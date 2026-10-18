"""
A 420 (django-esi's ESIErrorLimitException) is ESI telling us to stop for
everyone. Several best-effort steps wrapped their ESI calls in a bare
`except Exception: log`, which swallowed it and let the task carry on
making calls. They now let it through to esi_error_retry (or, for
update_eve_name, set the shared flag and retry themselves).
"""
# Standard Library
from datetime import timedelta
from unittest.mock import MagicMock, patch

# Third Party
from celery.exceptions import Retry

# Django
from django.core.cache import cache
from django.test import TestCase
from django.utils import timezone

# Alliance Auth
from esi.exceptions import ESIErrorLimitException

# AA Example App
from corptools.models import EveName
from corptools.task_helpers.char_tasks import (
    update_character_assets,
    update_character_mail_headers,
)
from corptools.tasks.corporation.assets import corp_update_assets
from corptools.tasks.updates import update_eve_name, update_prices_for_types
from corptools.tasks.utils import (
    clear_error_flag,
    get_error_count_flag,
    get_error_flag,
)

from . import CorptoolsTestCase

CHAR_TASKS = "corptools.task_helpers.char_tasks"
CORP_ASSETS = "corptools.tasks.corporation.assets"


class TestCharacterAssetsLetErrorLimitThrough(CorptoolsTestCase):

    @patch(f"{CHAR_TASKS}.update_character_blueprints")
    @patch(f"{CHAR_TASKS}.update_den_locations")
    @patch(f"{CHAR_TASKS}.update_character_assets_names")
    @patch(f"{CHAR_TASKS}.update_asset_locations")
    @patch(f"{CHAR_TASKS}.get_current_ship_location", return_value=False)
    @patch(f"{CHAR_TASKS}.get_token")
    @patch(f"{CHAR_TASKS}.providers")
    def test_names_step_420_propagates_and_stops_further_esi_calls(
        self, mock_providers, mock_get_token, _ship, _locations,
        mock_names, _dens, mock_blueprints
    ):
        mock_get_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Assets.GetCharactersCharacterIdAssets.return_value.results.return_value = []
        mock_names.side_effect = ESIErrorLimitException(reset=30)

        with self.assertRaises(ESIErrorLimitException):
            update_character_assets(self.char1.character_id)

        mock_blueprints.assert_not_called()

    @patch(f"{CHAR_TASKS}.update_character_blueprints")
    @patch(f"{CHAR_TASKS}.update_den_locations")
    @patch(f"{CHAR_TASKS}.update_character_assets_names")
    @patch(f"{CHAR_TASKS}.update_asset_locations")
    @patch(f"{CHAR_TASKS}.get_current_ship_location", return_value=False)
    @patch(f"{CHAR_TASKS}.get_token")
    @patch(f"{CHAR_TASKS}.providers")
    def test_other_names_step_errors_are_still_best_effort(
        self, mock_providers, mock_get_token, _ship, _locations,
        mock_names, _dens, mock_blueprints
    ):
        mock_get_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Assets.GetCharactersCharacterIdAssets.return_value.results.return_value = []
        mock_names.side_effect = ValueError("boom")

        update_character_assets(self.char1.character_id)

        mock_blueprints.assert_called_once()


class TestCorpAssetsLetErrorLimitThrough(CorptoolsTestCase):

    @patch(f"{CORP_ASSETS}.enqueue_next_task")
    @patch(f"{CORP_ASSETS}.update_corporation_blueprints")
    @patch(f"{CORP_ASSETS}.corp_update_asset_names")
    @patch(f"{CORP_ASSETS}.get_corp_token")
    @patch(f"{CORP_ASSETS}.providers")
    def test_names_step_420_propagates(
        self, mock_providers, mock_get_corp_token, mock_names, mock_blueprints, mock_enqueue
    ):
        mock_get_corp_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Assets.GetCorporationsCorporationIdAssets.return_value.results.return_value = []
        mock_names.side_effect = ESIErrorLimitException(reset=30)

        # update_corp_audit only swallows HTTPError/NoTokens, so it gets out
        with self.assertRaises(ESIErrorLimitException):
            corp_update_assets(self.corp1.corporation_id)

        mock_blueprints.assert_not_called()
        mock_enqueue.assert_not_called()


class TestMailHeadersLetErrorLimitThrough(CorptoolsTestCase):

    @patch(f"{CHAR_TASKS}.EveName.objects.create_bulk_from_esi")
    @patch(f"{CHAR_TASKS}.get_token")
    @patch(f"{CHAR_TASKS}.providers")
    def test_bulk_name_420_propagates(self, mock_providers, mock_get_token, mock_bulk):
        mock_get_token.return_value = MagicMock()
        mail = mock_providers.esi_openapi.client.Mail
        mail.GetCharactersCharacterIdMailLabels.return_value.result.return_value = MagicMock(
            labels=[])
        msg = MagicMock(mail_id=1, recipients=[], labels=[])
        setattr(msg, "from", 90000001)
        mail.GetCharactersCharacterIdMail.return_value.result.return_value = [
            msg]
        mock_bulk.side_effect = ESIErrorLimitException(reset=30)

        with self.assertRaises(ESIErrorLimitException):
            update_character_mail_headers(self.char1.character_id)


class TestUpdateEveNameErrorLimit(TestCase):

    def tearDown(self):
        # the test cache is a real redis shared across runs - don't leave a
        # live back-off flag behind for whatever runs next
        clear_error_flag()

    def setUp(self):
        cache.clear()
        self.name = EveName.objects.create(
            eve_id=12345, name="Test Character", category=EveName.CHARACTER)
        self.past = timezone.now() - timedelta(days=31)
        EveName.objects.filter(eve_id=12345).update(last_update=self.past)

    @patch("corptools.tasks.updates.eve_names")
    def test_420_sets_shared_flag_and_retries_without_cooling_off(self, mock_eve_names):
        mock_eve_names.get_character.side_effect = ESIErrorLimitException(
            reset=90)

        with patch.object(update_eve_name, "retry", side_effect=Retry()) as mock_retry:
            with self.assertRaises(Retry):
                update_eve_name(12345)

        mock_retry.assert_called_once_with(countdown=91)
        self.assertTrue(get_error_count_flag())
        self.assertGreater(
            (get_error_flag() - timezone.now()).total_seconds(), 80)
        # not treated as "no access" - the name isn't cooled off
        self.name.refresh_from_db()
        self.assertEqual(self.name.last_update, self.past)


class TestUpdatePricesForTypes(TestCase):

    @patch("corptools.tasks.updates.requests")
    def test_empty_list_makes_no_request(self, mock_requests):
        update_prices_for_types([])
        mock_requests.get.assert_not_called()

    @patch("corptools.tasks.updates.requests")
    def test_does_not_mutate_callers_list_and_sets_timeout(self, mock_requests):
        mock_requests.get.return_value.json.return_value = {}
        type_ids = [34, 35]

        update_prices_for_types(type_ids)

        self.assertEqual(type_ids, [34, 35])
        args, kwargs = mock_requests.get.call_args
        self.assertIn("types=34,35", args[0])
        self.assertEqual(kwargs.get("timeout"), 30)
        mock_requests.get.return_value.raise_for_status.assert_called_once()
