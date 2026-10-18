"""
Helpers that used to run a query (or a save) per row now batch them. These
pin that the results are the same - and, where it was a bug, better.
"""
# Standard Library
import json
import math
from unittest.mock import MagicMock, patch

# Third Party
from eve_sde import models as sde_models

# Django
from django.utils import timezone

# AA Example App
from corptools import models as ct_models
from corptools.task_helpers.char_tasks import (
    update_character_assets_names,
    update_character_industry_jobs,
    update_character_loyaltypoints,
)
from corptools.task_helpers.skill_helpers import SkillListCache
from corptools.tasks.corporation.assets import corp_update_asset_names
from corptools.tasks.corporation.characters import (
    update_character_logins_from_corp,
)
from corptools.tasks.corporation.indy import corp_update_industry_jobs

from . import CorptoolsTestCase

CHAR_TASKS = "corptools.task_helpers.char_tasks"


def _job(job_id, status, completed=None, successful_runs=None):
    now = timezone.now()
    return MagicMock(
        activity_id=1, blueprint_id=1, blueprint_location_id=1,
        blueprint_type_id=1000, completed_character_id=None,
        completed_date=completed, cost=10, duration=60, end_date=now,
        facility_id=1, installer_id=1, job_id=job_id, licensed_runs=1,
        location_id=1, output_location_id=1, pause_date=None, probability=None,
        product_type_id=2000, runs=1, start_date=now, station_id=1,
        status=status, successful_runs=successful_runs,
    )


