"""
Write-path regressions in the character/corp update helpers:

- Character industry jobs were fetched without include_completed=True, so
  ESI only ever returned active jobs and stored jobs never moved on to
  delivered/cancelled.
- Several helpers deleted a character's rows and then recreated them as two
  separate statements. Readers (e.g. securegroups skill filters) could see
  the character with nothing mid-refresh, and a failure between the two
  left the data wiped. They now run in a single transaction.
"""
# Standard Library
from unittest.mock import MagicMock, patch

# Third Party
from eve_sde import models as sde_models

# AA Example App
from corptools.models import (
    CharacterContactLabel,
    Skill,
    SkillQueue,
)
from corptools.models.sovereignty import SovereigntyHub, SovereigntyHubReagent
from corptools.task_helpers.char_tasks import (
    update_character_contacts,
    update_character_industry_jobs,
    update_character_skill_list,
    update_character_skill_queue,
)
from corptools.tasks.corporation.sovereignty import (
    corp_sovereignty_hub_detail_update,
)

from . import CorptoolsTestCase

CHAR_TASKS = "corptools.task_helpers.char_tasks"


class TestCharacterIndustryJobsIncludeCompleted(CorptoolsTestCase):
    @patch(f"{CHAR_TASKS}.get_token")
    @patch(f"{CHAR_TASKS}.providers")
    def test_requests_completed_jobs(self, mock_providers, mock_get_token):
        mock_get_token.return_value = MagicMock()
        industry = mock_providers.esi_openapi.client.Industry
        industry.GetCharactersCharacterIdIndustryJobs.return_value.result.return_value = []

        update_character_industry_jobs(self.char1.character_id)

        self.assertTrue(
            industry.GetCharactersCharacterIdIndustryJobs.call_args.kwargs["include_completed"])


class TestDeleteRecreateIsAtomic(CorptoolsTestCase):
    def setUp(self):
        super().setUp()
        self.skill_type = sde_models.ItemType.objects.create(
            id=3300, name="Gunnery", published=True)
        self.old_skill = Skill.objects.create(
            character=self.ca1, skill_id=3300, skill_name=self.skill_type,
            active_skill_level=5, skillpoints_in_skill=256000,
            trained_skill_level=5,
        )

    @patch(f"{CHAR_TASKS}.get_token")
    @patch(f"{CHAR_TASKS}.providers")
    def test_skill_list_failure_keeps_existing_skills(self, mock_providers, mock_get_token):
        mock_get_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Skills.GetCharactersCharacterIdSkills.return_value.result.return_value = MagicMock(
            total_sp=1, unallocated_sp=0,
            skills=[MagicMock(skill_id=3300, active_skill_level=5,
                              skillpoints_in_skill=256000, trained_skill_level=5)],
        )

        with patch.object(Skill.objects, "bulk_create", side_effect=RuntimeError("db")):
            with self.assertRaises(RuntimeError):
                update_character_skill_list(self.char1.character_id)

        self.assertTrue(Skill.objects.filter(pk=self.old_skill.pk).exists())

    @patch(f"{CHAR_TASKS}.get_token")
    @patch(f"{CHAR_TASKS}.providers")
    def test_skill_list_success_replaces_skills(self, mock_providers, mock_get_token):
        mock_get_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Skills.GetCharactersCharacterIdSkills.return_value.result.return_value = MagicMock(
            total_sp=1, unallocated_sp=0,
            skills=[MagicMock(skill_id=3300, active_skill_level=4,
                              skillpoints_in_skill=45255, trained_skill_level=4)],
        )

        update_character_skill_list(self.char1.character_id)

        skills = Skill.objects.filter(character=self.ca1)
        self.assertEqual(skills.count(), 1)
        self.assertEqual(skills.get().active_skill_level, 4)
        self.assertFalse(Skill.objects.filter(pk=self.old_skill.pk).exists())

    @patch(f"{CHAR_TASKS}.get_token")
    @patch(f"{CHAR_TASKS}.providers")
    def test_skill_queue_failure_keeps_existing_queue(self, mock_providers, mock_get_token):
        old = SkillQueue.objects.create(
            character=self.ca1, finish_level=5, queue_position=0,
            skill_id=3300, skill_name=self.skill_type,
        )
        mock_get_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Skills.GetCharactersCharacterIdSkillqueue.return_value.result.return_value = [
            MagicMock(skill_id=3300, finished_level=5, queue_position=0,
                      finish_date=None, level_end_sp=None, level_start_sp=None,
                      start_date=None, training_start_sp=None)
        ]

        with patch.object(SkillQueue.objects, "bulk_create", side_effect=RuntimeError("db")):
            with self.assertRaises(RuntimeError):
                update_character_skill_queue(self.char1.character_id)

        self.assertTrue(SkillQueue.objects.filter(pk=old.pk).exists())

    @patch(f"{CHAR_TASKS}.get_token")
    @patch(f"{CHAR_TASKS}.providers")
    def test_contact_labels_failure_keeps_existing_labels(self, mock_providers, mock_get_token):
        old = CharacterContactLabel(
            character=self.ca1, label_id=1, label_name="Blues")
        old.build_id()
        old.save()
        mock_get_token.return_value = MagicMock()
        contacts = mock_providers.esi_openapi.client.Contacts
        new_label = MagicMock(label_id=2)
        new_label.label_name = "Reds"
        contacts.GetCharactersCharacterIdContactsLabels.return_value.result.return_value = [
            new_label]

        with patch.object(CharacterContactLabel.objects, "bulk_create", side_effect=RuntimeError("db")):
            with self.assertRaises(RuntimeError):
                update_character_contacts(self.char1.character_id)

        self.assertTrue(
            CharacterContactLabel.objects.filter(pk=old.pk).exists())

    @patch("corptools.tasks.corporation.sovereignty.get_corp_token")
    @patch("corptools.tasks.corporation.sovereignty.providers")
    def test_sov_hub_failure_keeps_existing_reagents(self, mock_providers, mock_get_corp_token):
        hub = SovereigntyHub.objects.create(
            corporation=self.cp1, hub_id=1, solar_system_id=30000142)
        reagent_type = sde_models.ItemType.objects.create(
            id=81143, name="Magmatic Gas", published=True)
        old = SovereigntyHubReagent.objects.create(
            hub=hub, type_name=reagent_type, amount=100, burning_per_hour=1)

        mock_get_corp_token.return_value = MagicMock()
        detail = MagicMock(id=1, solar_system_id=30000142, resources=None,
                           vulnerability_window=None, workforce_transport=None,
                           upgrades=None, fuel_access_list_id=None)
        detail.reagent_bay.last_updated = None
        detail.reagent_bay.reagents = [
            MagicMock(type_id=81143, amount=50, burning_per_hour=1)]
        mock_providers.esi_openapi.client.Structures.GetCorporationsStructuresSovereigntyHubsDetail.return_value.result.return_value = detail

        with patch.object(SovereigntyHubReagent.objects, "bulk_create", side_effect=RuntimeError("db")):
            with self.assertRaises(RuntimeError):
                corp_sovereignty_hub_detail_update(
                    self.corp1.corporation_id, 1)

        self.assertTrue(
            SovereigntyHubReagent.objects.filter(pk=old.pk).exists())
