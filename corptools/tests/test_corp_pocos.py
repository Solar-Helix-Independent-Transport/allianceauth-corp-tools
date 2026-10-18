"""
corp_update_pocos names each customs office after its nearest planet.
Asset positions from ESI are relative to the office's own solar system, but
the nearest-planet search ran across every planet in the universe, so a
planet in a different system with similar local coordinates could win.
It also crashed on `None.name` when there was no assets token (or ESI didn't
return a position for an office), failing the whole poco update.
"""
# Standard Library
from unittest.mock import MagicMock, patch

# Third Party
from eve_sde import models as sde_models

# AA Example App
from corptools.models import Poco
from corptools.tasks.corporation.structures import corp_update_pocos

from . import CorptoolsTestCase

OFFICE_ID = 1_000_000_000_001


def _fake_poco(office_id=OFFICE_ID, system_id=30000142):
    return MagicMock(
        office_id=office_id,
        system_id=system_id,
        alliance_tax_rate=0.1,
        allow_access_with_standings=False,
        allow_alliance_access=True,
        bad_standing_tax_rate=None,
        corporation_tax_rate=0.05,
        excellent_standing_tax_rate=None,
        good_standing_tax_rate=None,
        neutral_standing_tax_rate=None,
        reinforce_exit_end=1,
        reinforce_exit_start=0,
        standing_level=None,
        terrible_standing_tax_rate=None,
    )


def _fake_location(item_id=OFFICE_ID, x=0, y=0, z=0):
    return MagicMock(item_id=item_id, position=MagicMock(x=x, y=y, z=z))


class TestCorpUpdatePocos(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        region = sde_models.Region.objects.create(id=1, name="Test Region")
        constellation = sde_models.Constellation.objects.create(
            id=1, name="Test Constellation", region=region)
        self.jita = sde_models.SolarSystem.objects.create(
            id=30000142, name="Jita", security_status=0.9,
            x=0, y=0, z=0, security_class="hisec", constellation=constellation,
        )
        self.perimeter = sde_models.SolarSystem.objects.create(
            id=30000144, name="Perimeter", security_status=0.9,
            x=0, y=0, z=0, security_class="hisec", constellation=constellation,
        )
        self.jita_planet = sde_models.Planet.objects.create(
            id=40009077, name="Jita IV", solar_system=self.jita,
            x=1000, y=0, z=0,
        )
        # Closer to the office's (system-local) position, but in another
        # system entirely - must not be picked.
        sde_models.Planet.objects.create(
            id=40009116, name="Perimeter II", solar_system=self.perimeter,
            x=0, y=0, z=0,
        )

    def _setup_providers(self, mock_providers, locations):
        esi = mock_providers.esi_openapi
        esi.client.Planetary_Interaction.GetCorporationsCorporationIdCustomsOffices.return_value.results.return_value = [
            _fake_poco()
        ]
        esi.client.Assets.PostCorporationsCorporationIdAssetsLocations.return_value.result.return_value = locations
        esi.chunk_ids.side_effect = lambda ids: [ids]

    @patch("corptools.tasks.corporation.structures.get_corp_token")
    @patch("corptools.tasks.corporation.structures.providers")
    def test_nearest_planet_is_limited_to_the_offices_system(
        self, mock_providers, mock_get_corp_token
    ):
        self._setup_providers(mock_providers, [_fake_location(x=10)])
        mock_get_corp_token.return_value = MagicMock(character_id=1)

        corp_update_pocos(self.corp1.corporation_id)

        poco = Poco.objects.get(office_id=OFFICE_ID)
        self.assertEqual(poco.planet_id, self.jita_planet.id)
        self.assertEqual(poco.name, "Jita IV")

    @patch("corptools.tasks.corporation.structures.get_corp_token")
    @patch("corptools.tasks.corporation.structures.providers")
    def test_no_assets_token_still_updates_and_keeps_known_planet(
        self, mock_providers, mock_get_corp_token
    ):
        Poco.objects.create(
            corporation=self.cp1, office_id=OFFICE_ID,
            system_id=30000142, reinforce_exit_end=1, reinforce_exit_start=0,
            name="Jita IV", planet=self.jita_planet,
        )
        self._setup_providers(mock_providers, [])
        poco_token = MagicMock(character_id=1)
        # customs offices token found, assets token not
        mock_get_corp_token.side_effect = [poco_token, None]

        result = corp_update_pocos(self.corp1.corporation_id)

        self.assertIn("Finished Pocos", result)
        mock_providers.esi_openapi.client.Assets.PostCorporationsCorporationIdAssetsLocations.assert_not_called()
        poco = Poco.objects.get(office_id=OFFICE_ID)
        self.assertEqual(poco.corporation_tax_rate, 0.05)
        self.assertEqual(poco.planet_id, self.jita_planet.id)
        self.assertEqual(poco.name, "Jita IV")
