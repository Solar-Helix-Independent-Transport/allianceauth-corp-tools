"""
Exact response bodies for API endpoints that have (or had) loose `dict` /
`List` response declarations.

Giving an endpoint a real response schema changes what it returns at
runtime - ninja validates and serializes the response through the schema,
so a missing field is silently dropped and a wrong type is a 500. These pin
the JSON each endpoint returned before it got a schema, so the schema can't
quietly change it.
"""
# Standard Library
import math
import sys
import types
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from unittest.mock import patch

# Third Party
from eve_sde import models as sde

# AA Example App
from corptools import models as ct
from corptools.models.eve_models import EveName
from corptools.models.interactions import MailLabel, MailMessage, MailRecipient

from . import CorptoolsTestCase


class ApiShapeTestCase(CorptoolsTestCase):
    def setUp(self):
        super().setUp()
        self.user1.is_superuser = True
        self.user1.save()
        self.client.force_login(self.user1)
        self.cid = self.char1.character_id

    def get_json(self, url):
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200, resp.content)
        return resp.json()

    def post_text_json(self, url, body):
        resp = self.client.post(url, data=body, content_type="text/plain")
        self.assertEqual(resp.status_code, 200, resp.content)
        return resp.json()


class TestMailShapes(ApiShapeTestCase):
    def setUp(self):
        super().setUp()
        sender = EveName.objects.create(
            eve_id=5001, name="Sender", category="character")
        named = EveName.objects.create(
            eve_id=5002, name="Named Recipient", category="character")
        r_named = MailRecipient.objects.create(
            recipient_id=5002, recipient_name=named, recipient_type="character")
        r_unnamed = MailRecipient.objects.create(
            recipient_id=6001, recipient_type="mailing_list")
        l_named = MailLabel.objects.create(
            character=self.ca1, label_id=1, label_name="Inbox")
        l_unnamed = MailLabel.objects.create(character=self.ca1, label_id=8)

        full = MailMessage.objects.create(
            id_key=1, character=self.ca1, mail_id=101, from_id=5001, from_name=sender,
            subject="Hello", timestamp=datetime(2026, 3, 4, 5, 6, 7, tzinfo=timezone.utc),
            body='<font size="12" color="#ff0000">Hi</font>',
        )
        full.recipients.add(r_named, r_unnamed)
        full.labels.add(l_named, l_unnamed)
        # everything optional left empty, sender known only by id
        MailMessage.objects.create(
            id_key=2, character=self.ca1, mail_id=102, from_id=7001,
            timestamp=datetime(2026, 3, 1, tzinfo=timezone.utc),
        )

    def test_mail_list(self):
        self.assertEqual(self.get_json(f"/audit/api/account/{self.cid}/mail"), [
            {
                "character": self.char1.character_name,
                "character_id": self.cid,
                "mail_id": 101,
                "subject": "Hello",
                "from": "Sender",
                "recipients": ["Named Recipient", "6001 (mailing_list)"],
                "labels": ["Inbox", 8],
                "timestamp": "2026-03-04T05:06:07Z",
            },
            {
                "character": self.char1.character_name,
                "character_id": self.cid,
                "mail_id": 102,
                "subject": None,
                "from": "7001",
                "recipients": [],
                "labels": [],
                "timestamp": "2026-03-01T00:00:00Z",
            },
        ])

    def test_mail_body(self):
        self.assertEqual(
            self.get_json(f"/audit/api/account/{self.cid}/mail/101"),
            {"body": '<font _size_="12" _color_="#ff0000">Hi</font>'},
        )


