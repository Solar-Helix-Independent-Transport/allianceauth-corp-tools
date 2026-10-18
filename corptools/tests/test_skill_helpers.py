# Standard Library
import json

# Third Party
from eve_sde import models as sde_models

# Django
from django.core.cache import cache
from django.db import connection
from django.test.utils import CaptureQueriesContext

# AA Example App
from corptools import models as ct_models
from corptools.models.filters import Skillfilter
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


class TestCheckSkillListsOutput(CorptoolsTestCase):
    """Pins the build output - it moved from model instances to plain values
    for speed, and must produce exactly the same structure."""

    def setUp(self):
        super().setUp()
        group = sde_models.ItemGroup.objects.create(id=960, name="Gunnery")
        attr = sde_models.DogmaAttribute.objects.create(
            id=275, name="skillTimeConstant")
        self.gunnery = sde_models.ItemType.objects.create(
            id=960, name="Gunnery", published=True, group=group)
        self.sharp = sde_models.ItemType.objects.create(
            id=961, name="Sharpshooter", published=True, group=group)
        for t in (self.gunnery, self.sharp):
            sde_models.TypeDogma.objects.create(
                item_type=t, dogma_attribute=attr, value=1.0)
        # an alpha-limited skill (trained 5, usable 3)
        ct_models.Skill.objects.create(
            character=self.ca1, skill_id=960, skill_name=self.gunnery,
            active_skill_level=3, skillpoints_in_skill=8000, trained_skill_level=5)
        ct_models.Skill.objects.create(
            character=self.ca1, skill_id=961, skill_name=self.sharp,
            active_skill_level=2, skillpoints_in_skill=1414, trained_skill_level=2)
        ct_models.SkillList.objects.create(
            name="Doctrine", skill_list=json.dumps({"Gunnery": 4, "Sharpshooter": 2}))

    def test_output_structure(self):
        result = SkillListCache().check_skill_lists(
            ct_models.SkillList.objects.all(), [self.char1.character_id])

        self.assertEqual(list(result), [self.char1.character_name])
        table = result[self.char1.character_name]
        self.assertEqual(table["character_id"], self.char1.character_id)
        self.assertFalse(table["omega"])
        self.assertEqual(table["skills"], {
            "Gunnery": {"grp": "Gunnery", "sp_total": 8000, "active_level": 3, "trained_level": 5},
            "Sharpshooter": {"grp": "Gunnery", "sp_total": 1414, "active_level": 2, "trained_level": 2},
        })
        self.assertEqual(table["queue"], {})
        lvl4 = int(250 * 1.0 * 32 ** 1.5)  # 250 * tc * sqrt(32)^3
        lvl2 = int(250 * 1.0 * 32 ** 0.5)
        self.assertEqual(table["doctrines"], {
            "Doctrine": {
                # Gunnery 4 needed, only 3 usable; trained beyond it, so the
                # doctrine level's SP counts as trained
                "Gunnery": 4,
                "_meta": {"total_sp": lvl4 + lvl2, "trained_sp": lvl4 + lvl2},
            }
        })

    def test_character_without_skills_is_left_out(self):
        result = SkillListCache().check_skill_lists(
            ct_models.SkillList.objects.all(),
            [self.char1.character_id, self.char2.character_id])
        self.assertEqual(list(result), [self.char1.character_name])


class TestSkillCheckQueryCounts(CorptoolsTestCase):

    def setUp(self):
        super().setUp()

        cache.clear()
        group = sde_models.ItemGroup.objects.create(id=970, name="Gunnery")
        skill_type = sde_models.ItemType.objects.create(
            id=970, name="Gunnery", published=True, group=group)
        for ca in (self.ca1, self.ca2, self.ca3, self.ca5, self.ca7):
            ct_models.Skill.objects.create(
                character=ca, skill_id=970, skill_name=skill_type,
                active_skill_level=1, skillpoints_in_skill=250, trained_skill_level=1)
        self.doctrine = ct_models.SkillList.objects.create(
            name="Doctrine", skill_list=json.dumps({"Gunnery": 1}))

    def tearDown(self):
        cache.clear()

    def _queries(self, fn):
        cache.clear()
        with CaptureQueriesContext(connection) as ctx:
            fn()
        return len(ctx.captured_queries)

    def test_cold_batch_build_does_not_query_per_user(self):
        # Used to rebuild each uncached user separately - several queries
        # each, so a smart group check on a cold cache scaled with users.
        cache_ = SkillListCache()
        one = self._queries(lambda: cache_.get_and_cache_users([self.user1]))
        three = self._queries(lambda: cache_.get_and_cache_users(
            [self.user1, self.user2, self.user3]))
        self.assertEqual(one, three)

    def test_process_filter_queries(self):
        skill_filter = Skillfilter.objects.create(name="f", description="f")
        skill_filter.required_skill_lists.add(self.doctrine)
        SkillListCache().get_and_cache_user(self.user1.id)  # warm

        with CaptureQueriesContext(connection) as ctx:
            self.assertTrue(skill_filter.process_filter(self.user1))
        # the filter's 2 lists + the user's characters + the doctrines.
        # Was 8: every .count() re-queried the lists, plus a User lookup.
        self.assertEqual(len(ctx.captured_queries), 4)