class TestIndustryJobsBulkUpdate(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        sde_models.ItemType.objects.create(
            id=1000, name="Rifter Blueprint", published=True)
        sde_models.ItemType.objects.create(
            id=2000, name="Rifter", published=True)

    @patch(f"{CHAR_TASKS}.get_token")
    @patch(f"{CHAR_TASKS}.providers")
    def test_character_jobs_are_created_then_updated_in_place(self, mock_providers, mock_get_token):
        mock_get_token.return_value = MagicMock()
        op = mock_providers.esi_openapi.client.Industry.GetCharactersCharacterIdIndustryJobs

        op.return_value.result.return_value = [
            _job(1, "active"), _job(2, "active")]
        update_character_industry_jobs(self.char1.character_id)

        done = timezone.now()
        op.return_value.result.return_value = [
            _job(1, "delivered", completed=done, successful_runs=1),
            _job(3, "active"),
        ]
        update_character_industry_jobs(self.char1.character_id)

        jobs = ct_models.CharacterIndustryJob.objects.filter(
            character=self.ca1)
        self.assertEqual(
            dict(jobs.values_list("job_id", "status")),
            {1: "delivered", 2: "active", 3: "active"})
        job1 = jobs.get(job_id=1)
        self.assertEqual(job1.completed_date, done)
        self.assertEqual(job1.successful_runs, 1)

    @patch("corptools.tasks.corporation.indy.get_corp_token")
    @patch("corptools.tasks.corporation.indy.providers")
    def test_corp_jobs_are_created_then_updated_in_place(self, mock_providers, mock_get_corp_token):
        mock_get_corp_token.return_value = MagicMock()
        op = mock_providers.esi_openapi.client.Industry.GetCorporationsCorporationIdIndustryJobs

        op.return_value.results.return_value = [_job(1, "active")]
        corp_update_industry_jobs(self.corp1.corporation_id)
        op.return_value.results.return_value = [
            _job(1, "delivered", successful_runs=5)]
        corp_update_industry_jobs(self.corp1.corporation_id)

        job = ct_models.CorporationIndustryJob.objects.get(
            corporation=self.cp1)
        self.assertEqual((job.status, job.successful_runs), ("delivered", 5))


class TestAssetNamesBulkUpdate(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        category = sde_models.ItemCategory.objects.create(
            id=6, name="Ship", published=True)
        group = sde_models.ItemGroup.objects.create(
            id=25, name="Frigate", category=category)
        self.rifter = sde_models.ItemType.objects.create(
            id=587, name="Rifter", published=True, group=group)

    def _names(self, mock_providers, op_name):
        names = []
        for item_id, name in ((1, "Fast Boat"), (2, "Slow Boat")):
            n = MagicMock(item_id=item_id)
            n.name = name
            names.append(n)
        op = getattr(mock_providers.esi_openapi.client.Assets, op_name)
        op.return_value.result.return_value = names
        op.return_value.results.return_value = names

    @patch(f"{CHAR_TASKS}.get_token")
    @patch(f"{CHAR_TASKS}.providers")
    def test_character_asset_names(self, mock_providers, mock_get_token):
        mock_get_token.return_value = MagicMock()
        for item_id in (1, 2, 3):
            ct_models.CharacterAsset.objects.create(
                character=self.ca1, singleton=True, item_id=item_id,
                location_flag="Hangar", location_id=60003760, location_type="station",
                quantity=1, type_id=587, type_name=self.rifter)
        self._names(mock_providers, "PostCharactersCharacterIdAssetsNames")

        update_character_assets_names(self.char1.character_id)

        self.assertEqual(
            dict(ct_models.CharacterAsset.objects.values_list("item_id", "name")),
            {1: "Fast Boat", 2: "Slow Boat", 3: None})

    @patch("corptools.tasks.corporation.assets.get_corp_token")
    @patch("corptools.tasks.corporation.assets.providers")
    def test_corp_asset_names(self, mock_providers, mock_get_corp_token):
        mock_get_corp_token.return_value = MagicMock()
        for item_id in (1, 2, 3):
            ct_models.CorpAsset.objects.create(
                corporation=self.cp1, singleton=True, item_id=item_id,
                location_flag="Hangar", location_id=60003760, location_type="station",
                quantity=1, type_id=587, type_name=self.rifter)
        self._names(mock_providers, "PostCorporationsCorporationIdAssetsNames")

        corp_update_asset_names(self.corp1.corporation_id)

        self.assertEqual(
            dict(ct_models.CorpAsset.objects.values_list("item_id", "name")),
            {1: "Fast Boat", 2: "Slow Boat", 3: None})


class TestLoyaltyPointsBulk(CorptoolsTestCase):

    @patch(f"{CHAR_TASKS}.EveName.objects.create_bulk_from_esi")
    @patch(f"{CHAR_TASKS}.get_token")
    @patch(f"{CHAR_TASKS}.providers")
    def test_creates_updates_and_only_resolves_unknown_corps(
        self, mock_providers, mock_get_token, mock_bulk_names
    ):
        mock_get_token.return_value = MagicMock()
        ct_models.EveName.objects.create(
            eve_id=1000035, name="Caldari Navy", category="corporation")
        ct_models.LoyaltyPoint.objects.create(
            character=self.ca1, corporation_id=1000035, amount=10)

        def create_names(ids):
            for i in ids:
                ct_models.EveName.objects.create(
                    eve_id=i, name=f"corp {i}", category="corporation")
            return True
        mock_bulk_names.side_effect = create_names
        mock_providers.esi_openapi.client.Loyalty.GetCharactersCharacterIdLoyaltyPoints.return_value.results.return_value = [
            MagicMock(corporation_id=1000035, loyalty_points=500),
            MagicMock(corporation_id=1000125, loyalty_points=20),
        ]

        update_character_loyaltypoints(self.char1.character_id)

        mock_bulk_names.assert_called_once_with([1000125])
        self.assertEqual(
            dict(ct_models.LoyaltyPoint.objects.filter(character=self.ca1)
                 .values_list("corporation_id", "amount")),
            {1000035: 500, 1000125: 20})


class TestCorpLoginsBulk(CorptoolsTestCase):

    @patch("corptools.tasks.corporation.characters.get_corp_token")
    @patch("corptools.tasks.corporation.characters.providers")
    def test_updates_tracked_members_and_ignores_unknown(self, mock_providers, mock_get_corp_token):
        mock_get_corp_token.return_value = MagicMock()
        logon = timezone.now()
        mock_providers.esi_openapi.client.Corporation.GetCorporationsCorporationIdMembertracking.return_value.results.return_value = [
            MagicMock(character_id=self.char1.character_id,
                      logon_date=logon, logoff_date=logon),
            MagicMock(character_id=self.char2.character_id,
                      logon_date=logon, logoff_date=None),
            MagicMock(character_id=99999999,
                      logon_date=logon, logoff_date=None),
        ]

        update_character_logins_from_corp(self.corp1.corporation_id)

        for ca in (self.ca1, self.ca2):
            ca.refresh_from_db()
            self.assertEqual(ca.last_known_login, logon)
            self.assertIn("login", ca.update_timestamps)


class TestDoctrineSkillPoints(CorptoolsTestCase):

    def test_unknown_skill_does_not_drop_the_rest_of_the_doctrine(self):
        # The SP lookup used to sit in one try around the whole doctrine, so
        # the first skill missing from the SDE silently zeroed every skill
        # listed after it.
        group = sde_models.ItemGroup.objects.create(id=255, name="Gunnery")
        gunnery = sde_models.ItemType.objects.create(
            id=3300, name="Gunnery", published=True, group=group)
        time_constant = sde_models.DogmaAttribute.objects.create(
            id=275, name="skillTimeConstant")
        sde_models.TypeDogma.objects.create(
            item_type=gunnery, dogma_attribute=time_constant, value=1.0)
        ct_models.Skill.objects.create(
            character=self.ca1, skill_id=3300, skill_name=gunnery,
            active_skill_level=1, skillpoints_in_skill=250, trained_skill_level=1)
        ct_models.SkillList.objects.create(
            name="Doctrine",
            skill_list=json.dumps({"Not A Real Skill": 1, "Gunnery": 2}))

        result = SkillListCache().check_skill_lists(
            ct_models.SkillList.objects.all(), [self.char1.character_id])

        meta = result[self.char1.character_name]["doctrines"]["Doctrine"]["_meta"]
        self.assertEqual(meta["total_sp"], int(250 * 1.0 * math.sqrt(32)))