class TestStructureShapes(ApiShapeTestCase):
    def setUp(self):
        super().setUp()
        region = sde.Region.objects.create(id=10000002, name="The Forge")
        const = sde.Constellation.objects.create(
            id=20000020, name="Kimotoro", region=region)
        self.jita = sde.SolarSystem.objects.create(
            id=30000142, name="Jita", security_status=0.9, x=0, y=0, z=0,
            security_class="hisec", constellation=const)
        self.planet = sde.Planet.objects.create(
            id=40009077, name="Jita IV", solar_system=self.jita)
        self.moon = sde.Moon.objects.create(
            id=40009078, name="Jita IV - Moon 1", solar_system=self.jita)
        grp = sde.ItemGroup.objects.create(
            id=1, name="Group", anchorable=False, anchored=False,
            fittable_non_singleton=False, published=True,
            use_base_price=False)

        def item_type(type_id, name):
            return sde.ItemType.objects.create(
                id=type_id, name=name, published=True, group=grp)

        self.tower = item_type(16213, "Caldari Control Tower")
        self.fortizar = item_type(35833, "Fortizar")
        self.module = item_type(35881, "Standup Launch Tube")
        self.fuel = item_type(4051, "Caldari Fuel Block")
        self.ore = item_type(1230, "Veldspar")

    def corp_asset(self, item_id, type_name, flag, location_id, qty=1):
        return ct.CorpAsset.objects.create(
            corporation=self.cp1, singleton=True, item_id=item_id,
            location_flag=flag, location_id=location_id,
            location_type="item", quantity=qty, type_id=type_name.id,
            type_name=type_name)

    def test_divisions(self):
        ct.CorporationWalletDivision.objects.create(
            corporation=self.cp1, division=1, name="Master",
            balance=Decimal("1234.50"))
        ct.CorporationWalletDivision.objects.create(
            corporation=self.cp1, division=2, balance=Decimal("0"))

        self.assertEqual(self.get_json(
            f"/audit/api/corporation/{self.corp1.corporation_id}/divisions"
        ), [
            {"division": "1", "name": "Master", "balance": 1234.5},
            {"division": "2", "name": "None", "balance": 0.0},
        ])

    def test_pocos(self):
        ct.Poco.objects.create(
            corporation=self.cp1, office_id=1001, reinforce_exit_end=2,
            reinforce_exit_start=1, system_id=self.jita.id,
            system_name=self.jita, planet=self.planet, name="Jita IV",
            standing_level="neutral", alliance_tax_rate=0.054321,
            corporation_tax_rate=0.1, allow_access_with_standings=True,
            allow_alliance_access=False)
        # no planet - skipped (logged) rather than breaking the list
        ct.Poco.objects.create(
            corporation=self.cp1, office_id=1002, reinforce_exit_end=0,
            reinforce_exit_start=0, system_id=self.jita.id,
            system_name=self.jita)

        self.assertEqual(self.get_json("/audit/api/corp/pocos"), [{
            "id": 1001,
            "owner": {
                "corporation_name": self.corp1.corporation_name,
                "corporation_id": self.corp1.corporation_id,
            },
            "name": "Jita IV",
            "location": {
                "id": 40009077, "name": "Jita IV",
                "region": "The Forge", "constellation": "Kimotoro",
            },
            "standing_level": "neutral",
            "alliance_tax_rate": 0.05,
            "corporation_tax_rate": 0.1,
            "terrible_standing_tax_rate": None,
            "bad_standing_tax_rate": None,
            "neutral_standing_tax_rate": None,
            "good_standing_tax_rate": None,
            "excellent_standing_tax_rate": None,
            "reinforce_exit_end": 2,
            "reinforce_exit_start": 1,
            "allow_access_with_standings": True,
            "allow_alliance_access": False,
        }])

    def test_starbases(self):
        ct.Starbase.objects.create(
            corporation=self.cp1, starbase_id=900, name="Tower",
            state="online", system=self.jita, moon=self.moon,
            type_name=self.tower,
            onlined_since=datetime(2026, 1, 2, tzinfo=timezone.utc),
            attack_standing_threshold=-5.0, anchor="corporation_member",
            fuels="[{'type_id': 4051, 'quantity': 100}]")
        # no system/moon - those keys are left out entirely, not null
        ct.Starbase.objects.create(
            corporation=self.cp1, starbase_id=901, state="offline",
            type_name=self.tower)

        owner = {
            "corporation_id": self.corp1.corporation_id,
            "corporation_name": self.corp1.corporation_name,
        }
        defaults = {
            "reinforced_until": None,
            "unanchor_at": None,
            "allow_alliance_members": False,
            "allow_corporation_members": False,
            "attack_if_other_security_status_dropping": False,
            "use_alliance_standings": False,
            "attack_security_status_threshold": None,
            "online": None,
            "offline": None,
            "unanchor": None,
            "fuel_bay_take": None,
            "fuel_bay_view": None,
        }
        tower_type = {"id": 16213, "name": "Caldari Control Tower"}
        self.assertEqual(self.get_json("/audit/api/corp/starbases"), [
            {
                **defaults,
                "starbase_id": 900, "owner": owner, "name": "Tower",
                "type": tower_type, "state": "online",
                "onlined_since": "2026-01-02T00:00:00Z",
                "attack_standing_threshold": -5.0,
                "anchor": "corporation_member",
                "fuels": "[{'type_id': 4051, 'quantity': 100}]",
                "moon": {"id": 40009078, "name": "Jita IV - Moon 1"},
                "system": {"id": 30000142, "name": "Jita"},
                "constellation": {"id": 20000020, "name": "Kimotoro"},
                "region": {"id": 10000002, "name": "The Forge"},
            },
            {
                **defaults,
                "starbase_id": 901, "owner": owner, "name": "",
                "type": tower_type, "state": "offline",
                "onlined_since": None, "attack_standing_threshold": None,
                "anchor": None, "fuels": "",
            },
        ])

    def test_starbase_detail(self):
        ct.Starbase.objects.create(
            corporation=self.cp1, starbase_id=900, state="online",
            system=self.jita, type_name=self.tower,
            fuels="[{'type_id': 4051, 'quantity': 100}]")
        tower = self.corp_asset(900, self.tower, "AutoFit", self.jita.id)
        near = self.corp_asset(950, self.ore, "AutoFit", self.jita.id)
        far = self.corp_asset(951, self.ore, "AutoFit", self.jita.id)
        # 0m, 5km (3-4-5) and 500km from the tower
        for asset, x, z in ((tower, 0, 0), (near, 3000, 4000), (far, 500000, 0)):
            ct.AssetCoordiante.objects.create(item=asset, x=x, y=0, z=z)

        data = self.get_json("/audit/api/corp/starbase/900")
        self.assertEqual(data["fuel"], [
            {"id": 4051, "name": "Caldari Fuel Block", "qty": 100},
        ])
        # everything within 100km of the tower, the tower included
        self.assertCountEqual(data["space"], [
            {"type": {"id": 16213, "name": "Caldari Control Tower"},
             "distance": 0.0},
            {"type": {"id": 1230, "name": "Veldspar"}, "distance": 5000.0},
        ])
        self.assertEqual(set(data), {"fuel", "space"})

    def test_starbase_detail_tower_not_in_assets(self):
        # Used to 500 - the function fell off the end and returned None.
        # The fuel bay doesn't need the assets; only "space" does.
        ct.Starbase.objects.create(
            corporation=self.cp1, starbase_id=900, state="online",
            system=self.jita, type_name=self.tower,
            fuels="[{'type_id': 4051, 'quantity': 100}]")

        self.assertEqual(self.get_json("/audit/api/corp/starbase/900"), {
            "fuel": [{"id": 4051, "name": "Caldari Fuel Block", "qty": 100}],
            "space": [],
        })

    def test_starbase_detail_no_fuel(self):
        # fuels is nullable - used to 500 on None.replace
        ct.Starbase.objects.create(
            corporation=self.cp1, starbase_id=900, state="online",
            system=self.jita, type_name=self.tower, fuels=None)

        self.assertEqual(self.get_json("/audit/api/corp/starbase/900"), {
            "fuel": [], "space": [],
        })

    def test_structure_detail(self):
        # structures only count as visible after a recent structure update
        self.cp1.update_timestamps = {
            "structures": datetime.now(timezone.utc).isoformat()}
        self.cp1.save()
        ct.Structure.objects.create(
            corporation=self.cp1, profile_id=1, reinforce_hour=12,
            state="shield_vulnerable", structure_id=1000000000001,
            system_id=self.jita.id, type_id=self.fortizar.id,
            type_name=self.fortizar, name="Jita - Keepstar")
        sid = 1000000000001
        self.corp_asset(1, self.module, "HiSlot0", sid)
        self.corp_asset(2, self.module, "ServiceSlot0", sid)
        self.corp_asset(3, self.module, "FighterTube0", sid)
        self.corp_asset(4, self.fuel, "StructureFuel", sid, qty=500)
        self.corp_asset(5, self.fuel, "StructureFuel", sid, qty=20)
        self.corp_asset(6, self.ore, "Cargo", sid, qty=7)
        self.corp_asset(7, self.ore, "CorpSAG1", sid)  # not shown
        # slot counts from the SDE override the defaults
        for attr_id, value in ((12, 6.0), (2056, 5.0)):
            attr = sde.DogmaAttribute.objects.create(
                id=attr_id, name=f"attr{attr_id}")
            sde.TypeDogma.objects.create(
                item_type=self.fortizar, dogma_attribute=attr, value=value)

        module = {"id": 35881, "name": "Standup Launch Tube"}
        self.assertEqual(self.get_json(f"/audit/api/corp/structures/{sid}"), {
            "fit": {
                "HiSlot0": module,
                "ServiceSlot0": module,
                "FighterTube0": module,
                "StructureFuel": [
                    {"id": 4051, "name": "Caldari Fuel Block", "qty": 500},
                    {"id": 4051, "name": "Caldari Fuel Block", "qty": 20},
                ],
                "Cargo": [{"id": 1230, "name": "Veldspar", "qty": 7}],
            },
            "low": 6.0, "med": 8, "high": 8, "rig": 3,
            "service": 5.0, "fighter": 0, "subsystem": 0,
        })


