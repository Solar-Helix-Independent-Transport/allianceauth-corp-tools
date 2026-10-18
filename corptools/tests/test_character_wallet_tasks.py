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
    @patch("corptools.tasks.character.wallet.enqueue_next_task")
    @patch("corptools.tasks.character.wallet.update_character_contracts")
    def test_builds_chain_of_contract_item_tasks(self, mock_contracts, mock_enqueue):
        mock_contracts.return_value = (None, [101, 102])

        result = update_char_contracts(self.char1.character_id)

        mock_contracts.assert_called_once_with(
            self.char1.character_id, force_refresh=False)
        signatures = mock_enqueue.call_args[0][0]
        self.assertEqual(
            [sig.args for sig in signatures],
            [(self.char1.character_id, 101), (self.char1.character_id, 102)]
        )
        for sig in signatures:
            self.assertEqual(sig.options["priority"], 8)
        self.assertIn(str(self.char1.character_id), result)

    @patch("corptools.tasks.character.wallet.enqueue_next_task")
    @patch("corptools.tasks.character.wallet.update_character_contracts")
    def test_empty_contract_ids_enqueues_empty_chain(self, mock_contracts, mock_enqueue):
        mock_contracts.return_value = (None, [])

        update_char_contracts(self.char1.character_id)

        mock_enqueue.assert_called_once_with([])


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

    def _bounty_types(self):
        # Third Party
        from eve_sde import models as sde_models
        bounty_attr = sde_models.DogmaAttribute.objects.create(
            id=481, name="entityKillBounty")
        rifter = sde_models.ItemType.objects.create(
            id=12345, name="Rifter", published=True)
        sde_models.TypeDogma.objects.create(
            item_type=rifter, dogma_attribute=bounty_attr, value=5000000.0)
        # known type, but no bounty attribute
        sde_models.ItemType.objects.create(
            id=23456, name="Slasher", published=True)

    def _bounty_entry(self, reason, entry_id=888):
        return _make_journal_entry(
            self.ca1, entry_id=entry_id, ref_type="bounty_prizes",
            processed=False, reason=reason)

    def test_success_creates_bounty_event_and_marks_processed(self):
        # AA Example App
        from corptools.models import CharacterBountyEvent
        self._bounty_types()
        entry = self._bounty_entry("12345: 3")

        update_char_wallet_bounty_text(self.char1.character_id, 888)

        entry.refresh_from_db()
        self.assertTrue(entry.processed)
        event = CharacterBountyEvent.objects.get(entry=entry)
        self.assertEqual(event.message, "3x Rifter @ 5,000,000 ISK")
        self.assertEqual(
            list(event.stats.values_list("type_name_id", "qty")), [(12345, 3)])

    def test_unknown_type_and_missing_bounty_do_not_block_processing(self):
        # These used to raise (DoesNotExist / None.value), leaving the entry
        # unprocessed so every wallet update re-queued it, forever.
        # AA Example App
        from corptools.models import CharacterBountyEvent
        self._bounty_types()
        entry = self._bounty_entry("12345: 3, 23456: 2, 99999: 1")

        update_char_wallet_bounty_text(self.char1.character_id, 888)

        entry.refresh_from_db()
        self.assertTrue(entry.processed)
        event = CharacterBountyEvent.objects.get(entry=entry)
        self.assertEqual(
            event.message.split("\n"),
            ["3x Rifter @ 5,000,000 ISK", "2x Slasher", "1x Unknown Type 99999"],
        )
        # no stat row for a type we can't FK to
        self.assertEqual(
            sorted(event.stats.values_list("type_name_id", "qty")),
            [(12345, 3), (23456, 2)],
        )

    def test_malformed_or_empty_reason_still_marks_processed(self):
        # AA Example App
        from corptools.models import CharacterBountyEvent
        self._bounty_types()
        for entry_id, reason in ((901, None), (902, ""), (903, "junk, 12345, 12345: x, 12345: 1")):
            entry = self._bounty_entry(reason, entry_id=entry_id)
            update_char_wallet_bounty_text(self.char1.character_id, entry_id)
            entry.refresh_from_db()
            self.assertTrue(entry.processed, reason)
        self.assertEqual(
            CharacterBountyEvent.objects.get(entry__entry_id=903).message,
            "1x Rifter @ 5,000,000 ISK")

    def test_leftover_event_from_a_half_finished_run_is_replaced(self):
        # AA Example App
        from corptools.models import CharacterBountyEvent
        self._bounty_types()
        entry = self._bounty_entry("12345: 3")
        CharacterBountyEvent.objects.create(entry=entry, message="partial")

        update_char_wallet_bounty_text(self.char1.character_id, 888)

        entry.refresh_from_db()
        self.assertTrue(entry.processed)
        self.assertEqual(
            CharacterBountyEvent.objects.get(entry=entry).message,
            "3x Rifter @ 5,000,000 ISK")

    def test_failure_while_writing_leaves_nothing_half_done(self):
        # AA Example App
        from corptools.models import CharacterBountyEvent, CharacterBountyStat
        self._bounty_types()
        entry = self._bounty_entry("12345: 3")

        with patch.object(CharacterBountyStat.objects, "bulk_create", side_effect=RuntimeError("db")):
            with self.assertRaises(RuntimeError):
                update_char_wallet_bounty_text(self.char1.character_id, 888)

        entry.refresh_from_db()
        self.assertFalse(entry.processed)
        self.assertFalse(
            CharacterBountyEvent.objects.filter(entry=entry).exists())


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
