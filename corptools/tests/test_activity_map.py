# Standard Library
import uuid
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
_PI_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/pi"
_ORDERS_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/orders"
_MERCENARY_DENS_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/mercenarydens"
_MERCENARY_TACOPS_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/mercenarytacticaloperations"


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

        self.planet1 = sde_models.Planet.objects.create(
            id=40000001, name="System One I", solar_system=self.system1
        )
        self.planet2 = sde_models.Planet.objects.create(
            id=40000002, name="System Two I", solar_system=self.system2
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

    def _create_pi_entry(self, character, planet, amount, entry_id, ref_type="planetary_export_tax", date=None):
        date = date if date is not None else _days_ago_datetime(5)
        return ct_models.CharacterWalletJournalEntry.objects.create(
            character=character,
            entry_id=entry_id,
            ref_type=ref_type,
            date=date,
            amount=amount,
            context_id=planet.id if planet else None,
            context_id_type="planet_id" if planet else None,
        )

    def _create_order(self, character, location, order_id, state="active"):
        return ct_models.CharacterMarketOrder.objects.create(
            order_id=order_id,
            character=character,
            is_corporation=False,
            duration=90,
            issued=_days_ago_datetime(5),
            location_id=location.location_id,
            location_name=location,
            order_range="station",
            region_id=1,
            type_id=1,
            volume_remain=1,
            volume_total=1,
            state=state,
        )

    def _create_mercenary_den(self, character, planet, den_id):
        return ct_models.CharacterMercenaryDen.objects.create(
            character=character,
            den_id=den_id,
            planet_id=planet.id,
            planet_name=planet,
            type_id=1,
            state="running",
            development_level="level0",
            anarchy_level="level0",
            infomorph_amount=0,
        )

    def _create_mercenary_tactical_operation(self, character, den_id, operation_id=None):
        return ct_models.CharacterMercenaryTacticalOperation.objects.create(
            character=character,
            operation_id=operation_id or uuid.uuid4(),
            mercenary_den_id=den_id,
            dungeon_type_id=1,
            state="started",
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

    def test_pi_endpoint_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(
            _PI_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

    def test_pi_endpoint_combines_all_pi_ref_types_regardless_of_type(self):
        # Amounts are negative from the paying character's side (matches
        # real wallet data) - the map should report the absolute ISK spent.
        self._create_pi_entry(
            self.ca1, self.planet1, -100000, entry_id=1,
            ref_type="planetary_construction",
        )
        self._create_pi_entry(
            self.ca1, self.planet1, -50000, entry_id=2,
            ref_type="planetary_import_tax",
        )
        self._create_pi_entry(
            self.ca1, self.planet1, -25000, entry_id=3,
            ref_type="planetary_export_tax",
        )

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _PI_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["value"], 175000)
        self.assertEqual(values_by_system[self.system1.id]["count"], 3)

    def test_pi_endpoint_excludes_old_entries(self):
        self._create_pi_entry(
            self.ca1, self.planet1, -100000, entry_id=1,
            date=_days_ago_datetime(400),
        )

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _PI_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    def test_pi_endpoint_ignores_other_characters(self):
        self._create_pi_entry(self.ca3, self.planet1, -100000, entry_id=1)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _PI_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    def test_orders_endpoint_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(
            _ORDERS_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

    def test_orders_endpoint_only_counts_active_orders(self):
        self._create_order(self.ca1, self.loc1, order_id=1, state="active")
        self._create_order(self.ca1, self.loc1, order_id=2, state="expired")

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _ORDERS_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)

    def test_orders_endpoint_ignores_other_characters(self):
        self._create_order(self.ca3, self.loc1, order_id=1)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _ORDERS_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    def test_mercenary_dens_endpoint_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(
            _MERCENARY_DENS_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

    def test_mercenary_dens_endpoint_resolves_via_planet(self):
        self._create_mercenary_den(self.ca1, self.planet1, den_id=1)
        self._create_mercenary_den(self.ca1, self.planet2, den_id=2)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _MERCENARY_DENS_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)
        self.assertEqual(values_by_system[self.system2.id]["count"], 1)

    def test_mercenary_dens_endpoint_ignores_other_characters(self):
        self._create_mercenary_den(self.ca3, self.planet1, den_id=1)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _MERCENARY_DENS_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    def test_mercenary_tactical_operations_endpoint_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(
            _MERCENARY_TACOPS_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

    def test_mercenary_tactical_operations_endpoint_resolves_via_den_and_planet(self):
        self._create_mercenary_den(self.ca1, self.planet1, den_id=42)
        self._create_mercenary_tactical_operation(self.ca1, den_id=42)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _MERCENARY_TACOPS_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)

    def test_mercenary_tactical_operations_endpoint_ignores_other_characters(self):
        self._create_mercenary_den(self.ca3, self.planet1, den_id=42)
        self._create_mercenary_tactical_operation(self.ca3, den_id=42)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(
            _MERCENARY_TACOPS_ACTIVITY_MAP_URL.format(cid=self.char1.character_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)


_CONTRACTS_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/contracts"
_CONTRACTS_SALES_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/contracts/sales"
_CONTRACTS_LOGISTICS_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/contracts/logistics"
_INDUSTRY_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/industry"


class ActivityMapContractsAndIndustryTestCase(CorptoolsTestCase):
    """Contracts and industry jobs are the two data sources added after
    structures/POCOs - both need their own fixtures (EveName for contract
    parties, a resolvable EveLocation for facility_id) rather than reusing
    ActivityMapAssetsTestCase's asset/mining/ratting-oriented setup."""

    def setUp(self):
        super().setUp()

        self.region = sde_models.Region.objects.create(
            id=1, name="Test Region")
        self.constellation = sde_models.Constellation.objects.create(
            id=1, name="Test Constellation", region=self.region
        )
        self.system1 = sde_models.SolarSystem.objects.create(
            id=1001, name="System One", security_status=0.5,
            x=0, y=0, z=0, security_class="hisec",
            constellation=self.constellation,
        )
        self.system2 = sde_models.SolarSystem.objects.create(
            id=1002, name="System Two", security_status=0.5,
            x=1, y=1, z=1, security_class="hisec",
            constellation=self.constellation,
        )

        self.loc1 = ct_models.EveLocation.objects.create(
            location_id=60000001, location_name="Station One", system=self.system1
        )
        self.loc2 = ct_models.EveLocation.objects.create(
            location_id=60000002, location_name="Station Two", system=self.system2
        )

        self.view_module = Permission.objects.get_by_natural_key(
            'view_characteraudit', 'corptools', 'characteraudit')

        self.some_entity = ct_models.EveName.objects.create(
            eve_id=1, name="Some Entity", category="character")

    def _create_contract(
        self, character, contract_id, start_location=None, end_location=None,
        date_issued=None, contract_type="item_exchange",
    ):
        date_issued = date_issued if date_issued is not None else _days_ago_datetime(
            5)
        return ct_models.Contract.objects.create(
            id=f"c{contract_id}",
            contract_id=contract_id,
            character=character,
            acceptor_id=1,
            acceptor_name=self.some_entity,
            assignee_id=1,
            assignee_name=self.some_entity,
            issuer_id=1,
            issuer_name=self.some_entity,
            issuer_corporation_id=1,
            issuer_corporation_name=self.some_entity,
            days_to_complete=1,
            start_location_id=start_location.location_id if start_location else None,
            start_location_name=start_location,
            end_location_id=end_location.location_id if end_location else None,
            end_location_name=end_location,
            for_corporation=False,
            date_issued=date_issued,
            date_expired=date_issued,
            contract_type=contract_type,
        )

    def _create_industry_job(self, character, job_id, facility_id, start_date=None):
        start_date = start_date if start_date is not None else _days_ago_datetime(
            5)
        return ct_models.CharacterIndustryJob.objects.create(
            character=character,
            activity_id=1,
            blueprint_id=1,
            blueprint_location_id=facility_id,
            blueprint_type_id=1,
            duration=3600,
            end_date=start_date,
            facility_id=facility_id,
            installer_id=1,
            job_id=job_id,
            output_location_id=facility_id,
            product_type_id=1,
            runs=1,
            start_date=start_date,
            station_id=facility_id,
            status="active",
        )

    # ------------------------------------------------------------------
    # contracts
    # ------------------------------------------------------------------

    def test_contracts_endpoint_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        for url in (
            _CONTRACTS_ACTIVITY_MAP_URL, _CONTRACTS_SALES_ACTIVITY_MAP_URL,
            _CONTRACTS_LOGISTICS_ACTIVITY_MAP_URL,
        ):
            resp = self.client.get(url.format(cid=self.char1.character_id))
            self.assertEqual(resp.status_code, 403)

    def test_contracts_endpoint_counts_start_and_end_location(self):
        self._create_contract(
            self.ca1, contract_id=1, start_location=self.loc1, end_location=self.loc2)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_CONTRACTS_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        # One contract shows up at both its start and end system.
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)
        self.assertEqual(values_by_system[self.system2.id]["count"], 1)

    def test_contracts_endpoint_excludes_old_contracts(self):
        self._create_contract(
            self.ca1, contract_id=1, start_location=self.loc1,
            date_issued=_days_ago_datetime(400),
        )

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_CONTRACTS_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    def test_contracts_endpoint_ignores_other_characters(self):
        self._create_contract(
            self.ca3, contract_id=1, start_location=self.loc1)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_CONTRACTS_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    def test_contracts_sales_endpoint_only_counts_trade_contracts(self):
        self._create_contract(
            self.ca1, contract_id=1, start_location=self.loc1,
            contract_type="item_exchange",
        )
        self._create_contract(
            self.ca1, contract_id=2, start_location=self.loc2,
            contract_type="courier", end_location=self.loc1,
        )

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_CONTRACTS_SALES_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        # Only the item_exchange contract (system1) counts - the courier
        # contract (system1 <-> system2) is excluded entirely.
        self.assertEqual(set(values_by_system), {self.system1.id})
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)

    def test_contracts_logistics_endpoint_only_counts_courier_contracts(self):
        self._create_contract(
            self.ca1, contract_id=1, start_location=self.loc1,
            contract_type="item_exchange",
        )
        self._create_contract(
            self.ca1, contract_id=2, start_location=self.loc1,
            end_location=self.loc2, contract_type="courier",
        )

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_CONTRACTS_LOGISTICS_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        # Only the courier contract counts - and it counts at both ends.
        self.assertEqual(set(values_by_system), {
                         self.system1.id, self.system2.id})
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)
        self.assertEqual(values_by_system[self.system2.id]["count"], 1)

    # ------------------------------------------------------------------
    # industry
    # ------------------------------------------------------------------

    def test_industry_endpoint_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(_INDUSTRY_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

    def test_industry_endpoint_aggregates_regardless_of_activity_type(self):
        # activity_id differs (manufacturing vs. reactions, say) - both
        # must land in the same combined count.
        self._create_industry_job(
            self.ca1, job_id=1, facility_id=self.loc1.location_id)
        job2 = self._create_industry_job(
            self.ca1, job_id=2, facility_id=self.loc1.location_id)
        job2.activity_id = 9
        job2.save()

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_INDUSTRY_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)

    def test_industry_endpoint_excludes_old_jobs(self):
        self._create_industry_job(
            self.ca1, job_id=1, facility_id=self.loc1.location_id,
            start_date=_days_ago_datetime(400),
        )

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_INDUSTRY_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    def test_industry_endpoint_ignores_other_characters(self):
        self._create_industry_job(
            self.ca3, job_id=1, facility_id=self.loc1.location_id)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_INDUSTRY_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)


