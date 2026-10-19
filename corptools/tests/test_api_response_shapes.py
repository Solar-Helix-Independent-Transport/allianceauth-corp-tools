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
from datetime import datetime, timezone
from decimal import Decimal

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
            # balance is a string - a Decimal, as Django's encoder sends it
            {"division": "1", "name": "Master", "balance": "1234.50"},
            {"division": "2", "name": "None", "balance": "0.00"},
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
