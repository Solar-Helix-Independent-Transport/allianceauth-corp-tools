# Standard Library
from unittest.mock import MagicMock, patch

# Django
from django.test import TestCase

# Alliance Auth
from esi.exceptions import HTTPClientError, HTTPNotModified

# AA Example App
from corptools.models import CorporationAudit
from corptools.tasks.corporation import (
    update_all_corps,
    update_corp,
    update_corp_assets,
    update_corp_contracts,
    update_corp_industry_jobs,
    update_corp_logins,
    update_corp_pocos,
    update_corp_starbases,
    update_corp_structures,
    update_corp_wallet,
    update_corporate_contract_items,
)

from . import CorptoolsTestCase


class TestCorpSimpleWrapperTasks(TestCase):
    @patch("corptools.tasks.corporation.update_corp_wallet_divisions")
    def test_update_corp_wallet_calls_helper(self, mock_helper):
        mock_helper.return_value = "wallet done"
        result = update_corp_wallet(123)
        mock_helper.assert_called_once_with(123, full_update=False)
        self.assertEqual(result, "wallet done")

    @patch("corptools.tasks.corporation.corp_structure_update")
    def test_update_corp_structures_calls_helper(self, mock_helper):
        mock_helper.return_value = "structures done"
        result = update_corp_structures(123)
        mock_helper.assert_called_once_with(123, force_refresh=False)
        self.assertEqual(result, "structures done")

    @patch("corptools.tasks.corporation.corp_update_assets")
    def test_update_corp_assets_calls_helper(self, mock_helper):
        mock_helper.return_value = "assets done"
        result = update_corp_assets(123)
        mock_helper.assert_called_once_with(123, force_refresh=False)
        self.assertEqual(result, "assets done")

    @patch("corptools.tasks.corporation.corp_update_pocos")
    def test_update_corp_pocos_calls_helper(self, mock_helper):
        mock_helper.return_value = "pocos done"
        result = update_corp_pocos(123)
        mock_helper.assert_called_once_with(123, full_update=False)
        self.assertEqual(result, "pocos done")

    @patch("corptools.tasks.corporation.update_character_logins_from_corp")
    def test_update_corp_logins_calls_helper(self, mock_helper):
        mock_helper.return_value = "logins done"
        result = update_corp_logins(123)
        mock_helper.assert_called_once_with(123, full_update=False)
        self.assertEqual(result, "logins done")

    @patch("corptools.tasks.corporation.corp_starbase_update")
    def test_update_corp_starbases_calls_helper(self, mock_helper):
        mock_helper.return_value = "starbases done"
        result = update_corp_starbases(123)
        mock_helper.assert_called_once_with(123, force_refresh=False)
        self.assertEqual(result, "starbases done")

    @patch("corptools.tasks.corporation.corp_update_industry_jobs")
    def test_update_corp_industry_jobs_calls_helper(self, mock_helper):
        mock_helper.return_value = "jobs done"
        result = update_corp_industry_jobs(123)
        mock_helper.assert_called_once_with(123, force_refresh=False)
        self.assertEqual(result, "jobs done")


class TestUpdateCorporateContractItems(TestCase):
    @patch("corptools.tasks.utils.rate_limiter")
    @patch("corptools.tasks.corporation.corp_contract_item_fetch")
    def test_calls_helper_and_returns_result(self, mock_helper, mock_limiter):
        mock_limiter.check_bucket.return_value = None
        mock_helper.return_value = "items done"
        result = update_corporate_contract_items(123, 42)
        mock_helper.assert_called_once_with(123, 42, force_refresh=False)
        self.assertEqual(result, "items done")

    @patch("corptools.tasks.utils.rate_limiter")
    @patch("corptools.tasks.corporation.corp_contract_item_fetch")
    def test_http_not_modified_returns_none(self, mock_helper, mock_limiter):
        mock_limiter.check_bucket.return_value = None
        mock_helper.side_effect = HTTPNotModified(304, {})
        result = update_corporate_contract_items(123, 42)
        self.assertIsNone(result)

    @patch("corptools.tasks.utils.rate_limiter")
    @patch("corptools.tasks.corporation.corp_contract_item_fetch")
    def test_http_404_returns_not_found_message(self, mock_helper, mock_limiter):
        mock_limiter.check_bucket.return_value = None
        mock_helper.side_effect = HTTPClientError(404, {}, MagicMock())
        result = update_corporate_contract_items(123, 42)
        self.assertIn("123", result)
        self.assertIn("42", result)
        self.assertIn("NOT FOUND", result)


class TestUpdateCorpContracts(CorptoolsTestCase):
    @patch("corptools.tasks.corporation.Chain")
    @patch("corptools.tasks.corporation.corp_contract_update")
    def test_builds_chain_of_contract_item_tasks(self, mock_contracts, mock_chain_cls):
        mock_contracts.return_value = (None, [101, 102])
        mock_chain_instance = MagicMock()
        mock_chain_cls.return_value = mock_chain_instance

        result = update_corp_contracts(123)

        mock_contracts.assert_called_once_with(123, force_refresh=False)
        mock_chain_instance.apply_async.assert_called_once_with(priority=8)
        self.assertIn("123", result)

    @patch("corptools.tasks.corporation.Chain")
    @patch("corptools.tasks.corporation.corp_contract_update")
    def test_none_return_skips_item_chain(self, mock_contracts, mock_chain_cls):
        mock_contracts.return_value = None

        result = update_corp_contracts(123)

        mock_chain_cls.assert_not_called()
        self.assertIn("123", result)

    @patch("corptools.tasks.corporation.Chain")
    @patch("corptools.tasks.corporation.corp_contract_update")
    def test_empty_contract_ids_enqueues_empty_chain(self, mock_contracts, mock_chain_cls):
        mock_contracts.return_value = (None, [])
        mock_chain_instance = MagicMock()
        mock_chain_cls.return_value = mock_chain_instance

        update_corp_contracts(123)

        mock_chain_cls.assert_called_once_with([])


class TestUpdateCorp(CorptoolsTestCase):
    @patch("corptools.tasks.corporation.Chain")
    def test_builds_and_queues_task_chain(self, mock_chain_cls):
        mock_chain_instance = MagicMock()
        mock_chain_cls.return_value = mock_chain_instance

        update_corp(123)

        mock_chain_instance.apply_async.assert_called_once_with(priority=6)

    @patch("corptools.tasks.corporation.Chain")
    def test_chain_contains_all_eight_sub_tasks(self, mock_chain_cls):
        update_corp(123)
        tasks = mock_chain_cls.call_args[0][0]
        self.assertEqual(len(tasks), 8)

    @patch("corptools.tasks.corporation.Chain")
    def test_force_refresh_propagated_to_chain(self, mock_chain_cls):
        update_corp(123, force_refresh=True)
        tasks = mock_chain_cls.call_args[0][0]
        for sig in tasks:
            self.assertTrue(sig.kwargs.get("force_refresh"))


class TestUpdateAllCorps(CorptoolsTestCase):
    @patch("corptools.tasks.corporation.update_corp")
    def test_enqueues_update_for_every_corp_audit(self, mock_task):
        update_all_corps()
        corp_count = CorporationAudit.objects.count()
        self.assertEqual(mock_task.apply_async.call_count, corp_count)

    @patch("corptools.tasks.corporation.update_corp")
    def test_passes_force_refresh_kwarg(self, mock_task):
        update_all_corps(force_refresh=True)
        for call in mock_task.apply_async.call_args_list:
            self.assertTrue(call.kwargs["kwargs"]["force_refresh"])
