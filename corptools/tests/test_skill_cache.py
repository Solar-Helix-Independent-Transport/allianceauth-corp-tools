"""
SkillListCache invalidation.

There used to be a global "header" key with the doctrine hash, saved with the
cache's default TTL (300s on a stock AA install). That expiry was what made
cached results pick up skill changes at all - cache_user_skill_list asked for
a non-forced rebuild after every skill refetch. The doctrine hash also only
covered doctrine names, so editing a doctrine's skills changed nothing.

Now: entries carry the hash of names + skills, cache_user_skill_list always
rebuilds, and there is no header.
"""
# Standard Library
import json
from unittest.mock import patch

# Django
from django.core.cache import cache

# Alliance Auth
from allianceauth.authentication.models import CharacterOwnership

# AA Example App
from corptools import models as ct_models
from corptools.task_helpers.skill_helpers import SkillListCache
from corptools.tasks.character.skills import cache_user_skill_list

from . import CorptoolsTestCase

BUILD = "corptools.task_helpers.skill_helpers.SkillListCache.check_skill_lists"


class TestSkillListCache(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        cache.clear()
        self.doctrine = ct_models.SkillList.objects.create(
            name="Doctrine", skill_list=json.dumps({"Gunnery": 2}))

    def tearDown(self):
        cache.clear()

    @patch(BUILD, return_value={})
    def test_second_read_is_served_from_cache(self, mock_build):
        cache_ = SkillListCache()
        cache_.get_and_cache_user(self.user1.id)
        cache_.get_and_cache_user(self.user1.id)
        self.assertEqual(mock_build.call_count, 1)

    @patch(BUILD, return_value={})
    def test_cache_survives_the_default_cache_timeout(self, mock_build):
        # Nothing about a hit depends on a short-lived key any more.
        cache_ = SkillListCache()
        cache_.get_and_cache_user(self.user1.id)
        cache.delete("CT_SKILL_HEADER_v2")  # the old header, if it were there
        cache_.get_and_cache_user(self.user1.id)
        self.assertEqual(mock_build.call_count, 1)

    @patch(BUILD, return_value={})
    def test_editing_a_doctrines_skills_invalidates(self, mock_build):
        cache_ = SkillListCache()
        cache_.get_and_cache_user(self.user1.id)

        self.doctrine.skill_list = json.dumps({"Gunnery": 5})
        self.doctrine.save()
        cache_.get_and_cache_user(self.user1.id)

        self.assertEqual(mock_build.call_count, 2)

    @patch(BUILD, return_value={})
    def test_adding_a_doctrine_invalidates(self, mock_build):
        cache_ = SkillListCache()
        cache_.get_and_cache_user(self.user1.id)
        ct_models.SkillList.objects.create(
            name="Another", skill_list=json.dumps({"Navigation": 1}))
        cache_.get_and_cache_user(self.user1.id)
        self.assertEqual(mock_build.call_count, 2)

    @patch(BUILD, return_value={})
    def test_character_ownership_change_uses_a_new_entry(self, mock_build):
        cache_ = SkillListCache()
        cache_.get_and_cache_user(self.user1.id)
        CharacterOwnership.objects.filter(
            user=self.user1, character=self.char2).delete()
        cache_.get_and_cache_user(self.user1.id)
        self.assertEqual(mock_build.call_count, 2)

    @patch(BUILD, return_value={})
    def test_skill_refetch_task_always_rebuilds(self, mock_build):
        SkillListCache().get_and_cache_user(self.user1.id)

        cache_user_skill_list(self.user1.id)

        self.assertEqual(mock_build.call_count, 2)

    @patch(BUILD, return_value={})
    def test_batch_reads_use_cache_and_load_doctrines_once(self, mock_build):
        cache_ = SkillListCache()
        cache_.get_and_cache_user(self.user1.id)  # user1 cached, others not
        mock_build.reset_mock()

        with patch.object(
            SkillListCache, "_get_skill_lists", wraps=cache_._get_skill_lists
        ) as mock_lists:
            result = cache_.get_and_cache_users(
                [self.user1, self.user2, self.user3])

        self.assertEqual(mock_lists.call_count, 1)
        # only the two uncached users were built
        self.assertEqual(mock_build.call_count, 2)
        self.assertEqual(
            set(result), {self.user1.id, self.user2.id, self.user3.id})
        for data in result.values():
            self.assertIn("skills_list", data["data"])
