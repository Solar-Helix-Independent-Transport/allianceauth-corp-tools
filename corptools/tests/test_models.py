# Standard Library
import datetime
from unittest.mock import patch

# Third Party
from eve_sde import models as sde_models

# Django
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone

# AA Example App
from corptools.models.audits import CharacterAudit, CorporationAudit, EveLocation
from corptools.models.eve_models import EveName
from corptools.models.interactions import (
    CharacterContact,
    CharacterContactLabel,
    CharacterTitle,
    LoyaltyPoint,
)
from corptools.models.skills import Skill, SkillList, SkillTotalHistory, valid_skills

from . import CorptoolsTestCase

# ---------------------------------------------------------------------------
# skills.py
# ---------------------------------------------------------------------------


class TestSkillTotalHistorySp(TestCase):
    def test_sp_sums_total_and_unallocated(self):
        entry = SkillTotalHistory(total_sp=1_000_000, unallocated_sp=50_000)
        self.assertEqual(entry.sp, 1_050_000)

    def test_sp_with_zero_unallocated(self):
        entry = SkillTotalHistory(total_sp=500_000, unallocated_sp=0)
        self.assertEqual(entry.sp, 500_000)


class TestSkillAlphaProperty(TestCase):
    def test_alpha_false_when_trained_equals_active(self):
        skill = Skill(active_skill_level=4, trained_skill_level=4)
        self.assertFalse(skill.alpha)

    def test_alpha_true_when_trained_exceeds_active(self):
        skill = Skill(active_skill_level=3, trained_skill_level=5)
        self.assertTrue(skill.alpha)


class TestSkillListGetSkills(TestCase):
    def test_get_skills_parses_json(self):
        sl = SkillList(
            skill_list='{"Afterburner": 4, "Propulsion Jamming": 3}')
        self.assertEqual(sl.get_skills(), {
                         "Afterburner": 4, "Propulsion Jamming": 3})

    def test_get_skills_empty_object(self):
        sl = SkillList(skill_list='{}')
        self.assertEqual(sl.get_skills(), {})


class TestSkillListStr(CorptoolsTestCase):
    def test_str_contains_name_and_weight(self):
        sl = SkillList.objects.create(
            name="Test List", skill_list='{}', order_weight=5)
        result = str(sl)
        self.assertIn("Test List", result)
        self.assertIn("5", result)


class TestValidSkillsValidator(TestCase):
    def test_invalid_json_raises(self):
        with self.assertRaises(ValidationError):
            valid_skills("not valid json")

    def test_level_above_five_raises(self):
        group = sde_models.ItemGroup.objects.create(id=99, name="TestGroup")
        sde_models.ItemType.objects.create(
            id=99, name="Afterburner", published=True, group=group)
        with self.assertRaises(ValidationError):
            valid_skills('{"Afterburner": 6}')

    def test_negative_level_raises(self):
        group = sde_models.ItemGroup.objects.create(id=98, name="TestGroup2")
        sde_models.ItemType.objects.create(
            id=98, name="Navigation", published=True, group=group)
        with self.assertRaises(ValidationError):
            valid_skills('{"Navigation": -1}')

    def test_unknown_skill_name_raises(self):
        with self.assertRaises(ValidationError):
            valid_skills('{"DoesNotExistSkill": 4}')


# ---------------------------------------------------------------------------
# eve_models.py
# ---------------------------------------------------------------------------

class TestEveNameStr(TestCase):
    def test_str_returns_name(self):
        name = EveName(eve_id=123, name="Test Character",
                       category=EveName.CHARACTER)
        self.assertEqual(str(name), "Test Character")


class TestEveNameGetImageUrl(TestCase):
    def test_character_returns_portrait_url(self):
        name = EveName(eve_id=1, name="Pilot", category=EveName.CHARACTER)
        with patch("corptools.models.eve_models.eveimageserver.character_portrait_url", return_value="portrait") as mock:
            result = name.get_image_url()
        mock.assert_called_once_with(1)
        self.assertEqual(result, "portrait")

    def test_corporation_returns_logo_url(self):
        name = EveName(eve_id=2, name="Corp", category=EveName.CORPORATION)
        with patch("corptools.models.eve_models.eveimageserver.corporation_logo_url", return_value="corp_logo") as mock:
            result = name.get_image_url()
        mock.assert_called_once_with(2)
        self.assertEqual(result, "corp_logo")

    def test_alliance_returns_alliance_logo_url(self):
        name = EveName(eve_id=3, name="Alliance", category=EveName.ALLIANCE)
        with patch("corptools.models.eve_models.eveimageserver.alliance_logo_url", return_value="alli_logo") as mock:
            result = name.get_image_url()
        mock.assert_called_once_with(3)
        self.assertEqual(result, "alli_logo")

    def test_faction_returns_corporation_logo_url(self):
        name = EveName(eve_id=4, name="Faction", category="faction")
        with patch("corptools.models.eve_models.eveimageserver.corporation_logo_url", return_value="faction_logo") as mock:
            result = name.get_image_url()
        mock.assert_called_once_with(4)
        self.assertEqual(result, "faction_logo")


