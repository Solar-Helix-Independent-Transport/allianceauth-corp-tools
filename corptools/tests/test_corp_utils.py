# Standard Library
from unittest.mock import MagicMock, patch

# Django
from django.test import TestCase

# Alliance Auth
from esi.exceptions import HTTPError, HTTPNotModified

# AA Example App
from corptools.models import EveName
from corptools.tasks.corporation.utils import (
    NoTokens,
    get_corp_token,
    get_eve_ids,
    update_corp_audit,
)

from . import CorptoolsTestCase


class TestUpdateCorpAuditDecorator(CorptoolsTestCase):

    def test_success_updates_both_timestamps_and_returns_result(self):
        @update_corp_audit(update_field="wallet")
        def my_func(corp_id):
            return "done"

        result = my_func(self.cp1.corporation.corporation_id)
        self.assertEqual(result, "done")
        self.cp1.refresh_from_db()
        self.assertIn("wallet", self.cp1.update_timestamps)
        self.assertIn("wallet", self.cp1.change_timestamps)

    def test_http_not_modified_sets_update_timestamp_only(self):
        @update_corp_audit(update_field="wallet")
        def my_func(corp_id):
            raise HTTPNotModified(304, {})

        result = my_func(self.cp1.corporation.corporation_id)
        self.assertIsNone(result)
        self.cp1.refresh_from_db()
        self.assertIn("wallet", self.cp1.update_timestamps)
        self.assertNotIn("wallet", self.cp1.change_timestamps)

    def test_http_error_logs_and_returns_none(self):
        @update_corp_audit(update_field="wallet")
        def my_func(corp_id):
            err = MagicMock(spec=HTTPError)
            err.__class__ = HTTPError
            raise HTTPError(MagicMock())

        result = my_func(self.cp1.corporation.corporation_id)
        self.assertIsNone(result)

    def test_no_tokens_logs_and_returns_none(self):
        @update_corp_audit(update_field="wallet")
        def my_func(corp_id):
            raise NoTokens("no token found")

        result = my_func(self.cp1.corporation.corporation_id)
        self.assertIsNone(result)

    def test_preserves_wrapped_function_name(self):
        @update_corp_audit(update_field="wallet")
        def my_named_func(corp_id):
            pass

        self.assertEqual(my_named_func.__name__, "my_named_func")


class TestGetEveIds(TestCase):

    def test_returns_matching_ids_as_set_of_ints(self):
        EveName.objects.create(eve_id=100, name="Alpha", category="character")
        EveName.objects.create(eve_id=200, name="Beta", category="corporation")
        result = get_eve_ids([100, 200, 999])
        self.assertIn(100, result)
        self.assertIn(200, result)
        self.assertNotIn(999, result)
        self.assertIsInstance(result, set)

    def test_returns_integers_not_tuples(self):
        EveName.objects.create(eve_id=101, name="Gamma", category="character")
        result = get_eve_ids([101])
        self.assertIn(101, result)
        # Confirm flat=True is working — elements are ints, not (id, name) tuples
        for item in result:
            self.assertIsInstance(item, int)

    def test_empty_input_returns_empty_set(self):
        result = get_eve_ids([])
        self.assertEqual(result, set())

    def test_no_matches_returns_empty_set(self):
        result = get_eve_ids([99999])
        self.assertEqual(result, set())

    def test_accepts_set_input(self):
        EveName.objects.create(eve_id=102, name="Delta", category="character")
        result = get_eve_ids({102})
        self.assertIn(102, result)


class TestGetCorpToken(CorptoolsTestCase):

    def test_no_characters_in_corp_returns_none(self):
        result = get_corp_token(
            99999, ["esi-wallet.read_corporation_wallets.v1"], ["Director"])
        self.assertIsNone(result)

    def test_roles_scope_appended_when_missing(self):
        scopes = ["esi-wallet.read_corporation_wallets.v1"]
        get_corp_token(99999, scopes, ["Director"])
        self.assertIn("esi-characters.read_corporation_roles.v1", scopes)

    def test_roles_scope_not_duplicated_when_already_present(self):
        scopes = [
            "esi-wallet.read_corporation_wallets.v1",
            "esi-characters.read_corporation_roles.v1",
        ]
        get_corp_token(99999, scopes, ["Director"])
        self.assertEqual(scopes.count(
            "esi-characters.read_corporation_roles.v1"), 1)

    @patch("corptools.tasks.corporation.utils.providers")
    @patch("corptools.tasks.corporation.utils.Token")
    def test_no_roles_required_returns_first_token(self, mock_token_cls, mock_providers):
        mock_token = MagicMock()
        mock_token_cls.objects.filter.return_value.require_scopes.return_value = [
            mock_token]

        result = get_corp_token(self.corp1.corporation_id, [
                                "esi-wallet.read_corporation_wallets.v1"], None)

        self.assertEqual(result, mock_token)
        mock_providers.esi_openapi.client.Character.GetCharactersCharacterIdRoles.assert_not_called()

    @patch("corptools.tasks.corporation.utils.providers")
    @patch("corptools.tasks.corporation.utils.Token")
    def test_matching_role_returns_token(self, mock_token_cls, mock_providers):
        mock_token = MagicMock()
        mock_token.character_id = 1
        mock_token_cls.objects.filter.return_value.require_scopes.return_value = [
            mock_token]

        mock_roles = MagicMock()
        mock_roles.roles = ["Director", "Accountant"]
        mock_providers.esi_openapi.client.Character.GetCharactersCharacterIdRoles.return_value.result.return_value = mock_roles

        result = get_corp_token(self.corp1.corporation_id, [
                                "esi-wallet.read_corporation_wallets.v1"], ["Director"])

        self.assertEqual(result, mock_token)

    @patch("corptools.tasks.corporation.utils.providers")
    @patch("corptools.tasks.corporation.utils.Token")
    def test_no_matching_role_returns_none(self, mock_token_cls, mock_providers):
        mock_token = MagicMock()
        mock_token.character_id = 1
        mock_token_cls.objects.filter.return_value.require_scopes.return_value = [
            mock_token]

        mock_roles = MagicMock()
        mock_roles.roles = ["Accountant"]
        mock_providers.esi_openapi.client.Character.GetCharactersCharacterIdRoles.return_value.result.return_value = mock_roles

        result = get_corp_token(self.corp1.corporation_id, [
                                "esi-wallet.read_corporation_wallets.v1"], ["Director"])

        self.assertIsNone(result)

    @patch("corptools.tasks.corporation.utils.providers")
    @patch("corptools.tasks.corporation.utils.Token")
    def test_token_error_skips_to_next_token(self, mock_token_cls, mock_providers):
        # Alliance Auth
        from esi.errors import TokenError

        bad_token = MagicMock()
        bad_token.character_id = 1
        mock_token_cls.objects.filter.return_value.require_scopes.return_value = [
            bad_token]

        mock_providers.esi_openapi.client.Character.GetCharactersCharacterIdRoles.return_value.result.side_effect = TokenError(
            "expired")

        result = get_corp_token(self.corp1.corporation_id, [
                                "esi-wallet.read_corporation_wallets.v1"], ["Director"])

        self.assertIsNone(result)
