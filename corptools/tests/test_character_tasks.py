# Standard Library
from unittest.mock import MagicMock, patch

# Django
from django.test import TestCase

# AA Example App
from corptools.tasks.character.assets import update_char_assets
from corptools.tasks.character.clones import update_char_clones
from corptools.tasks.character.misc import (
    update_char_corp_history,
    update_char_industry_jobs,
    update_char_location,
    update_char_loyaltypoints,
    update_char_mining_ledger,
    update_char_roles,
    update_char_titles,
)
from corptools.tasks.character.skills import (
    cache_user_skill_list,
    update_char_skill_list,
    update_char_skill_queue,
)
from corptools.tasks.character.social import (
    update_char_contacts,
    update_char_mail,
    update_char_notifications,
)


class TestCharacterSocialTasks(TestCase):
    @patch("corptools.tasks.character.social.update_character_contacts")
    def test_update_char_contacts_calls_helper(self, mock_helper):
        mock_helper.return_value = "contacts done"
        result = update_char_contacts(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "contacts done")

    @patch("corptools.tasks.character.social.update_character_notifications")
    def test_update_char_notifications_calls_helper(self, mock_helper):
        mock_helper.return_value = "notifications done"
        result = update_char_notifications(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "notifications done")

    @patch("corptools.tasks.character.social.update_character_mail_headers")
    def test_update_char_mail_calls_helper_and_returns_string(self, mock_helper):
        result = update_char_mail(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertIn("1", result)


class TestCharacterSkillsTasks(TestCase):
    @patch("corptools.tasks.character.skills.update_character_skill_list")
    def test_update_char_skill_list_calls_helper(self, mock_helper):
        mock_helper.return_value = "skills done"
        result = update_char_skill_list(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "skills done")

    @patch("corptools.tasks.character.skills.update_character_skill_queue")
    def test_update_char_skill_queue_calls_helper(self, mock_helper):
        mock_helper.return_value = "queue done"
        result = update_char_skill_queue(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "queue done")

    @patch("corptools.tasks.character.skills.providers")
    def test_cache_user_skill_list_calls_provider(self, mock_providers):
        cache_user_skill_list(99)
        mock_providers.skills.get_and_cache_user.assert_called_once_with(
            99, force_rebuild=False)


class TestCharacterMiscTasks(TestCase):
    @patch("corptools.tasks.character.misc.update_corp_history")
    def test_update_char_corp_history_calls_helper(self, mock_helper):
        mock_helper.return_value = "corp history done"
        result = update_char_corp_history(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "corp history done")

    @patch("corptools.tasks.character.misc.update_character_roles")
    def test_update_char_roles_calls_helper(self, mock_helper):
        mock_helper.return_value = "roles done"
        result = update_char_roles(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "roles done")

    @patch("corptools.tasks.character.misc.update_character_titles")
    def test_update_char_titles_calls_helper(self, mock_helper):
        mock_helper.return_value = "titles done"
        result = update_char_titles(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "titles done")

    @patch("corptools.tasks.character.misc.update_character_location")
    def test_update_char_location_calls_helper(self, mock_helper):
        mock_helper.return_value = "location done"
        result = update_char_location(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "location done")

    @patch("corptools.tasks.character.misc.update_character_loyaltypoints")
    def test_update_char_loyaltypoints_calls_helper(self, mock_helper):
        mock_helper.return_value = "lp done"
        result = update_char_loyaltypoints(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "lp done")

    @patch("corptools.tasks.character.misc.update_character_industry_jobs")
    def test_update_char_industry_jobs_calls_helper(self, mock_helper):
        mock_helper.return_value = "jobs done"
        result = update_char_industry_jobs(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "jobs done")

    @patch("corptools.tasks.character.misc.update_character_mining")
    def test_update_char_mining_ledger_calls_helper(self, mock_helper):
        mock_helper.return_value = "mining done"
        result = update_char_mining_ledger(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "mining done")


class TestCharacterClonesTasks(TestCase):
    @patch("corptools.tasks.character.clones.update_character_clones")
    def test_update_char_clones_calls_helper(self, mock_helper):
        mock_helper.return_value = "clones done"
        result = update_char_clones(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "clones done")


class TestCharacterAssetsTasks(TestCase):
    @patch("corptools.tasks.character.assets.update_character_assets")
    def test_update_char_assets_calls_helper(self, mock_helper):
        mock_helper.return_value = "assets done"
        result = update_char_assets(1)
        mock_helper.assert_called_once_with(1, force_refresh=False)
        self.assertEqual(result, "assets done")
