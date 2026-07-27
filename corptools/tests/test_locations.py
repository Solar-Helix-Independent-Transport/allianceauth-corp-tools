# Standard Library
from unittest.mock import patch

# Django
from django.core.cache import cache
from django.test import TestCase
from django.utils import timezone

# AA Example App
from corptools.models import (
    CharacterAsset,
    CorpAsset,
    CorporateContract,
    EveLocation,
    EveName,
)
from corptools.task_helpers.update_tasks import LocationUnresolvable
from corptools.tasks.locations import (
    get_location_cooloff,
    set_location_cooloff,
    update_all_locations,
    update_citadel_names,
    update_location,
)

from . import CorptoolsTestCase


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
    """update_location must not let a LocationUnresolvable (raised for a
    404 - object permanently gone) blow up the task. The per-character
    cooloff bookkeeping for that is now owned entirely by resolve_location
    (see test_update_tasks.py) - update_location only needs to react
    correctly to a bare None coming back."""

    def setUp(self):
        cache.clear()

    @patch("corptools.tasks.locations.fetch_location_name")
    def test_station_or_system_unresolvable_cools_off_the_whole_location(self, mock_fetch):
        # The station/system branch still calls fetch_location_name
        # directly (there's no per-character concept for a plain station).
        mock_fetch.side_effect = LocationUnresolvable(60003760)

        result = update_location.apply(args=[60003760])

        self.assertTrue(get_location_cooloff(60003760))
        self.assertIn("unresolvable", result.result)

    @patch("corptools.tasks.locations.get_character_lists")
    @patch("corptools.tasks.locations.resolve_location")
    def test_unresolvable_character_is_skipped_and_the_next_one_tried(
        self, mock_resolve_location, mock_get_character_lists
    ):
        # A plain list (rather than the set get_character_lists returns in
        # production) to keep iteration order deterministic for this test.
        mock_get_character_lists.return_value = [111, 222]
        resolved = EveLocation(
            location_id=1000000000000, location_name="Resolved Citadel")

        def resolve_side_effect(location_id, char_id):
            # resolve_location never raises - a character it can't resolve
            # for (cooled off, denied access, structure gone, ...) is
            # always just None.
            if char_id == 111:
                return None
            return resolved

        mock_resolve_location.side_effect = resolve_side_effect

        with patch.object(resolved, "save"), patch(
            "corptools.tasks.locations.update_missing_locations"
        ) as mock_update_missing:
            update_location.apply(args=[1000000000000])

        mock_update_missing.assert_called_once_with(1000000000000)
        mock_resolve_location.assert_any_call(1000000000000, 111)
        mock_resolve_location.assert_any_call(1000000000000, 222)