class TestDashboardShapes(ApiShapeTestCase):
    def setUp(self):
        super().setUp()
        region = sde.Region.objects.create(id=10000060, name="Delve")
        const = sde.Constellation.objects.create(
            id=20000696, name="O-EIMK", region=region)

        def system(system_id, name):
            return sde.SolarSystem.objects.create(
                id=system_id, name=name, security_status=-0.5, x=0, y=0,
                z=0, security_class="E", constellation=const)

        self.a = system(30004759, "1DQ1-A")
        self.b = system(30004760, "8QT-H4")
        self.c = system(30004761, "PDE-U3")
        cat = sde.ItemCategory.objects.create(
            id=4809, name="Infrastructure Upgrades", published=True)
        self.den_group = sde.ItemGroup.objects.create(
            id=4810, name="Mercenary Dens", category=cat, anchorable=False,
            anchored=False, fittable_non_singleton=False, published=True,
            use_base_price=False)
        self.den = sde.ItemType.objects.create(
            id=85230, name="Mercenary Den", published=True,
            group=self.den_group)

    def gate(self, structure_id, system, name, ozone=None, online=True,
             fuel_days=None):
        gate = ct.Structure.objects.create(
            corporation=self.cp1, profile_id=1, reinforce_hour=12,
            state="shield_vulnerable", structure_id=structure_id,
            system_id=system.id, system_name=system, type_id=35841,
            name=name, fuel_expires=(
                datetime.now(timezone.utc) + timedelta(days=fuel_days, hours=1)
                if fuel_days is not None else None))
        ct.StructureService.objects.create(
            structure=gate, name="Jump Bridge Access",
            state="online" if online else "offline")
        if ozone:
            ct.CorpAsset.objects.create(
                corporation=self.cp1, singleton=False, item_id=structure_id + 1,
                location_flag="StructureFuel", location_id=structure_id,
                location_type="item", quantity=ozone, type_id=16273)

    def test_gates(self):
        # structures only count as visible after a recent structure update
        self.cp1.update_timestamps = {
            "structures": datetime.now(timezone.utc).isoformat()}
        self.cp1.save()
        # a pair, and a gate whose other end isn't known
        self.gate(1001, self.a, "1DQ1-A » 8QT-H4 - Highway", ozone=500,
                  fuel_days=10)
        self.gate(1002, self.b, "8QT-H4 » 1DQ1-A - Highway", online=False)
        self.gate(1003, self.c, "PDE-U3 » 4-HWWF - Spur", fuel_days=3)

        self.assertEqual(self.get_json("/audit/api/dashboard/gates"), [
            {
                "start": {
                    "system_name": "1DQ1-A", "system_id": 30004759,
                    "ozone": 500, "known": True, "active": True,
                    "expires": 10, "name": "1DQ1-A » 8QT-H4 - Highway",
                },
                "end": {
                    "system_name": "8QT-H4", "system_id": 30004760,
                    "ozone": 0, "known": True, "active": False,
                    "expires": 0, "name": "8QT-H4 » 1DQ1-A - Highway",
                },
            },
            {
                "start": {
                    "system_name": "PDE-U3", "system_id": 30004761,
                    "ozone": 0, "known": True, "active": True,
                    "expires": 3, "name": "PDE-U3 » 4-HWWF - Spur",
                },
                # just these two keys - nothing else is known about it
                "end": {"known": False, "active": False},
            },
        ])

    def test_dens(self):
        located = ct.EveLocation.objects.create(
            location_id=self.a.id, location_name="1DQ1-A", system=self.a)

        def den(item_id, character, location_id, location_name=None,
                name=None):
            ct.CharacterAsset.objects.create(
                character=character, singleton=True, item_id=item_id,
                location_flag="AutoFit", location_id=location_id,
                location_type="solar_system", quantity=1,
                type_id=self.den.id, type_name=self.den,
                location_name=location_name, name=name)

        den(5001, self.ca1, self.a.id, located, name="My Den")
        # location never resolved
        den(5002, self.ca1, self.b.id)

        character = {
            "character_id": self.char1.character_id,
            # "Main (Alt)" - here the character is its own main
            "character_name":
                f"{self.char1.character_name} ({self.char1.character_name})",
            "corporation_id": self.char1.corporation_id,
            "corporation_name": self.char1.corporation_name,
            "alliance_id": self.char1.alliance_id,
            "alliance_name": self.char1.alliance_name,
        }
        item = {
            "id": 85230, "name": "Mercenary Den",
            "cat": "Infrastructure Upgrades - Mercenary Dens", "cat_id": 4810,
        }
        self.assertEqual(self.get_json("/audit/api/dashboard/dens"), [
            {
                "character": character,
                "item": {**item, "name": "Mercenary Den (My Den)"},
                "quantity": 1, "id": 5001, "expand": False, "name": "My Den",
                "location": {
                    "id": self.a.id, "name": "1DQ1-A",
                    # as built today: the system's id with the
                    # constellation's name, and the constellation's id with
                    # the region's name
                    "constellation": {"id": self.a.id, "name": "O-EIMK"},
                    "region": {"id": 20000696, "name": "Delve"},
                },
            },
            {
                "character": character,
                "item": item,
                "quantity": 1, "id": 5002, "expand": False, "name": None,
                "location": {
                    "id": self.b.id, "name": f"{self.b.id} (AutoFit)",
                    "constellation": {"id": 0, "name": ""},
                    "region": {"id": 0, "name": ""},
                },
            },
        ])


