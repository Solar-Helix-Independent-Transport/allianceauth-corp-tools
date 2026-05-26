# Standard Library
from unittest import mock

# Django
from django.test import TestCase

# AA Example App
from corptools.api.helpers import (
    assets_glances,
    format_hours_as_duration,
    get_alts_queryset,
    get_corporation_characters,
    mining_check,
    round_or_null,
    wallet_check,
)

from . import CorptoolsTestCase

# ---------------------------------------------------------------------------
# format_hours_as_duration
# ---------------------------------------------------------------------------


class TestFormatHoursAsDuration(TestCase):
    def test_zero_returns_zero_hours(self):
        self.assertEqual(format_hours_as_duration(0), "0 hours")

    def test_none_treated_as_zero(self):
        self.assertEqual(format_hours_as_duration(None), "0 hours")

    def test_negative_clamped_to_zero_hours(self):
        self.assertEqual(format_hours_as_duration(-5), "0 hours")

    def test_one_hour_singular(self):
        self.assertEqual(format_hours_as_duration(1), "1 hour")

    def test_two_hours_plural(self):
        self.assertEqual(format_hours_as_duration(2), "2 hours")

    def test_one_day_singular(self):
        self.assertEqual(format_hours_as_duration(24), "1 day")

    def test_two_days_plural(self):
        self.assertEqual(format_hours_as_duration(48), "2 days")

    def test_day_and_one_hour(self):
        self.assertEqual(format_hours_as_duration(25), "1 day and 1 hour")

    def test_day_and_hours_plural(self):
        self.assertEqual(format_hours_as_duration(26), "1 day and 2 hours")

    def test_one_month_singular(self):
        # 720 = 30 * 24
        self.assertEqual(format_hours_as_duration(720), "1 month")

    def test_two_months_plural(self):
        self.assertEqual(format_hours_as_duration(1440), "2 months")

    def test_month_and_hour_no_day(self):
        # 721 = 1 month remainder 1 hour (< 24, so no day part)
        self.assertEqual(format_hours_as_duration(721), "1 month and 1 hour")

    def test_month_and_day(self):
        # 744 = 1 month (720) + 1 day (24)
        self.assertEqual(format_hours_as_duration(744), "1 month and 1 day")

    def test_three_parts_uses_oxford_comma(self):
        # 745 = 1 month + 1 day + 1 hour
        self.assertEqual(format_hours_as_duration(745),
                         "1 month, 1 day, and 1 hour")

    def test_three_parts_all_plural(self):
        # 1465 = 2 months (1440) + 1 day (24) + 1 hour
        self.assertEqual(format_hours_as_duration(
            1465), "2 months, 1 day, and 1 hour")


# ---------------------------------------------------------------------------
# round_or_null
# ---------------------------------------------------------------------------

class TestRoundOrNull(TestCase):
    def test_none_returns_none(self):
        self.assertIsNone(round_or_null(None))

    def test_zero_returns_zero(self):
        self.assertEqual(round_or_null(0), 0)

    def test_zero_float_returns_zero_float(self):
        self.assertEqual(round_or_null(0.0), 0.0)

    def test_rounds_to_two_decimal_places_by_default(self):
        self.assertEqual(round_or_null(3.14159), 3.14)

    def test_custom_digits(self):
        self.assertEqual(round_or_null(3.14159, 4), 3.1416)

    def test_zero_digits(self):
        self.assertEqual(round_or_null(3.7, 0), 4.0)


# ---------------------------------------------------------------------------
# assets_glances
# ---------------------------------------------------------------------------

class TestAssetsGlances(TestCase):
    def test_empty_iterables_all_zero(self):
        result = assets_glances([], [])
        self.assertEqual(result["frigate"], 0)
        self.assertEqual(result["titan"], 0)
        self.assertEqual(result["injector"], 0)
        self.assertEqual(result["extractor"], 0)

    def test_frigate_group_25_counted(self):
        ships = [{"type_name__group__id": 25, "grp_total": 3}]
        result = assets_glances(ships, [])
        self.assertEqual(result["frigate"], 3)

    def test_destroyer_group_420_counted(self):
        ships = [{"type_name__group__id": 420, "grp_total": 2}]
        result = assets_glances(ships, [])
        self.assertEqual(result["destroyer"], 2)

    def test_cruiser_group_26_counted(self):
        ships = [{"type_name__group__id": 26, "grp_total": 4}]
        result = assets_glances(ships, [])
        self.assertEqual(result["cruiser"], 4)

    def test_battleship_group_27_counted(self):
        ships = [{"type_name__group__id": 27, "grp_total": 1}]
        result = assets_glances(ships, [])
        self.assertEqual(result["battleship"], 1)

    def test_titan_group_30_counted(self):
        ships = [{"type_name__group__id": 30, "grp_total": 1}]
        result = assets_glances(ships, [])
        self.assertEqual(result["titan"], 1)

    def test_carrier_group_547_counted(self):
        ships = [{"type_name__group__id": 547, "grp_total": 2}]
        result = assets_glances(ships, [])
        self.assertEqual(result["carrier"], 2)

    def test_fax_group_1538_counted(self):
        ships = [{"type_name__group__id": 1538, "grp_total": 1}]
        result = assets_glances(ships, [])
        self.assertEqual(result["fax"], 1)

    def test_supercarrier_group_659_counted(self):
        ships = [{"type_name__group__id": 659, "grp_total": 1}]
        result = assets_glances(ships, [])
        self.assertEqual(result["supercarrier"], 1)

    def test_injector_group_1739_counted(self):
        ships = [{"type_name__group__id": 1739, "grp_total": 10}]
        result = assets_glances(ships, [])
        self.assertEqual(result["injector"], 10)

    def test_extractor_type_40519_counted(self):
        sp = [{"type_name__id": 40519, "type_total": 5}]
        result = assets_glances([], sp)
        self.assertEqual(result["extractor"], 5)

    def test_merc_den_type_85230_counted(self):
        sp = [{"type_name__id": 85230, "type_total": 2}]
        result = assets_glances([], sp)
        self.assertEqual(result["merc_den"], 2)

    def test_unknown_group_changes_nothing(self):
        ships = [{"type_name__group__id": 99999, "grp_total": 10}]
        result = assets_glances(ships, [])
        self.assertEqual(sum(result.values()), 0)

    def test_multiple_same_group_accumulated(self):
        ships = [
            {"type_name__group__id": 25, "grp_total": 2},
            {"type_name__group__id": 25, "grp_total": 3},
        ]
        result = assets_glances(ships, [])
        self.assertEqual(result["frigate"], 5)

    def test_mixed_categories_classified_correctly(self):
        ships = [
            {"type_name__group__id": 25, "grp_total": 1},  # frigate
            {"type_name__group__id": 27, "grp_total": 2},  # battleship
            {"type_name__group__id": 30, "grp_total": 1},  # titan
        ]
        result = assets_glances(ships, [])
        self.assertEqual(result["frigate"], 1)
        self.assertEqual(result["battleship"], 2)
        self.assertEqual(result["titan"], 1)
        self.assertEqual(result["destroyer"], 0)


