"""The whole known-space base map is cached per SDE build."""
# Third Party
from eve_sde import models as sde

# Django
from django.db import connection
from django.test import TestCase
from django.test.utils import CaptureQueriesContext

# AA Example App
from corptools.api import spacemap
from corptools.api.activity_map_shared import build_asset_map_payload
from corptools.models import CharacterAsset


class TestUniverseMapCache(TestCase):
    def setUp(self):
        spacemap._universe_map_cache.clear()
        # django-solo keeps EveSDE in the (persistent, shared) cache - a
        # build number left there would turn caching on for other tests
        sde.EveSDE.clear_cache()
        region = sde.Region.objects.create(id=10000002, name="The Forge")
        const = sde.Constellation.objects.create(
            id=20000020, name="Kimotoro", region=region)
        self.jita = sde.SolarSystem.objects.create(
            id=30000142, name="Jita", constellation=const, x=0, y=0, z=0,
            x_2d=0, y_2d=0)
        sde.SolarSystem.objects.create(
            id=30000144, name="Perimeter", constellation=const, x=1, y=0,
            z=1, x_2d=1, y_2d=1)

    def tearDown(self):
        spacemap._universe_map_cache.clear()
        sde.EveSDE.clear_cache()

    def set_build(self, build):
        state = sde.EveSDE.get_solo()
        state.build_number = build
        state.save()

    def test_repeat_requests_use_the_cache(self):
        self.set_build(3142455)
        first = spacemap.build_base_map_payload(None)

        with CaptureQueriesContext(connection) as queries:
            second = spacemap.build_base_map_payload(None)

        # at most the SDE build lookup (django-solo may cache that too) -
        # the systems, gates and regions aren't read again
        self.assertLessEqual(len(queries), 1, queries.captured_queries)

        self.assertEqual(first, second)
        self.assertEqual(len(second["systems"]), 2)

    def test_a_new_sde_build_rebuilds(self):
        self.set_build(1)
        spacemap.build_base_map_payload(None)
        self.jita.name = "Jita (renamed)"
        self.jita.save()

        self.set_build(2)
        names = {s["name"]
                 for s in spacemap.build_base_map_payload(None)["systems"]}

        self.assertIn("Jita (renamed)", names)
        self.assertEqual(list(spacemap._universe_map_cache), [2])

    def test_without_an_sde_build_nothing_is_cached(self):
        # no build recorded - e.g. an SDE not loaded through eve_sde
        spacemap.build_base_map_payload(None)
        self.jita.name = "Jita (renamed)"
        self.jita.save()

        names = {s["name"]
                 for s in spacemap.build_base_map_payload(None)["systems"]}

        self.assertIn("Jita (renamed)", names)
        self.assertEqual(spacemap._universe_map_cache, {})

    def test_callers_adding_keys_dont_touch_the_cache(self):
        self.set_build(3142455)
        payload = build_asset_map_payload(CharacterAsset.objects.none())
        self.assertIn("values", payload)

        self.assertNotIn("values", spacemap.build_base_map_payload(None))

    def test_scoped_maps_are_not_cached(self):
        # the sov maps' region-scoped payloads vary per request
        self.set_build(3142455)
        spacemap.build_base_map_payload({self.jita.id})
        spacemap.build_base_map_payload(None, extra_system_ids={self.jita.id})
        self.assertEqual(spacemap._universe_map_cache, {})