class TestCorporationStatusShapes(ApiShapeTestCase):
    def test_character_status(self):
        # user1's characters, both in corp1: one active with ISK, one
        # inactive with no balance recorded
        self.ca1.balance = Decimal("1234.56")
        self.ca1.save()
        active = self.ca1.pk

        with patch.object(ct.CharacterAudit, "is_active",
                          lambda audit: audit.pk == active):
            data = self.get_json(
                f"/audit/api/corporation/{self.corp1.corporation_id}"
                "/character/status")

        self.assertEqual(data, {
            "characters": {
                "known_and_alts": 2,
                "known_in_corp": 2,
                "bad": 1,
                "in_corp": self.corp1.member_count,
                # a number, not a Decimal string
                "liquid": 1234.56,
            },
            "corporation": {
                "id": self.corp1.corporation_id,
                "name": self.corp1.corporation_name,
            },
        })

    def test_character_status_for_a_corp_not_visible(self):
        # Used to 500 - .get() raised DoesNotExist before the 403 check
        self.user1.is_superuser = False
        self.user1.save()

        resp = self.client.get(
            f"/audit/api/corporation/{self.corp1.corporation_id}"
            "/character/status")

        self.assertEqual(resp.status_code, 403)
        self.assertEqual(resp.json(), "Permission Denied")


