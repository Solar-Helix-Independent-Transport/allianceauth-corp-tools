# Standard Library
from datetime import timedelta

# Third Party
from eve_sde import models as sde_models

# Django
from django.contrib.auth.models import Permission
from django.utils import timezone

# AA Example App
from corptools import models as ct_models
from corptools.api.activity_map_shared import (
    LOOKBACK_DAYS,
    asset_counts_by_system,
    mining_volume_by_system,
    ratting_isk_by_system,
)

from . import CorptoolsTestCase


def _character_asset_counts_by_system(characters, extra_filter=None):
    qs = ct_models.CharacterAsset.objects.filter(
        character__character__in=characters)
    return asset_counts_by_system(qs, extra_filter)


def _days_ago_date(days):
    return (timezone.now() - timedelta(days=days)).date()


def _days_ago_datetime(days):
    return timezone.now() - timedelta(days=days)


_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/assets"
_SHIPS_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/assets/ships"
_CAPITALS_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/assets/capitals"
_MINING_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/mining"
_RATTING_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/ratting"


class ActivityMapAssetsTestCase(CorptoolsTestCase):

    def setUp(self):
        super().setUp()

        self.region = sde_models.Region.objects.create(
            id=1, name="Test Region")
        self.constellation = sde_models.Constellation.objects.create(
            id=1, name="Test Constellation", region=self.region
        )
        self.system1 = sde_models.SolarSystem.objects.create(
            id=1001,
            name="System One",
            security_status=0.5,
            x=0, y=0, z=0,
            security_class="hisec",
            constellation=self.constellation,
        )
        self.system2 = sde_models.SolarSystem.objects.create(
            id=1002,
            name="System Two",
            security_status=0.5,
            x=1, y=1, z=1,
            security_class="hisec",
            constellation=self.constellation,
        )
        # A system with no assets at all - should still show up on the map.
        self.system3 = sde_models.SolarSystem.objects.create(
            id=1003,
            name="System Three",
            security_status=0.5,
            x=2, y=2, z=2,
            security_class="hisec",
            constellation=self.constellation,
        )

        # Wormhole and Abyssal systems live at fixed id ranges in the real SDE
        # (31_000_000+/32_000_000+) - the whole-map view should never render
        # them, regardless of what region/constellation they're attached to.
        self.wh_region = sde_models.Region.objects.create(
            id=11000001, name="A-R00001")
        self.wh_constellation = sde_models.Constellation.objects.create(
            id=11000001, name="A-C00001", region=self.wh_region
        )
        self.wh_system = sde_models.SolarSystem.objects.create(
            id=31000005,
            name="J123456",
            security_status=-1.0,
            x=3, y=3, z=3,
            security_class="wormhole",
            constellation=self.wh_constellation,
        )

        self.abyssal_region = sde_models.Region.objects.create(
            id=12000001, name="Abyssal Region")
        self.abyssal_constellation = sde_models.Constellation.objects.create(
            id=12000001, name="Abyssal Constellation", region=self.abyssal_region
        )
        self.abyssal_system = sde_models.SolarSystem.objects.create(
            id=32000005,
            name="Abyssal System",
            security_status=0.0,
            x=4, y=4, z=4,
            security_class="abyssal",
            constellation=self.abyssal_constellation,
        )

        self.loc1 = ct_models.EveLocation.objects.create(
            location_id=60000001, location_name="Station One", system=self.system1
        )
        self.loc2 = ct_models.EveLocation.objects.create(
            location_id=60000002, location_name="Station Two", system=self.system2
        )

        self.view_module = Permission.objects.get_by_natural_key(
            'view_characteraudit', 'corptools', 'characteraudit')

        self.veldspar = sde_models.ItemType.objects.create(
            id=1230, name="Veldspar", published=True, volume=0.1)
        self.scordite = sde_models.ItemType.objects.create(
            id=1228, name="Scordite", published=True, volume=0.15)

        self.ship_category = sde_models.ItemCategory.objects.create(
            id=6, name="Ship")
        self.module_category = sde_models.ItemCategory.objects.create(
            id=7, name="Module")
        self.frigate_group = sde_models.ItemGroup.objects.create(
            id=25, name="Frigate", category=self.ship_category)
        self.dreadnought_group = sde_models.ItemGroup.objects.create(
            id=485, name="Dreadnought", category=self.ship_category)
        self.module_group = sde_models.ItemGroup.objects.create(
            id=300, name="Shield Extender", category=self.module_category)
        self.frigate_type = sde_models.ItemType.objects.create(
            id=600, name="Rifter", published=True, group=self.frigate_group)
        self.dreadnought_type = sde_models.ItemType.objects.create(
            id=601, name="Revelation", published=True, group=self.dreadnought_group)
        self.module_type = sde_models.ItemType.objects.create(
            id=602, name="Large Shield Extender", published=True, group=self.module_group)

    def _create_asset(self, character, location, item_id, type_id, quantity, type_name=None):
        return ct_models.CharacterAsset.objects.create(
            character=character,
            singleton=True,
            item_id=item_id,
            location_flag="Hangar",
            location_id=location.location_id,
            location_type="station",
            quantity=quantity,
            type_id=type_id,
            type_name=type_name,
            location_name=location,
        )

    def _create_mining_entry(self, character, system, ore_type, date, quantity, entry_id):
        return ct_models.CharacterMiningLedger.objects.create(
            id=entry_id,
            character=character,
            date=date,
            type_name=ore_type,
            system=system,
            quantity=quantity,
        )

    def _create_bounty_entry(self, character, system, amount, entry_id, date=None):
        date = date if date is not None else _days_ago_datetime(5)
        return ct_models.CharacterWalletJournalEntry.objects.create(
            character=character,
            entry_id=entry_id,
            ref_type="bounty_prizes",
            date=date,
            amount=amount,
            context_id=system.id if system else None,
            context_id_type="system_id" if system else None,
        )

    # ------------------------------------------------------------------
    # aggregation helper
    # ------------------------------------------------------------------

    def test_asset_counts_by_system_aggregates_count_and_quantity(self):
        self._create_asset(self.ca1, self.loc1, item_id=1,
                           type_id=1, quantity=5)
        self._create_asset(self.ca1, self.loc1, item_id=2,
                           type_id=2, quantity=3)
        self._create_asset(self.ca1, self.loc2, item_id=3,
                           type_id=1, quantity=1)

        result = _character_asset_counts_by_system([self.char1])

        self.assertEqual(result[self.system1.id]["count"], 2)
        self.assertEqual(result[self.system1.id]["quantity"], 8)
        self.assertEqual(result[self.system2.id]["count"], 1)
        self.assertEqual(result[self.system2.id]["quantity"], 1)

    def test_asset_counts_by_system_ignores_other_characters(self):
        self._create_asset(self.ca1, self.loc1, item_id=1,
                           type_id=1, quantity=5)
        self._create_asset(self.ca3, self.loc2, item_id=2,
                           type_id=1, quantity=9)

        result = _character_asset_counts_by_system([self.char1])

        self.assertIn(self.system1.id, result)
        self.assertNotIn(self.system2.id, result)

    def test_asset_counts_by_system_empty_without_assets(self):
        self.assertEqual(_character_asset_counts_by_system([self.char1]), {})

    # ------------------------------------------------------------------
    # HTTP endpoint
    # ------------------------------------------------------------------

    def test_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(
            _ACTIVITY_MAP_URL.format(cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

    def test_view_perm_returns_200_with_whole_map_and_values(self):
        self._create_asset(self.ca1, self.loc1, item_id=1,
                           type_id=1, quantity=5)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        # Whole map is always returned - system3 has no assets but is present.
        system_ids = {s["id"] for s in data["systems"]}
        self.assertEqual(
            system_ids, {self.system1.id, self.system2.id, self.system3.id})

        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(set(values_by_system), {self.system1.id})
        self.assertEqual(values_by_system[self.system1.id]["value"], 1)
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)
        self.assertEqual(values_by_system[self.system1.id]["quantity"], 5)

    def test_whole_map_excludes_wormhole_and_abyssal_space(self):
        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        system_ids = {s["id"] for s in data["systems"]}
        self.assertNotIn(self.wh_system.id, system_ids)
        self.assertNotIn(self.abyssal_system.id, system_ids)

        region_ids = {r["id"] for r in data["regions"]}
        self.assertNotIn(self.wh_region.id, region_ids)
        self.assertNotIn(self.abyssal_region.id, region_ids)

    def test_no_assets_returns_whole_map_with_no_values(self):
        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        system_ids = {s["id"] for s in data["systems"]}
        self.assertEqual(
            system_ids, {self.system1.id, self.system2.id, self.system3.id})
        self.assertEqual(data["values"], [])

    # ------------------------------------------------------------------
    # mining
    # ------------------------------------------------------------------

    def test_mining_volume_by_system_aggregates_volume_quantity_and_entries(self):
        self._create_mining_entry(
            self.ca1, self.system1, self.veldspar, _days_ago_date(5), 1000, "e1")
        self._create_mining_entry(
            self.ca1, self.system1, self.scordite, _days_ago_date(5), 2000, "e2")
        self._create_mining_entry(
            self.ca1, self.system2, self.veldspar, _days_ago_date(5), 500, "e3")

        result = mining_volume_by_system([self.char1])

        # system1: 1000*0.1 + 2000*0.15 = 100 + 300 = 400
        self.assertAlmostEqual(result[self.system1.id]["volume"], 400.0)
        self.assertEqual(result[self.system1.id]["quantity"], 3000)
        self.assertEqual(result[self.system1.id]["entries"], 2)

        # system2: 500*0.1 = 50
        self.assertAlmostEqual(result[self.system2.id]["volume"], 50.0)
        self.assertEqual(result[self.system2.id]["quantity"], 500)
        self.assertEqual(result[self.system2.id]["entries"], 1)

    def test_mining_volume_by_system_ignores_other_characters(self):
        self._create_mining_entry(
            self.ca1, self.system1, self.veldspar, _days_ago_date(5), 1000, "e1")
        self._create_mining_entry(
            self.ca3, self.system2, self.veldspar, _days_ago_date(5), 1000, "e2")

        result = mining_volume_by_system([self.char1])

        self.assertIn(self.system1.id, result)
        self.assertNotIn(self.system2.id, result)

    def test_mining_volume_by_system_empty_without_entries(self):
        self.assertEqual(mining_volume_by_system([self.char1]), {})

    def test_mining_volume_by_system_excludes_entries_older_than_lookback(self):
        self._create_mining_entry(
            self.ca1, self.system1, self.veldspar,
            _days_ago_date(LOOKBACK_DAYS + 1), 1000, "old",
        )
        self._create_mining_entry(
            self.ca1, self.system1, self.veldspar,
            _days_ago_date(LOOKBACK_DAYS - 1), 500, "recent",
        )

        result = mining_volume_by_system([self.char1])

        # Only the entry inside the lookback window counts.
        self.assertEqual(result[self.system1.id]["quantity"], 500)

    def test_mining_endpoint_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(
            _MINING_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

    def test_mining_endpoint_returns_whole_map_and_volume_values(self):
        self._create_mining_entry(
            self.ca1, self.system1, self.veldspar, _days_ago_date(5), 1000, "e1")

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _MINING_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        system_ids = {s["id"] for s in data["systems"]}
        self.assertEqual(
            system_ids, {self.system1.id, self.system2.id, self.system3.id})

        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(set(values_by_system), {self.system1.id})
        # value is volume (the "counter" the map scales circles by), not
        # the raw ore quantity or entry count.
        self.assertAlmostEqual(
            values_by_system[self.system1.id]["value"], 100.0)
        self.assertEqual(values_by_system[self.system1.id]["quantity"], 1000)
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)

    # ------------------------------------------------------------------
    # assets - ships / capitals filters
    # ------------------------------------------------------------------

    def test_ships_endpoint_only_counts_ship_category_assets(self):
        self._create_asset(self.ca1, self.loc1, item_id=1,
                           type_id=self.frigate_type.id, quantity=1, type_name=self.frigate_type)
        self._create_asset(self.ca1, self.loc1, item_id=2,
                           type_id=self.module_type.id, quantity=5, type_name=self.module_type)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _SHIPS_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(set(values_by_system), {self.system1.id})
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)
        self.assertEqual(values_by_system[self.system1.id]["quantity"], 1)

    def test_capitals_endpoint_only_counts_capital_group_assets(self):
        self._create_asset(self.ca1, self.loc1, item_id=1,
                           type_id=self.frigate_type.id, quantity=1, type_name=self.frigate_type)
        self._create_asset(self.ca1, self.loc2, item_id=2,
                           type_id=self.dreadnought_type.id, quantity=1, type_name=self.dreadnought_type)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _CAPITALS_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(set(values_by_system), {self.system2.id})
        self.assertEqual(values_by_system[self.system2.id]["count"], 1)
        self.assertEqual(values_by_system[self.system2.id]["quantity"], 1)

    def test_ships_and_capitals_endpoints_require_perms(self):
        self.client.force_login(self.user1)

        resp = self.client.get(
            _SHIPS_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

        resp = self.client.get(
            _CAPITALS_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

    # ------------------------------------------------------------------
    # ratting
    # ------------------------------------------------------------------

    def test_ratting_isk_by_system_aggregates_isk_and_entries(self):
        self._create_bounty_entry(self.ca1, self.system1, 1500000, entry_id=1)
        self._create_bounty_entry(self.ca1, self.system1, 2500000, entry_id=2)
        self._create_bounty_entry(self.ca1, self.system2, 900000, entry_id=3)

        result = ratting_isk_by_system([self.char1])

        self.assertEqual(result[self.system1.id]["isk"], 4000000)
        self.assertEqual(result[self.system1.id]["entries"], 2)
        self.assertEqual(result[self.system2.id]["isk"], 900000)
        self.assertEqual(result[self.system2.id]["entries"], 1)

    def test_ratting_isk_by_system_ignores_non_system_context(self):
        # A bounty entry with no system context (or the wrong context type)
        # can't be placed on the map - it must be excluded, not miscounted
        # against context_id=None or some unrelated id.
        self._create_bounty_entry(self.ca1, None, 1000000, entry_id=1)
        ct_models.CharacterWalletJournalEntry.objects.create(
            character=self.ca1,
            entry_id=2,
            ref_type="bounty_prizes",
            date=_days_ago_datetime(5),
            amount=2000000,
            context_id=60000001,
            context_id_type="station_id",
        )

        result = ratting_isk_by_system([self.char1])

        self.assertEqual(result, {})

    def test_ratting_isk_by_system_ignores_other_ref_types_and_characters(self):
        self._create_bounty_entry(self.ca1, self.system1, 1000000, entry_id=1)
        self._create_bounty_entry(self.ca3, self.system2, 1000000, entry_id=2)
        ct_models.CharacterWalletJournalEntry.objects.create(
            character=self.ca1,
            entry_id=3,
            ref_type="bounty_prize_corporation_tax",
            date=_days_ago_datetime(5),
            amount=100000,
            context_id=self.system1.id,
            context_id_type="system_id",
        )

        result = ratting_isk_by_system([self.char1])

        self.assertEqual(set(result), {self.system1.id})
        self.assertEqual(result[self.system1.id]["isk"], 1000000)

    def test_ratting_isk_by_system_excludes_entries_older_than_lookback(self):
        self._create_bounty_entry(
            self.ca1, self.system1, 1000000, entry_id=1,
            date=_days_ago_datetime(LOOKBACK_DAYS + 1),
        )
        self._create_bounty_entry(
            self.ca1, self.system1, 500000, entry_id=2,
            date=_days_ago_datetime(LOOKBACK_DAYS - 1),
        )

        result = ratting_isk_by_system([self.char1])

        # Only the entry inside the lookback window counts.
        self.assertEqual(result[self.system1.id]["isk"], 500000)

    def test_ratting_endpoint_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(
            _RATTING_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

    def test_ratting_endpoint_returns_whole_map_and_isk_values(self):
        self._create_bounty_entry(self.ca1, self.system1, 4000000, entry_id=1)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _RATTING_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()

        system_ids = {s["id"] for s in data["systems"]}
        self.assertEqual(
            system_ids, {self.system1.id, self.system2.id, self.system3.id})

        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(set(values_by_system), {self.system1.id})
        # value is ISK earned (the "counter" the map scales circles by).
        self.assertEqual(values_by_system[self.system1.id]["value"], 4000000)
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)
