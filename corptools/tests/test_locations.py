# Standard Library
from datetime import timedelta
from unittest.mock import MagicMock, patch

# Django
from django.core.cache import cache
from django.test import TestCase
from django.utils import timezone

# AA Example App
from corptools.models import EveLocation
from corptools.task_helpers.update_tasks import LocationUnresolvable
from corptools.tasks.locations import (
    COOLOFF_DAYS,
    UNRESOLVABLE_COOLOFF_DAYS,
    get_location_cooloff,
    is_character_on_cooloff,
    set_character_cooloff,
    set_location_cooloff,
    untried_characters,
    update_citadel_names,
    update_location,
)


class CharacterCooloffTests(TestCase):
    """A single per-location cache entry tracks which characters have
    already been (unsuccessfully) tried, replacing the three overlapping
    mechanisms that used to exist here."""

    def setUp(self):
        cache.clear()

    def test_character_not_on_cooloff_when_never_tried(self):
        self.assertFalse(is_character_on_cooloff(1000000000000, 1))

    def test_character_on_cooloff_after_being_set(self):
        set_character_cooloff(1000000000000, 1)
        self.assertTrue(is_character_on_cooloff(1000000000000, 1))

    def test_cooloff_does_not_affect_other_characters(self):
        set_character_cooloff(1000000000000, 1)
        self.assertFalse(is_character_on_cooloff(1000000000000, 2))

    def test_cooloff_does_not_affect_other_locations(self):
        set_character_cooloff(1000000000000, 1)
        self.assertFalse(is_character_on_cooloff(2000000000000, 1))

    def test_default_cooloff_window_matches_cooloff_days_constant(self):
        set_character_cooloff(1000000000000, 1)
        state = cache.get("loc_id_1000000000000")
        self.assertIsNotNone(state)
        # Sanity check it round-trips through is_character_on_cooloff rather
        # than asserting on the raw cache format.
        self.assertTrue(is_character_on_cooloff(1000000000000, 1))

    def test_custom_duration_is_respected(self):
        # A cooloff set for -1 days is already in the past, so it should read
        # back as expired immediately - proves `days` actually drives expiry
        # rather than always using COOLOFF_DAYS.
        set_character_cooloff(1000000000000, 1, days=-1)
        self.assertFalse(is_character_on_cooloff(1000000000000, 1))

    def test_unresolvable_cooloff_outlasts_default_cooloff(self):
        set_character_cooloff(
            1000000000000, 1, days=UNRESOLVABLE_COOLOFF_DAYS)
        self.assertGreater(UNRESOLVABLE_COOLOFF_DAYS, COOLOFF_DAYS)
        self.assertTrue(is_character_on_cooloff(1000000000000, 1))

    def test_untried_characters_excludes_those_on_cooloff(self):
        set_character_cooloff(1000000000000, 1)
        result = untried_characters(1000000000000, {1, 2, 3})
        self.assertEqual(result, {2, 3})

    def test_untried_characters_is_untouched_when_nothing_cooled_off(self):
        result = untried_characters(1000000000000, {1, 2, 3})
        self.assertEqual(result, {1, 2, 3})


class LocationCooloffTests(TestCase):
    def setUp(self):
        cache.clear()

    def test_location_not_on_cooloff_by_default(self):
        self.assertFalse(get_location_cooloff(1000000000000))

    def test_location_on_cooloff_after_being_set(self):
        set_location_cooloff(1000000000000)
        self.assertTrue(get_location_cooloff(1000000000000))

    def test_cooloff_is_scoped_per_location(self):
        set_location_cooloff(1000000000000)
        self.assertFalse(get_location_cooloff(2000000000000))


class UpdateCitadelNamesTests(TestCase):
    """Managed locations (corp-hangar/container rows that reuse an asset
    item_id as their location_id) must never be re-queried against ESI as if
    they were real citadels."""

    def setUp(self):
        cache.clear()
        EveLocation.objects.create(
            location_id=1000000000001, location_name="Real Citadel", managed=False
        )
        EveLocation.objects.create(
            location_id=1000000000002, location_name="Container Row", managed=True
        )
        EveLocation.objects.create(
            location_id=60003760, location_name="Station", managed=False
        )

    @patch("corptools.tasks.locations.update_location")
    def test_only_unmanaged_citadel_scale_locations_are_requeued(self, mock_update_location):
        update_citadel_names.apply()

        queued_ids = {
            c.kwargs["args"][0]
            for c in mock_update_location.apply_async.call_args_list
        }
        self.assertEqual(queued_ids, {1000000000001})


class UpdateLocationUnresolvableTests(TestCase):
    """update_location must translate a LocationUnresolvable (raised for a
    404 - object permanently gone) into the appropriate cooloff instead of
    letting the exception blow up the task."""

    def setUp(self):
        cache.clear()

    @patch("corptools.tasks.locations.fetch_location_name")
    def test_station_or_system_unresolvable_cools_off_the_whole_location(self, mock_fetch):
        mock_fetch.side_effect = LocationUnresolvable(60003760)

        result = update_location.apply(args=[60003760])

        self.assertTrue(get_location_cooloff(60003760))
        self.assertIn("unresolvable", result.result)

    @patch("corptools.tasks.locations.get_character_lists")
    @patch("corptools.tasks.locations.fetch_location_name")
    def test_structure_unresolvable_cools_off_that_character_for_longer(
        self, mock_fetch, mock_get_character_lists
    ):
        mock_get_character_lists.return_value = {111}
        mock_fetch.side_effect = LocationUnresolvable(1000000000000)

        update_location.apply(args=[1000000000000])

        self.assertTrue(is_character_on_cooloff(1000000000000, 111))
        # A normal failure only cools off for COOLOFF_DAYS; simulate one day
        # past that window and confirm the unresolvable cooloff is still
        # active because it was set for UNRESOLVABLE_COOLOFF_DAYS instead.
        future = timezone.now() + timedelta(days=COOLOFF_DAYS + 1)
        with patch("corptools.tasks.locations.timezone") as mock_timezone:
            mock_timezone.now.return_value = future
            self.assertTrue(is_character_on_cooloff(1000000000000, 111))

    @patch("corptools.tasks.locations.get_character_lists")
    @patch("corptools.tasks.locations.fetch_location_name")
    def test_structure_unresolvable_for_one_character_still_tries_the_next(
        self, mock_fetch, mock_get_character_lists
    ):
        # A plain list (rather than the set get_character_lists returns in
        # production) to keep iteration order deterministic for this test.
        mock_get_character_lists.return_value = [111, 222]
        resolved = EveLocation(
            location_id=1000000000000, location_name="Resolved Citadel")

        def fetch_side_effect(location_id, flag, char_id):
            if char_id == 111:
                raise LocationUnresolvable(location_id)
            return resolved

        mock_fetch.side_effect = fetch_side_effect

        with patch.object(resolved, "save"), patch(
            "corptools.tasks.locations.update_missing_locations"
        ) as mock_update_missing:
            update_location.apply(args=[1000000000000])

        mock_update_missing.assert_called_once_with(1000000000000)
        self.assertTrue(is_character_on_cooloff(1000000000000, 111))
        self.assertFalse(is_character_on_cooloff(1000000000000, 222))
