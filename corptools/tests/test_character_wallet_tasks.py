# Standard Library
from unittest.mock import MagicMock, patch

# Django
from django.test import TestCase
from django.utils import timezone

# AA Example App
from corptools.models import CharacterWalletJournalEntry
from corptools.tasks.character.wallet import (
    _clear_dupes,
    update_char_contract_items,
    update_char_contracts,
    update_char_order_history,
    update_char_orders,
    update_char_transactions,
    update_char_wallet,
    update_char_wallet_bounty_text,
)

from . import CorptoolsTestCase


def _make_journal_entry(ca, entry_id=1, ref_type="transfer", processed=False, reason=None):
    return CharacterWalletJournalEntry.objects.create(
        character=ca,
        amount=1000,
        balance=10000,
        date=timezone.now(),
        description="test entry",
        entry_id=entry_id,
        ref_type=ref_type,
        processed=processed,
        reason=reason,
    )


class TestCharacterWalletSimpleTasks(TestCase):
    @patch("corptools.tasks.character.wallet.update_character_transactions")
    def test_update_char_transactions_calls_helper(self, mock_helper):
        mock_helper.return_value = "tx done"
        result = update_char_transactions(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "tx done")

    @patch("corptools.tasks.character.wallet.update_character_orders")
    def test_update_char_orders_calls_helper(self, mock_helper):
        mock_helper.return_value = "orders done"
        result = update_char_orders(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "orders done")

    @patch("corptools.tasks.character.wallet.update_character_order_history")
    def test_update_char_order_history_calls_helper(self, mock_helper):
        mock_helper.return_value = "history done"
        result = update_char_order_history(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "history done")

    @patch("corptools.tasks.utils.rate_limiter")
    @patch("corptools.tasks.character.wallet.update_character_contract_items")
    def test_update_char_contract_items_calls_helper(self, mock_helper, mock_limiter):
        mock_limiter.check_bucket.return_value = None
        mock_helper.return_value = "items done"
        result = update_char_contract_items(1, 42)
        mock_helper.assert_called_once_with(1, 42, force_refresh=False)
        self.assertEqual(result, "items done")


class TestUpdateCharWallet(CorptoolsTestCase):
    @patch("corptools.tasks.character.wallet.update_character_wallet")
    def test_no_bounty_entries_returns_msg(self, mock_wallet):
        mock_wallet.return_value = "wallet done"
        result = update_char_wallet(self.char1.character_id)
        mock_wallet.assert_called_once_with(
            self.char1.character_id, force_refresh=False)
        self.assertEqual(result, "wallet done")

    @patch("corptools.tasks.character.wallet.update_char_wallet_bounty_text")
    @patch("corptools.tasks.character.wallet.update_character_wallet")
    def test_bounty_entry_enqueues_bounty_text_task(self, mock_wallet, mock_bounty_task):
        mock_wallet.return_value = "wallet done"
        _make_journal_entry(
            self.ca1, entry_id=555, ref_type="bounty_prizes", processed=False)

        update_char_wallet(self.char1.character_id)

        mock_bounty_task.apply_async.assert_called_once_with(
            args=[self.char1.character_id, 555], priority=9)

    @patch("corptools.tasks.character.wallet.update_char_wallet_bounty_text")
    @patch("corptools.tasks.character.wallet.update_character_wallet")
    def test_already_processed_bounty_entry_not_enqueued(self, mock_wallet, mock_bounty_task):
        mock_wallet.return_value = "wallet done"
        _make_journal_entry(
            self.ca1, entry_id=556, ref_type="bounty_prizes", processed=True)

        update_char_wallet(self.char1.character_id)

        mock_bounty_task.apply_async.assert_not_called()


