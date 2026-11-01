"""
Skills and the skill queue are synced in place rather than flushed and
recreated: unchanged rows keep their pk and aren't written, removed ones go.
"""
# Standard Library
from datetime import timedelta
from unittest.mock import MagicMock, patch

# Third Party
from eve_sde import models as sde_models

# Django
from django.utils import timezone

# AA Example App
from corptools.models import Skill, SkillQueue
from corptools.task_helpers.char_tasks import (
    update_character_skill_list,
    update_character_skill_queue,
)

from . import CorptoolsTestCase

CHAR_TASKS = "corptools.task_helpers.char_tasks"


def _skill(skill_id, level, sp):
    return MagicMock(skill_id=skill_id, active_skill_level=level,
                     skillpoints_in_skill=sp, trained_skill_level=level)


def _queued(position, skill_id, level, finish=None):
    return MagicMock(skill_id=skill_id, finished_level=level, queue_position=position,
                     finish_date=finish, level_end_sp=None, level_start_sp=None,
                     start_date=None, training_start_sp=None)


@patch(f"{CHAR_TASKS}.get_token")
@patch(f"{CHAR_TASKS}.providers")
class TestSkillSync(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        for i, name in ((3300, "Gunnery"), (3301, "Small Hybrid"), (3302, "Small Projectile")):
            sde_models.ItemType.objects.create(id=i, name=name, published=True)

    def _skills(self, mock_providers, mock_token, skills):
        mock_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Skills.GetCharactersCharacterIdSkills.return_value.result.return_value = MagicMock(
            total_sp=1, unallocated_sp=0, skills=skills)
        update_character_skill_list(self.char1.character_id)

    def _queue(self, mock_providers, mock_token, queue):
        mock_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Skills.GetCharactersCharacterIdSkillqueue.return_value.result.return_value = queue
        update_character_skill_queue(self.char1.character_id)

    def test_skill_list_refresh(self, mock_providers, mock_token):
        self._skills(mock_providers, mock_token,
                     [_skill(3300, 3, 8000), _skill(3301, 1, 250), _skill(3302, 2, 1415)])
        before = dict(Skill.objects.values_list("skill_id", "pk"))

        self._skills(mock_providers, mock_token,
                     [_skill(3300, 4, 45255), _skill(3301, 1, 250)])

        rows = {s.skill_id: s for s in Skill.objects.filter(
            character=self.ca1)}
        self.assertEqual(set(rows), {3300, 3301})
        self.assertEqual(rows[3300].pk, before[3300])
        self.assertEqual(rows[3301].pk, before[3301])
        self.assertEqual(
            (rows[3300].active_skill_level, rows[3300].skillpoints_in_skill), (4, 45255))

    def test_queue_advances_in_place(self, mock_providers, mock_token):
        soon = timezone.now() + timedelta(hours=1)
        later = soon + timedelta(days=1)
        self._queue(mock_providers, mock_token,
                    [_queued(0, 3300, 4, soon), _queued(1, 3300, 5, later),
                     _queued(2, 3301, 2)])
        before = dict(SkillQueue.objects.values_list("queue_position", "pk"))

        # the head finished, everything moved up one
        self._queue(mock_providers, mock_token,
                    [_queued(0, 3300, 5, later), _queued(1, 3301, 2)])

        rows = list(SkillQueue.objects.filter(character=self.ca1)
                    .order_by("queue_position")
                    .values_list("pk", "queue_position", "skill_id", "finish_level", "finish_date"))
        self.assertEqual(rows, [
            (before[0], 0, 3300, 5, later),
            (before[1], 1, 3301, 2, None),
        ])

    def test_empty_queue_clears(self, mock_providers, mock_token):
        self._queue(mock_providers, mock_token, [_queued(0, 3300, 4)])

        self._queue(mock_providers, mock_token, [])

        self.assertFalse(SkillQueue.objects.filter(
            character=self.ca1).exists())