# ---------------------------------------------------------------------------
# get_alts_queryset
# ---------------------------------------------------------------------------

class TestGetAltsQueryset(CorptoolsTestCase):
    def test_character_with_ownership_returns_all_linked_chars(self):
        # user1 owns char1 and char2
        alts = get_alts_queryset(self.char1)
        char_ids = set(alts.values_list("character_id", flat=True))
        self.assertIn(self.char1.character_id, char_ids)
        self.assertIn(self.char2.character_id, char_ids)

    def test_character_without_ownership_returns_only_self(self):
        # char4 has no CharacterOwnership in the fixture
        alts = get_alts_queryset(self.char4)
        char_ids = list(alts.values_list("character_id", flat=True))
        self.assertEqual(char_ids, [self.char4.pk])


# ---------------------------------------------------------------------------
# get_corporation_characters
# ---------------------------------------------------------------------------

class TestGetCorporationCharacters(CorptoolsTestCase):
    def test_returns_characters_in_corp_visible_to_user(self):
        # Django
        from django.contrib.auth.models import Permission
        perm = Permission.objects.get_by_natural_key(
            "global_hr", "corptools", "characteraudit"
        )
        self.user1.user_permissions.add(perm)
        self.user1.refresh_from_db()

        request = mock.Mock()
        request.user = self.user1

        # corp1 has char1 and char2 (both owned by user1)
        chars = get_corporation_characters(request, self.corp1.corporation_id)
        char_ids = set(chars.values_list("character_id", flat=True))
        self.assertIn(self.char1.character_id, char_ids)
        self.assertIn(self.char2.character_id, char_ids)

    def test_returns_empty_for_unknown_corp(self):
        request = mock.Mock()
        request.user = self.user1

        chars = get_corporation_characters(request, 99999)
        self.assertEqual(chars.count(), 0)


# ---------------------------------------------------------------------------
# wallet_check
# ---------------------------------------------------------------------------

class TestWalletCheck(CorptoolsTestCase):
    def test_string_types_coerced_to_list(self):
        characters = [self.char1]
        qry = wallet_check(characters, "bounty_prizes")
        # Just verifying it runs without error and returns a queryset
        self.assertEqual(qry.count(), 0)

    def test_list_types_accepted(self):
        characters = [self.char1]
        qry = wallet_check(characters, ["bounty_prizes", "market_transaction"])
        self.assertEqual(qry.count(), 0)

    def test_string_first_parties_coerced_to_list(self):
        characters = [self.char1]
        qry = wallet_check(characters, "bounty_prizes",
                           first_parties="1000125")
        self.assertEqual(qry.count(), 0)

    def test_minimum_amount_filter_applied(self):
        characters = [self.char1]
        qry = wallet_check(characters, "bounty_prizes",
                           minimum_amount=1_000_000)
        self.assertEqual(qry.count(), 0)

    def test_no_first_parties_no_minimum_runs(self):
        characters = [self.char1]
        qry = wallet_check(characters, ["bounty_prizes"])
        self.assertEqual(qry.count(), 0)


# ---------------------------------------------------------------------------
# mining_check
# ---------------------------------------------------------------------------

class TestMiningCheck(CorptoolsTestCase):
    def test_returns_queryset_for_known_groups(self):
        # AA Example App
        from corptools.constants.types import MINING_ORE_GROUPS

        characters = [self.char1]
        qry = mining_check(characters, MINING_ORE_GROUPS)
        self.assertEqual(qry.count(), 0)

    def test_custom_look_back_applied(self):
        characters = [self.char1, self.char2]
        qry = mining_check(characters, [463], look_back=7)
        self.assertEqual(qry.count(), 0)