class TestUpdateCharContracts(CorptoolsTestCase):
    @patch("corptools.tasks.character.wallet.Chain")
    @patch("corptools.tasks.character.wallet.update_character_contracts")
    def test_builds_chain_of_contract_item_tasks(self, mock_contracts, mock_chain_cls):
        mock_contracts.return_value = (None, [101, 102])
        mock_chain_instance = MagicMock()
        mock_chain_cls.return_value = mock_chain_instance

        result = update_char_contracts(self.char1.character_id)

        mock_contracts.assert_called_once_with(
            self.char1.character_id, force_refresh=False)
        mock_chain_instance.apply_async.assert_called_once_with(priority=8)
        self.assertIn(str(self.char1.character_id), result)

    @patch("corptools.tasks.character.wallet.Chain")
    @patch("corptools.tasks.character.wallet.update_character_contracts")
    def test_empty_contract_ids_enqueues_empty_chain(self, mock_contracts, mock_chain_cls):
        mock_contracts.return_value = (None, [])
        mock_chain_instance = MagicMock()
        mock_chain_cls.return_value = mock_chain_instance

        update_char_contracts(self.char1.character_id)

        mock_chain_cls.assert_called_once_with([])


class TestUpdateCharWalletBountyText(CorptoolsTestCase):
    def test_entry_not_found_returns_message(self):
        result = update_char_wallet_bounty_text(99999, 12345)
        self.assertIn("99999", result)
        self.assertIn("12345", result)

    def test_multiple_objects_calls_clear_dupes_and_retries(self):
        # Third Party
        from celery.exceptions import Retry

        _make_journal_entry(
            self.ca1, entry_id=777, ref_type="bounty_prizes", processed=False)
        _make_journal_entry(
            self.ca1, entry_id=777, ref_type="bounty_prizes", processed=False)

        with self.assertRaises(Retry):
            update_char_wallet_bounty_text(
                self.char1.character_id, 777)

        # One entry should remain
        self.assertEqual(
            CharacterWalletJournalEntry.objects.filter(
                character=self.ca1, entry_id=777
            ).count(),
            1
        )

    @patch("corptools.tasks.character.wallet.CharacterBountyStat")
    @patch("corptools.tasks.character.wallet.TypeDogma")
    @patch("corptools.tasks.character.wallet.ItemType")
    def test_success_creates_bounty_event_and_marks_processed(
        self, mock_item_cls, mock_dogma_cls, mock_stat_cls
    ):
        # AA Example App
        from corptools.models import CharacterBountyEvent

        entry = _make_journal_entry(
            self.ca1,
            entry_id=888,
            ref_type="bounty_prizes",
            processed=False,
            reason="12345: 3",
        )

        mock_ship = MagicMock()
        mock_ship.id = 12345
        mock_ship.name = "Rifter"
        mock_item_cls.objects.get.return_value = mock_ship

        mock_dogma = MagicMock()
        mock_dogma.value = 5000000.0
        mock_dogma_cls.objects.filter.return_value.first.return_value = mock_dogma

        update_char_wallet_bounty_text(self.char1.character_id, 888)

        entry.refresh_from_db()
        self.assertTrue(entry.processed)
        self.assertTrue(
            CharacterBountyEvent.objects.filter(entry=entry).exists())
        mock_stat_cls.objects.create.assert_called_once()


class TestClearDupes(CorptoolsTestCase):
    def test_removes_all_but_one_duplicate(self):
        _make_journal_entry(
            self.ca1, entry_id=999, ref_type="bounty_prizes", processed=False)
        _make_journal_entry(
            self.ca1, entry_id=999, ref_type="bounty_prizes", processed=False)
        _make_journal_entry(
            self.ca1, entry_id=999, ref_type="bounty_prizes", processed=False)

        self.assertEqual(
            CharacterWalletJournalEntry.objects.filter(
                character=self.ca1, entry_id=999).count(), 3)

        _clear_dupes(self.char1.character_id, 999)

        self.assertEqual(
            CharacterWalletJournalEntry.objects.filter(
                character=self.ca1, entry_id=999).count(), 1)
