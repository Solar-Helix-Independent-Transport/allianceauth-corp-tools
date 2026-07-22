# flake8: noqa
# Standard Library
from datetime import timedelta
from unittest.mock import patch

# Third Party
from eve_sde import models as sde_models

# Django
from django.contrib.auth.models import Group, User
from django.db.models import F
from django.test import TestCase
from django.utils import timezone

# Alliance Auth
from allianceauth.authentication.models import CharacterOwnership
from allianceauth.eveonline.models import (
    EveAllianceInfo,
    EveCharacter,
    EveCorporationInfo,
)
from allianceauth.tests.auth_utils import AuthUtils

# AA Example App
from corptools import models as ct_models


class TestSecGroupBotFilters(TestCase):
    @classmethod
    def setUpTestData(cls):

        ct_models.CharacterAudit.objects.all().delete()
        EveCharacter.objects.all().delete()
        User.objects.all().delete()
        CharacterOwnership.objects.all().delete()
        ct_models.EveLocation.objects.all().delete()
        ct_models.Skill.objects.all().delete()

        sde_models.Region.objects.all().delete()
        sde_models.Constellation.objects.all().delete()
        sde_models.SolarSystem.objects.all().delete()

        userids = range(1, 11)

        cls.test_group, _ = Group.objects.update_or_create(name="Test_Group")

        users = []
        characters = []
        for uid in userids:
            user = AuthUtils.create_user(f"User_{uid}")
            main_char = AuthUtils.add_main_character_2(user,
                                                       f"Main {uid}",
                                                       uid,
                                                       corp_id=1,
                                                       corp_name='Test Corp 1',
                                                       corp_ticker='TST1')
            CharacterOwnership.objects.create(
                user=user, character=main_char, owner_hash=f"main{uid}")

            characters.append(main_char)
            users.append(user)
        cls.c1t1 = ct_models.CharacterTitle.objects.create(corporation_id=1,
                                                           corporation_name='Test Corp 1',
                                                           title="Test Title1",
                                                           title_id=1)

        cls.c1t2 = ct_models.CharacterTitle.objects.create(corporation_id=1,
                                                           corporation_name='Test Corp 1',
                                                           title="Test Title2",
                                                           title_id=2)

        # add some extra characters to users in 2 corps/alliance
        for uid in range(0, 5):  # test corp 2
            character = EveCharacter.objects.create(character_name=f'Alt {uid}',
                                                    character_id=11 + uid,
                                                    corporation_name='Test Corp 2',
                                                    corporation_id=2,
                                                    corporation_ticker='TST2')
            CharacterOwnership.objects.create(character=character,
                                              user=users[uid],
                                              owner_hash=f'ownalt{11 + uid}')
            characters.append(character)

        cls.c2t1 = ct_models.CharacterTitle.objects.create(corporation_id=2,
                                                           corporation_name='Test Corp 2',
                                                           title="Test Title1",
                                                           title_id=1)

        cls.c2t2 = ct_models.CharacterTitle.objects.create(corporation_id=2,
                                                           corporation_name='Test Corp 2',
                                                           title="Test Title2",
                                                           title_id=2)

        for uid in range(5, 10):  # Test alliance 1
            character = EveCharacter.objects.create(character_name=f'Alt {uid}',
                                                    character_id=11 + uid,
                                                    corporation_name='Test Corp 3',
                                                    corporation_id=3,
                                                    corporation_ticker='TST3',
                                                    alliance_id=1,
                                                    alliance_name="Test Alliance 1",
                                                    alliance_ticker="TSTA1")
            CharacterOwnership.objects.create(character=character,
                                              user=users[uid],
                                              owner_hash=f'ownalt{11+uid}')
            characters.append(character)

        cls.alli = EveAllianceInfo.objects.create(alliance_id=1,
                                                  alliance_name="Test Alliance 1",
                                                  alliance_ticker="TSTA1",
                                                  executor_corp_id=3)

        cls.corp = EveCorporationInfo.objects.create(corporation_id=3,
                                                     corporation_name="Test Corp 3",
                                                     corporation_ticker="TST3",
                                                     member_count=10,
                                                     alliance=cls.alli,)

        # add some systems
        r1 = sde_models.Region.objects.create(
            name="Test region 1",
            description="This region is junk at best, nothing is even in range",
            id=1
        )
        r2 = sde_models.Region.objects.create(
            name="Test region 2",
            description="This region is a flood plain",
            id=2
        )
        r3 = sde_models.Region.objects.create(
            name="Test region 3",
            description="This region is a fortress",
            id=3
        )

        c1 = sde_models.Constellation.objects.create(
            name="Test Constellation 1",
            id=1,
            region=r1
        )
        c2 = sde_models.Constellation.objects.create(
            name="Test Constellation 2",
            id=2,
            region=r2
        )
        c3 = sde_models.Constellation.objects.create(
            name="Test Constellation 3",
            id=3,
            region=r3
        )
        s1 = sde_models.SolarSystem.objects.create(
            name="Test System 1",
            id=1,
            security_status=0.0,
            x=1,
            y=1,
            z=1,
            security_class="g",
            constellation=c1
        )
        s2 = sde_models.SolarSystem.objects.create(
            name="Test System 2",
            id=2,
            security_status=0.0,
            x=1,
            y=1,
            z=1,
            security_class="g",
            constellation=c2
        )
        s3 = sde_models.SolarSystem.objects.create(
            name="Test System 3",
            id=3,
            security_status=0.0,
            x=1,
            y=1,
            z=1,
            security_class="g",
            constellation=c3
        )

        audits = []
        for uid in range(0, 17):  # 4,5,6,7
            audits.append(
                ct_models.CharacterAudit.objects.create(
                    character=characters[uid],
                    update_timestamps={
                        "assets": timezone.now().isoformat(),
                        "clones": timezone.now().isoformat(),
                        "pub_data": timezone.now().isoformat(),
                        "skill_que": timezone.now().isoformat(),
                        "skills": timezone.now().isoformat(),
                        "wallet": timezone.now().isoformat(),
                        "orders": timezone.now().isoformat(),
                        "notif": timezone.now().isoformat(),
                        "roles": timezone.now().isoformat(),
                        "mails": timezone.now().isoformat(),
                    },
                )
            )
        audits.append(ct_models.CharacterAudit.objects.create(
            character=characters[17]))

        skg1 = sde_models.ItemGroup.objects.create(
            id=1,
            name="TestGroup"
        )

        sk1 = sde_models.ItemType.objects.create(
            id=1,
            name="Skill 1",
            published=True,
            group=skg1
        )

        sda1 = sde_models.DogmaAttribute.objects.create(
            id=275,
            name="Skill Level",
            description="The level of the skill",
            published=True
        )

        sde_models.TypeDogma.objects.create(
            dogma_attribute=sda1,
            item_type=sk1,
            value=5.0
        )

        sk2 = sde_models.ItemType.objects.create(
            id=2,
            name="Skill 2",
            published=True,
            group=skg1
        )

        sde_models.TypeDogma.objects.create(
            dogma_attribute=sda1,
            item_type=sk2,
            value=5.0
        )

        sk3 = sde_models.ItemType.objects.create(
            id=3,
            name="Skill 3",
            published=True,
            group=skg1
        )
        sde_models.TypeDogma.objects.create(
            dogma_attribute=sda1,
            item_type=sk3,
            value=5.0
        )

        sk4 = sde_models.ItemType.objects.create(
            id=4,
            name="Skill 4",
            published=True,
            group=skg1
        )
        sde_models.TypeDogma.objects.create(
            dogma_attribute=sda1,
            item_type=sk4,
            value=5.0
        )

        sk5 = sde_models.ItemType.objects.create(
            id=5,
            name="Skill 5",
            published=True,
            group=skg1
        )
        sde_models.TypeDogma.objects.create(
            dogma_attribute=sda1,
            item_type=sk5,
            value=5.0
        )

        skc1 = sde_models.ItemCategory.objects.create(
            id=1,
            name="TestCat"
        )
        skg2 = sde_models.ItemGroup.objects.create(
            id=2,
            name="TestGroup",
            category=skc1
        )
        a1 = sde_models.ItemType.objects.create(
            id=10,
            name="Asset 1",
            published=True,
            group=skg2
        )
        a2 = sde_models.ItemType.objects.create(
            id=11,
            name="Asset 2",
            published=True
        )
        a3 = sde_models.ItemType.objects.create(
            id=12,
            name="Asset 3",
            published=True
        )
        a4 = sde_models.ItemType.objects.create(
            id=13,
            name="Asset 4",
            published=True
        )
        a5 = sde_models.ItemType.objects.create(
            id=14,
            name="Asset 5",
            published=True
        )

        l1 = ct_models.EveLocation.objects.create(
            location_id=1,
            location_name="Test Location 1",
            system=s1
        )
        l2 = ct_models.EveLocation.objects.create(
            location_id=2,
            location_name="Test Location 2",
            system=s2
        )
        l3 = ct_models.EveLocation.objects.create(
            location_id=3,
            location_name="Test Location 3",
            system=s3
        )

        ct_models.CharacterLocation.objects.create(
            character=audits[0],
            current_location=l1,
            current_ship=a1,
            current_ship_name=f"Test Ship {a1.id} {a1.name}"
        )

        ct_models.CharacterLocation.objects.create(
            character=audits[1],
            current_location=l1,
            current_ship=a1,
            current_ship_name=f"Test Ship {a1.id} {a1.name}"
        )

        ct_models.CharacterLocation.objects.create(
            character=audits[2],
            current_location=l2,
            current_ship=a1,
            current_ship_name=f"Test Ship {a1.id} {a1.name}"
        )

        ct_models.CharacterLocation.objects.create(
            character=audits[3],
            current_location=l2,
            current_ship=a2,
            current_ship_name=f"Test Ship {a2.id} {a2.name}"
        )

        ct_models.CharacterLocation.objects.create(
            character=audits[4],
            current_location=l3,
            current_ship=a2,
            current_ship_name=f"Test Ship {a1.id} {a1.name}"
        )

        ct_models.CharacterLocation.objects.create(
            character=audits[5],
            current_location=l3,
            current_ship=a2,
            current_ship_name=f"Test Ship {a1.id} {a1.name}"
        )

        ct_models.CharacterAsset.objects.create(item_id=0,
                                                location_flag="test",
                                                location_id=0,
                                                quantity=1,
                                                singleton=True,
                                                location_type="test",
                                                type_id=10,
                                                type_name=a1,
                                                location_name=l1,
                                                character=audits[0],
                                                blueprint_copy=False)

        ct_models.CharacterAsset.objects.create(item_id=0,
                                                location_flag="test",
                                                location_id=0,
                                                quantity=1,
                                                singleton=True,
                                                location_type="test",
                                                type_id=10,
                                                type_name=a1,
                                                location_name=l1,
                                                character=audits[2],
                                                blueprint_copy=False)

        ct_models.CharacterAsset.objects.create(item_id=0,
                                                location_flag="test",
                                                location_id=0,
                                                quantity=1,
                                                singleton=True,
                                                location_type="test",
                                                type_id=10,
                                                type_name=a1,
                                                location_name=l1,
                                                character=audits[15],
                                                blueprint_copy=False)

        ct_models.CharacterAsset.objects.create(item_id=0,
                                                location_flag="test",
                                                location_id=0,
                                                quantity=1,
                                                singleton=True,
                                                location_type="test",
                                                type_id=10,
                                                type_name=a1,
                                                location_name=l1,
                                                character=audits[17],
                                                blueprint_copy=False)

        ct_models.CharacterAsset.objects.create(item_id=0,
                                                location_flag="test",
                                                location_id=0,
                                                quantity=1,
                                                singleton=True,
                                                location_type="test",
                                                type_id=11,
                                                type_name=a2,
                                                location_name=l1,
                                                character=audits[4],
                                                blueprint_copy=False)

        ct_models.CharacterAsset.objects.create(item_id=0,
                                                location_flag="test",
                                                location_id=0,
                                                quantity=1,
                                                singleton=True,
                                                location_type="test",
                                                type_id=11,
                                                type_name=a2,
                                                location_name=l1,
                                                character=audits[6],
                                                blueprint_copy=False)

        ct_models.CharacterAsset.objects.create(item_id=0,
                                                location_flag="test",
                                                location_id=0,
                                                quantity=1,
                                                singleton=True,
                                                location_type="test",
                                                type_id=11,
                                                type_name=a2,
                                                location_name=l1,
                                                character=audits[15],
                                                blueprint_copy=False)

        ct_models.CharacterAsset.objects.create(item_id=0,
                                                location_flag="test",
                                                location_id=0,
                                                quantity=1,
                                                singleton=True,
                                                location_type="test",
                                                type_id=11,
                                                type_name=a2,
                                                location_name=l1,
                                                character=audits[17],
                                                blueprint_copy=False)

        ct_models.CharacterAsset.objects.create(item_id=0,
                                                location_flag="test",
                                                location_id=0,
                                                quantity=1,
                                                singleton=True,
                                                location_type="test",
                                                type_id=11,
                                                type_name=a2,
                                                location_name=l2,
                                                character=audits[1],
                                                blueprint_copy=False)

        ct_models.CharacterAsset.objects.create(item_id=0,
                                                location_flag="test",
                                                location_id=0,
                                                quantity=1,
                                                singleton=True,
                                                location_type="test",
                                                type_id=11,
                                                type_name=a2,
                                                location_name=l2,
                                                character=audits[3],
                                                blueprint_copy=False)

        ct_models.CharacterAsset.objects.create(item_id=0,
                                                location_flag="test",
                                                location_id=0,
                                                quantity=1,
                                                singleton=True,
                                                location_type="test",
                                                type_id=11,
                                                type_name=a2,
                                                location_name=l2,
                                                character=audits[14],
                                                blueprint_copy=False)

        ct_models.CharacterAsset.objects.create(item_id=0,
                                                location_flag="test",
                                                location_id=0,
                                                quantity=1,
                                                singleton=True,
                                                location_type="test",
                                                type_id=11,
                                                type_name=a2,
                                                location_name=l2,
                                                character=audits[16],
                                                blueprint_copy=False)

        ct_models.SkillList.objects.create(name="Test Skills 1",
                                           skill_list='{"Skill 1":"5"}')
        ct_models.SkillList.objects.create(name="Test Skills 2",
                                           skill_list='{"Skill 2":"1"}')

        for a in audits:
            ct_models.Skill.objects.create(character=a,
                                           skill_id=sk2.id,
                                           skill_name=sk2,
                                           active_skill_level=0,
                                           trained_skill_level=5,
                                           skillpoints_in_skill=500)

        ct_models.Skill.objects.create(character=audits[0],
                                       skill_id=sk1.id,
                                       skill_name=sk1,
                                       active_skill_level=5,
                                       trained_skill_level=5,
                                       skillpoints_in_skill=500)

        ct_models.Skill.objects.create(character=audits[9],
                                       skill_id=sk1.id,
                                       skill_name=sk1,
                                       active_skill_level=5,
                                       trained_skill_level=5,
                                       skillpoints_in_skill=500)

        u1 = ct_models.CharacterRoles.objects.create(
            character=audits[0], director=True, personnel_manager=True)

        ct_models.CharacterRoles.objects.create(
            character=audits[16], director=True, personnel_manager=True)

        u1.titles.add(cls.c1t1)

        u15 = ct_models.CharacterRoles.objects.create(
            character=audits[15], personnel_manager=True)
        u15.titles.add(cls.c2t1)

        u16 = ct_models.CharacterRoles.objects.create(
            character=audits[17], personnel_manager=True)
        u16.titles.add(cls.c2t1)

        ct_models.Skill.objects.filter(
            character=audits[0]).update(active_skill_level=5)
        en = ct_models.EveName.objects.create(
            eve_id=12345678,
            name="blah"
        )
        en2 = ct_models.EveName.objects.create(
            eve_id=12345679,
            name="blah2"
        )
        for i in range(0, 4):
            ct_models.CorporationHistory.objects.create(
                character=audits[i],
                corporation_id=1,
                corporation_name=en,
                record_id=2,
                start_date=timezone.now() - timedelta(days=30)
            )
        for i in range(5, 7):
            ct_models.CorporationHistory.objects.create(
                character=audits[i],
                corporation_id=1,
                corporation_name=en,
                record_id=2,
                start_date=timezone.now() - timedelta(days=14)
            )
        for i in range(7, 9):
            ct_models.CorporationHistory.objects.create(
                character=audits[i],
                corporation_id=2,
                corporation_name=en2,
                record_id=2,
                start_date=timezone.now() - timedelta(days=14)
            )
        for i in range(0, 4):
            ct_models.CorporationHistory.objects.create(
                character=audits[i],
                corporation_id=2,
                corporation_name=en2,
                record_id=1,
                start_date=timezone.now() - timedelta(days=60)
            )
        for i in range(5, 9):
            ct_models.CorporationHistory.objects.create(
                character=audits[i],
                corporation_id=2,
                corporation_name=en2,
                record_id=1,
                start_date=timezone.now() - timedelta(days=30)
            )

    def test_user_loaded_fully(self):
        _filter = ct_models.FullyLoadedFilter.objects.create(name="Fully Loaded Test",
                                                             description="Something to tell user")
        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertTrue(tests[2])
        self.assertTrue(tests[3])
        self.assertTrue(tests[4])
        self.assertTrue(tests[5])
        self.assertTrue(tests[6])
        self.assertTrue(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])
        self.assertFalse(tests[10])

        tests = {}
        tests = _filter.audit_filter(
            User.objects.filter(id__in=list(users.keys())))

        self.assertTrue(tests[1]["check"])
        self.assertTrue(tests[2]["check"])
        self.assertTrue(tests[3]["check"])
        self.assertTrue(tests[4]["check"])
        self.assertTrue(tests[5]["check"])
        self.assertTrue(tests[6]["check"])
        self.assertTrue(tests[7]["check"])
        self.assertFalse(tests[8]["check"])
        self.assertFalse(tests[9]["check"])
        self.assertFalse(tests[10]["check"])

    def test_user_loaded_fully_reverse(self):
        _filter = ct_models.FullyLoadedFilter.objects.create(name="Fully Loaded Test",
                                                             description="Something to tell user",
                                                             reversed_logic=True)
        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertFalse(tests[2])
        self.assertFalse(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertFalse(tests[6])
        self.assertFalse(tests[7])
        self.assertTrue(tests[8])
        self.assertTrue(tests[9])
        self.assertTrue(tests[10])

        tests = {}
        tests = _filter.audit_filter(
            User.objects.filter(id__in=list(users.keys())))

        self.assertFalse(tests[1]["check"])
        self.assertFalse(tests[2]["check"])
        self.assertFalse(tests[3]["check"])
        self.assertFalse(tests[4]["check"])
        self.assertFalse(tests[5]["check"])
        self.assertFalse(tests[6]["check"])
        self.assertFalse(tests[7]["check"])
        self.assertTrue(tests[8]["check"])
        self.assertTrue(tests[9]["check"])
        self.assertTrue(tests[10]["check"])

    def test_update_section_single_section(self):
        _filter = ct_models.UpdateSectionFilter.objects.create(
            name="Skills Loaded",
            description="Something to tell user",
            sections=["skills"],
        )
        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k in users:
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        # Same split as FullyLoadedFilter: users 8/9/10 have an alt that's
        # either missing the timestamp entirely or has no audit at all.
        self.assertTrue(tests[1])
        self.assertTrue(tests[2])
        self.assertTrue(tests[3])
        self.assertTrue(tests[4])
        self.assertTrue(tests[5])
        self.assertTrue(tests[6])
        self.assertTrue(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])
        self.assertFalse(tests[10])

        tests = _filter.audit_filter(User.objects.filter(id__in=list(users)))
        self.assertTrue(tests[1]["check"])
        self.assertFalse(tests[8]["check"])
        self.assertFalse(tests[9]["check"])
        self.assertFalse(tests[10]["check"])

    def test_update_section_single_section_reverse(self):
        _filter = ct_models.UpdateSectionFilter.objects.create(
            name="Skills Loaded",
            description="Something to tell user",
            sections=["skills"],
            reversed_logic=True,
        )
        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k in users:
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertFalse(tests[7])
        self.assertTrue(tests[8])
        self.assertTrue(tests[9])
        self.assertTrue(tests[10])

    def test_update_section_empty_sections_is_noop(self):
        _filter = ct_models.UpdateSectionFilter.objects.create(
            name="No Sections Picked",
            description="Something to tell user",
            sections=[],
        )
        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k in users:
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        # User 8's alt still has an audit row (just empty timestamps), so an
        # empty section list is a no-op pass for them. Users 9/10's alts
        # have no audit row at all, which still fails regardless of sections.
        self.assertTrue(tests[1])
        self.assertTrue(tests[8])
        self.assertFalse(tests[9])
        self.assertFalse(tests[10])

    def test_update_section_requires_all_selected_sections(self):
        user1 = User.objects.get(id=1)
        main_audit = ct_models.CharacterAudit.objects.get(
            character=user1.profile.main_character)
        main_audit.update_timestamps["clones"] = (
            timezone.now() - timedelta(days=99)).isoformat()
        main_audit.save()

        single_section = ct_models.UpdateSectionFilter.objects.create(
            name="Assets Only",
            description="Something to tell user",
            sections=["assets"],
        )
        self.assertTrue(single_section.process_filter(user1))

        both_sections = ct_models.UpdateSectionFilter.objects.create(
            name="Assets and Clones",
            description="Something to tell user",
            sections=["assets", "clones"],
        )
        self.assertFalse(both_sections.process_filter(user1))

    def test_update_section_ignores_active_ignore_flags(self):
        user = AuthUtils.create_user("IgnoreFlagUser")
        main_char = AuthUtils.add_main_character_2(
            user, "Ignore Flag Main", 9001, corp_id=1,
            corp_name='Test Corp 1', corp_ticker='TST1')
        CharacterOwnership.objects.create(
            user=user, character=main_char, owner_hash="ignoreflagmain")
        ct_models.CharacterAudit.objects.create(
            character=main_char,
            update_timestamps={
                "assets": timezone.now().isoformat(),
                "clones": timezone.now().isoformat(),
                "pub_data": timezone.now().isoformat(),
                "wallet": timezone.now().isoformat(),
                "orders": timezone.now().isoformat(),
                "notif": timezone.now().isoformat(),
                "roles": timezone.now().isoformat(),
                # Deliberately stale - this is the section under test.
                "skills": (timezone.now() - timedelta(days=30)).isoformat(),
                "skill_que": (timezone.now() - timedelta(days=30)).isoformat(),
            },
        )

        fully_loaded = ct_models.FullyLoadedFilter.objects.create(
            name="Fully Loaded", description="test")
        section_filter = ct_models.UpdateSectionFilter.objects.create(
            name="Skills Section", description="test", sections=["skills"])

        # By default (CT_CHAR_ACTIVE_IGNORE_SKILLS_MODULE=False) both see the
        # stale skills timestamp and fail.
        self.assertFalse(fully_loaded.process_filter(user))
        self.assertFalse(section_filter.process_filter(user))

        # With the ignore-flag on, is_active()/FullyLoadedFilter stop caring
        # about skills entirely - but UpdateSectionFilter checks the raw
        # timestamp directly and isn't affected by the flag.
        with patch("corptools.app_settings.CT_CHAR_ACTIVE_IGNORE_SKILLS_MODULE", True):
            self.assertTrue(fully_loaded.process_filter(user))
            self.assertFalse(section_filter.process_filter(user))

    def test_user_assets_no_loc(self):
        _filter = ct_models.AssetsFilter.objects.create(name="Assets Test",
                                                        description="Something to tell user")
        _filter.types.add(sde_models.ItemType.objects.get(id=10))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertFalse(tests[2])
        self.assertTrue(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertTrue(tests[6])
        self.assertFalse(tests[7])
        self.assertTrue(tests[8])
        self.assertFalse(tests[9])
        self.assertFalse(tests[10])

    def test_user_assets_no_loc_reverse(self):
        _filter = ct_models.AssetsFilter.objects.create(
            name="Assets Test",
            description="Something to tell user",
            reversed_logic=True
        )
        _filter.types.add(sde_models.ItemType.objects.get(id=10))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertTrue(tests[2])
        self.assertFalse(tests[3])
        self.assertTrue(tests[4])
        self.assertTrue(tests[5])
        self.assertFalse(tests[6])
        self.assertTrue(tests[7])
        self.assertFalse(tests[8])
        self.assertTrue(tests[9])
        self.assertTrue(tests[10])

    def test_user_assets_location_flag(self):
        a1 = sde_models.ItemType.objects.get(id=10)
        l1 = ct_models.EveLocation.objects.get(location_id=1)
        user2_audit = ct_models.CharacterAudit.objects.get(
            character=User.objects.get(id=2).profile.main_character)

        ct_models.CharacterAsset.objects.create(
            item_id=99999,
            location_flag="AutoFit",
            location_id=0,
            quantity=1,
            singleton=True,
            location_type="test",
            type_id=10,
            type_name=a1,
            location_name=l1,
            character=user2_audit,
            blueprint_copy=False,
        )

        _filter = ct_models.AssetsFilter.objects.create(
            name="Deployed Assets",
            description="Something to tell user",
            location_flags=["AutoFit"],
        )
        _filter.types.add(a1)

        # Only User 2's new AutoFit asset matches. The fixture's existing
        # assets for users 1/3/6/8 (see test_user_assets_no_loc) are
        # flagged "test" and are correctly excluded by location_flags.
        self.assertTrue(_filter.process_filter(User.objects.get(id=2)))
        self.assertFalse(_filter.process_filter(User.objects.get(id=1)))
        self.assertFalse(_filter.process_filter(User.objects.get(id=3)))
        self.assertFalse(_filter.process_filter(User.objects.get(id=6)))
        self.assertFalse(_filter.process_filter(User.objects.get(id=8)))

    def test_user_assets_no_loc_cat(self):
        _filter = ct_models.AssetsFilter.objects.create(name="Assets Test",
                                                        description="Something to tell user")
        _filter.categories.add(sde_models.ItemCategory.objects.get(id=1))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertFalse(tests[2])
        self.assertTrue(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertTrue(tests[6])
        self.assertFalse(tests[7])
        self.assertTrue(tests[8])
        self.assertFalse(tests[9])
        self.assertFalse(tests[10])

    def test_user_assets_no_loc_cat_reverse(self):
        _filter = ct_models.AssetsFilter.objects.create(
            name="Assets Test",
            description="Something to tell user",
            reversed_logic=True
        )
        _filter.categories.add(sde_models.ItemCategory.objects.get(id=1))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertTrue(tests[2])
        self.assertFalse(tests[3])
        self.assertTrue(tests[4])
        self.assertTrue(tests[5])
        self.assertFalse(tests[6])
        self.assertTrue(tests[7])
        self.assertFalse(tests[8])
        self.assertTrue(tests[9])
        self.assertTrue(tests[10])

    def test_user_assets_no_loc_grp(self):
        _filter = ct_models.AssetsFilter.objects.create(name="Assets Test",
                                                        description="Something to tell user")
        _filter.groups.add(sde_models.ItemGroup.objects.get(id=2))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertFalse(tests[2])
        self.assertTrue(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertTrue(tests[6])
        self.assertFalse(tests[7])
        self.assertTrue(tests[8])
        self.assertFalse(tests[9])
        self.assertFalse(tests[10])

    def test_user_assets_no_loc_grp_reverse(self):
        _filter = ct_models.AssetsFilter.objects.create(
            name="Assets Test",
            description="Something to tell user",
            reversed_logic=True
        )
        _filter.groups.add(sde_models.ItemGroup.objects.get(id=2))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertTrue(tests[2])
        self.assertFalse(tests[3])
        self.assertTrue(tests[4])
        self.assertTrue(tests[5])
        self.assertFalse(tests[6])
        self.assertTrue(tests[7])
        self.assertFalse(tests[8])
        self.assertTrue(tests[9])
        self.assertTrue(tests[10])

    def test_user_assets_loc(self):
        _filter = ct_models.AssetsFilter.objects.create(name="Assets Test",
                                                        description="Something to tell user")
        _filter.types.add(sde_models.ItemType.objects.get(id=11))
        _filter.systems.add(
            sde_models.SolarSystem.objects.get(name="Test System 1"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertFalse(tests[2])
        self.assertFalse(tests[3])
        self.assertFalse(tests[4])
        self.assertTrue(tests[5])
        self.assertTrue(tests[6])
        self.assertTrue(tests[7])
        self.assertTrue(tests[8])
        self.assertFalse(tests[9])
        self.assertFalse(tests[10])

    def test_user_assets_loc_reverse(self):
        _filter = ct_models.AssetsFilter.objects.create(
            name="Assets Test",
            description="Something to tell user",
            reversed_logic=True
        )
        _filter.types.add(sde_models.ItemType.objects.get(id=11))
        _filter.systems.add(
            sde_models.SolarSystem.objects.get(name="Test System 1"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertTrue(tests[2])
        self.assertTrue(tests[3])
        self.assertTrue(tests[4])
        self.assertFalse(tests[5])
        self.assertFalse(tests[6])
        self.assertFalse(tests[7])
        self.assertFalse(tests[8])
        self.assertTrue(tests[9])
        self.assertTrue(tests[10])

    def test_user_assets_loc_con(self):
        _filter = ct_models.AssetsFilter.objects.create(name="Assets Test",
                                                        description="Something to tell user")
        _filter.types.add(sde_models.ItemType.objects.get(id=11))
        _filter.constellations.add(
            sde_models.Constellation.objects.get(name="Test Constellation 1"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertFalse(tests[2])
        self.assertFalse(tests[3])
        self.assertFalse(tests[4])
        self.assertTrue(tests[5])
        self.assertTrue(tests[6])
        self.assertTrue(tests[7])
        self.assertTrue(tests[8])
        self.assertFalse(tests[9])
        self.assertFalse(tests[10])

    def test_user_assets_loc_con_reverse(self):
        _filter = ct_models.AssetsFilter.objects.create(
            name="Assets Test",
            description="Something to tell user",
            reversed_logic=True
        )
        _filter.types.add(sde_models.ItemType.objects.get(id=11))
        _filter.constellations.add(
            sde_models.Constellation.objects.get(name="Test Constellation 1"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertTrue(tests[2])
        self.assertTrue(tests[3])
        self.assertTrue(tests[4])
        self.assertFalse(tests[5])
        self.assertFalse(tests[6])
        self.assertFalse(tests[7])
        self.assertFalse(tests[8])
        self.assertTrue(tests[9])
        self.assertTrue(tests[10])

    def test_user_assets_loc_reg(self):
        _filter = ct_models.AssetsFilter.objects.create(name="Assets Test",
                                                        description="Something to tell user")
        _filter.types.add(sde_models.ItemType.objects.get(id=11))
        _filter.regions.add(
            sde_models.Region.objects.get(name="Test region 1"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertFalse(tests[2])
        self.assertFalse(tests[3])
        self.assertFalse(tests[4])
        self.assertTrue(tests[5])
        self.assertTrue(tests[6])
        self.assertTrue(tests[7])
        self.assertTrue(tests[8])
        self.assertFalse(tests[9])
        self.assertFalse(tests[10])

    def test_user_assets_loc_reg_reverse(self):
        _filter = ct_models.AssetsFilter.objects.create(
            name="Assets Test",
            description="Something to tell user",
            reversed_logic=True
        )
        _filter.types.add(sde_models.ItemType.objects.get(id=11))
        _filter.regions.add(
            sde_models.Region.objects.get(name="Test region 1"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertTrue(tests[2])
        self.assertTrue(tests[3])
        self.assertTrue(tests[4])
        self.assertFalse(tests[5])
        self.assertFalse(tests[6])
        self.assertFalse(tests[7])
        self.assertFalse(tests[8])
        self.assertTrue(tests[9])
        self.assertTrue(tests[10])

    def test_user_assets_loc_2(self):
        _filter = ct_models.AssetsFilter.objects.create(name="Assets Test",
                                                        description="Something to tell user")
        _filter.types.add(sde_models.ItemType.objects.get(id=11))
        _filter.systems.add(
            sde_models.SolarSystem.objects.get(name="Test System 2"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertTrue(tests[2])
        self.assertFalse(tests[3])
        self.assertTrue(tests[4])
        self.assertTrue(tests[5])
        self.assertFalse(tests[6])
        self.assertTrue(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])

    def test_user_assets_loc_2_reverse(self):
        _filter = ct_models.AssetsFilter.objects.create(
            name="Assets Test",
            description="Something to tell user",
            reversed_logic=True
        )
        _filter.types.add(sde_models.ItemType.objects.get(id=11))
        _filter.systems.add(
            sde_models.SolarSystem.objects.get(name="Test System 2"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertFalse(tests[2])
        self.assertTrue(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertTrue(tests[6])
        self.assertFalse(tests[7])
        self.assertTrue(tests[8])
        self.assertTrue(tests[9])

    def test_user_skill_lists_alpha(self):
        _filter = ct_models.Skillfilter.objects.create(name="Skills Test",
                                                       description="Something to tell user")
        _filter.required_skill_lists.add(
            ct_models.SkillList.objects.get(name="Test Skills 2"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertFalse(tests[2])
        self.assertFalse(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertFalse(tests[6])
        self.assertFalse(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])
        self.assertFalse(tests[10])

    def test_user_skill_lists_req_one(self):
        _filter = ct_models.Skillfilter.objects.create(name="Skills Test",
                                                       description="Something to tell user")
        _filter.single_req_skill_lists.add(
            ct_models.SkillList.objects.get(name="Test Skills 2"))
        _filter.required_skill_lists.add(
            ct_models.SkillList.objects.get(name="Test Skills 1"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertFalse(tests[2])
        self.assertFalse(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertFalse(tests[6])
        self.assertFalse(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])
        self.assertFalse(tests[10])

    def test_user_skill_lists_audit_req_one(self):
        _filter = ct_models.Skillfilter.objects.create(name="Skills Test",
                                                       description="Something to tell user")
        _filter.single_req_skill_lists.add(
            ct_models.SkillList.objects.get(name="Test Skills 2"))
        _filter.required_skill_lists.add(
            ct_models.SkillList.objects.get(name="Test Skills 1"))

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

        # run again and confirm cache
        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

    def test_user_skill_lists_omega(self):
        _filter = ct_models.Skillfilter.objects.create(name="Skills Test",
                                                       description="Something to tell user")
        _filter.required_skill_lists.add(
            ct_models.SkillList.objects.get(name="Test Skills 1"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertFalse(tests[2])
        self.assertFalse(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertFalse(tests[6])
        self.assertFalse(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])
        self.assertTrue(tests[10])

    def test_user_skill_lists_audit_omega(self):
        _filter = ct_models.Skillfilter.objects.create(name="Skills Test",
                                                       description="Something to tell user")
        _filter.required_skill_lists.add(
            ct_models.SkillList.objects.get(name="Test Skills 1"))

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertTrue(tests[10]['check'])

        # run again and confirm cache
        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertTrue(tests[10]['check'])

    def test_user_has_roles_director(self):
        _filter = ct_models.Rolefilter.objects.create(name="roles Test",
                                                      description="Something to tell user")
        _filter.has_director = True

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertTrue(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

        # run again and confirm cache
        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertTrue(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

    def test_user_has_roles_director_main_only(self):
        _filter = ct_models.Rolefilter.objects.create(name="roles Test",
                                                      description="Something to tell user")
        _filter.has_director = True
        _filter.main_only = True

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

        # run again and confirm cache
        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

    def test_user_has_roles_personel(self):
        _filter = ct_models.Rolefilter.objects.create(name="roles Test",
                                                      description="Something to tell user")
        _filter.has_personnel_manager = True

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertTrue(tests[6]['check'])
        self.assertTrue(tests[7]['check'])
        self.assertTrue(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

        # run again and confirm cache
        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertTrue(tests[6]['check'])
        self.assertTrue(tests[7]['check'])
        self.assertTrue(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

    def test_user_has_roles_personel_main_only(self):
        _filter = ct_models.Rolefilter.objects.create(name="roles Test",
                                                      description="Something to tell user")
        _filter.has_personnel_manager = True
        _filter.main_only = True

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

        # run again and confirm cache
        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

    def test_user_has_roles_personel_alli_filtered(self):
        _filter = ct_models.Rolefilter.objects.create(name="roles Test",
                                                      description="Something to tell user",
                                                      )
        _filter.has_personnel_manager = True
        _filter.alliances_filter.add(self.alli)

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertFalse(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertTrue(tests[6]['check'])
        self.assertTrue(tests[7]['check'])
        self.assertTrue(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

        # run again and confirm cache
        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertFalse(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertTrue(tests[6]['check'])
        self.assertTrue(tests[7]['check'])
        self.assertTrue(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

    def test_user_has_roles_personel_corp_filtered(self):
        _filter = ct_models.Rolefilter.objects.create(name="roles Test",
                                                      description="Something to tell user",
                                                      )
        _filter.has_personnel_manager = True
        _filter.corps_filter.add(self.corp)

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertFalse(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertTrue(tests[6]['check'])
        self.assertTrue(tests[7]['check'])
        self.assertTrue(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

        # run again and confirm cache
        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertFalse(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertTrue(tests[6]['check'])
        self.assertTrue(tests[7]['check'])
        self.assertTrue(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

    def test_user_has_title_1(self):
        _filter = ct_models.Titlefilter.objects.create(name="Title Test1",
                                                       description="Something to tell user",
                                                       titles=self.c1t1)

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

        # run again and confirm cache
        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

    def test_user_has_title_2(self):
        _filter = ct_models.Titlefilter.objects.create(name="Title Test2",
                                                       description="Something to tell user",
                                                       titles=self.c2t1)

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertFalse(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertTrue(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertTrue(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

        # run again and confirm cache
        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertFalse(tests[1]['check'])
        self.assertFalse(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertTrue(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertTrue(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

    def test_user_has_logged_in(self):
        _filter = ct_models.LastLoginfilter.objects.create(name="login Test",
                                                           description="Something to tell user",
                                                           days_since_login=30)

        now_iso = timezone.now().isoformat()
        c1_qs = ct_models.CharacterAudit.objects.filter(
            character__character_ownership__user_id=1)
        c1_qs.update(last_known_login=timezone.now() - timedelta(days=60))
        c1 = list(c1_qs)
        for ca in c1:
            ca.update_timestamps["login"] = now_iso
        ct_models.CharacterAudit.objects.bulk_update(c1, ["update_timestamps"])
        c2_qs = ct_models.CharacterAudit.objects.filter(
            character__character_ownership__user_id=2)
        c2_qs.update(last_known_login=timezone.now() - timedelta(days=15))
        c2 = list(c2_qs)
        for ca in c2:
            ca.update_timestamps["login"] = now_iso
        ct_models.CharacterAudit.objects.bulk_update(c2, ["update_timestamps"])

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = _filter.audit_filter(User.objects.filter(id__in=users))
        self.assertFalse(tests[1]['check'])
        self.assertTrue(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

    def test_legacy_user_has_logged_in(self):
        _filter = ct_models.LastLoginfilter.objects.create(name="login Test",
                                                           description="Something to tell user",
                                                           days_since_login=30)

        now_iso = timezone.now().isoformat()
        c1_qs = ct_models.CharacterAudit.objects.filter(
            character__character_ownership__user_id=1)
        c1_qs.update(last_known_login=timezone.now() - timedelta(days=60))
        c1 = list(c1_qs)
        for ca in c1:
            ca.update_timestamps["login"] = now_iso
        ct_models.CharacterAudit.objects.bulk_update(c1, ["update_timestamps"])
        c2_qs = ct_models.CharacterAudit.objects.filter(
            character__character_ownership__user_id=2)
        c2_qs.update(last_known_login=timezone.now() - timedelta(days=15))
        c2 = list(c2_qs)
        for ca in c2:
            ca.update_timestamps["login"] = now_iso
        ct_models.CharacterAudit.objects.bulk_update(c2, ["update_timestamps"])

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = {u: {"check": _filter.process_filter(
            User.objects.get(id=u))} for u in users}

        self.assertFalse(tests[1]['check'])
        self.assertTrue(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

    def test_user_has_logged_in_no_data_pass(self):
        _filter = ct_models.LastLoginfilter.objects.create(name="login Test",
                                                           description="Something to tell user",
                                                           days_since_login=30,
                                                           no_data_pass=True)

        now_iso = timezone.now().isoformat()
        c1_qs = ct_models.CharacterAudit.objects.filter(
            character__character_ownership__user_id=1)
        c1_qs.update(last_known_login=timezone.now() - timedelta(days=60))
        c1 = list(c1_qs)
        for ca in c1:
            ca.update_timestamps["login"] = now_iso
        ct_models.CharacterAudit.objects.bulk_update(c1, ["update_timestamps"])
        c2_qs = ct_models.CharacterAudit.objects.filter(
            character__character_ownership__user_id=2)
        c2_qs.update(last_known_login=timezone.now() - timedelta(days=15))
        c2 = list(c2_qs)
        for ca in c2:
            ca.update_timestamps["login"] = now_iso
        ct_models.CharacterAudit.objects.bulk_update(c2, ["update_timestamps"])

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = _filter.audit_filter(User.objects.filter(id__in=users))
        self.assertFalse(tests[1]['check'])
        self.assertTrue(tests[2]['check'])
        self.assertTrue(tests[3]['check'])
        self.assertTrue(tests[4]['check'])
        self.assertTrue(tests[5]['check'])
        self.assertTrue(tests[6]['check'])
        self.assertTrue(tests[7]['check'])
        self.assertTrue(tests[8]['check'])
        self.assertTrue(tests[9]['check'])
        self.assertTrue(tests[10]['check'])

    def test_legacy_user_has_logged_in_no_data_pass(self):
        _filter = ct_models.LastLoginfilter.objects.create(name="login Test",
                                                           description="Something to tell user",
                                                           days_since_login=30,
                                                           no_data_pass=True)

        now_iso = timezone.now().isoformat()
        c1_qs = ct_models.CharacterAudit.objects.filter(
            character__character_ownership__user_id=1)
        c1_qs.update(last_known_login=timezone.now() - timedelta(days=60))
        c1 = list(c1_qs)
        for ca in c1:
            ca.update_timestamps["login"] = now_iso
        ct_models.CharacterAudit.objects.bulk_update(c1, ["update_timestamps"])
        c2_qs = ct_models.CharacterAudit.objects.filter(
            character__character_ownership__user_id=2)
        c2_qs.update(last_known_login=timezone.now() - timedelta(days=15))
        c2 = list(c2_qs)
        for ca in c2:
            ca.update_timestamps["login"] = now_iso
        ct_models.CharacterAudit.objects.bulk_update(c2, ["update_timestamps"])

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = {u: {"check": _filter.process_filter(
            User.objects.get(id=u))} for u in users}

        self.assertFalse(tests[1]['check'])
        self.assertTrue(tests[2]['check'])
        self.assertTrue(tests[3]['check'])
        self.assertTrue(tests[4]['check'])
        self.assertTrue(tests[5]['check'])
        self.assertTrue(tests[6]['check'])
        self.assertTrue(tests[7]['check'])
        self.assertTrue(tests[8]['check'])
        self.assertTrue(tests[9]['check'])
        self.assertTrue(tests[10]['check'])

    def test_user_has_logged_in_main_only(self):
        _filter = ct_models.LastLoginfilter.objects.create(name="login Test",
                                                           description="Something to tell user",
                                                           days_since_login=30,
                                                           main_corp_only=True)

        now_iso = timezone.now().isoformat()
        c1_qs = ct_models.CharacterAudit.objects.filter(
            id__gte=11)  # All the alts
        c1_qs.update(last_known_login=timezone.now() - timedelta(days=15))
        c1 = list(c1_qs)
        for ca in c1:
            ca.update_timestamps["login"] = now_iso
        ct_models.CharacterAudit.objects.bulk_update(c1, ["update_timestamps"])
        c2_qs = ct_models.CharacterAudit.objects.filter(
            character__character_ownership__user_id=2)
        c2_qs.update(last_known_login=timezone.now() - timedelta(days=15))
        c2 = list(c2_qs)
        for ca in c2:
            ca.update_timestamps["login"] = now_iso
        ct_models.CharacterAudit.objects.bulk_update(c2, ["update_timestamps"])

        users = []
        for user in ct_models.CharacterAudit.objects.all():
            users.append(user.character.character_ownership.user.id)

        tests = _filter.audit_filter(User.objects.filter(id__in=users))
        self.assertFalse(tests[1]['check'])
        self.assertTrue(tests[2]['check'])
        self.assertFalse(tests[3]['check'])
        self.assertFalse(tests[4]['check'])
        self.assertFalse(tests[5]['check'])
        self.assertFalse(tests[6]['check'])
        self.assertFalse(tests[7]['check'])
        self.assertFalse(tests[8]['check'])
        self.assertFalse(tests[9]['check'])
        self.assertFalse(tests[10]['check'])

    def test_user_in_ship_l1_a1(self):
        _filter = ct_models.CurrentShipFilter.objects.create(name="Ship in Location Test",
                                                             description="Something to tell user")
        _filter.types.add(sde_models.ItemType.objects.get(id=10))
        _filter.systems.add(
            sde_models.SolarSystem.objects.get(name="Test System 1"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertTrue(tests[2])
        self.assertFalse(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertFalse(tests[6])
        self.assertFalse(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])

    def test_user_in_ship_l2_a1(self):
        _filter = ct_models.CurrentShipFilter.objects.create(name="Ship in Location Test",
                                                             description="Something to tell user")
        _filter.types.add(sde_models.ItemType.objects.get(id=10))
        _filter.systems.add(
            sde_models.SolarSystem.objects.get(name="Test System 2"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertFalse(tests[2])
        self.assertTrue(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertFalse(tests[6])
        self.assertFalse(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])

    def test_user_in_ship_a1(self):
        _filter = ct_models.CurrentShipFilter.objects.create(name="Ship in Location Test",
                                                             description="Something to tell user")
        _filter.types.add(sde_models.ItemType.objects.get(id=10))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertTrue(tests[2])
        self.assertTrue(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertFalse(tests[6])
        self.assertFalse(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])

    def test_user_in_ship_c2_a1(self):
        _filter = ct_models.CurrentShipFilter.objects.create(name="Ship in Location Test",
                                                             description="Something to tell user")
        _filter.types.add(sde_models.ItemType.objects.get(id=10))
        _filter.constellations.add(
            sde_models.Constellation.objects.get(name="Test Constellation 2"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertFalse(tests[2])
        self.assertTrue(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertFalse(tests[6])
        self.assertFalse(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])

    def test_user_in_ship_r3_a2(self):
        _filter = ct_models.CurrentShipFilter.objects.create(name="Ship in Location Test",
                                                             description="Something to tell user")
        _filter.types.add(sde_models.ItemType.objects.get(id=11))
        _filter.regions.add(
            sde_models.Region.objects.get(name="Test region 3"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertFalse(tests[2])
        self.assertFalse(tests[3])
        self.assertFalse(tests[4])
        self.assertTrue(tests[5])
        self.assertTrue(tests[6])
        self.assertFalse(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])

    def test_user_in_ship_r3_a3(self):
        _filter = ct_models.CurrentShipFilter.objects.create(name="Ship in Location Test",
                                                             description="Something to tell user")
        _filter.types.add(sde_models.ItemType.objects.get(id=12))
        _filter.regions.add(
            sde_models.Region.objects.get(name="Test region 3"))

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertFalse(tests[2])
        self.assertFalse(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertFalse(tests[6])
        self.assertFalse(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])

    def test_user_time_in_corp_p(self):
        _filter = ct_models.TimeInCorpFilter.objects.create(
            name="Time in Corp > 15d",
            description="Something to tell user",
            days_in_corp=15
        )

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertTrue(tests[2])
        self.assertTrue(tests[3])
        self.assertTrue(tests[4])
        self.assertFalse(tests[5])
        self.assertFalse(tests[6])
        self.assertFalse(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])

    def test_user_age_p(self):
        _filter = ct_models.CharacterAgeFilter.objects.create(
            name="age > 31d",
            description="Something to tell user",
            min_age=31
        )

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertTrue(tests[1])
        self.assertTrue(tests[2])
        self.assertTrue(tests[3])
        self.assertTrue(tests[4])
        self.assertFalse(tests[5])
        self.assertFalse(tests[6])
        self.assertFalse(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])

    def test_user_age_rev_p(self):
        _filter = ct_models.CharacterAgeFilter.objects.create(
            name="age > 31d",
            description="Something to tell user",
            min_age=31,
            reversed_logic=True
        )

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertFalse(tests[2])
        self.assertFalse(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertTrue(tests[6])
        self.assertTrue(tests[7])
        self.assertTrue(tests[8])
        self.assertTrue(tests[9])

    def test_user_time_in_corp_rev_p(self):
        _filter = ct_models.TimeInCorpFilter.objects.create(
            name="Time in Corp < 15d",
            description="Something to tell user",
            days_in_corp=15,
            reversed_logic=True
        )

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = {}
        for k, u in users.items():
            tests[k] = _filter.process_filter(User.objects.get(id=k))

        self.assertFalse(tests[1])
        self.assertFalse(tests[2])
        self.assertFalse(tests[3])
        self.assertFalse(tests[4])
        self.assertFalse(tests[5])
        self.assertTrue(tests[6])
        self.assertTrue(tests[7])
        self.assertFalse(tests[8])
        self.assertFalse(tests[9])

    def test_user_time_in_corp_a(self):
        _filter = ct_models.TimeInCorpFilter.objects.create(
            name="Time in Corp > 20d",
            description="Something to tell user",
            days_in_corp=20
        )

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]["check"])
        self.assertTrue(tests[2]["check"])
        self.assertTrue(tests[3]["check"])
        self.assertTrue(tests[4]["check"])
        self.assertFalse(tests[5]["check"])
        self.assertFalse(tests[6]["check"])
        self.assertFalse(tests[7]["check"])
        self.assertFalse(tests[8]["check"])
        self.assertFalse(tests[9]["check"])

    def test_user_age_a(self):
        _filter = ct_models.CharacterAgeFilter.objects.create(
            name="age > 32d",
            description="Something to tell user",
            min_age=32
        )

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertTrue(tests[1]["check"])
        self.assertTrue(tests[2]["check"])
        self.assertTrue(tests[3]["check"])
        self.assertTrue(tests[4]["check"])
        self.assertFalse(tests[5]["check"])
        self.assertFalse(tests[6]["check"])
        self.assertFalse(tests[7]["check"])
        self.assertFalse(tests[8]["check"])
        self.assertFalse(tests[9]["check"])

    def test_user_age_rev_a(self):
        _filter = ct_models.CharacterAgeFilter.objects.create(
            name="age < 32d",
            description="Something to tell user",
            min_age=32,
            reversed_logic=True
        )

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertFalse(tests[1]["check"])
        self.assertFalse(tests[2]["check"])
        self.assertFalse(tests[3]["check"])
        self.assertFalse(tests[4]["check"])
        self.assertFalse(tests[5]["check"])
        self.assertTrue(tests[6]["check"])
        self.assertTrue(tests[7]["check"])
        self.assertTrue(tests[8]["check"])
        self.assertTrue(tests[9]["check"])

    def test_user_time_in_corp_rev_a(self):
        _filter = ct_models.TimeInCorpFilter.objects.create(
            name="Time in Corp > 20d",
            description="Something to tell user",
            days_in_corp=20,
            reversed_logic=True
        )

        users = {}
        for user in ct_models.CharacterAudit.objects.all():
            users[user.character.character_ownership.user.id] = None

        tests = _filter.audit_filter(User.objects.filter(id__in=users))

        self.assertFalse(tests[1]["check"])
        self.assertFalse(tests[2]["check"])
        self.assertFalse(tests[3]["check"])
        self.assertFalse(tests[4]["check"])
        self.assertFalse(tests[5]["check"])
        self.assertTrue(tests[6]["check"])
        self.assertTrue(tests[7]["check"])
        self.assertFalse(tests[8]["check"])
        self.assertFalse(tests[9]["check"])

    def test_user_time_in_corp_no_audit_rev(self):
        _filter = ct_models.TimeInCorpFilter.objects.create(
            name="Time in Corp > 20d",
            description="Something to tell user",
            days_in_corp=20,
            reversed_logic=True
        )

        tests = _filter.audit_filter(User.objects.filter(id__in=[11]))

        self.assertFalse(tests[11]["check"])

    def test_user_time_in_corp_no_audit(self):
        _filter = ct_models.TimeInCorpFilter.objects.create(
            name="Time in Corp > 20d",
            description="Something to tell user",
            days_in_corp=20
        )

        tests = _filter.audit_filter(User.objects.filter(id__in=[11]))

        self.assertFalse(tests[11]["check"])

    def test_user_age_no_audit_rev(self):
        _filter = ct_models.CharacterAgeFilter.objects.create(
            name="Age > 20d",
            description="Something to tell user",
            min_age=20,
            reversed_logic=True
        )

        tests = _filter.audit_filter(User.objects.filter(id__in=[11]))

        self.assertFalse(tests[11]["check"])

    def test_user_age_no_audit(self):
        _filter = ct_models.CharacterAgeFilter.objects.create(
            name="Age > 20d",
            description="Something to tell user",
            min_age=20
        )

        tests = _filter.audit_filter(User.objects.filter(id__in=[11]))

        self.assertFalse(tests[11]["check"])

    def test_user_home_station(self):
        l1 = ct_models.EveLocation.objects.get(location_id=1)
        user1_audit = ct_models.CharacterAudit.objects.get(
            character=User.objects.get(id=1).profile.main_character)
        ct_models.Clone.objects.create(
            character=user1_audit,
            location_id=1,
            location_name=l1,
            location_type="station",
        )

        _filter = ct_models.HomeStationFilter.objects.create(
            name="Home Station Test", description="Something to tell user")
        _filter.evelocation.add(l1)

        self.assertTrue(_filter.process_filter(User.objects.get(id=1)))
        self.assertFalse(_filter.process_filter(User.objects.get(id=2)))

        tests = _filter.audit_filter(User.objects.filter(id__in=[1, 2]))
        self.assertTrue(tests[1]["check"])
        self.assertFalse(tests[2]["check"])

    def test_user_home_station_unconfigured(self):
        # Regression: an unconfigured filter (no evelocation picked) must
        # fail closed, not match every account that merely has a clone.
        l1 = ct_models.EveLocation.objects.get(location_id=1)
        user1_audit = ct_models.CharacterAudit.objects.get(
            character=User.objects.get(id=1).profile.main_character)
        ct_models.Clone.objects.create(
            character=user1_audit,
            location_id=1,
            location_name=l1,
            location_type="station",
        )

        _filter = ct_models.HomeStationFilter.objects.create(
            name="Unconfigured", description="Something to tell user")

        self.assertFalse(_filter.process_filter(User.objects.get(id=1)))
        tests = _filter.audit_filter(User.objects.filter(id__in=[1]))
        self.assertFalse(tests[1]["check"])

    def test_user_jump_clone(self):
        l1 = ct_models.EveLocation.objects.get(location_id=1)
        user1_audit = ct_models.CharacterAudit.objects.get(
            character=User.objects.get(id=1).profile.main_character)
        ct_models.JumpClone.objects.create(
            character=user1_audit,
            jump_clone_id=1,
            location_id=1,
            location_name=l1,
            location_type="station",
        )

        _filter = ct_models.JumpCloneFilter.objects.create(
            name="Jump Clone Test", description="Something to tell user")
        _filter.evelocation.add(l1)

        self.assertTrue(_filter.process_filter(User.objects.get(id=1)))
        self.assertFalse(_filter.process_filter(User.objects.get(id=2)))

        tests = _filter.audit_filter(User.objects.filter(id__in=[1, 2]))
        self.assertTrue(tests[1]["check"])
        self.assertFalse(tests[2]["check"])

    def test_user_jump_clone_unconfigured(self):
        # Regression: same fail-closed requirement as HomeStationFilter.
        l1 = ct_models.EveLocation.objects.get(location_id=1)
        user1_audit = ct_models.CharacterAudit.objects.get(
            character=User.objects.get(id=1).profile.main_character)
        ct_models.JumpClone.objects.create(
            character=user1_audit,
            jump_clone_id=1,
            location_id=1,
            location_name=l1,
            location_type="station",
        )

        _filter = ct_models.JumpCloneFilter.objects.create(
            name="Unconfigured", description="Something to tell user")

        self.assertFalse(_filter.process_filter(User.objects.get(id=1)))
        tests = _filter.audit_filter(User.objects.filter(id__in=[1]))
        self.assertFalse(tests[1]["check"])

    def test_user_highest_sp(self):
        user1_audit = ct_models.CharacterAudit.objects.get(
            character=User.objects.get(id=1).profile.main_character)
        user2_audit = ct_models.CharacterAudit.objects.get(
            character=User.objects.get(id=2).profile.main_character)
        ct_models.SkillTotals.objects.create(
            character=user1_audit, total_sp=6_000_000_000, unallocated_sp=0)
        ct_models.SkillTotals.objects.create(
            character=user2_audit, total_sp=1_000_000_000, unallocated_sp=0)

        _filter = ct_models.HighestSPFilter.objects.create(
            name="5B SP", description="Something to tell user", sp_cutoff=5_000_000_000)

        self.assertTrue(_filter.process_filter(User.objects.get(id=1)))
        self.assertFalse(_filter.process_filter(User.objects.get(id=2)))

        tests = _filter.audit_filter(User.objects.filter(id__in=[1, 2]))
        self.assertTrue(tests[1]["check"])
        self.assertFalse(tests[2]["check"])

    def test_user_highest_sp_swap_logic(self):
        user1_audit = ct_models.CharacterAudit.objects.get(
            character=User.objects.get(id=1).profile.main_character)
        ct_models.SkillTotals.objects.create(
            character=user1_audit, total_sp=6_000_000_000, unallocated_sp=0)

        _filter = ct_models.HighestSPFilter.objects.create(
            name="Under 5B SP",
            description="Something to tell user",
            sp_cutoff=5_000_000_000,
            swap_logic=True,
        )

        # swap_logic inverts pass/fail: at/above cutoff now fails.
        self.assertFalse(_filter.process_filter(User.objects.get(id=1)))
        # No SkillTotals row at all -> treated as 0 SP -> passes under swap_logic.
        self.assertTrue(_filter.process_filter(User.objects.get(id=2)))

    def test_rolefilter_no_roles_selected(self):
        # Regression: previously crashed with IndexError (queries.pop() on
        # an empty list) instead of failing closed like every other filter
        # does when left unconfigured.
        _filter = ct_models.Rolefilter.objects.create(
            name="Unconfigured", description="Something to tell user")

        self.assertFalse(_filter.process_filter(User.objects.get(id=1)))
        tests = _filter.audit_filter(User.objects.filter(id__in=[1]))
        self.assertFalse(tests[1]["check"])

    def test_assets_filter_unconfigured(self):
        # Regression: previously audit_filter crashed with AttributeError
        # ('bool' object has no attribute 'values') because filter_query()
        # returned a bare False instead of an empty queryset.
        _filter = ct_models.AssetsFilter.objects.create(
            name="Unconfigured", description="Something to tell user")

        self.assertFalse(_filter.process_filter(User.objects.get(id=1)))
        tests = _filter.audit_filter(User.objects.filter(id__in=[1]))
        self.assertFalse(tests[1]["check"])

    def test_current_ship_filter_unconfigured(self):
        # Regression: same bare-False/AttributeError bug as AssetsFilter.
        _filter = ct_models.CurrentShipFilter.objects.create(
            name="Unconfigured", description="Something to tell user")

        self.assertFalse(_filter.process_filter(User.objects.get(id=1)))
        tests = _filter.audit_filter(User.objects.filter(id__in=[1]))
        self.assertFalse(tests[1]["check"])

    def test_skill_filter_unconfigured(self):
        # Regression: audit_filter() returned a bare False instead of the
        # expected {user_id: {...}} dict when no skill lists were picked,
        # which crashes any caller that indexes the result.
        _filter = ct_models.Skillfilter.objects.create(
            name="Unconfigured", description="Something to tell user")

        self.assertFalse(_filter.process_filter(User.objects.get(id=1)))
        tests = _filter.audit_filter(User.objects.filter(id__in=[1]))
        self.assertFalse(tests[1]["check"])