class TestSovereigntyShapes(ApiShapeTestCase):
    """The sov hub list and both sov maps - the map payload is the shared
    space-map shape (regions/systems/edges) with sov data on top."""

    def setUp(self):
        super().setUp()
        delve = sde.Region.objects.create(id=10000060, name="Delve")
        fountain = sde.Region.objects.create(id=10000058, name="Fountain")
        delve_c = sde.Constellation.objects.create(
            id=20000696, name="O-EIMK", region=delve)
        fountain_c = sde.Constellation.objects.create(
            id=20000672, name="Fountain C", region=fountain)

        def system(system_id, name, const, x, z, has_2d=True):
            return sde.SolarSystem.objects.create(
                id=system_id, name=name, constellation=const,
                security_status=-0.4, security_class="E",
                x=x, y=0, z=z,
                x_2d=x if has_2d else None, y_2d=z if has_2d else None)

        # picked so the normalised positions are round numbers: span 100
        # scales to 20000
        self.a = system(30004759, "1DQ1-A", delve_c, 0, 0)
        self.b = system(30004760, "8QT-H4", delve_c, 100, 100)
        # another region, no 2D position - only on the map as a workforce
        # source / jump bridge endpoint
        self.c = system(30004761, "PDE-U3", fountain_c, 50, 50, has_2d=False)
        sde.Stargate.objects.create(
            id=50001, name="Stargate (8QT-H4)", solar_system=self.a,
            destination=self.b)
        sde.Stargate.objects.create(
            id=50002, name="Stargate (1DQ1-A)", solar_system=self.b,
            destination=self.a)

        fuel = sde.ItemType.objects.create(
            id=81143, name="Magmatic Gas", published=True)
        upgrade = sde.ItemType.objects.create(
            id=81615, name="Power Monitoring Division", published=True)
        den_type = sde.ItemType.objects.create(
            id=85230, name="Mercenary Den", published=True)
        planet = sde.Planet.objects.create(
            id=40300001, name="1DQ1-A I", solar_system=self.a)

        self.hub_a = ct.SovereigntyHub.objects.create(
            corporation=self.cp1, hub_id=5001, solar_system_id=self.a.id,
            solar_system_name=self.a, power_allocated=100,
            power_available=200, workforce_allocated=10,
            workforce_available=20,
            reagent_last_updated=datetime(2026, 5, 6, tzinfo=timezone.utc),
            workforce_transport={
                "configuration": {"import": {"sources": [
                    {"solar_system_id": self.c.id}]}},
                "state": {"import": {"sources": [
                    {"solar_system_id": self.c.id, "amount": 5}]}},
            })
        self.hub_a.reagents.create(
            type_name=fuel, amount=50, burning_per_hour=2)
        self.hub_a.reagents.create(amount=0, burning_per_hour=0)
        self.hub_a.upgrades.create(type_name=upgrade, power_state="online")
        self.hub_a.upgrades.create(power_state="offline")
        ct.SovereigntyHub.objects.create(
            corporation=self.cp1, hub_id=5002, solar_system_id=self.b.id,
            solar_system_name=self.b,
            workforce_transport={
                "configuration": {"export": {
                    "solar_system_id": self.a.id, "amount": 7}},
                "state": {},
            })
        ct.CharacterMercenaryDen.objects.create(
            character=self.ca1, den_id=7001, planet_id=planet.id,
            planet_name=planet, type_id=den_type.id, type_name=den_type,
            state="running", development_level="level0",
            anarchy_amount=55, anarchy_level="level4")
        # a jump bridge from 1DQ1-A out to PDE-U3
        self.cp1.update_timestamps = {
            "structures": datetime.now(timezone.utc).isoformat()}
        self.cp1.save()
        ct.Structure.objects.create(
            corporation=self.cp1, profile_id=1, reinforce_hour=12,
            state="shield_vulnerable", structure_id=1001,
            system_id=self.a.id, system_name=self.a, type_id=35841,
            name="1DQ1-A » PDE-U3 - Out")

        owner = {
            "corporation_id": self.corp1.corporation_id,
            "corporation_name": self.corp1.corporation_name,
        }
        delve_ref = {"id": 10000060, "name": "Delve"}
        const_ref = {"id": 20000696, "name": "O-EIMK"}
        self.den = {
            "den_id": 7001, "anarchy_amount": 55,
            "character_name": self.char1.character_name,
            "type_name": "Mercenary Den", "planet_name": "1DQ1-A I",
        }
        self.hub_a_json = {
            "hub_id": 5001, "owner": owner,
            "location": {"id": self.a.id, "name": "1DQ1-A"},
            "constellation": const_ref, "region": delve_ref,
            "power_allocated": 100, "power_available": 200,
            "workforce_allocated": 10, "workforce_available": 20,
            "reagent_last_updated": "2026-05-06T00:00:00Z",
            "reagents": [
                {"name": "Magmatic Gas", "type_id": 81143, "amount": 50,
                 "burning_per_hour": 2},
                {"name": "Unknown", "type_id": None, "amount": 0,
                 "burning_per_hour": 0},
            ],
            "upgrades": [
                {"name": "Power Monitoring Division", "type_id": 81615,
                 "power_state": "online"},
                {"name": "Unknown", "type_id": None,
                 "power_state": "offline"},
            ],
            "workforce_transport": {
                "mode": "import",
                "config_sources": [
                    {"system_id": self.c.id, "system_name": "PDE-U3"}],
                "state_sources": [
                    {"system_id": self.c.id, "system_name": "PDE-U3",
                     "amount": 5}],
                "config_destination": None,
                "state_destination": None,
            },
            "anarchy_dens": [self.den],
        }
        self.hub_b_json = {
            "hub_id": 5002, "owner": owner,
            "location": {"id": self.b.id, "name": "8QT-H4"},
            "constellation": const_ref, "region": delve_ref,
            "power_allocated": None, "power_available": None,
            "workforce_allocated": None, "workforce_available": None,
            "reagent_last_updated": None,
            "reagents": [], "upgrades": [],
            "workforce_transport": {
                "mode": "export", "config_sources": [], "state_sources": [],
                "config_destination": {
                    "system_id": self.a.id, "system_name": "1DQ1-A",
                    "amount": 7},
                "state_destination": None,
            },
            "anarchy_dens": [],
        }

    def map_system(self, system, region_id, const_id, p2d, preal,
                   external=False, **sov):
        return {
            "id": system.id, "name": system.name, "region_id": region_id,
            "constellation_id": const_id,
            "x_2d": p2d[0] if p2d else None, "y_2d": p2d[1] if p2d else None,
            "x_real": preal[0], "y_real": preal[1],
            "security_status": -0.4, "security_class": "E",
            "external": external, **sov,
        }

    def expected_map(self, hubs, den_detail):
        alert = {"anarchy_alert": den_detail,
                 "anarchy_dens": [self.den] if den_detail else []}
        quiet = {"anarchy_alert": False, "anarchy_dens": []}
        return {
            "regions": [{"id": 10000060, "name": "Delve"}],
            "systems": [
                self.map_system(self.a, 10000060, 20000696, (0, 20000),
                                (0, 20000), is_hub=True, **alert),
                self.map_system(self.b, 10000060, 20000696, (20000, 0),
                                (20000, 0), is_hub=True, **quiet),
                self.map_system(self.c, 10000058, 20000672, None,
                                (10000, 10000), external=True,
                                is_hub=False, **quiet),
            ],
            "edges": [{"source": self.a.id, "target": self.b.id}],
            "jump_bridges": [{"source": self.a.id, "target": self.c.id}],
            "hubs": hubs,
        }

    def test_sov_hubs(self):
        self.assertEqual(self.get_json("/audit/api/corp/sovhubs"),
                         [self.hub_a_json, self.hub_b_json])

    def test_sov_map(self):
        # map lists dens per system
        hub_a = {**self.hub_a_json, "anarchy_dens": []}
        self.assertEqual(self.get_json("/audit/api/corp/sovhubs/map"),
                         self.expected_map([hub_a, self.hub_b_json], True))

    def test_public_sov_map(self):
        # no power/workforce/reagents/transport, and no den info at all
        public = {
            "power_allocated": None, "power_available": None,
            "workforce_allocated": None, "workforce_available": None,
            "reagent_last_updated": None, "reagents": [],
            "workforce_transport": None, "anarchy_dens": [],
        }
        self.assertEqual(
            self.get_json("/audit/api/dash/sovmap"),
            self.expected_map([
                {**self.hub_a_json, **public},
                {**self.hub_b_json, **public},
            ], False))


