"""
The character update helpers used to load the entire EveLocation / EveName
tables into python lists on every run and then do a linear `in` scan per
item. They now look up just the ids in the ESI response (in chunks) and use
sets - these tests pin that the results are unchanged.
"""
# Standard Library
from unittest.mock import MagicMock, patch

# Third Party
from eve_sde import models as sde_models

# AA Example App
from corptools.models import CharacterAsset, EveLocation, EveName
from corptools.task_helpers import char_tasks
from corptools.task_helpers.char_tasks import (
    _known_eve_ids,
    _known_location_ids,
    update_character_assets,
)

from . import CorptoolsTestCase

CHAR_TASKS = "corptools.task_helpers.char_tasks"


class TestKnownIds(CorptoolsTestCase):
    def test_returns_only_existing_ids_and_ignores_none(self):
        EveLocation.objects.create(location_id=60003760, location_name="Jita")
        self.assertEqual(
            _known_location_ids([60003760, 60008494, None, 60003760]),
            {60003760},
        )

    def test_empty_input_does_no_query(self):
        with self.assertNumQueries(0):
            self.assertEqual(_known_eve_ids([]), set())

    def test_lookup_is_chunked(self):
        for i in range(5):
            EveName.objects.create(
                eve_id=1000 + i, name=f"n{i}", category="character")
        with patch.object(char_tasks, "_ID_LOOKUP_CHUNK", 2):
            with self.assertNumQueries(3):
                found = _known_eve_ids(range(1000, 1005))
        self.assertEqual(found, set(range(1000, 1005)))


def _fake_asset(item_id, location_id):
    return MagicMock(
        is_blueprint_copy=False, is_singleton=True, item_id=item_id,
        location_flag="Hangar", location_id=location_id,
        location_type="station", quantity=1, type_id=34,
    )


class TestUpdateCharacterAssetsLocationAttach(CorptoolsTestCase):
    def setUp(self):
        super().setUp()
        sde_models.ItemType.objects.create(
            id=34, name="Tritanium", published=True)
        sde_models.ItemType.objects.create(
            id=587, name="Rifter", published=True)
        EveLocation.objects.create(location_id=60003760, location_name="Jita")
        EveLocation.objects.create(location_id=60008494, location_name="Amarr")

    @patch(f"{CHAR_TASKS}.update_character_blueprints")
    @patch(f"{CHAR_TASKS}.update_den_locations")
    @patch(f"{CHAR_TASKS}.update_character_assets_names")
    @patch(f"{CHAR_TASKS}.update_asset_locations")
    @patch(f"{CHAR_TASKS}.get_current_ship_location")
    @patch(f"{CHAR_TASKS}.get_token")
    @patch(f"{CHAR_TASKS}.providers")
    def test_known_locations_attached_for_assets_and_ship(
        self, mock_providers, mock_get_token, mock_ship, *_
    ):
        mock_get_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Assets.GetCharactersCharacterIdAssets.return_value.results.return_value = [
            _fake_asset(1, 60003760),
            _fake_asset(2, 1_000_000_000_000),
        ]
        # ship is somewhere none of the assets are
        mock_ship.return_value = CharacterAsset(
            character=self.ca1, singleton=True, item_id=3,
            location_flag="station", location_id=60008494,
            location_type="hangar", quantity=1, type_id=587, type_name_id=587,
        )

        update_character_assets(self.char1.character_id)

        located = dict(
            CharacterAsset.objects.filter(character=self.ca1)
            .values_list("item_id", "location_name_id")
        )
        self.assertEqual(located, {1: 60003760, 2: None, 3: 60008494})
