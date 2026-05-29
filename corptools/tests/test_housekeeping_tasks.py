# Standard Library
from unittest.mock import MagicMock, patch

# Django
from django.test import TestCase
from django.utils import timezone

# AA Example App
from corptools.models import CharacterWalletJournalEntry
from corptools.tasks.housekeeping import (
    clear_all_etags,
    clear_all_skill_caches,
    run_housekeeping,
    update_wallet_currency,
)

from . import CorptoolsTestCase


class TestRunHousekeeping(TestCase):
    @patch("corptools.tasks.housekeeping.remove_old_notifications")
    def test_calls_helper_and_returns_result(self, mock_helper):
        mock_helper.return_value = "cleaned up"
        result = run_housekeeping()
        mock_helper.assert_called_once()
        self.assertEqual(result, "cleaned up")


class TestClearAllSkillCaches(TestCase):
    @patch("django_redis.get_redis_connection")
    def test_deletes_matching_keys_and_returns_count(self, mock_get_conn):
        mock_client = MagicMock()
        mock_client.keys.return_value = [b"key1", b"key2"]
        mock_client.delete.return_value = 2
        mock_get_conn.return_value = mock_client

        result = clear_all_skill_caches()

        mock_client.keys.assert_called_once_with(":?:SKILL_LISTS_*")
        mock_client.delete.assert_called_once_with(b"key1", b"key2")
        self.assertEqual(result, "Deleted 2 skill cache keys")

    @patch("django_redis.get_redis_connection")
    def test_no_keys_skips_delete_and_reports_zero(self, mock_get_conn):
        mock_client = MagicMock()
        mock_client.keys.return_value = []
        mock_get_conn.return_value = mock_client

        result = clear_all_skill_caches()

        mock_client.delete.assert_not_called()
        self.assertEqual(result, "Deleted 0 skill cache keys")


class TestClearAllEtags(TestCase):
    @patch("django_redis.get_redis_connection")
    def test_deletes_matching_etag_keys_and_returns_count(self, mock_get_conn):
        mock_client = MagicMock()
        mock_client.keys.return_value = [b"etag-abc"]
        mock_client.delete.return_value = 1
        mock_get_conn.return_value = mock_client

        result = clear_all_etags()

        mock_client.keys.assert_called_once_with(":?:etag-*")
        mock_client.delete.assert_called_once_with(b"etag-abc")
        self.assertEqual(result, "Deleted 1 etag keys")

    @patch("django_redis.get_redis_connection")
    def test_no_etag_keys_skips_delete_and_reports_zero(self, mock_get_conn):
        mock_client = MagicMock()
        mock_client.keys.return_value = []
        mock_get_conn.return_value = mock_client

        result = clear_all_etags()

        mock_client.delete.assert_not_called()
        self.assertEqual(result, "Deleted 0 etag keys")


def _make_journal_entry(ca, entry_id, reason):
    return CharacterWalletJournalEntry.objects.create(
        character=ca,
        amount=100,
        balance=1000,
        date=timezone.now(),
        description="test",
        entry_id=entry_id,
        ref_type="bounty_prizes",
        processed=False,
        reason=reason,
    )


class TestUpdateWalletCurrency(CorptoolsTestCase):
    def test_appends_isk_and_normalises_dollar_sign(self):
        entry = _make_journal_entry(self.ca1, 801, "5 Rifter @ $10,000")
        update_wallet_currency(entry.pk)
        entry.refresh_from_db()
        self.assertEqual(entry.reason, "5 Rifter @ 10,000 ISK")

    def test_appends_isk_when_no_dollar_sign(self):
        entry = _make_journal_entry(self.ca1, 802, "5 Rifter @ 10,000")
        update_wallet_currency(entry.pk)
        entry.refresh_from_db()
        self.assertTrue(entry.reason.endswith("ISK"))

    def test_leaves_reason_unchanged_when_already_ends_with_isk(self):
        entry = _make_journal_entry(self.ca1, 803, "5 Rifter @ 10,000 ISK")
        update_wallet_currency(entry.pk)
        entry.refresh_from_db()
        self.assertEqual(entry.reason, "5 Rifter @ 10,000 ISK")
