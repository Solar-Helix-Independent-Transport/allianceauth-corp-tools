# Standard Library
from datetime import timedelta

# Third Party
from eve_sde import models as sde_models

# Django
from django.contrib.auth.models import Permission
from django.utils import timezone

# AA Example App
from corptools import models as ct_models

from . import CorptoolsTestCase


def _days_ago_date(days):
    return (timezone.now() - timedelta(days=days)).date()


def _days_ago_datetime(days):
    return (timezone.now() - timedelta(days=days)).strftime("%Y-%m-%dT%H:%M:%SZ")


_ASSETS_URL = "/audit/api/corporation/{cid}/activitymap/assets"
_SHIPS_URL = "/audit/api/corporation/{cid}/activitymap/assets/ships"
_CAPITALS_URL = "/audit/api/corporation/{cid}/activitymap/assets/capitals"
_MINING_URL = "/audit/api/corporation/{cid}/activitymap/mining"
_RATTING_URL = "/audit/api/corporation/{cid}/activitymap/ratting"


class CorpActivityMapTestCase(CorptoolsTestCase):

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

        self.loc1 = ct_models.EveLocation.objects.create(
            location_id=60000001, location_name="Station One", system=self.system1
        )

        self.ship_category = sde_models.ItemCategory.objects.create(
            id=6, name="Ship")
        self.frigate_group = sde_models.ItemGroup.objects.create(
            id=25, name="Frigate", category=self.ship_category)
        self.dreadnought_group = sde_models.ItemGroup.objects.create(
            id=485, name="Dreadnought", category=self.ship_category)
        self.frigate_type = sde_models.ItemType.objects.create(
            id=600, name="Rifter", published=True, group=self.frigate_group)
        self.dreadnought_type = sde_models.ItemType.objects.create(
            id=601, name="Revelation", published=True, group=self.dreadnought_group)

        self.veldspar = sde_models.ItemType.objects.create(
            id=1230, name="Veldspar", published=True, volume=0.1)

    def _create_corp_asset(self, corporation, location, item_id, type_id, quantity, type_name=None):
        return ct_models.CorpAsset.objects.create(
            corporation=corporation,
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

    def _create_bounty_entry(self, character, system, amount, entry_id):
        return ct_models.CharacterWalletJournalEntry.objects.create(
            character=character,
            entry_id=entry_id,
            ref_type="bounty_prizes",
            date=_days_ago_datetime(5),
            amount=amount,
            context_id=system.id,
            context_id_type="system_id",
        )

    # ------------------------------------------------------------------
    # permission gating
    # ------------------------------------------------------------------

    def test_no_perms_returns_403_for_every_endpoint(self):
        self.client.force_login(self.user1)
        for url in (_ASSETS_URL, _SHIPS_URL, _CAPITALS_URL, _MINING_URL, _RATTING_URL):
            resp = self.client.get(url.format(cid=self.corp1.corporation_id))
            self.assertEqual(resp.status_code, 403)

    def test_own_corp_manager_returns_200_for_every_endpoint(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        for url in (_ASSETS_URL, _SHIPS_URL, _CAPITALS_URL, _MINING_URL, _RATTING_URL):
            resp = self.client.get(url.format(cid=self.corp1.corporation_id))
            self.assertEqual(resp.status_code, 200)

    # ------------------------------------------------------------------
    # assets
    # ------------------------------------------------------------------

    def test_assets_endpoint_aggregates_whole_corp(self):
        self._create_corp_asset(self.cp1, self.loc1,
                                item_id=1, type_id=1, quantity=5)
        self._create_corp_asset(self.cp1, self.loc1,
                                item_id=2, type_id=2, quantity=3)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_ASSETS_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)
        self.assertEqual(values_by_system[self.system1.id]["quantity"], 8)

    def test_assets_endpoint_ignores_other_corps(self):
        self._create_corp_asset(self.cp1, self.loc1,
                                item_id=1, type_id=1, quantity=5)
        self._create_corp_asset(self.cp2, self.loc1,
                                item_id=2, type_id=1, quantity=9)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_ASSETS_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["quantity"], 5)

    def test_ships_endpoint_only_counts_ship_category(self):
        self._create_corp_asset(
            self.cp1, self.loc1, item_id=1, type_id=self.frigate_type.id,
            quantity=1, type_name=self.frigate_type,
        )
        self._create_corp_asset(
            self.cp1, self.loc1, item_id=2, type_id=1, quantity=5,
        )

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_SHIPS_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)
        self.assertEqual(values_by_system[self.system1.id]["quantity"], 1)

    def test_capitals_endpoint_only_counts_capital_groups(self):
        self._create_corp_asset(
            self.cp1, self.loc1, item_id=1, type_id=self.frigate_type.id,
            quantity=1, type_name=self.frigate_type,
        )
        self._create_corp_asset(
            self.cp1, self.loc1, item_id=2, type_id=self.dreadnought_type.id,
            quantity=1, type_name=self.dreadnought_type,
        )

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_CAPITALS_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(set(values_by_system), {self.system1.id})
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)

    # ------------------------------------------------------------------
    # mining / ratting - aggregated across every character whose main is in
    # this corp (char1 and char2 are both owned by user1, whose main char1
    # is in corp1)
    # ------------------------------------------------------------------

    def test_mining_endpoint_aggregates_across_corp_characters(self):
        self._create_mining_entry(
            self.ca1, self.system1, self.veldspar, _days_ago_date(5), 1000, "e1")
        self._create_mining_entry(
            self.ca2, self.system1, self.veldspar, _days_ago_date(5), 500, "e2")

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_MINING_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        # (1000 + 500) * 0.1 m3
        self.assertAlmostEqual(
            values_by_system[self.system1.id]["value"], 150.0)
        self.assertEqual(values_by_system[self.system1.id]["quantity"], 1500)

    def test_mining_endpoint_ignores_other_corps(self):
        self._create_mining_entry(
            self.ca1, self.system1, self.veldspar, _days_ago_date(5), 1000, "e1")
        self._create_mining_entry(
            self.ca3, self.system2, self.veldspar, _days_ago_date(5), 1000, "e2")

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_MINING_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system2.id, system_ids_with_values)

    def test_ratting_endpoint_aggregates_across_corp_characters(self):
        self._create_bounty_entry(self.ca1, self.system1, 1000000, entry_id=1)
        self._create_bounty_entry(self.ca2, self.system1, 2000000, entry_id=2)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_RATTING_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["value"], 3000000)
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)
