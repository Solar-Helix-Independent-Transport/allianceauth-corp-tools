# Standard Library
from unittest.mock import MagicMock, patch

# Third Party
from eve_sde import models as sde_models

# Django
from django.test import TestCase

# Alliance Auth
from esi.exceptions import HTTPClientError

# AA Example App
from corptools.models import EveLocation
from corptools.task_helpers.update_tasks import (
    LocationUnresolvable,
    _handle_esi_client_error,
    fetch_location_name,
)


def _client_error(status_code, remain=100, reset="60"):
    return HTTPClientError(
        status_code,
        {
            "x-esi-error-limit-remain": str(remain),
            "x-esi-error-limit-reset": reset,
        },
        MagicMock(),
    )


class HandleEsiClientErrorTests(TestCase):
    """`_handle_esi_client_error` decides, per ESI status code, whether a
    location resolution failure is a global-ESI problem (420/429), a
    permanent one (404), or a normal per-character/location failure (403 and
    everything else)."""

    def test_420_reraises_the_original_exception(self):
        err = _client_error(420)
        with self.assertRaises(HTTPClientError) as cm:
            _handle_esi_client_error(err, 1000000000)
        self.assertIs(cm.exception, err)

    def test_429_reraises_the_original_exception(self):
        err = _client_error(429)
        with self.assertRaises(HTTPClientError) as cm:
            _handle_esi_client_error(err, 1000000000)
        self.assertIs(cm.exception, err)

    def test_404_raises_location_unresolvable_instead_of_returning(self):
        err = _client_error(404)
        with self.assertRaises(LocationUnresolvable):
            _handle_esi_client_error(err, 1000000000)

    def test_403_returns_none_without_raising(self):
        err = _client_error(403)
        result = _handle_esi_client_error(err, 1000000000)
        self.assertIsNone(result)

    def test_other_client_error_returns_none_without_raising(self):
        err = _client_error(401)
        result = _handle_esi_client_error(err, 1000000000)
        self.assertIsNone(result)

    @patch("corptools.task_helpers.update_tasks.set_error_count_flag")
    def test_sets_error_count_flag_when_remaining_budget_is_low(self, mock_set_flag):
        err = _client_error(403, remain=10)
        _handle_esi_client_error(err, 1000000000)
        mock_set_flag.assert_called_once()

    @patch("corptools.task_helpers.update_tasks.set_error_count_flag")
    def test_does_not_set_error_count_flag_when_remaining_budget_is_healthy(self, mock_set_flag):
        err = _client_error(403, remain=80)
        _handle_esi_client_error(err, 1000000000)
        mock_set_flag.assert_not_called()

    @patch("corptools.task_helpers.update_tasks.set_error_count_flag")
    def test_sets_error_count_flag_even_on_the_404_path(self, mock_set_flag):
        err = _client_error(404, remain=5)
        with self.assertRaises(LocationUnresolvable):
            _handle_esi_client_error(err, 1000000000)
        mock_set_flag.assert_called_once()


