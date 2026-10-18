# Standard Library
from unittest.mock import MagicMock, patch

# Django
from django.core.cache import cache
from django.test import TestCase

# Alliance Auth
from esi.exceptions import HTTPClientError, HTTPError, HTTPNotModified

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


def _token(pk, character_id):
    token = MagicMock()
    token.pk = pk
    token.character_id = character_id
    return token


ROLES_OP = "corptools.tasks.corporation.utils.providers"
WALLET_SCOPES = ["esi-wallet.read_corporation_wallets.v1"]


class TestGetCorpToken(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        cache.clear()

    def _setup(self, mock_token_cls, mock_providers, tokens, roles_by_char):
        """roles_by_char: character_id -> list of roles, or an exception to raise."""
        qs = MagicMock()
        qs.__iter__.side_effect = lambda: iter(tokens)
        qs.first.return_value = tokens[0] if tokens else None
        mock_token_cls.objects.filter.return_value.require_scopes.return_value = qs

        def roles_call(character_id, token):
            op = MagicMock()
            result = roles_by_char[character_id]
            if isinstance(result, Exception):
                op.result.side_effect = result
            else:
                op.result.return_value = MagicMock(roles=result)
            return op

        roles = mock_providers.esi_openapi.client.Character.GetCharactersCharacterIdRoles
        roles.side_effect = roles_call
        return roles

    def test_no_characters_in_corp_returns_none(self):
        result = get_corp_token(99999, list(WALLET_SCOPES), ["Director"])
        self.assertIsNone(result)

    @patch(ROLES_OP)
    @patch("corptools.tasks.corporation.utils.Token")
    def test_roles_scope_required_without_mutating_callers_list(self, mock_token_cls, mock_providers):
        self._setup(mock_token_cls, mock_providers, [], {})
        scopes = list(WALLET_SCOPES)

        get_corp_token(self.corp1.corporation_id, scopes, ["Director"])

        self.assertEqual(scopes, WALLET_SCOPES)
        required = mock_token_cls.objects.filter.return_value.require_scopes.call_args[0][0]
        self.assertEqual(
            sorted(required),
            sorted(WALLET_SCOPES + ["esi-characters.read_corporation_roles.v1"]))

    @patch(ROLES_OP)
    @patch("corptools.tasks.corporation.utils.Token")
    def test_no_roles_required_returns_first_token(self, mock_token_cls, mock_providers):
        token = _token(1, 101)
        roles = self._setup(mock_token_cls, mock_providers, [token], {})

        result = get_corp_token(self.corp1.corporation_id, WALLET_SCOPES, None)

        self.assertEqual(result, token)
        roles.assert_not_called()

    @patch(ROLES_OP)
    @patch("corptools.tasks.corporation.utils.Token")
    def test_matching_role_returns_token(self, mock_token_cls, mock_providers):
        token = _token(1, 101)
        self._setup(mock_token_cls, mock_providers,
                    [token], {101: ["Accountant"]})

        result = get_corp_token(self.corp1.corporation_id,
                                WALLET_SCOPES, ["Accountant"])

        self.assertEqual(result, token)

    @patch(ROLES_OP)
    @patch("corptools.tasks.corporation.utils.Token")
    def test_no_matching_role_returns_none(self, mock_token_cls, mock_providers):
        self._setup(mock_token_cls, mock_providers,
                    [_token(1, 101)], {101: ["Accountant"]})

        result = get_corp_token(self.corp1.corporation_id,
                                WALLET_SCOPES, ["Factory_Manager"])

        self.assertIsNone(result)

    @patch(ROLES_OP)
    @patch("corptools.tasks.corporation.utils.Token")
    def test_director_satisfies_any_role(self, mock_token_cls, mock_providers):
        # Directors hold every role in game; ESI listing only "Director"
        # must not stop them qualifying for e.g. industry or sov endpoints.
        token = _token(1, 101)
        self._setup(mock_token_cls, mock_providers,
                    [token], {101: ["Director"]})

        result = get_corp_token(self.corp1.corporation_id,
                                WALLET_SCOPES, ["Factory_Manager"])

        self.assertEqual(result, token)

    @patch(ROLES_OP)
    @patch("corptools.tasks.corporation.utils.Token")
    def test_token_error_skips_to_next_token(self, mock_token_cls, mock_providers):
        # Alliance Auth
        from esi.errors import TokenError

        good = _token(2, 102)
        self._setup(mock_token_cls, mock_providers, [_token(1, 101), good], {
            101: TokenError("expired"),
            102: ["Director"],
        })

        result = get_corp_token(self.corp1.corporation_id,
                                WALLET_SCOPES, ["Director"])

        self.assertEqual(result, good)

    @patch(ROLES_OP)
    @patch("corptools.tasks.corporation.utils.Token")
    def test_http_error_on_one_token_skips_to_next_token(self, mock_token_cls, mock_providers):
        # Used to abort the whole lookup - and the bad token is always tried
        # first, so the corp module broke until the token went away.
        good = _token(2, 102)
        self._setup(mock_token_cls, mock_providers, [_token(1, 101), good], {
            101: HTTPClientError(403, {}, MagicMock()),
            102: ["Director"],
        })

        result = get_corp_token(self.corp1.corporation_id,
                                WALLET_SCOPES, ["Director"])

        self.assertEqual(result, good)

    @patch(ROLES_OP)
    @patch("corptools.tasks.corporation.utils.Token")
    def test_error_limit_propagates_instead_of_trying_every_token(self, mock_token_cls, mock_providers):
        roles = self._setup(mock_token_cls, mock_providers, [_token(1, 101), _token(2, 102)], {
            101: HTTPClientError(429, {}, MagicMock()),
            102: ["Director"],
        })

        with self.assertRaises(HTTPClientError):
            get_corp_token(self.corp1.corporation_id,
                           WALLET_SCOPES, ["Director"])
        self.assertEqual(roles.call_count, 1)

    @patch(ROLES_OP)
    @patch("corptools.tasks.corporation.utils.Token")
    def test_last_good_token_is_tried_first_next_time(self, mock_token_cls, mock_providers):
        director = _token(3, 103)
        roles = self._setup(
            mock_token_cls, mock_providers,
            [_token(1, 101), _token(2, 102), director],
            {101: [], 102: ["Accountant"], 103: ["Director"]},
        )

        get_corp_token(self.corp1.corporation_id, WALLET_SCOPES, ["Director"])
        self.assertEqual(roles.call_count, 3)

        roles.reset_mock()
        result = get_corp_token(self.corp1.corporation_id,
                                WALLET_SCOPES, ["Director"])

        self.assertEqual(result, director)
        self.assertEqual(
            [c.kwargs["character_id"] for c in roles.call_args_list], [103])

    @patch(ROLES_OP)
    @patch("corptools.tasks.corporation.utils.Token")
    def test_remembered_token_that_lost_its_role_falls_back_to_scan(self, mock_token_cls, mock_providers):
        old, new = _token(1, 101), _token(2, 102)
        roles_by_char = {101: ["Director"], 102: []}
        self._setup(mock_token_cls, mock_providers, [old, new], roles_by_char)
        self.assertEqual(
            get_corp_token(self.corp1.corporation_id, WALLET_SCOPES, ["Director"]), old)

        roles_by_char.update({101: [], 102: ["Director"]})
        self.assertEqual(
            get_corp_token(self.corp1.corporation_id, WALLET_SCOPES, ["Director"]), new)

    @patch(ROLES_OP)
    @patch("corptools.tasks.corporation.utils.Token")
    def test_remembered_token_is_per_role_set(self, mock_token_cls, mock_providers):
        accountant, manager = _token(1, 101), _token(2, 102)
        self._setup(mock_token_cls, mock_providers, [accountant, manager], {
            101: ["Accountant"], 102: ["Factory_Manager"]})

        self.assertEqual(
            get_corp_token(self.corp1.corporation_id, WALLET_SCOPES, ["Accountant"]), accountant)
        self.assertEqual(
            get_corp_token(self.corp1.corporation_id, WALLET_SCOPES, ["Factory_Manager"]), manager)