class TestMiningShapes(ApiShapeTestCase):
    def setUp(self):
        super().setUp()
        region = sde.Region.objects.create(id=10000002, name="The Forge")
        const = sde.Constellation.objects.create(
            id=20000020, name="Kimotoro", region=region)
        self.a = sde.SolarSystem.objects.create(
            id=30000142, name="Jita", constellation=const)
        self.b = sde.SolarSystem.objects.create(
            id=30000144, name="Perimeter", constellation=const)
        group = sde.ItemGroup.objects.create(
            id=450, name="Arkonor", anchorable=False, anchored=False,
            fittable_non_singleton=False, published=True,
            use_base_price=False)
        # volumes that are exact in binary, so the sums are too
        self.veld = sde.ItemType.objects.create(
            id=1230, name="Veldspar", published=True, group=group,
            volume=0.5)
        self.scord = sde.ItemType.objects.create(
            id=1228, name="Scordite", published=True, group=group,
            volume=0.25)

        today = datetime.now(timezone.utc).date()
        self.day = {n: str(today - timedelta(days=n)) for n in range(5)}

        def row(row_id, audit, days_ago, ore, system, qty):
            ct.CharacterMiningLedger.objects.create(
                id=row_id, character=audit,
                date=today - timedelta(days=days_ago), type_name=ore,
                system=system, quantity=qty)

        row("1", self.ca1, 2, self.veld, self.a, 1000)
        row("2", self.ca1, 2, self.veld, self.a, 500)
        row("3", self.ca2, 2, self.scord, self.b, 200)
        row("4", self.ca1, 3, self.veld, self.a, 100)
        row("5", self.ca1, 0, self.veld, self.a, 999)  # today - not shown
        row("6", self.ca1, 10, self.veld, self.a, 999)  # outside look_back

    def get_mining(self, url):
        # the moons app prices the ore - not installed here, so stand in
        helpers = types.ModuleType("moons.helpers")
        helpers.OreHelper = type("OreHelper", (), {
            "get_ore_array_with_value": staticmethod(
                lambda: {1230: {"value": 2.5}})})
        with patch.dict(sys.modules, {
                "moons": types.ModuleType("moons"), "moons.helpers": helpers}):
            data = self.get_json(url)
        # built from sets - no stable order
        for key in ("all_ores", "all_groups", "all_systems"):
            data[key] = sorted(data[key])
        return data

    def empty_day(self, n):
        return {"date": self.day[n], "ores": [], "characters": [],
                "systems": [], "value": 0, "volume": 0}

    def expected(self, day2_characters):
        jita = {"id": self.a.id, "name": "Jita"}
        return {
            "all_ores": ["Scordite", "Veldspar"],
            "all_groups": ["Arkonor"],
            "all_systems": ["Jita", "Perimeter"],
            "total_volume": 850.0,
            "total_value": 4000.0,
            # look_back=3 gives the 4 days before today, oldest first
            "data": [
                self.empty_day(4),
                {
                    "date": self.day[3],
                    # NB: an ore's value counts its first row of the day
                    # twice (entry starts at `value`, then += value) - 500
                    # here where 250 is right, while the day's own value
                    # is right
                    "ores": [{"name": "Veldspar", "group": "Arkonor",
                              "id": 1230, "volume": 50.0, "value": 500.0}],
                    "characters": [{"id": self.char1.character_id,
                                    "name": self.char1.character_name}],
                    "systems": [jita],
                    "value": 250.0,
                    "volume": 50.0,
                },
                {
                    "date": self.day[2],
                    "ores": [
                        # 3750 is right - see above
                        {"name": "Veldspar", "group": "Arkonor", "id": 1230,
                         "volume": 750.0, "value": 6250.0},
                        {"name": "Scordite", "group": "Arkonor", "id": 1228,
                         "volume": 50.0, "value": 0},
                    ],
                    "characters": day2_characters,
                    "systems": [jita, {"id": self.b.id, "name": "Perimeter"}],
                    "value": 3750.0,
                    "volume": 800.0,
                },
                self.empty_day(1),
            ],
        }

    def test_character_mining(self):
        self.assertEqual(
            self.get_mining(
                f"/audit/api/account/{self.cid}/mining?look_back=3"),
            self.expected([
                {"id": self.char1.character_id,
                 "name": self.char1.character_name},
                {"id": self.char2.character_id,
                 "name": self.char2.character_name},
            ]))

    def test_corporation_mining(self):
        # characters are shown as their main - char2's main is char1
        self.assertEqual(
            self.get_mining(
                f"/audit/api/corporation/{self.corp1.corporation_id}"
                "/mining?look_back=3"),
            self.expected([
                {"id": self.char1.character_id,
                 "name": self.char1.character_name},
            ]))

    def test_mining_characters(self):
        self.assertEqual(
            self.get_json(f"/audit/api/account/{self.cid}/mining/chars"),
            {"characters": [
                {"character_id": self.char1.character_id,
                 "character_name": self.char1.character_name},
                {"character_id": self.char2.character_id,
                 "character_name": self.char2.character_name},
            ]})


