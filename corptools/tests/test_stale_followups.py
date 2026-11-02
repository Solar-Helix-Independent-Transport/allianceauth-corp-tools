"""
Follow-ups from the stale data audit:
- a failed update left its ETags behind, so later runs 304'd past the
  unwritten data until it changed in game.
- a newly created (or re-added) audit was first updated without
  force_refresh, so ETags left from before 304'd it to empty.
- mail read state and labels were only captured when a mail first arrived,
  and labels deleted in game were never removed.
- wallet division names were overwritten with "Unknown" without a Director.
- an order closed outside the 90 day history window stayed active forever.
"""
# Standard Library
import inspect
from datetime import timedelta
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

# Third Party
from eve_sde import models as sde_models

# Django
from django.core.cache import cache
from django.test import RequestFactory
from django.utils import timezone

# Alliance Auth
from esi.exceptions import HTTPClientError, HTTPNotModified
from esi.openapi_clients import EsiOperation

# AA Example App
from corptools import views
from corptools.models import (
    CharacterAudit,
    CharacterMarketOrder,
    CorporationWalletDivision,
    EveName,
    MailLabel,
    MailMessage,
)
from corptools.task_helpers.char_tasks import (
    update_character_mail_headers,
    update_character_orders,
)
from corptools.task_helpers.etags import clear_etags_on_error
from corptools.tasks.character import update_character
from corptools.tasks.corporation.utils import update_corp_audit
from corptools.tasks.corporation.wallet import update_corp_wallet_divisions
from corptools.tasks.utils import clear_error_flag, esi_error_retry

from . import CorptoolsTestCase

CHAR_TASKS = "corptools.task_helpers.char_tasks"
WALLET = "corptools.tasks.corporation.wallet"
ETAG_KEY = "corptools_test_etag_key"


def _operation():
    op = EsiOperation.__new__(EsiOperation)
    op._etag_key = lambda: ETAG_KEY
    return op


def _fetch():
    """What a real ESI call does on a fresh response."""
    _operation()._store_etag({"ETag": "abc"})