class TestEveNameNeedsUpdate(TestCase):
    def test_fresh_name_does_not_need_update(self):
        name = EveName.objects.create(
            eve_id=1, name="Fresh", category=EveName.CHARACTER)
        self.assertFalse(name.needs_update())

    def test_stale_name_needs_update(self):
        EveName.objects.create(eve_id=2, name="Stale",
                               category=EveName.CHARACTER)
        stale_time = timezone.now() - datetime.timedelta(days=31)
        EveName.objects.filter(pk=2).update(last_update=stale_time)
        name = EveName.objects.get(pk=2)
        self.assertTrue(name.needs_update())

    def test_twenty_nine_days_ago_does_not_need_update(self):
        EveName.objects.create(eve_id=3, name="Recent",
                               category=EveName.CHARACTER)
        recent = timezone.now() - datetime.timedelta(days=29)
        EveName.objects.filter(pk=3).update(last_update=recent)
        name = EveName.objects.get(pk=3)
        self.assertFalse(name.needs_update())


# ---------------------------------------------------------------------------
# interactions.py
# ---------------------------------------------------------------------------

class TestCharacterContactLabelBuildId(TestCase):
    def test_build_id_concatenates_character_and_label(self):
        label = CharacterContactLabel(character_id=123, label_id=456)
        result = label.build_id()
        self.assertEqual(result, 123456)
        self.assertEqual(label.id, 123456)

    def test_build_id_returns_integer(self):
        label = CharacterContactLabel(character_id=1, label_id=1)
        self.assertIsInstance(label.build_id(), int)


class TestCharacterContactBuildId(TestCase):
    def test_build_id_concatenates_character_and_contact(self):
        contact = CharacterContact(character_id=100, contact_id=200)
        result = contact.build_id()
        self.assertEqual(result, 100200)
        self.assertEqual(contact.id, 100200)


class TestCharacterTitleStr(TestCase):
    def test_str_includes_corp_name_and_title(self):
        title = CharacterTitle(
            title_id=1, title="CEO", corporation_id=123, corporation_name="Test Corp"
        )
        result = str(title)
        self.assertIn("Test Corp", result)
        self.assertIn("CEO", result)


class TestLoyaltyPointStr(CorptoolsTestCase):
    def test_str_includes_character_and_corp_name(self):
        corp_name = EveName.objects.create(
            eve_id=99999, name="NPC Corp", category=EveName.CORPORATION
        )
        lp = LoyaltyPoint.objects.create(
            character=self.ca1, corporation=corp_name, amount=500
        )
        result = str(lp)
        self.assertIn("NPC Corp", result)


# ---------------------------------------------------------------------------
# audits.py — extending coverage beyond test_audits.py
# ---------------------------------------------------------------------------

class TestCharacterAuditStr(CorptoolsTestCase):
    def test_str_contains_character_name(self):
        result = str(self.ca1)
        self.assertIn("character.name1", result)


class TestCorporationAuditStr(CorptoolsTestCase):
    def test_str_contains_corporation_name(self):
        result = str(self.cp1)
        self.assertIn("corporation.name1", result)


class TestCorporationAuditGetUpdateTime(CorptoolsTestCase):
    def test_missing_key_returns_none(self):
        self.assertIsNone(self.cp1.get_update_time("nonexistent"))

    def test_existing_key_returns_datetime(self):
        now_iso = timezone.now().isoformat()
        self.cp1.update_timestamps = {"structures": now_iso}
        self.cp1.save()
        result = self.cp1.get_update_time("structures")
        self.assertIsInstance(result, datetime.datetime)


class TestEveLocationStr(TestCase):
    def test_str_returns_location_name(self):
        loc = EveLocation(location_id=60_000_000,
                          location_name="Jita IV - Moon 4")
        self.assertEqual(str(loc), "Jita IV - Moon 4")