class TestFitCheckShapes(ApiShapeTestCase):
    def setUp(self):
        super().setUp()
        skills_group = sde.ItemGroup.objects.create(
            id=255, name="Gunnery", anchorable=False, anchored=False,
            fittable_non_singleton=False, published=True,
            use_base_price=False)
        attrs = {
            a: sde.DogmaAttribute.objects.create(id=a, name=f"attr{a}")
            for a in (182, 183, 277, 278, 275)}

        def item(type_id, name, group=None, **dogma):
            t = sde.ItemType.objects.create(
                id=type_id, name=name, published=True, group=group)
            for attr, value in dogma.items():
                sde.TypeDogma.objects.create(
                    item_type=t, dogma_attribute=attrs[int(attr[1:])],
                    value=value)
            return t

        # skills, with their training time multiplier (attribute 275)
        self.gunnery = item(3300, "Gunnery", skills_group, a275=1)
        self.frig = item(3329, "Minmatar Frigate", skills_group, a275=2)
        item(3301, "Small Projectile Turret", skills_group, a275=1)
        # the fit: the ship needs Minmatar Frigate III, the gun Gunnery I
        # and Small Projectile Turret I
        item(587, "Rifter", a182=3329, a277=3)
        item(2873, "200mm AutoCannon I", a182=3300, a277=1, a183=3301,
             a278=1)

        ct.Skill.objects.create(
            character=self.ca1, skill_id=3300, skill_name=self.gunnery,
            active_skill_level=5, trained_skill_level=5,
            skillpoints_in_skill=256000)
        ct.Skill.objects.create(
            character=self.ca1, skill_id=3329, skill_name=self.frig,
            active_skill_level=2, trained_skill_level=2,
            skillpoints_in_skill=2829)

    def test_fit_check(self):
        eft = (
            "[Rifter, Test fit]\n"
            "200mm AutoCannon I, EMP S\n"
            "\n"
            "Nanite Repair Paste x10\n"  # not in the SDE - ignored
        )
        data = self.post_text_json(
            f"/audit/api/extras/fitting2skills/{self.cid}", eft)

        self.assertEqual(data, {
            # skill id and level are floats - SDE dogma values
            "skills": [
                {"s": 3300.0, "l": 1.0, "n": "Gunnery"},
                {"s": 3329.0, "l": 3.0, "n": "Minmatar Frigate"},
                {"s": 3301.0, "l": 1.0, "n": "Small Projectile Turret"},
            ],
            # characters on the account with any skills, by name
            "chars": {
                self.char1.character_name: {
                    "character_id": self.char1.character_id,
                    "omega": True,
                    "skills": {
                        "Gunnery": {"grp": "Gunnery", "sp_total": 256000,
                                    "active_level": 5, "trained_level": 5},
                        "Minmatar Frigate": {
                            "grp": "Gunnery", "sp_total": 2829,
                            "active_level": 2, "trained_level": 2},
                    },
                    "queue": {},
                    "doctrines": {"fit": {
                        # SP: 250 * multiplier * sqrt(32)^(level - 1)
                        "_meta": {"total_sp": 250 + 16000 + 250,
                                  "trained_sp": 250 + 2829},
                        # what's missing, at the level needed
                        "Minmatar Frigate": 3,
                        "Small Projectile Turret": 1,
                    }},
                },
            },
        })