_LOCATION_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/location"
_CLONES_HOME_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/clones/home"
_CLONES_JUMP_ACTIVITY_MAP_URL = "/audit/api/account/{cid}/activitymap/clones/jump"


class ActivityMapLocationAndClonesTestCase(CorptoolsTestCase):
    """Current location and clones are character-only concepts (a corp has
    no "current location" or clones of its own), so unlike
    structures/pocos/contracts/industry these only ever get a character-side
    endpoint."""

    def setUp(self):
        super().setUp()

        self.region = sde_models.Region.objects.create(
            id=1, name="Test Region")
        self.constellation = sde_models.Constellation.objects.create(
            id=1, name="Test Constellation", region=self.region
        )
        self.system1 = sde_models.SolarSystem.objects.create(
            id=1001, name="System One", security_status=0.5,
            x=0, y=0, z=0, security_class="hisec",
            constellation=self.constellation,
        )
        self.system2 = sde_models.SolarSystem.objects.create(
            id=1002, name="System Two", security_status=0.5,
            x=1, y=1, z=1, security_class="hisec",
            constellation=self.constellation,
        )

        self.loc1 = ct_models.EveLocation.objects.create(
            location_id=60000001, location_name="Station One", system=self.system1
        )
        self.loc2 = ct_models.EveLocation.objects.create(
            location_id=60000002, location_name="Station Two", system=self.system2
        )

        self.view_module = Permission.objects.get_by_natural_key(
            'view_characteraudit', 'corptools', 'characteraudit')

    # ------------------------------------------------------------------
    # current location
    # ------------------------------------------------------------------

    def test_location_endpoint_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(_LOCATION_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

    def test_location_endpoint_shows_where_each_alt_currently_is(self):
        ct_models.CharacterLocation.objects.create(
            character=self.ca1, current_location=self.loc1)
        ct_models.CharacterLocation.objects.create(
            character=self.ca2, current_location=self.loc1)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_LOCATION_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)

    def test_location_endpoint_ignores_other_characters(self):
        ct_models.CharacterLocation.objects.create(
            character=self.ca3, current_location=self.loc1)

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_LOCATION_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    # ------------------------------------------------------------------
    # home clone
    # ------------------------------------------------------------------

    def test_clones_home_endpoint_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(_CLONES_HOME_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

    def test_clones_home_endpoint_aggregates_across_alts(self):
        ct_models.Clone.objects.create(
            character=self.ca1, location_id=self.loc1.location_id,
            location_name=self.loc1, location_type="station",
        )
        ct_models.Clone.objects.create(
            character=self.ca2, location_id=self.loc2.location_id,
            location_name=self.loc2, location_type="station",
        )

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_CLONES_HOME_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)
        self.assertEqual(values_by_system[self.system2.id]["count"], 1)

    def test_clones_home_endpoint_ignores_other_characters(self):
        ct_models.Clone.objects.create(
            character=self.ca3, location_id=self.loc1.location_id,
            location_name=self.loc1, location_type="station",
        )

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_CLONES_HOME_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    # ------------------------------------------------------------------
    # jump clones
    # ------------------------------------------------------------------

    def test_clones_jump_endpoint_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(_CLONES_JUMP_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

    def test_clones_jump_endpoint_counts_multiple_per_character(self):
        # A single character can have several jump clones, unlike the home
        # clone (one-to-one).
        ct_models.JumpClone.objects.create(
            character=self.ca1, jump_clone_id=1,
            location_id=self.loc1.location_id, location_name=self.loc1,
        )
        ct_models.JumpClone.objects.create(
            character=self.ca1, jump_clone_id=2,
            location_id=self.loc1.location_id, location_name=self.loc1,
        )

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_CLONES_JUMP_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)

    def test_clones_jump_endpoint_ignores_other_characters(self):
        ct_models.JumpClone.objects.create(
            character=self.ca3, jump_clone_id=1,
            location_id=self.loc1.location_id, location_name=self.loc1,
        )

        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_CLONES_JUMP_ACTIVITY_MAP_URL.format(
            cid=self.char1.character_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)
