"""
Jump clones and implants are synced in place rather than flushed and
recreated: unchanged clones/implants keep their pk, removed ones go, and a
location name resolved later survives a refresh while the clone stays put.
"""
# Standard Library
from unittest.mock import MagicMock, patch

# Third Party
from eve_sde import models as sde_models

# AA Example App
from corptools.models import EveLocation, Implant, JumpClone
from corptools.task_helpers.char_tasks import update_character_clones

from . import CorptoolsTestCase

CHAR_TASKS = "corptools.task_helpers.char_tasks"

JITA = 60003760
AMARR = 60008494


def _jump_clone(jump_clone_id, location_id, implants, name=None):
    clone = MagicMock(jump_clone_id=jump_clone_id, location_id=location_id,
                      location_type="station", implants=implants)
    clone.name = name
    return clone


@patch(f"{CHAR_TASKS}.get_token")
@patch(f"{CHAR_TASKS}.providers")
class TestCloneSync(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        for i in (9899, 9941, 9942, 9943, 9956):
            sde_models.ItemType.objects.create(
                id=i, name=f"implant {i}", published=True)

    def _run(self, mock_providers, mock_token, active, jump_clones):
        mock_token.return_value = MagicMock()
        api = mock_providers.esi_openapi.client.Clones
        api.GetCharactersCharacterIdImplants.return_value.result.return_value = active
        api.GetCharactersCharacterIdClones.return_value.result.return_value = MagicMock(
            jump_clones=jump_clones, last_clone_jump_date=None,
            last_station_change_date=None,
            home_location=MagicMock(location_id=JITA, location_type="station"))
        update_character_clones(self.char1.character_id)

    def _implants(self):
        return {
            (i.clone.jump_clone_id, i.type_name_id): i.pk
            for i in Implant.objects.filter(clone__character=self.ca1).select_related("clone")
        }

    def test_refresh_updates_in_place(self, mock_providers, mock_token):
        self._run(mock_providers, mock_token, [9899, 9941], [
            _jump_clone(1, JITA, [9942, 9943], name="Pod A"),
            _jump_clone(2, AMARR, [9956]),
        ])
        clones = dict(JumpClone.objects.filter(
            character=self.ca1).values_list("jump_clone_id", "pk"))
        implants = self._implants()

        self._run(mock_providers, mock_token, [9899, 9956], [
            _jump_clone(1, JITA, [9942, 9941], name="Pod B"),
            _jump_clone(3, AMARR, []),
        ])

        after = {c.jump_clone_id: c for c in JumpClone.objects.filter(
            character=self.ca1)}
        self.assertEqual(set(after), {0, 1, 3})
        self.assertEqual(after[0].pk, clones[0])
        self.assertEqual(after[1].pk, clones[1])
        self.assertEqual(after[1].name, "Pod B")

        now = self._implants()
        self.assertEqual(
            set(now), {(0, 9899), (0, 9956), (1, 9942), (1, 9941)})
        self.assertEqual(now[(0, 9899)], implants[(0, 9899)])
        self.assertEqual(now[(1, 9942)], implants[(1, 9942)])

    def test_resolved_location_survives_until_clone_moves(self, mock_providers, mock_token):
        self._run(mock_providers, mock_token, [], [
            _jump_clone(1, JITA, []), _jump_clone(2, JITA, [])])
        # resolved afterwards by the location pipeline
        loc = EveLocation.objects.create(
            location_id=JITA, location_name="Jita IV - Moon 4")
        JumpClone.objects.filter(location_id=JITA).update(location_name=loc)

        # the refresh itself doesn't know the location name
        with patch(f"{CHAR_TASKS}._known_location_ids", return_value=set()):
            self._run(mock_providers, mock_token, [], [
                _jump_clone(1, JITA, []), _jump_clone(2, AMARR, [])])

        rows = dict(JumpClone.objects.filter(
            character=self.ca1, jump_clone_id__in=[1, 2]
        ).values_list("jump_clone_id", "location_name_id"))
        self.assertEqual(rows, {1: JITA, 2: None})