class TestSkillGraphShapes(ApiShapeTestCase):
    def test_skill_graph(self):
        skill_cat = sde.ItemCategory.objects.create(
            id=16, name="Skill", published=True)
        attr = sde.DogmaAttribute.objects.create(
            id=275, name="skillTimeConstant")

        def group(group_id, name):
            return sde.ItemGroup.objects.create(
                id=group_id, name=name, category=skill_cat,
                anchorable=False, anchored=False,
                fittable_non_singleton=False, published=True,
                use_base_price=False)

        def skill(type_id, name, grp, sp):
            t = sde.ItemType.objects.create(
                id=type_id, name=name, published=True, group=grp)
            sde.TypeDogma.objects.create(
                item_type=t, dogma_attribute=attr, value=1)
            if sp is not None:
                ct.Skill.objects.create(
                    character=self.ca1, skill_id=type_id, skill_name=t,
                    active_skill_level=1, trained_skill_level=1,
                    skillpoints_in_skill=sp)

        gunnery = group(255, "Gunnery")
        skill(3300, "Gunnery", gunnery, 256000)
        skill(3301, "Small Projectile Turret", gunnery, 128000)
        # trained too little to show (rounds to 0) - the group is left out
        skill(3449, "Navigation", group(275, "Navigation"), 1000)
        # nobody has it - left out too
        skill(3402, "Science", group(270, "Science"), None)

        sp_5 = 250 * 1 * math.sqrt(32) ** 4  # a multiplier 1 skill at V
        self.assertEqual(
            self.get_json(f"/audit/api/account/{self.cid}/skillgraph"), {
                "characters": [self.char1.character_name],
                "data": [{
                    "group": "Gunnery",
                    # SP the character has in the group
                    "char_total": 384000,
                    # SP of every skill in the group at V
                    "total": 2 * sp_5,
                    # % of the group trained, weighted by each skill's size:
                    # Gunnery at V is 50, half of Small Projectile 25
                    self.char1.character_name: 75,
                }],
            })


class TestFuelShapes(ApiShapeTestCase):
    def test_structure_fuel(self):
        now = datetime(2026, 6, 1, 12, 0, tzinfo=timezone.utc)
        self.cp1.update_timestamps = {"structures": now.isoformat()}
        self.cp1.save()
        region = sde.Region.objects.create(id=10000060, name="Delve")
        const = sde.Constellation.objects.create(
            id=20000696, name="O-EIMK", region=region)
        system = sde.SolarSystem.objects.create(
            id=30004759, name="1DQ1-A", constellation=const)
        fortizar = sde.ItemType.objects.create(
            id=35833, name="Fortizar", published=True)
        metenox = sde.ItemType.objects.create(
            id=81826, name="Metenox Moon Drill", published=True)
        gas = sde.ItemType.objects.create(
            id=81143, name="Magmatic Gas", published=True)

        def structure(structure_id, type_name, services, fuel_expires=None):
            st = ct.Structure.objects.create(
                corporation=self.cp1, profile_id=1, reinforce_hour=12,
                state="shield_vulnerable", structure_id=structure_id,
                system_id=system.id, system_name=system,
                type_id=type_name.id, type_name=type_name,
                name=f"1DQ1-A - {type_name.name}", fuel_expires=fuel_expires)
            for name, state in services:
                ct.StructureService.objects.create(
                    structure=st, name=name, state=state)

        # 30 blocks/h while online, 10.5h of fuel left
        structure(1001, fortizar, [("Market", "online"),
                                   ("Clone Bay", "offline")],
                  fuel_expires=now + timedelta(hours=10, minutes=30))
        # 5 blocks/h, out of blocks; 1000 gas at 200/h
        structure(1002, metenox, [("Automatic Moon Drilling", "online")])
        ct.CorpAsset.objects.create(
            corporation=self.cp1, singleton=False, item_id=9001,
            location_flag="StructureFuel", location_id=1002,
            location_type="item", quantity=1000, type_id=gas.id,
            type_name=gas)

        with patch("django.utils.timezone.now", return_value=now):
            data = self.get_json("/audit/api/corp/structures/fuel")

        place = {
            "location": {"id": system.id, "name": "1DQ1-A"},
            "constellation": {"id": 20000696, "name": "O-EIMK"},
            "region": {"id": 10000060, "name": "Delve"},
        }
        owner = {"id": self.corp1.corporation_id,
                 "name": self.corp1.corporation_name}
        self.assertEqual(data, {
            "structures": [
                {
                    "id": 1001, "owner": owner,
                    "name": "1DQ1-A - Fortizar",
                    "type": {"id": 35833, "name": "Fortizar"}, **place,
                    "fuel_expiry": "2026-06-01T22:30:00Z",
                    "state": "shield_vulnerable", "state_expiry": None,
                    "fuel_req": 30, "fuel_req_day": 720,
                    "fuel_req_30d": 21600,
                    "gas_req": 0, "gas_req_day": 0, "gas_req_30d": 0,
                    # 11 hours (10.5 rounded up) at 30/h
                    "current_blocks": 330,
                    "extra_fuel_info": None,
                    "metenox_gas_hourly": 0, "current_metenox_gas": 0,
                    "block_hours_left": 11, "gas_hours_left": 0,
                    "block_duration_left": "11 hours",
                    "gas_duration_left": "0 hours",
                    "90day": 30 * 24 * 90 - 330, "gas_90day": 0,
                },
                {
                    "id": 1002, "owner": owner,
                    "name": "1DQ1-A - Metenox Moon Drill",
                    "type": {"id": 81826, "name": "Metenox Moon Drill"},
                    **place,
                    "fuel_expiry": None,
                    "state": "shield_vulnerable", "state_expiry": None,
                    "fuel_req": 5, "fuel_req_day": 120, "fuel_req_30d": 3600,
                    "gas_req": 200, "gas_req_day": 4800,
                    "gas_req_30d": 144000,
                    "current_blocks": 0,
                    "extra_fuel_info": {
                        "qty": 1000, "name": "Magmatic Gas",
                        "expires": "2026-06-01T17:00:00Z",
                    },
                    "metenox_gas_hourly": 200, "current_metenox_gas": 1000,
                    "block_hours_left": 0, "gas_hours_left": 5,
                    "block_duration_left": "0 hours",
                    "gas_duration_left": "5 hours",
                    "90day": 5 * 24 * 90, "gas_90day": 200 * 24 * 90 - 1000,
                },
            ],
            "total_hourly_fuel": 35,
        })
