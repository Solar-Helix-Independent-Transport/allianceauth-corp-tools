# Third Party
from eve_sde import models as sde_models

# AA Example App
from corptools import models as ct_models
from corptools.api.corporation.sovereignty import (
    ANARCHY_ALERT_THRESHOLD_PCT,
    _build_sov_map_payload,
    _high_anarchy_dens_by_system,
    _serialize_hub,
    _serialize_hub_public,
)

from . import CorptoolsTestCase


class SovereigntyMapAnarchyAlertTestCase(CorptoolsTestCase):
    @classmethod
    def setUpTestData(cls):
        pass

    def setUp(self):
        super().setUp()

        self.region = sde_models.Region.objects.create(
            id=1, name="Test Region")
        self.constellation = sde_models.Constellation.objects.create(
            id=1, name="Test Constellation", region=self.region
        )
        self.system1 = sde_models.SolarSystem.objects.create(
            id=1001,
            name="Hub System",
            security_status=0.0,
            x=0, y=0, z=0,
            security_class="null",
            constellation=self.constellation,
        )
        self.system2 = sde_models.SolarSystem.objects.create(
            id=1002,
            name="Other System",
            security_status=0.0,
            x=1, y=1, z=1,
            security_class="null",
            constellation=self.constellation,
        )
        self.den_type = sde_models.ItemType.objects.create(
            id=1, name="Mercenary Den", published=True
        )
        self.planet1 = sde_models.Planet.objects.create(
            id=2001, name="Planet 1", solar_system=self.system1
        )
        self.planet2 = sde_models.Planet.objects.create(
            id=2002, name="Planet 2", solar_system=self.system2
        )

        self.hub = ct_models.SovereigntyHub.objects.create(
            corporation=self.cp1,
            hub_id=5001,
            solar_system_id=self.system1.id,
            solar_system_name=self.system1,
        )

    def _create_den(self, character, planet, anarchy_amount, den_id):
        return ct_models.CharacterMercenaryDen.objects.create(
            character=character,
            den_id=den_id,
            planet_id=planet.id,
            planet_name=planet,
            type_id=self.den_type.id,
            type_name=self.den_type,
            state='running',
            development_level='level0',
            anarchy_amount=anarchy_amount,
            anarchy_level='level4',
        )

    def test_den_over_threshold_is_flagged(self):
        self._create_den(self.ca1, self.planet1,
                         ANARCHY_ALERT_THRESHOLD_PCT + 1, 1)

        result = _high_anarchy_dens_by_system([self.system1.id])

        self.assertIn(self.system1.id, result)
        self.assertEqual(len(result[self.system1.id]), 1)
        alert = result[self.system1.id][0]
        self.assertEqual(alert["den_id"], 1)
        self.assertEqual(alert["anarchy_amount"],
                         ANARCHY_ALERT_THRESHOLD_PCT + 1)
        self.assertEqual(alert["character_name"], self.char1.character_name)
        self.assertEqual(alert["planet_name"], self.planet1.name)

    def test_den_at_threshold_is_not_flagged(self):
        # Threshold is exclusive - exactly 40% shouldn't alert.
        self._create_den(self.ca1, self.planet1,
                         ANARCHY_ALERT_THRESHOLD_PCT, 1)

        result = _high_anarchy_dens_by_system([self.system1.id])

        self.assertNotIn(self.system1.id, result)

    def test_den_in_unrequested_system_is_excluded(self):
        self._create_den(self.ca1, self.planet2,
                         ANARCHY_ALERT_THRESHOLD_PCT + 10, 1)

        result = _high_anarchy_dens_by_system([self.system1.id])

        self.assertEqual(result, {})

    def test_no_system_ids_returns_empty_without_querying(self):
        self.assertEqual(_high_anarchy_dens_by_system([]), {})

    def test_payload_flags_hub_system_with_high_anarchy_den(self):
        self._create_den(self.ca1, self.planet1,
                         ANARCHY_ALERT_THRESHOLD_PCT + 1, 1)

        payload = _build_sov_map_payload(
            [self.hub],
            lambda h: {"hub_id": h.hub_id},
        )

        system = next(s for s in payload["systems"]
                      if s["id"] == self.system1.id)
        self.assertTrue(system["anarchy_alert"])
        self.assertEqual(len(system["anarchy_dens"]), 1)
        self.assertEqual(system["anarchy_dens"][0]
                         ["character_name"], self.char1.character_name)

    def test_payload_hides_all_den_info_when_not_included(self):
        # Public/dashboard view: no signal that a den issue exists at all,
        # not even the boolean alert - not just the den-level detail.
        self._create_den(self.ca1, self.planet1,
                         ANARCHY_ALERT_THRESHOLD_PCT + 1, 1)

        payload = _build_sov_map_payload(
            [self.hub],
            lambda h: {"hub_id": h.hub_id},
            include_den_detail=False,
        )

        system = next(s for s in payload["systems"]
                      if s["id"] == self.system1.id)
        self.assertFalse(system["anarchy_alert"])
        self.assertEqual(system["anarchy_dens"], [])

    def test_payload_no_alert_without_high_anarchy_dens(self):
        payload = _build_sov_map_payload(
            [self.hub],
            lambda h: {"hub_id": h.hub_id},
        )

        system = next(s for s in payload["systems"]
                      if s["id"] == self.system1.id)
        self.assertFalse(system["anarchy_alert"])
        self.assertEqual(system["anarchy_dens"], [])

    def test_serialize_hub_includes_anarchy_dens(self):
        self._create_den(self.ca1, self.planet1,
                         ANARCHY_ALERT_THRESHOLD_PCT + 1, 1)
        anarchy_by_system = _high_anarchy_dens_by_system([self.system1.id])

        result = _serialize_hub(
            self.hub, {}, anarchy_by_system.get(self.system1.id, [])
        )

        self.assertEqual(len(result["anarchy_dens"]), 1)
        self.assertEqual(result["anarchy_dens"][0]
                         ["character_name"], self.char1.character_name)
        self.assertEqual(result["anarchy_dens"][0]
                         ["planet_name"], self.planet1.name)

    def test_serialize_hub_defaults_to_no_anarchy_dens(self):
        result = _serialize_hub(self.hub, {})

        self.assertEqual(result["anarchy_dens"], [])

    def test_serialize_hub_public_has_same_keys_as_full_serializer(self):
        # Regression guard: the frontend's SovHub type treats these as always
        # present (never optional), so the public/dashboard serializer has to
        # emit every key the full one does - just nulled/empty for the
        # operational fields it deliberately withholds - or the map's detail
        # panel crashes reading e.g. `hub.reagents.length` on a missing key.
        full = _serialize_hub(self.hub, {})
        public = _serialize_hub_public(self.hub)

        self.assertEqual(set(full.keys()), set(public.keys()))
        self.assertIsNone(public["power_allocated"])
        self.assertIsNone(public["power_available"])
        self.assertIsNone(public["workforce_allocated"])
        self.assertIsNone(public["workforce_available"])
        self.assertIsNone(public["reagent_last_updated"])
        self.assertIsNone(public["workforce_transport"])
        self.assertEqual(public["reagents"], [])
        self.assertEqual(public["anarchy_dens"], [])
