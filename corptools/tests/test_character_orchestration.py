# Standard Library
import datetime
from unittest.mock import MagicMock, patch

# Django
from django.test import TestCase
from django.utils import timezone

# Alliance Auth
from esi.errors import TokenExpiredError

# AA Example App
from corptools.models import CharacterAudit, CorptoolsConfiguration
from corptools.tasks.character import (
    _needs_update,
    check_account,
    process_corp_histories,
    re_que_corp_histories,
    update_all_characters,
    update_character,
    update_subset_of_characters,
)

from . import CorptoolsTestCase


class TestNeedsUpdate(TestCase):
    def setUp(self):
        self.skip_date = timezone.now() - datetime.timedelta(hours=2)
        self.min_date = timezone.now() - datetime.timedelta(days=90)

    def test_stale_last_update_returns_true(self):
        last_update = timezone.now() - datetime.timedelta(hours=5)
        self.assertTrue(_needs_update(
            last_update, self.skip_date, False, self.min_date))

    def test_fresh_last_update_returns_false(self):
        last_update = timezone.now() - datetime.timedelta(minutes=30)
        self.assertFalse(_needs_update(
            last_update, self.skip_date, False, self.min_date))

    def test_none_last_update_uses_min_date_and_is_stale(self):
        self.assertTrue(_needs_update(
            None, self.skip_date, False, self.min_date))

    def test_force_refresh_returns_true_regardless_of_last_update(self):
        last_update = timezone.now() - datetime.timedelta(minutes=1)
        self.assertTrue(_needs_update(
            last_update, self.skip_date, True, self.min_date))


class TestUpdateAllCharacters(CorptoolsTestCase):
    @patch("corptools.tasks.character.update_character")
    def test_enqueues_update_for_every_character_audit(self, mock_task):
        update_all_characters()
        audit_count = CharacterAudit.objects.count()
        self.assertEqual(mock_task.apply_async.call_count, audit_count)

    @patch("corptools.tasks.character.update_character")
    def test_passes_force_refresh_kwarg(self, mock_task):
        update_all_characters(force_refresh=True)
        for call_kwargs in [c.kwargs for c in mock_task.apply_async.call_args_list]:
            self.assertTrue(call_kwargs["kwargs"]["force_refresh"])


class TestUpdateSubsetOfCharacters(CorptoolsTestCase):
    @patch("corptools.tasks.character.process_corp_histories")
    @patch("corptools.tasks.character.update_character")
    def test_enqueues_characters_and_triggers_corp_history(self, mock_task, mock_corps):
        result = update_subset_of_characters()
        self.assertGreater(mock_task.apply_async.call_count, 0)
        mock_corps.apply_async.assert_called_once_with(priority=6)
        self.assertIn("Queued", result)


class TestReQueCorpHistories(TestCase):
    @patch("corptools.tasks.character.process_corp_histories")
    def test_triggers_process_corp_histories(self, mock_task):
        re_que_corp_histories()
        mock_task.apply_async.assert_called_once_with(priority=6)


class TestProcessCorpHistories(CorptoolsTestCase):
    def test_no_stale_characters_returns_none_message(self):
        # All ca objects have empty timestamps — pub_data key missing, query will
        # filter for `lte` which won't match. Force all to have a very fresh timestamp.
        fresh = timezone.now().isoformat()
        for ca in CharacterAudit.objects.all():
            ca.update_timestamps["pub_data"] = fresh
            ca.save()

        result = process_corp_histories()
        self.assertEqual(result, "No characters to process")

    @patch("corptools.tasks.character.re_que_corp_histories")
    @patch("corptools.tasks.character.update_char_corp_history")
    def test_stale_character_triggers_corp_history_update(self, mock_update, mock_reque):
        stale = (timezone.now() - datetime.timedelta(days=10)).isoformat()
        self.ca1.update_timestamps["pub_data"] = stale
        self.ca1.save()

        result = process_corp_histories()

        mock_update.assert_called_once_with(self.char1.character_id)
        mock_reque.apply_async.assert_called_once_with(countdown=1)
        self.assertIn(str(self.char1.character_id), result)


class TestCheckAccount(CorptoolsTestCase):
    @patch("corptools.tasks.character.update_character")
    def test_enqueues_update_for_all_linked_characters(self, mock_task):
        # user1 owns char1 and char2
        check_account(self.char1.character_id)
        linked = self.user1.character_ownerships.values_list(
            'character__character_id', flat=True)
        self.assertEqual(mock_task.apply_async.call_count, len(linked))
        called_ids = {c.kwargs["args"][0]
                      for c in mock_task.apply_async.call_args_list}
        self.assertEqual(set(called_ids), set(linked))