class TestClearEtagsOnError(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        cache.delete(ETAG_KEY)
        clear_error_flag()

    def tearDown(self):
        cache.delete(ETAG_KEY)

    def test_failure_clears_etags_stored_inside(self):
        with self.assertRaises(ValueError):
            with clear_etags_on_error():
                _fetch()
                raise ValueError("write failed")

        self.assertIsNone(cache.get(ETAG_KEY))

    def test_renewed_etag_is_cleared_too(self):
        cache.set(ETAG_KEY, "abc")
        with self.assertRaises(ValueError):
            with clear_etags_on_error():
                _operation()._update_etag_ttl()
                raise ValueError("write failed")

        self.assertIsNone(cache.get(ETAG_KEY))

    def test_success_and_not_modified_keep_etags(self):
        with clear_etags_on_error():
            _fetch()
        self.assertEqual(cache.get(ETAG_KEY), "abc")

        with self.assertRaises(HTTPNotModified):
            with clear_etags_on_error():
                _fetch()
                raise HTTPNotModified(304, {})
        self.assertEqual(cache.get(ETAG_KEY), "abc")

    def test_untracked_outside_context(self):
        _fetch()
        self.assertEqual(cache.get(ETAG_KEY), "abc")

    def test_task_wrapper_clears_on_failure(self):
        @esi_error_retry
        def task(self):
            _fetch()
            raise ValueError("write failed")

        with self.assertRaises(ValueError):
            task(MagicMock())

        self.assertIsNone(cache.get(ETAG_KEY))

    def test_corp_wrapper_clears_on_swallowed_error(self):
        @update_corp_audit(update_field="structures")
        def corp_task(corp_id):
            _fetch()
            raise HTTPClientError(420, {}, MagicMock())

        # update_corp_audit swallows HTTPError, so the outer wrapper never
        # sees it - the clear has to happen inside
        self.assertIsNone(corp_task(self.corp1.corporation_id))

        self.assertIsNone(cache.get(ETAG_KEY))


class TestNewAuditsForceRefresh(CorptoolsTestCase):

    @patch("corptools.tasks.character.enqueue_next_task")
    @patch("corptools.tasks.character.Token")
    def test_new_character_audit_is_forced(self, mock_token, mock_enqueue):
        char = self.create_char(9999, "new.character", corp=self.corp1)
        mock_token.get_token.return_value = MagicMock(character_id=9999)

        update_character(9999)

        self.assertTrue(CharacterAudit.objects.filter(character=char).exists())
        queued = mock_enqueue.call_args.args[0]
        refreshes = [t.kwargs["force_refresh"]
                     for t in queued if "force_refresh" in t.kwargs]
        self.assertTrue(refreshes)
        self.assertTrue(all(refreshes))

    @patch("corptools.views.messages")
    @patch("corptools.views.update_corp")
    def test_add_corp_forces_that_corp(self, mock_update_corp, _messages):
        request = RequestFactory().get("/")
        request.user = MagicMock()

        inspect.unwrap(views.add_corp)(request, MagicMock(character_id=1))

        mock_update_corp.apply_async.assert_called_once_with(
            priority=6, args=[self.corp1.corporation_id],
            kwargs={"force_refresh": True})

    @patch("corptools.views.messages")
    @patch("corptools.views._check_callback")
    @patch("corptools.views.update_corp")
    def test_add_corp_section_forces(self, mock_update_corp, mock_callback, _messages):
        mock_callback.return_value = MagicMock(character_id=1)
        request = RequestFactory().get("/")
        request.user = MagicMock()
        request.session = MagicMock(session_key="abcdefgh")

        inspect.unwrap(views.add_corp_section)(request)

        mock_update_corp.apply_async.assert_called_once_with(
            priority=6, args=[self.corp1.corporation_id],
            kwargs={"force_refresh": True})


def _mail(mail_id, is_read, labels):
    msg = MagicMock(mail_id=mail_id, is_read=is_read, labels=labels,
                    recipients=[], timestamp=None, subject="hi")
    setattr(msg, "from", 90000001)
    return msg


def _label(label_id, name):
    label = MagicMock(label_id=label_id, color="#ffffff", unread_count=0)
    label.name = name
    return label


@patch(f"{CHAR_TASKS}.get_token", return_value=MagicMock())
@patch(f"{CHAR_TASKS}.providers")
class TestMailStaleData(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        EveName.objects.create(
            eve_id=90000001, name="Sender", category=EveName.CHARACTER)

    def _run(self, mock_providers, labels, mail):
        api = mock_providers.esi_openapi.client.Mail
        api.GetCharactersCharacterIdMailLabels.return_value.result.return_value = MagicMock(
            labels=labels)
        api.GetCharactersCharacterIdMail.return_value.result.side_effect = [
            mail, []]
        update_character_mail_headers(self.char1.character_id)

    def _labels(self, mail_id):
        return set(MailMessage.objects.get(
            character=self.ca1, mail_id=mail_id).labels.values_list("label_id", flat=True))

    def test_read_state_and_labels_follow_the_game(self, mock_providers, _token):
        self._run(mock_providers, [_label(1, "Inbox"), _label(2, "Work")],
                  [_mail(10, False, [1, 2])])
        self.assertEqual(self._labels(10), {1, 2})

        # read and un-labelled in game, the Work label deleted, a new mail in
        self._run(mock_providers, [_label(1, "Inbox")],
                  [_mail(11, False, [1]), _mail(10, True, [1])])

        self.assertTrue(MailMessage.objects.get(mail_id=10).is_read)
        self.assertEqual(self._labels(10), {1})
        self.assertEqual(self._labels(11), {1})
        self.assertEqual(
            list(MailLabel.objects.filter(character=self.ca1).values_list(
                "label_id", flat=True)),
            [1])

    def test_label_added_later(self, mock_providers, _token):
        labels = [_label(1, "Inbox"), _label(2, "Work")]
        self._run(mock_providers, labels, [_mail(10, False, [1])])

        self._run(mock_providers, labels, [_mail(10, False, [1, 2])])

        self.assertEqual(self._labels(10), {1, 2})


@patch(f"{WALLET}.update_corp_wallet_journal")
@patch(f"{WALLET}.providers")
class TestWalletDivisionNames(CorptoolsTestCase):

    def _run(self, mock_providers, director):
        mock_providers.esi_openapi.client.Corporation.GetCorporationsCorporationIdDivisions.return_value.result.return_value = MagicMock(
            wallet=[SimpleNamespace(division=1, name="Master Wallet")])
        mock_providers.esi_openapi.client.Wallet.GetCorporationsCorporationIdWallets.return_value.result.return_value = [
            SimpleNamespace(division=1, balance=100),
            SimpleNamespace(division=2, balance=5)]
        with patch(f"{WALLET}.get_corp_token",
                   side_effect=[MagicMock() if director else None, MagicMock()]):
            update_corp_wallet_divisions(self.corp1.corporation_id)

    def _divisions(self):
        return dict(CorporationWalletDivision.objects.filter(
            corporation=self.cp1).values_list("division", "name"))

    def test_names_kept_without_director(self, mock_providers, _journal):
        self._run(mock_providers, director=True)
        self.assertEqual(self._divisions(), {1: "Master Wallet", 2: "Unknown"})

        self._run(mock_providers, director=False)

        self.assertEqual(self._divisions(), {1: "Master Wallet", 2: "Unknown"})
        self.assertEqual(
            CorporationWalletDivision.objects.get(division=1).balance, 100)

    def test_new_division_without_director_is_unknown(self, mock_providers, _journal):
        self._run(mock_providers, director=False)

        self.assertEqual(self._divisions(), {1: "Unknown", 2: "Unknown"})


def _open_order(order_id):
    return SimpleNamespace(
        order_id=order_id, duration=90, escrow=None, is_buy_order=False,
        issued=timezone.now(), location_id=60003760, min_volume=1, price=10,
        range="station", region_id=10000002, type_id=34, volume_remain=5,
        volume_total=10, is_corporation=False, state="active")


@patch(f"{CHAR_TASKS}.get_token", return_value=MagicMock())
@patch(f"{CHAR_TASKS}.providers")
class TestClosedOrders(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        sde_models.Region.objects.create(id=10000002, name="The Forge")
        sde_models.ItemType.objects.create(
            id=34, name="Tritanium", published=True)

    def _store(self, order_id, state="active"):
        CharacterMarketOrder.objects.create(
            character=self.ca1, order_id=order_id, duration=90,
            issued=timezone.now() - timedelta(days=200), location_id=60003760,
            order_range="station", region_id=10000002, type_id=34,
            volume_remain=5, volume_total=10, is_corporation=False, state=state)

    def test_orders_no_longer_open_are_closed(self, mock_providers, _token):
        self._store(1)
        self._store(2)
        self._store(3, state="cancelled")
        mock_providers.esi_openapi.client.Market.GetCharactersCharacterIdOrders.return_value.result.return_value = [
            _open_order(2)]

        update_character_orders(self.char1.character_id)

        self.assertEqual(
            dict(CharacterMarketOrder.objects.values_list("order_id", "state")),
            {1: "expired", 2: "active", 3: "cancelled"})

    def test_not_modified_leaves_orders(self, mock_providers, _token):
        self._store(1)
        mock_providers.esi_openapi.client.Market.GetCharactersCharacterIdOrders.return_value.result.side_effect = HTTPNotModified(
            304, {})

        update_character_orders(self.char1.character_id)

        self.assertEqual(CharacterMarketOrder.objects.get(
            order_id=1).state, "active")
