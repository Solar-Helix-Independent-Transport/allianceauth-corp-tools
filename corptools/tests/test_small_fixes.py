"""Small task bugs found in review."""
# Standard Library
from unittest.mock import patch

# AA Example App
from corptools.models import (
    BridgeOzoneLevel,
    CharacterAsset,
    CorpAsset,
    EveLocation,
    Structure,
)
from corptools.tasks.corporation.assets import run_ozone_levels
from corptools.tasks.locations import update_missing_locations

from . import CorptoolsTestCase

OZONE = 16273
BRIDGE = 35841


class TestRunOzoneLevels(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        self.bridge = Structure.objects.create(
            corporation=self.cp1, structure_id=1_000_000_000_001, type_id=BRIDGE,
            system_id=30000142, name="JB", state="online", profile_id=1, reinforce_hour=0)

    def _ozone(self, quantity, item_id=1):
        CorpAsset.objects.filter(type_id=OZONE).delete()
        if quantity:
            CorpAsset.objects.create(
                corporation=self.cp1, singleton=False, item_id=item_id,
                location_flag="StructureFuel", location_id=self.bridge.structure_id,
                location_type="item", quantity=quantity, type_id=OZONE)

    def test_records_level_and_usage(self):
        self._ozone(5000)
        run_ozone_levels(self.corp1.corporation_id)
        self._ozone(4200)
        run_ozone_levels(self.corp1.corporation_id)

        levels = list(BridgeOzoneLevel.objects.order_by(
            "id").values_list("quantity", "used"))
        self.assertEqual(levels, [(5000, 0), (4200, 800)])

    def test_empty_bridge_is_recorded_as_zero(self):
        # Sum() is None with no ozone at all - this used to fail and be
        # silently swallowed, so running dry was never recorded.
        self._ozone(5000)
        run_ozone_levels(self.corp1.corporation_id)
        self._ozone(0)
        run_ozone_levels(self.corp1.corporation_id)

        levels = list(BridgeOzoneLevel.objects.order_by(
            "id").values_list("quantity", "used"))
        self.assertEqual(levels, [(5000, 0), (0, 5000)])

    def test_refuel_is_not_negative_usage(self):
        self._ozone(1000)
        run_ozone_levels(self.corp1.corporation_id)
        self._ozone(9000)
        run_ozone_levels(self.corp1.corporation_id)
        self.assertEqual(
            BridgeOzoneLevel.objects.order_by("-id").first().used, 0)


class TestUpdateMissingLocationsCount(CorptoolsTestCase):

    @patch("corptools.tasks.locations.logger")
    def test_count_includes_character_assets(self, _logger):
        # the CorpAsset count used to overwrite the CharacterAsset one
        EveLocation.objects.create(location_id=60003760, location_name="Jita")
        for item_id in (1, 2):
            CharacterAsset.objects.create(
                character=self.ca1, singleton=True, item_id=item_id,
                location_flag="Hangar", location_id=60003760,
                location_type="station", quantity=1, type_id=34)
        CorpAsset.objects.create(
            corporation=self.cp1, singleton=True, item_id=3,
            location_flag="Hangar", location_id=60003760,
            location_type="station", quantity=1, type_id=34)

        self.assertEqual(update_missing_locations(60003760), 3)
