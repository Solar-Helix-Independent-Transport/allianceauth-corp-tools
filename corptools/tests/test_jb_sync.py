"""
build_jb_network used to delete every auto bridge and recreate it. It now
syncs in place, leaves manual bridges alone (including one sharing a
structure_id with an auto bridge, which used to raise IntegrityError) and
the router still notices removed and changed bridges.
"""
# Standard Library
from datetime import timedelta

# Third Party
from eve_sde import models as sde_models

# Django
from django.utils import timezone

# AA Example App
from corptools.models import EveName, Structure
from corptools.models.eve_models import MapJumpBridge
from corptools.providers import EveRouter
from corptools.tasks.corporation.structures import build_jb_network

from . import CorptoolsTestCase

JB_TYPE = 35841
JITA, PERIMETER, AMARR, URLEN = 30000142, 30000144, 30002187, 30000139


class TestJumpBridgeSync(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        region = sde_models.Region.objects.create(
            id=10000002, name="The Forge")
        const = sde_models.Constellation.objects.create(
            id=20000020, name="Kimotoro", region=region)
        self.systems = {}
        for system_id, name in ((JITA, "Jita"), (PERIMETER, "Perimeter"),
                                (AMARR, "Amarr"), (URLEN, "Urlen")):
            self.systems[system_id] = sde_models.SolarSystem.objects.create(
                id=system_id, name=name, security_status=0.9, x=0, y=0, z=0,
                constellation=const)
        EveName.objects.create(
            eve_id=3, name="alliance.names1", category="alliance")

    def _bridge(self, structure_id, src, dst):
        return Structure.objects.create(
            corporation=self.cp2, structure_id=structure_id, type_id=JB_TYPE,
            system_id=src, system_name=self.systems[src],
            name=f"{self.systems[src].name} » {self.systems[dst].name} - Bridge {structure_id}",
            state="online", profile_id=1, reinforce_hour=0)

    def _bridges(self):
        return dict(MapJumpBridge.objects.values_list(
            "structure_id", "to_solar_system_id"))

    def test_sync_in_place(self):
        self._bridge(1, JITA, PERIMETER)
        self._bridge(2, AMARR, URLEN)
        manual = MapJumpBridge.objects.create(
            structure_id=99, from_solar_system_id=URLEN, to_solar_system_id=JITA,
            manually_input=True)
        build_jb_network()
        self.assertEqual(self._bridges(), {1: PERIMETER, 2: URLEN, 99: JITA})

        # bridge 1 retargeted, bridge 2 gone
        Structure.objects.filter(structure_id=1).update(
            name="Jita » Urlen - Bridge 1")
        Structure.objects.filter(structure_id=2).delete()
        build_jb_network()

        self.assertEqual(self._bridges(), {1: URLEN, 99: JITA})
        manual.refresh_from_db()
        self.assertTrue(manual.manually_input)

    def test_manual_bridge_wins_over_auto_with_same_id(self):
        self._bridge(5, JITA, PERIMETER)
        MapJumpBridge.objects.create(
            structure_id=5, from_solar_system_id=JITA, to_solar_system_id=AMARR,
            manually_input=True)

        build_jb_network()

        jb = MapJumpBridge.objects.get(structure_id=5)
        self.assertEqual(
            (jb.to_solar_system_id, jb.manually_input), (AMARR, True))

    def test_unchanged_run_leaves_timestamps(self):
        self._bridge(1, JITA, PERIMETER)
        build_jb_network()
        before = MapJumpBridge.objects.get(structure_id=1).updated

        build_jb_network()

        self.assertEqual(MapJumpBridge.objects.get(
            structure_id=1).updated, before)

    def test_changed_run_bumps_timestamps(self):
        self._bridge(1, JITA, PERIMETER)
        build_jb_network()
        MapJumpBridge.objects.update(
            updated=timezone.now() - timedelta(hours=1))
        before = MapJumpBridge.objects.get(structure_id=1).updated

        Structure.objects.filter(structure_id=1).update(
            name="Jita » Urlen - Bridge 1")
        build_jb_network()

        self.assertGreater(MapJumpBridge.objects.get(
            structure_id=1).updated, before)


class TestRouterStaleness(TestJumpBridgeSync):

    def test_rebuilds_after_bridge_removed(self):
        self._bridge(1, JITA, PERIMETER)
        self._bridge(2, AMARR, URLEN)
        build_jb_network()
        router = EveRouter()
        router.bulid_graph()
        self.assertFalse(router.graph_stale())

        Structure.objects.filter(structure_id=2).delete()
        build_jb_network()

        self.assertTrue(router.graph_stale())

    def test_rebuilds_after_last_bridge_removed(self):
        self._bridge(1, JITA, PERIMETER)
        build_jb_network()
        router = EveRouter()
        router.bulid_graph()

        Structure.objects.all().delete()
        build_jb_network()

        self.assertTrue(router.graph_stale())
