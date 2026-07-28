"""
update_den_locations (corptools/task_helpers/char_tasks.py) resolves a
deployed mercenary den's planet by finding the nearest Planet in the den's
solar system. It was calling Planet.objects.filter(system=...) - Planet has
no `system` field (it's `solar_system`) - so this raised
FieldError: Cannot resolve keyword 'system' into field, every single time,
silently swallowed by the bare except Exception in update_character_assets.
"""

# Third Party
from eve_sde import models as sde_models

# AA Example App
from corptools import models as ct_models
from corptools.task_helpers.char_tasks import update_den_locations

from . import CorptoolsTestCase

MERCENARY_DEN_GROUP_ID = 4810


class TestUpdateDenLocations(CorptoolsTestCase):

    def setUp(self):
        super().setUp()

        region = sde_models.Region.objects.create(id=1, name="Test Region")
        constellation = sde_models.Constellation.objects.create(
            id=1, name="Test Constellation", region=region)
        self.system = sde_models.SolarSystem.objects.create(
            id=30000142,
            name="Jita",
            security_status=0.9,
            x=0, y=0, z=0,
            security_class="hisec",
            constellation=constellation,
        )
        self.location = ct_models.EveLocation.objects.create(
            location_id=30000142, location_name="Jita", system=self.system)

        self.near_planet = sde_models.Planet.objects.create(
            id=40000001, name="Jita I", solar_system=self.system,
            x=10, y=0, z=0,
        )
        self.far_planet = sde_models.Planet.objects.create(
            id=40000002, name="Jita II", solar_system=self.system,
            x=1000, y=0, z=0,
        )

        self.den_group = sde_models.ItemGroup.objects.create(
            id=MERCENARY_DEN_GROUP_ID, name="Mercenary Den", published=True)
        self.den_type = sde_models.ItemType.objects.create(
            id=85230, name="Mercenary Den", published=True, volume=500,
            group=self.den_group,
        )

        self.den = ct_models.CharacterAsset.objects.create(
            character=self.ca1,
            singleton=True,
            item_id=1_000_000_000_001,
            location_flag="AutoFit",
            location_id=30000142,
            location_type="solar_system",
            quantity=1,
            type_id=self.den_type.id,
            type_name=self.den_type,
            location_name=self.location,
        )
        ct_models.CharAssetCoordiante.objects.create(
            item=self.den, x=0, y=0, z=0)

    def test_resolves_to_nearest_planet_without_raising(self):
        update_den_locations(self.char1.character_id)

        self.den.refresh_from_db()
        self.assertEqual(self.den.name, self.near_planet.name)
