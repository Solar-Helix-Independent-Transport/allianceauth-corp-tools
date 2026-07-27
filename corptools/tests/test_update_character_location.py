# Standard Library
from unittest.mock import MagicMock, patch

# Alliance Auth
from esi.exceptions import HTTPNotModified

# AA Example App
from corptools.models import CharacterAudit, CharacterLocation, EveLocation
from corptools.task_helpers.char_tasks import update_character_location
from corptools.task_helpers.update_tasks import (
    is_character_on_cooloff,
    set_character_cooloff,
)

from . import CorptoolsTestCase


def _not_modified():
    return HTTPNotModified(304, {})


class UpdateCharacterLocationTests(CorptoolsTestCase):
    """update_character_location resolves the character's current location
    through resolve_location, which owns all the cooloff/retry bookkeeping
    (including the 404 -> LocationUnresolvable case) - so this function
    itself just needs to treat "couldn't resolve it" (None) as
    current_location=None, the same as it always did for a plain 403."""

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

    @patch("corptools.task_helpers.char_tasks.resolve_location")
    @patch("corptools.task_helpers.char_tasks.providers")
    @patch("corptools.task_helpers.char_tasks.get_token")
    def test_unresolvable_current_location_does_not_raise(
        self, mock_get_token, mock_providers, mock_resolve_location
    ):
        mock_get_token.return_value = MagicMock()
        self._mock_out_ship_and_online_lookups(mock_providers)
        esi_location = MagicMock(structure_id=1000000000000,
                                 station_id=None, solar_system_id=None)
        mock_providers.esi_openapi.char_location.return_value = esi_location
        mock_resolve_location.return_value = None

        # Should not raise, regardless of *why* resolve_location came back
        # empty (cooled off, denied access, structure gone, ...).
        update_character_location(self.char1.character_id)

        current = CharacterLocation.objects.get(
            character__character=self.char1)
        self.assertIsNone(current.current_location)

    @patch("corptools.task_helpers.char_tasks.resolve_location")
    @patch("corptools.task_helpers.char_tasks.providers")
    @patch("corptools.task_helpers.char_tasks.get_token")
    def test_resolvable_current_location_is_still_saved(
        self, mock_get_token, mock_providers, mock_resolve_location
    ):
        mock_get_token.return_value = MagicMock()
        self._mock_out_ship_and_online_lookups(mock_providers)
        esi_location = MagicMock(structure_id=None,
                                 station_id=60003760, solar_system_id=None)
        mock_providers.esi_openapi.char_location.return_value = esi_location

        resolved = EveLocation(location_id=60003760,
                               location_name="Jita IV - Moon 4")
        mock_resolve_location.return_value = resolved

        update_character_location(self.char1.character_id)

        current = CharacterLocation.objects.get(
            character__character=self.char1)
        self.assertEqual(current.current_location_id, 60003760)

    @patch("corptools.task_helpers.char_tasks.providers")
    @patch("corptools.task_helpers.char_tasks.get_token")
    def test_character_stuck_somewhere_inaccessible_stops_hitting_esi(
        self, mock_get_token, mock_providers
    ):
        # Before resolve_location, this call path had *no* backoff at all -
        # a character sitting in a structure they can't access would hit
        # ESI's structure endpoint every single audit cycle, forever. Now
        # that it goes through resolve_location, an already-cooled-off
        # character/location pair should short-circuit before ever touching
        # ESI's structure endpoint.
        mock_get_token.return_value = MagicMock()
        self._mock_out_ship_and_online_lookups(mock_providers)
        esi_location = MagicMock(structure_id=1000000000000,
                                 station_id=None, solar_system_id=None)
        mock_providers.esi_openapi.char_location.return_value = esi_location
        set_character_cooloff(1000000000000, self.char1.character_id)

        update_character_location(self.char1.character_id)

        mock_providers.esi_openapi.client.Universe.GetUniverseStructuresStructureId.assert_not_called()
        self.assertTrue(
            is_character_on_cooloff(1000000000000, self.char1.character_id))
