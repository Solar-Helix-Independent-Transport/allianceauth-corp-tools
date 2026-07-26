# Standard Library
from unittest.mock import MagicMock, patch

# Alliance Auth
from esi.exceptions import HTTPNotModified

# AA Example App
from corptools.models import CharacterAudit, CharacterLocation, EveLocation
from corptools.task_helpers.char_tasks import update_character_location
from corptools.task_helpers.update_tasks import LocationUnresolvable

from . import CorptoolsTestCase


def _not_modified():
    return HTTPNotModified(304, {})


class UpdateCharacterLocationUnresolvableTests(CorptoolsTestCase):
    """fetch_location_name can now raise LocationUnresolvable for a 404 (e.g.
    a destroyed structure the character happens to be sitting in). Before
    this fix, update_character_location didn't catch it, so an already
    error-handled case (esi_error_retry does not know about this exception)
    would blow up the whole per-character task instead of just recording an
    unknown current location - same as the existing "no docking access"
    (403 -> None) case already does."""

    def setUp(self):
        super().setUp()
        CharacterAudit.objects.get_or_create(character=self.char1)

    def _mock_out_ship_and_online_lookups(self, mock_providers):
        # These are separate ESI calls in update_character_location that
        # aren't relevant to the location-resolution behaviour under test;
        # short-circuit them via HTTPNotModified (a case the function already
        # handles) so a MagicMock value doesn't leak into a real DB query.
        mock_providers.esi_openapi.client.Location.GetCharactersCharacterIdShip.return_value.result.side_effect = _not_modified()
        mock_providers.esi_openapi.client.Location.GetCharactersCharacterIdOnline.return_value.result.side_effect = _not_modified()

    @patch("corptools.task_helpers.char_tasks.fetch_location_name")
    @patch("corptools.task_helpers.char_tasks.providers")
    @patch("corptools.task_helpers.char_tasks.get_token")
    def test_unresolvable_current_location_does_not_raise(
        self, mock_get_token, mock_providers, mock_fetch
    ):
        mock_get_token.return_value = MagicMock()
        self._mock_out_ship_and_online_lookups(mock_providers)
        esi_location = MagicMock(structure_id=1000000000000,
                                 station_id=None, solar_system_id=None)
        mock_providers.esi_openapi.char_location.return_value = esi_location
        mock_fetch.side_effect = LocationUnresolvable(1000000000000)

        # Should not raise.
        update_character_location(self.char1.character_id)

        current = CharacterLocation.objects.get(
            character__character=self.char1)
        self.assertIsNone(current.current_location)

    @patch("corptools.task_helpers.char_tasks.fetch_location_name")
    @patch("corptools.task_helpers.char_tasks.providers")
    @patch("corptools.task_helpers.char_tasks.get_token")
    def test_resolvable_current_location_is_still_saved(
        self, mock_get_token, mock_providers, mock_fetch
    ):
        mock_get_token.return_value = MagicMock()
        self._mock_out_ship_and_online_lookups(mock_providers)
        esi_location = MagicMock(structure_id=None,
                                 station_id=60003760, solar_system_id=None)
        mock_providers.esi_openapi.char_location.return_value = esi_location

        resolved = EveLocation(location_id=60003760,
                               location_name="Jita IV - Moon 4")
        mock_fetch.return_value = resolved

        update_character_location(self.char1.character_id)

        current = CharacterLocation.objects.get(
            character__character=self.char1)
        self.assertEqual(current.current_location_id, 60003760)