class FetchLocationNameTests(TestCase):
    def setUp(self):
        self.region = sde_models.Region.objects.create(
            id=1, name="Test Region")
        self.constellation = sde_models.Constellation.objects.create(
            id=1, name="Test Constellation", region=self.region
        )
        self.system = sde_models.SolarSystem.objects.create(
            id=30000142,
            name="Jita",
            security_status=0.9,
            x=0, y=0, z=0,
            security_class="hisec",
            constellation=self.constellation,
        )

    def test_asset_safety_location(self):
        location = fetch_location_name(2004, None, 1)
        self.assertEqual(location.location_name, "Asset Safety")

    def test_solar_system_resolves_from_sde(self):
        location = fetch_location_name(30000142, "solar_system", 1)
        self.assertEqual(location.location_name, "Jita")
        self.assertEqual(location.system_id, 30000142)

    def test_solar_system_missing_from_sde_returns_none(self):
        location = fetch_location_name(30000999, "solar_system", 1)
        self.assertIsNone(location)

    def test_disallowed_location_flag_returns_none(self):
        location = fetch_location_name(60003760, "CargoHold", 1)
        self.assertIsNone(location)

    def test_existing_station_is_returned_from_cache_without_calling_esi(self):
        EveLocation.objects.create(
            location_id=60003760, location_name="Jita IV - Moon 4", system=self.system
        )
        with patch("corptools.task_helpers.update_tasks.providers") as mock_providers:
            location = fetch_location_name(60003760, None, 1)
        mock_providers.esi_openapi.client.Universe.GetUniverseStationsStationId.assert_not_called()
        self.assertEqual(location.location_name, "Jita IV - Moon 4")

    @patch("corptools.task_helpers.update_tasks.providers")
    def test_station_resolves_successfully(self, mock_providers):
        station = MagicMock(system_id=30000142)
        station.name = "Jita IV - Moon 4 - Caldari Navy Assembly Plant"
        mock_providers.esi_openapi.client.Universe.GetUniverseStationsStationId.return_value.result.return_value = station

        location = fetch_location_name(60003760, None, 1)

        self.assertEqual(
            location.location_name,
            "Jita IV - Moon 4 - Caldari Navy Assembly Plant",
        )
        self.assertEqual(location.system_id, 30000142)

    @patch("corptools.task_helpers.update_tasks.providers")
    def test_station_403_is_caught_and_returns_none(self, mock_providers):
        mock_providers.esi_openapi.client.Universe.GetUniverseStationsStationId.return_value.result.side_effect = _client_error(
            403)

        location = fetch_location_name(60003760, None, 1)

        self.assertIsNone(location)

    @patch("corptools.task_helpers.update_tasks.providers")
    def test_station_404_raises_location_unresolvable(self, mock_providers):
        mock_providers.esi_openapi.client.Universe.GetUniverseStationsStationId.return_value.result.side_effect = _client_error(
            404)

        with self.assertRaises(LocationUnresolvable):
            fetch_location_name(60003760, None, 1)

    @patch("corptools.task_helpers.update_tasks.providers")
    def test_station_420_propagates_as_http_client_error(self, mock_providers):
        mock_providers.esi_openapi.client.Universe.GetUniverseStationsStationId.return_value.result.side_effect = _client_error(
            420)

        with self.assertRaises(HTTPClientError):
            fetch_location_name(60003760, None, 1)

    @patch("corptools.task_helpers.update_tasks.Token")
    def test_structure_with_no_token_returns_none(self, mock_token_cls):
        mock_token_cls.get_token.return_value = None

        location = fetch_location_name(1000000000000, None, 1)

        self.assertIsNone(location)

    @patch("corptools.task_helpers.update_tasks.providers")
    @patch("corptools.task_helpers.update_tasks.Token")
    def test_structure_resolves_successfully(self, mock_token_cls, mock_providers):
        mock_token_cls.get_token.return_value = MagicMock()
        structure = MagicMock(solar_system_id=30000142)
        structure.name = "Test Citadel"
        mock_providers.esi_openapi.client.Universe.GetUniverseStructuresStructureId.return_value.result.return_value = structure

        location = fetch_location_name(1000000000000, None, 1)

        self.assertEqual(location.location_name, "Test Citadel")
        self.assertEqual(location.system_id, 30000142)

    @patch("corptools.task_helpers.update_tasks.providers")
    @patch("corptools.task_helpers.update_tasks.Token")
    def test_structure_403_is_caught_and_returns_none(self, mock_token_cls, mock_providers):
        mock_token_cls.get_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Universe.GetUniverseStructuresStructureId.return_value.result.side_effect = _client_error(
            403)

        location = fetch_location_name(1000000000000, None, 1)

        self.assertIsNone(location)

    @patch("corptools.task_helpers.update_tasks.providers")
    @patch("corptools.task_helpers.update_tasks.Token")
    def test_structure_404_raises_location_unresolvable(self, mock_token_cls, mock_providers):
        mock_token_cls.get_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Universe.GetUniverseStructuresStructureId.return_value.result.side_effect = _client_error(
            404)

        with self.assertRaises(LocationUnresolvable):
            fetch_location_name(1000000000000, None, 1)

    @patch("corptools.task_helpers.update_tasks.providers")
    @patch("corptools.task_helpers.update_tasks.Token")
    def test_structure_420_propagates_as_http_client_error(self, mock_token_cls, mock_providers):
        mock_token_cls.get_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Universe.GetUniverseStructuresStructureId.return_value.result.side_effect = _client_error(
            420)

        with self.assertRaises(HTTPClientError):
            fetch_location_name(1000000000000, None, 1)

    @patch("corptools.task_helpers.update_tasks.providers")
    @patch("corptools.task_helpers.update_tasks.Token")
    def test_structure_updates_name_on_existing_location(self, mock_token_cls, mock_providers):
        EveLocation.objects.create(
            location_id=1000000000000, location_name="Old Name", system=self.system
        )
        mock_token_cls.get_token.return_value = MagicMock()
        structure = MagicMock(solar_system_id=30000142)
        structure.name = "New Name"
        mock_providers.esi_openapi.client.Universe.GetUniverseStructuresStructureId.return_value.result.return_value = structure

        location = fetch_location_name(1000000000000, None, 1, update=True)

        self.assertEqual(location.location_id, 1000000000000)
        self.assertEqual(location.location_name, "New Name")