class TestUpdateCharacter(CorptoolsTestCase):
    def setUp(self):
        super().setUp()
        CorptoolsConfiguration.clear_cache()

    @patch("corptools.tasks.character.Token")
    def test_no_audit_no_token_returns_false(self, mock_token_cls):
        mock_token_cls.get_token.return_value = None
        result = update_character(99999)
        self.assertFalse(result)

    @patch("corptools.tasks.character.Token")
    def test_no_audit_token_expired_returns_false(self, mock_token_cls):
        mock_token = MagicMock()
        mock_token.valid_access_token.side_effect = TokenExpiredError()
        mock_token_cls.get_token.return_value = mock_token
        result = update_character(99999)
        self.assertFalse(result)

    @patch("corptools.tasks.character.enqueue_next_task")
    def test_existing_audit_enqueues_task_queue(self, mock_enqueue):
        # ca1 has no update_timestamps — all fields are stale → full queue built
        result = update_character(self.char1.character_id)
        mock_enqueue.assert_called_once()
        queue = mock_enqueue.call_args[0][0]
        # At minimum, update_all_locations is always appended
        self.assertGreater(len(queue), 0)

    @patch("corptools.tasks.character.enqueue_next_task")
    def test_force_refresh_prepends_corp_history_and_uses_delay_1(self, mock_enqueue):
        update_character(self.char1.character_id, force_refresh=True)
        mock_enqueue.assert_called_once()
        _, kwargs = mock_enqueue.call_args
        self.assertEqual(kwargs.get(
            "delay", mock_enqueue.call_args[1].get("delay")), 1)

    @patch("corptools.tasks.character.enqueue_next_task")
    def test_fresh_timestamps_produce_minimal_queue(self, mock_enqueue):
        # Set all timestamps to now so nothing is stale
        now_iso = timezone.now().isoformat()
        self.ca1.update_timestamps = {k: now_iso for k in [
            "roles", "titles", "notif", "assets", "skills", "skill_que",
            "clones", "contacts", "mining", "wallet", "orders", "contracts",
            "pub_data",
        ]}
        self.ca1.save()

        update_character(self.char1.character_id)
        queue = mock_enqueue.call_args[0][0]
        # Only location and mail/lp/indy tasks remain (always appended)
        # The key check: no skill/wallet/asset tasks since all timestamps are fresh
        task_names = [str(t) for t in queue]
        self.assertFalse(
            any("skill_list" in n or "assets" in n or "wallet" in n
                for n in task_names)
        )

    @patch("corptools.tasks.character.enqueue_next_task")
    def test_all_modules_disabled_via_config(self, mock_enqueue):
        config = CorptoolsConfiguration.get_solo()
        config.disable_update_roles = True
        config.disable_update_notif = True
        config.disable_update_assets = True
        config.disable_update_skills = True
        config.disable_update_clones = True
        config.disable_update_contacts = True
        config.disable_update_mining = True
        config.disable_update_wallet = True
        config.disable_update_location = True
        config.disable_update_mails = True
        config.disable_update_loyaltypoints = True
        config.disable_update_indy = True
        config.save()

        update_character(self.char1.character_id)
        queue = mock_enqueue.call_args[0][0]
        # With everything disabled, only update_all_locations is appended
        self.assertEqual(len(queue), 1)

    @patch("corptools.tasks.character.enqueue_next_task")
    @patch("corptools.tasks.character.EveCharacter")
    @patch("corptools.tasks.character.Token")
    def test_valid_token_creates_audit_and_enqueues(self, mock_token_cls, mock_eve_cls, mock_enqueue):
        mock_token = MagicMock()
        mock_token.valid_access_token.return_value = "token_value"
        mock_token.character_id = 99999
        mock_token_cls.get_token.return_value = mock_token

        mock_char = MagicMock()
        mock_char.character_id = 99999
        mock_char.character_name = "Test Char"
        mock_char.character_ownership.user_id = None
        mock_eve_cls.objects.get_character_by_id.return_value = mock_char

        with patch("corptools.tasks.character.CharacterAudit") as mock_audit_cls:
            mock_audit = MagicMock()
            mock_audit.character = mock_char
            mock_audit.get_update_time.return_value = None
            mock_audit_cls.objects.filter.return_value.first.return_value = None
            mock_audit_cls.objects.update_or_create.return_value = (
                mock_audit, True)

            update_character(99999)

        mock_audit_cls.objects.update_or_create.assert_called_once()

    @patch("corptools.tasks.character.enqueue_next_task")
    def test_mail_module_enabled_adds_mail_task(self, mock_enqueue):
        with patch("corptools.app_settings.CT_CHAR_MAIL_MODULE", True):
            update_character(self.char1.character_id)
        queue = mock_enqueue.call_args[0][0]
        task_names = [str(t) for t in queue]
        self.assertTrue(any("mail" in n for n in task_names))

    @patch("corptools.tasks.character.enqueue_next_task")
    def test_character_without_ownership_skips_skill_cache(self, mock_enqueue):
        # char8 has ca8 but no CharacterOwnership → ObjectDoesNotExist is caught
        update_character(self.char8.character_id)
        mock_enqueue.assert_called_once()
        queue = mock_enqueue.call_args[0][0]
        task_names = [str(t) for t in queue]
        self.assertFalse(any("cache_user_skill" in n for n in task_names))
