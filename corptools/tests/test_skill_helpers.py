# Third Party
from eve_sde import models as sde_models

# AA Example App
from corptools import models as ct_models
from corptools.task_helpers.skill_helpers import SkillListCache

from . import CorptoolsTestCase


class TestSkillQueuePopulation(CorptoolsTestCase):
    def test_queue_holds_highest_finish_level_per_skill(self):
        group = sde_models.ItemGroup.objects.create(id=950, name="Skill Group")
        skill_type = sde_models.ItemType.objects.create(
            id=950, name="Gunnery", published=True, group=group)

        ct_models.Skill.objects.create(
            character=self.ca1, skill_id=950, skill_name=skill_type,
            active_skill_level=2, skillpoints_in_skill=1000, trained_skill_level=2,
        )
        # Two queue entries for the same skill (e.g. training level 3, then
        # 4) - only the highest finish_level should end up in the result.
        ct_models.SkillQueue.objects.create(
            character=self.ca1, finish_level=3, queue_position=0,
            skill_id=950, skill_name=skill_type,
        )
        ct_models.SkillQueue.objects.create(
            character=self.ca1, finish_level=4, queue_position=1,
            skill_id=950, skill_name=skill_type,
        )

        result = SkillListCache().check_skill_lists(
            ct_models.SkillList.objects.none(), [self.char1.character_id])

        self.assertEqual(
            result[self.char1.character_name]["queue"], {"Gunnery": 4})

    def test_no_queue_entries_gives_empty_dict(self):
        group = sde_models.ItemGroup.objects.create(id=951, name="Skill Group")
        skill_type = sde_models.ItemType.objects.create(
            id=951, name="Navigation", published=True, group=group)
        ct_models.Skill.objects.create(
            character=self.ca1, skill_id=951, skill_name=skill_type,
            active_skill_level=1, skillpoints_in_skill=100, trained_skill_level=1,
        )

        result = SkillListCache().check_skill_lists(
            ct_models.SkillList.objects.none(), [self.char1.character_id])

        self.assertEqual(result[self.char1.character_name]["queue"], {})

    def test_queue_entry_for_character_with_no_trained_skills_ignored(self):
        # Only characters that already have at least one row in skill_tables
        # (i.e. some trained skill) get a queue entry - a character with a
        # queue but zero Skill rows shouldn't crash or appear.
        group = sde_models.ItemGroup.objects.create(id=952, name="Skill Group")
        skill_type = sde_models.ItemType.objects.create(
            id=952, name="Engineering", published=True, group=group)
        ct_models.SkillQueue.objects.create(
            character=self.ca1, finish_level=2, queue_position=0,
            skill_id=952, skill_name=skill_type,
        )

        result = SkillListCache().check_skill_lists(
            ct_models.SkillList.objects.none(), [self.char1.character_id])

        self.assertEqual(result, {})