class UpdateAllLocationsCorpScopingTests(CorptoolsTestCase):
    """character_filter and corp_filter are independent scopes: a
    per-character call must not also sweep every corp's locations (and vice
    versa), only a bare call with neither filter set should touch
    everything. CorpAsset/CorporateContract discovery mirrors the same
    "only locations actually in use" filtering the character-asset queries
    already used (location_flag allow-list, excluding item_ids that are
    really just another tracked asset)."""

    def setUp(self):
        super().setUp()
        cache.clear()

    def _corp_asset(self, item_id, location_id, location_flag="Hangar"):
        return CorpAsset.objects.create(
            corporation=self.cp1,
            singleton=True,
            item_id=item_id,
            location_flag=location_flag,
            location_id=location_id,
            location_type="station",
            quantity=1,
            type_id=34,
        )

    def _character_asset(self, item_id, location_id, location_flag="Hangar"):
        return CharacterAsset.objects.create(
            character=self.ca1,
            singleton=True,
            item_id=item_id,
            location_flag=location_flag,
            location_id=location_id,
            location_type="station",
            quantity=1,
            type_id=34,
        )

    @patch("corptools.tasks.locations.update_location")
    def test_corp_filter_alone_does_not_touch_character_locations(self, mock_update_location):
        self._character_asset(item_id=1, location_id=60003760)

        update_all_locations.apply(
            kwargs={"corp_filter": [self.corp1.corporation_id]})

        queued = {
            c.kwargs["args"][0] for c in mock_update_location.apply_async.call_args_list}
        self.assertEqual(queued, set())

    @patch("corptools.tasks.locations.update_location")
    def test_character_filter_alone_does_not_touch_corp_locations(self, mock_update_location):
        self._corp_asset(item_id=1, location_id=60003760)

        update_all_locations.apply(
            kwargs={"character_filter": [self.char1.character_id]})

        queued = {
            c.kwargs["args"][0] for c in mock_update_location.apply_async.call_args_list}
        self.assertEqual(queued, set())

    @patch("corptools.tasks.locations.update_location")
    def test_corp_filter_discovers_unresolved_corp_asset_location(self, mock_update_location):
        self._corp_asset(item_id=1, location_id=60003760)

        update_all_locations.apply(
            kwargs={"corp_filter": [self.corp1.corporation_id]})

        queued = {
            c.kwargs["args"][0] for c in mock_update_location.apply_async.call_args_list}
        self.assertIn(60003760, queued)

    @patch("corptools.tasks.locations.update_location")
    def test_neither_filter_sweeps_everything(self, mock_update_location):
        self._character_asset(item_id=1, location_id=60003760)
        self._corp_asset(item_id=2, location_id=1000000000000)

        update_all_locations.apply()

        queued = {
            c.kwargs["args"][0] for c in mock_update_location.apply_async.call_args_list}
        self.assertEqual(queued, {60003760, 1000000000000})

    @patch("corptools.tasks.locations.update_location")
    def test_corp_asset_location_id_matching_another_assets_item_id_is_excluded(
        self, mock_update_location
    ):
        # A container sitting in a real station...
        self._corp_asset(item_id=555, location_id=60003760)
        # ...and something whose location_id is really just that
        # container's item_id, not a real EVE location - must never be
        # queued for ESI resolution.
        self._corp_asset(item_id=556, location_id=555)

        update_all_locations.apply(
            kwargs={"corp_filter": [self.corp1.corporation_id]})

        queued = {
            c.kwargs["args"][0] for c in mock_update_location.apply_async.call_args_list}
        self.assertNotIn(555, queued)
        self.assertIn(60003760, queued)

    @patch("corptools.tasks.locations.update_location")
    def test_corp_asset_with_unaccepted_location_flag_is_ignored(self, mock_update_location):
        # e.g. a fitted module or something in a cargo hold - not a
        # meaningful "where is this" location for the asset tree.
        self._corp_asset(item_id=1, location_id=60003760,
                         location_flag="Cargo")

        update_all_locations.apply(
            kwargs={"corp_filter": [self.corp1.corporation_id]})

        queued = {
            c.kwargs["args"][0] for c in mock_update_location.apply_async.call_args_list}
        self.assertEqual(queued, set())

    @patch("corptools.tasks.locations.update_location")
    def test_corporate_contract_locations_are_discovered(self, mock_update_location):
        name = EveName.objects.create(
            eve_id=1, name="Some Entity", category="character")
        CorporateContract.objects.create(
            id="c1",
            contract_id=1,
            corporation=self.cp1,
            acceptor_id=1,
            acceptor_name=name,
            assignee_id=1,
            assignee_name=name,
            issuer_id=1,
            issuer_name=name,
            issuer_corporation_id=1,
            issuer_corporation_name=name,
            days_to_complete=1,
            start_location_id=60003760,
            end_location_id=60003761,
            for_corporation=False,
            date_expired=timezone.now(),
            date_issued=timezone.now(),
        )

        update_all_locations.apply(
            kwargs={"corp_filter": [self.corp1.corporation_id]})

        queued = {
            c.kwargs["args"][0] for c in mock_update_location.apply_async.call_args_list}
        self.assertEqual(queued, {60003760, 60003761})
