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

from . import CorptoolsTestCase


def _days_ago_date(days):
    return (timezone.now() - timedelta(days=days)).date()


def _days_ago_datetime(days):
    return (timezone.now() - timedelta(days=days)).strftime("%Y-%m-%dT%H:%M:%SZ")


_ASSETS_URL = "/audit/api/corporation/{cid}/activitymap/assets"
_SHIPS_URL = "/audit/api/corporation/{cid}/activitymap/assets/ships"
_CAPITALS_URL = "/audit/api/corporation/{cid}/activitymap/assets/capitals"
_MEMBER_ASSETS_URL = "/audit/api/corporation/{cid}/activitymap/assets/members"
_MEMBER_SHIPS_URL = "/audit/api/corporation/{cid}/activitymap/assets/members/ships"
_MEMBER_CAPITALS_URL = "/audit/api/corporation/{cid}/activitymap/assets/members/capitals"
_STRUCTURES_URL = "/audit/api/corporation/{cid}/activitymap/structures"
_STARBASES_URL = "/audit/api/corporation/{cid}/activitymap/starbases"
_POCOS_URL = "/audit/api/corporation/{cid}/activitymap/pocos"
_POCOS_REVENUE_URL = "/audit/api/corporation/{cid}/activitymap/pocos/revenue"
_ORDERS_URL = "/audit/api/corporation/{cid}/activitymap/orders"
_ORDERS_MEMBERS_URL = "/audit/api/corporation/{cid}/activitymap/orders/members"
_CONTRACTS_URL = "/audit/api/corporation/{cid}/activitymap/contracts"
_CONTRACTS_SALES_URL = "/audit/api/corporation/{cid}/activitymap/contracts/sales"
_CONTRACTS_LOGISTICS_URL = "/audit/api/corporation/{cid}/activitymap/contracts/logistics"
_INDUSTRY_URL = "/audit/api/corporation/{cid}/activitymap/industry"
_LOCATION_URL = "/audit/api/corporation/{cid}/activitymap/location"
_CLONES_HOME_URL = "/audit/api/corporation/{cid}/activitymap/clones/home"
_CLONES_JUMP_URL = "/audit/api/corporation/{cid}/activitymap/clones/jump"
_MERCENARY_DENS_URL = "/audit/api/corporation/{cid}/activitymap/mercenarydens"
_MERCENARY_TACOPS_URL = "/audit/api/corporation/{cid}/activitymap/mercenarytacticaloperations"
_PI_URL = "/audit/api/corporation/{cid}/activitymap/pi"
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
        self.loc2 = ct_models.EveLocation.objects.create(
            location_id=60000002, location_name="Station Two", system=self.system2
        )

        self.planet1 = sde_models.Planet.objects.create(
            id=40000001, name="System One I", solar_system=self.system1
        )
        self.planet2 = sde_models.Planet.objects.create(
            id=40000002, name="System Two I", solar_system=self.system2
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

    def _create_character_asset(self, character, location, item_id, type_id, quantity, type_name=None):
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

    def _create_pi_entry(self, character, planet, amount, entry_id, ref_type="planetary_export_tax"):
        return ct_models.CharacterWalletJournalEntry.objects.create(
            character=character,
            entry_id=entry_id,
            ref_type=ref_type,
            date=_days_ago_datetime(5),
            amount=amount,
            context_id=planet.id if planet else None,
            context_id_type="planet_id" if planet else None,
        )

    def _create_corp_wallet_division(self, corporation, division=1):
        return ct_models.CorporationWalletDivision.objects.create(
            corporation=corporation, division=division, balance=0,
        )

    def _create_poco_revenue_entry(
        self, division, planet, amount, entry_id, ref_type="planetary_export_tax",
    ):
        if not hasattr(self, "_wallet_party"):
            self._wallet_party = ct_models.EveName.objects.create(
                eve_id=2, name="Some Other Entity", category="character")
        return ct_models.CorporationWalletJournalEntry.objects.create(
            division=division,
            entry_id=entry_id,
            ref_type=ref_type,
            date=_days_ago_datetime(5),
            amount=amount,
            first_party_id=self._wallet_party.eve_id,
            first_party_name=self._wallet_party,
            second_party_id=self._wallet_party.eve_id,
            second_party_name=self._wallet_party,
            context_id=planet.id if planet else None,
            context_id_type="planet_id" if planet else None,
        )

    def _create_structure(self, corporation, system, structure_id):
        # Structure.get_visible requires a recent "structures" update
        # timestamp on the corp - mirrors what corp_structure_update sets
        # on every real sync (CorporationAudit has no set_update_time
        # helper of its own, unlike CharacterAudit).
        corporation.update_timestamps["structures"] = timezone.now(
        ).isoformat()
        corporation.save()
        return ct_models.Structure.objects.create(
            corporation=corporation,
            structure_id=structure_id,
            profile_id=1,
            reinforce_hour=1,
            state="shield_vulnerable",
            system_id=system.id,
            system_name=system,
            type_id=1,
        )

    def _create_starbase(self, corporation, system, starbase_id):
        return ct_models.Starbase.objects.create(
            corporation=corporation,
            starbase_id=starbase_id,
            system=system,
        )

    def _create_corp_order(self, division, location, order_id, state="active"):
        return ct_models.CorporationMarketOrder.objects.create(
            order_id=order_id,
            wallet_division=division,
            issued_by=1,
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

    def _create_character_order(self, character, location, order_id, state="active"):
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

    def _create_mercenary_tactical_operation(self, character, den_id):
        return ct_models.CharacterMercenaryTacticalOperation.objects.create(
            character=character,
            operation_id=uuid.uuid4(),
            mercenary_den_id=den_id,
            dungeon_type_id=1,
            state="started",
        )

    def _create_poco(self, corporation, system, office_id):
        return ct_models.Poco.objects.create(
            corporation=corporation,
            office_id=office_id,
            standing_level="1",
            reinforce_exit_end=1,
            reinforce_exit_start=1,
            system_id=system.id,
            system_name=system,
        )

    def _create_corp_contract(
        self, corporation, contract_id, start_location=None, end_location=None,
        date_issued=None, contract_type="item_exchange",
    ):
        date_issued = date_issued if date_issued is not None else _days_ago_datetime(
            5)
        if not hasattr(self, "_some_entity"):
            self._some_entity = ct_models.EveName.objects.create(
                eve_id=1, name="Some Entity", category="character")
        return ct_models.CorporateContract.objects.create(
            id=f"c{contract_id}",
            contract_id=contract_id,
            corporation=corporation,
            acceptor_id=1,
            acceptor_name=self._some_entity,
            assignee_id=1,
            assignee_name=self._some_entity,
            issuer_id=1,
            issuer_name=self._some_entity,
            issuer_corporation_id=1,
            issuer_corporation_name=self._some_entity,
            days_to_complete=1,
            start_location_id=start_location.location_id if start_location else None,
            start_location_name=start_location,
            end_location_id=end_location.location_id if end_location else None,
            end_location_name=end_location,
            for_corporation=True,
            date_issued=date_issued,
            date_expired=date_issued,
            contract_type=contract_type,
        )

    def _create_corp_industry_job(self, corporation, job_id, facility_id, start_date=None):
        start_date = start_date if start_date is not None else _days_ago_datetime(
            5)
        return ct_models.CorporationIndustryJob.objects.create(
            corporation=corporation,
            activity_id=1,
            blueprint_id=1,
            blueprint_location_id=facility_id,
            blueprint_type_id=1,
            duration=3600,
            end_date=start_date,
            facility_id=facility_id,
            installer_id=1,
            job_id=job_id,
            location_id=facility_id,
            output_location_id=facility_id,
            product_type_id=1,
            runs=1,
            start_date=start_date,
            status="active",
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
        for url in (
            _ASSETS_URL, _SHIPS_URL, _CAPITALS_URL, _MEMBER_ASSETS_URL,
            _MEMBER_SHIPS_URL, _MEMBER_CAPITALS_URL, _STRUCTURES_URL,
            _STARBASES_URL, _POCOS_URL, _POCOS_REVENUE_URL,
            _ORDERS_URL, _ORDERS_MEMBERS_URL, _CONTRACTS_URL,
            _CONTRACTS_SALES_URL, _CONTRACTS_LOGISTICS_URL, _INDUSTRY_URL,
            _LOCATION_URL, _CLONES_HOME_URL, _CLONES_JUMP_URL,
            _MERCENARY_DENS_URL, _MERCENARY_TACOPS_URL, _PI_URL,
            _MINING_URL, _RATTING_URL,
        ):
            resp = self.client.get(url.format(cid=self.corp1.corporation_id))
            self.assertEqual(resp.status_code, 403)

    def test_own_corp_manager_returns_200_for_every_endpoint(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        for url in (
            _ASSETS_URL, _SHIPS_URL, _CAPITALS_URL, _MEMBER_ASSETS_URL,
            _MEMBER_SHIPS_URL, _MEMBER_CAPITALS_URL, _STRUCTURES_URL,
            _STARBASES_URL, _POCOS_URL, _POCOS_REVENUE_URL,
            _ORDERS_URL, _ORDERS_MEMBERS_URL, _CONTRACTS_URL,
            _CONTRACTS_SALES_URL, _CONTRACTS_LOGISTICS_URL, _INDUSTRY_URL,
            _LOCATION_URL, _CLONES_HOME_URL, _CLONES_JUMP_URL,
            _MERCENARY_DENS_URL, _MERCENARY_TACOPS_URL, _PI_URL,
            _MINING_URL, _RATTING_URL,
        ):
            resp = self.client.get(url.format(cid=self.corp1.corporation_id))
            self.assertEqual(resp.status_code, 200)

    def test_holding_corp_structures_returns_200_for_every_endpoint(self):
        # Every sibling structure/starbase/poco endpoint under corp/*
        # accepts holding_corp_structures; the activity map's shared gate
        # serves the same structure/starbase/poco data and should too.
        holding_structures = Permission.objects.get_by_natural_key(
            'holding_corp_structures', 'corptools', 'corptoolsconfiguration')
        self.user1.user_permissions.add(holding_structures)
        self.client.force_login(self.user1)
        for url in (
            _ASSETS_URL, _SHIPS_URL, _CAPITALS_URL, _MEMBER_ASSETS_URL,
            _MEMBER_SHIPS_URL, _MEMBER_CAPITALS_URL, _STRUCTURES_URL,
            _STARBASES_URL, _POCOS_URL, _POCOS_REVENUE_URL,
            _ORDERS_URL, _ORDERS_MEMBERS_URL, _CONTRACTS_URL,
            _CONTRACTS_SALES_URL, _CONTRACTS_LOGISTICS_URL, _INDUSTRY_URL,
            _LOCATION_URL, _CLONES_HOME_URL, _CLONES_JUMP_URL,
            _MERCENARY_DENS_URL, _MERCENARY_TACOPS_URL, _PI_URL,
            _MINING_URL, _RATTING_URL,
        ):
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
    # member assets - personal CharacterAsset holdings, aggregated across
    # every character whose main is in this corp (distinct from CorpAsset,
    # which is the corporation's own hangar/structure contents)
    # ------------------------------------------------------------------

    def test_member_assets_endpoint_aggregates_across_corp_characters(self):
        self._create_character_asset(
            self.ca1, self.loc1, item_id=1, type_id=1, quantity=5)
        self._create_character_asset(
            self.ca2, self.loc1, item_id=2, type_id=2, quantity=3)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_MEMBER_ASSETS_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)
        self.assertEqual(values_by_system[self.system1.id]["quantity"], 8)

    def test_member_assets_endpoint_ignores_other_corps(self):
        self._create_character_asset(
            self.ca1, self.loc1, item_id=1, type_id=1, quantity=5)
        self._create_character_asset(
            self.ca3, self.loc2, item_id=2, type_id=1, quantity=9)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_MEMBER_ASSETS_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system2.id, system_ids_with_values)

    def test_member_ships_endpoint_only_counts_ship_category(self):
        self._create_character_asset(
            self.ca1, self.loc1, item_id=1, type_id=self.frigate_type.id,
            quantity=1, type_name=self.frigate_type,
        )
        self._create_character_asset(
            self.ca1, self.loc1, item_id=2, type_id=1, quantity=5,
        )

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_MEMBER_SHIPS_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)
        self.assertEqual(values_by_system[self.system1.id]["quantity"], 1)

    def test_member_capitals_endpoint_only_counts_capital_groups(self):
        self._create_character_asset(
            self.ca1, self.loc1, item_id=1, type_id=self.frigate_type.id,
            quantity=1, type_name=self.frigate_type,
        )
        self._create_character_asset(
            self.ca1, self.loc1, item_id=2, type_id=self.dreadnought_type.id,
            quantity=1, type_name=self.dreadnought_type,
        )

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_MEMBER_CAPITALS_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(set(values_by_system), {self.system1.id})
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)

    # ------------------------------------------------------------------
    # structures / pocos - corporation property, no character equivalent
    # ------------------------------------------------------------------

    def test_structures_endpoint_aggregates_whole_corp(self):
        self._create_structure(self.cp1, self.system1, structure_id=1001)
        self._create_structure(self.cp1, self.system1, structure_id=1002)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_STRUCTURES_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)

    def test_structures_endpoint_ignores_other_corps(self):
        self._create_structure(self.cp1, self.system1, structure_id=1001)
        self._create_structure(self.cp2, self.system2, structure_id=1002)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_STRUCTURES_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertEqual(system_ids_with_values, {self.system1.id})

    def test_starbases_endpoint_aggregates_whole_corp(self):
        self._create_starbase(self.cp1, self.system1, starbase_id=3001)
        self._create_starbase(self.cp1, self.system1, starbase_id=3002)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_STARBASES_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)

    def test_starbases_endpoint_ignores_other_corps(self):
        self._create_starbase(self.cp1, self.system1, starbase_id=3001)
        self._create_starbase(self.cp2, self.system2, starbase_id=3002)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_STARBASES_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertEqual(system_ids_with_values, {self.system1.id})

    def test_pocos_endpoint_aggregates_whole_corp(self):
        self._create_poco(self.cp1, self.system1, office_id=2001)
        self._create_poco(self.cp1, self.system2, office_id=2002)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_POCOS_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)
        self.assertEqual(values_by_system[self.system2.id]["count"], 1)

    def test_pocos_endpoint_ignores_other_corps(self):
        self._create_poco(self.cp1, self.system1, office_id=2001)
        self._create_poco(self.cp2, self.system2, office_id=2002)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_POCOS_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertEqual(system_ids_with_values, {self.system1.id})

    def test_pocos_revenue_endpoint_sums_import_and_export_tax(self):
        division = self._create_corp_wallet_division(self.cp1)
        self._create_poco_revenue_entry(
            division, self.planet1, 100000, entry_id=1,
            ref_type="planetary_export_tax",
        )
        self._create_poco_revenue_entry(
            division, self.planet1, 50000, entry_id=2,
            ref_type="planetary_import_tax",
        )

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_POCOS_REVENUE_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["value"], 150000)
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)

    def test_pocos_revenue_endpoint_excludes_planetary_construction(self):
        # Construction is a personal colony-upkeep cost that never appears
        # in the corp wallet (confirmed against production data) - even if
        # it somehow did, it shouldn't count as customs office revenue.
        division = self._create_corp_wallet_division(self.cp1)
        self._create_poco_revenue_entry(
            division, self.planet1, 100000, entry_id=1,
            ref_type="planetary_construction",
        )

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_POCOS_REVENUE_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    def test_pocos_revenue_endpoint_ignores_other_corps(self):
        division1 = self._create_corp_wallet_division(self.cp1)
        division2 = self._create_corp_wallet_division(self.cp2)
        self._create_poco_revenue_entry(
            division1, self.planet1, 100000, entry_id=1)
        self._create_poco_revenue_entry(
            division2, self.planet2, 100000, entry_id=2)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_POCOS_REVENUE_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system2.id, system_ids_with_values)

    # ------------------------------------------------------------------
    # market orders - corp-owned (CorporationMarketOrder) and member-owned
    # (CharacterMarketOrder, aggregated across the corp's members)
    # ------------------------------------------------------------------

    def test_orders_endpoint_only_counts_active_corp_orders(self):
        division = self._create_corp_wallet_division(self.cp1)
        self._create_corp_order(division, self.loc1,
                                order_id=1, state="active")
        self._create_corp_order(division, self.loc1,
                                order_id=2, state="expired")

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_ORDERS_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)

    def test_orders_endpoint_ignores_other_corps(self):
        division1 = self._create_corp_wallet_division(self.cp1)
        division2 = self._create_corp_wallet_division(self.cp2)
        self._create_corp_order(division1, self.loc1, order_id=1)
        self._create_corp_order(division2, self.loc2, order_id=2)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_ORDERS_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system2.id, system_ids_with_values)

    def test_orders_members_endpoint_aggregates_across_corp_characters(self):
        self._create_character_order(self.ca1, self.loc1, order_id=1)
        self._create_character_order(self.ca2, self.loc1, order_id=2)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_ORDERS_MEMBERS_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)

    def test_orders_members_endpoint_ignores_other_corps(self):
        self._create_character_order(self.ca3, self.loc1, order_id=1)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_ORDERS_MEMBERS_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    # ------------------------------------------------------------------
    # member mercenary dens / tactical operations - character-only concepts,
    # aggregated across the corp's members
    # ------------------------------------------------------------------

    def test_mercenary_dens_endpoint_aggregates_across_corp_characters(self):
        self._create_mercenary_den(self.ca1, self.planet1, den_id=1)
        self._create_mercenary_den(self.ca2, self.planet1, den_id=2)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_MERCENARY_DENS_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)

    def test_mercenary_dens_endpoint_ignores_other_corps(self):
        self._create_mercenary_den(self.ca3, self.planet1, den_id=1)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_MERCENARY_DENS_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    def test_mercenary_tactical_operations_endpoint_resolves_via_den_and_planet(self):
        self._create_mercenary_den(self.ca1, self.planet1, den_id=42)
        self._create_mercenary_tactical_operation(self.ca1, den_id=42)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_MERCENARY_TACOPS_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)

    def test_mercenary_tactical_operations_endpoint_ignores_other_corps(self):
        self._create_mercenary_den(self.ca3, self.planet1, den_id=42)
        self._create_mercenary_tactical_operation(self.ca3, den_id=42)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_MERCENARY_TACOPS_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    # ------------------------------------------------------------------
    # member PI activity - character wallet data, aggregated across the
    # corp's members (same mechanism as mining/ratting below)
    # ------------------------------------------------------------------

    def test_pi_endpoint_aggregates_across_corp_characters(self):
        self._create_pi_entry(self.ca1, self.planet1, -100000, entry_id=1)
        self._create_pi_entry(self.ca2, self.planet1, -50000, entry_id=2)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_PI_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["value"], 150000)
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)

    def test_pi_endpoint_ignores_other_corps(self):
        self._create_pi_entry(self.ca3, self.planet1, -100000, entry_id=1)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_PI_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    # ------------------------------------------------------------------
    # contracts / industry - corp-owned data, mirroring the character-side
    # equivalents in test_activity_map.py
    # ------------------------------------------------------------------

    def test_contracts_endpoint_counts_start_and_end_location(self):
        self._create_corp_contract(
            self.cp1, contract_id=1, start_location=self.loc1, end_location=self.loc1)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_CONTRACTS_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        # Same system for both start and end -> two counted endpoints.
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)

    def test_contracts_endpoint_ignores_other_corps(self):
        self._create_corp_contract(
            self.cp2, contract_id=1, start_location=self.loc1)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_CONTRACTS_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    def test_contracts_sales_endpoint_only_counts_trade_contracts(self):
        self._create_corp_contract(
            self.cp1, contract_id=1, start_location=self.loc1,
            contract_type="item_exchange",
        )
        self._create_corp_contract(
            self.cp1, contract_id=2, start_location=self.loc1,
            end_location=self.loc2, contract_type="courier",
        )

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_CONTRACTS_SALES_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(set(values_by_system), {self.system1.id})
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)

    def test_contracts_logistics_endpoint_only_counts_courier_contracts(self):
        self._create_corp_contract(
            self.cp1, contract_id=1, start_location=self.loc1,
            contract_type="item_exchange",
        )
        self._create_corp_contract(
            self.cp1, contract_id=2, start_location=self.loc1,
            end_location=self.loc2, contract_type="courier",
        )

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_CONTRACTS_LOGISTICS_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(set(values_by_system), {
                         self.system1.id, self.system2.id})
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)
        self.assertEqual(values_by_system[self.system2.id]["count"], 1)

    def test_industry_endpoint_aggregates_regardless_of_activity_type(self):
        self._create_corp_industry_job(
            self.cp1, job_id=1, facility_id=self.loc1.location_id)
        job2 = self._create_corp_industry_job(
            self.cp1, job_id=2, facility_id=self.loc1.location_id)
        job2.activity_id = 9
        job2.save()

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_INDUSTRY_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)

    def test_industry_endpoint_ignores_other_corps(self):
        self._create_corp_industry_job(
            self.cp2, job_id=1, facility_id=self.loc1.location_id)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_INDUSTRY_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    # ------------------------------------------------------------------
    # current location / clones - character-only concepts, but still
    # aggregated across every character whose main is in this corp, same as
    # mining/ratting below (char1 and char2 are both owned by user1, whose
    # main char1 is in corp1)
    # ------------------------------------------------------------------

    def test_location_endpoint_aggregates_across_corp_characters(self):
        ct_models.CharacterLocation.objects.create(
            character=self.ca1, current_location=self.loc1)
        ct_models.CharacterLocation.objects.create(
            character=self.ca2, current_location=self.loc1)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_LOCATION_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)

    def test_location_endpoint_ignores_other_corps(self):
        ct_models.CharacterLocation.objects.create(
            character=self.ca1, current_location=self.loc1)
        ct_models.CharacterLocation.objects.create(
            character=self.ca3, current_location=self.loc2)

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_LOCATION_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system2.id, system_ids_with_values)

    def test_clones_home_endpoint_aggregates_across_corp_characters(self):
        ct_models.Clone.objects.create(
            character=self.ca1, location_id=self.loc1.location_id,
            location_name=self.loc1, location_type="station",
        )
        ct_models.Clone.objects.create(
            character=self.ca2, location_id=self.loc2.location_id,
            location_name=self.loc2, location_type="station",
        )

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_CLONES_HOME_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 1)
        self.assertEqual(values_by_system[self.system2.id]["count"], 1)

    def test_clones_home_endpoint_ignores_other_corps(self):
        ct_models.Clone.objects.create(
            character=self.ca3, location_id=self.loc1.location_id,
            location_name=self.loc1, location_type="station",
        )

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_CLONES_HOME_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

    def test_clones_jump_endpoint_counts_multiple_per_character(self):
        ct_models.JumpClone.objects.create(
            character=self.ca1, jump_clone_id=1,
            location_id=self.loc1.location_id, location_name=self.loc1,
        )
        ct_models.JumpClone.objects.create(
            character=self.ca1, jump_clone_id=2,
            location_id=self.loc1.location_id, location_name=self.loc1,
        )

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_CLONES_JUMP_URL.format(
            cid=self.corp1.corporation_id))

        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        values_by_system = {v["system_id"]: v for v in data["values"]}
        self.assertEqual(values_by_system[self.system1.id]["count"], 2)

    def test_clones_jump_endpoint_ignores_other_corps(self):
        ct_models.JumpClone.objects.create(
            character=self.ca3, jump_clone_id=1,
            location_id=self.loc1.location_id, location_name=self.loc1,
        )

        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(_CLONES_JUMP_URL.format(
            cid=self.corp1.corporation_id))

        data = resp.json()
        system_ids_with_values = {v["system_id"] for v in data["values"]}
        self.assertNotIn(self.system1.id, system_ids_with_values)

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
