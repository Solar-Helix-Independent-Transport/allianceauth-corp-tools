from unittest import mock

from django.contrib.auth.models import Permission
from django.test import TestCase

from allianceauth.authentication.models import CharacterOwnership
from allianceauth.eveonline.models import EveCharacter
from allianceauth.tests.auth_utils import AuthUtils

from ..api import helpers
from ..models import CharacterAudit


class TestCorptoolsAPIAccess(TestCase):
    def setUp(cls):
        cls.user1 = AuthUtils.create_user('Main User1')
        cls.user2 = AuthUtils.create_user('Main User2')
        cls.user3 = AuthUtils.create_user('Main User3')
        cls.user4 = AuthUtils.create_user('Main User4')

        char1 = EveCharacter.objects.create(character_id=1,
                                            character_name='character.name1',
                                            corporation_id=123,
                                            corporation_name='corporation.name1',
                                            corporation_ticker='ABC')
        cls.ca1 = CharacterAudit.objects.create(character=char1)

        cls.user1.profile.main_character = char1
        CharacterOwnership.objects.create(
            user=cls.user1, character=char1, owner_hash="abc123")
        cls.user1.profile.save()

        char2 = EveCharacter.objects.create(character_id=2,
                                            character_name='character.name2',
                                            corporation_id=123,
                                            corporation_name='corporation.name1',
                                            corporation_ticker='ABC')
        cls.ca2 = CharacterAudit.objects.create(character=char2)
        CharacterOwnership.objects.create(
            user=cls.user1, character=char2, owner_hash="cba123")
        cls.user1.profile.refresh_from_db()

        char3 = EveCharacter.objects.create(character_id=3,
                                            character_name='character.name3',
                                            corporation_id=2,
                                            corporation_name='corporation.name2',
                                            corporation_ticker='ABC2',
                                            alliance_id=3,
                                            alliance_name='test alliance2',
                                            alliance_ticker='TEST')
        cls.ca3 = CharacterAudit.objects.create(character=char3)

        cls.user2.profile.main_character = char3
        CharacterOwnership.objects.create(
            user=cls.user2, character=char3, owner_hash="cba321")

        cls.user2.profile.save()
        cls.user2.profile.refresh_from_db()

        char4 = EveCharacter.objects.create(character_id=4,
                                            character_name='character.name4',
                                            corporation_id=2,
                                            corporation_name='corporation.name2',
                                            corporation_ticker='ABC',
                                            alliance_id=3,
                                            alliance_name='test alliance2',
                                            alliance_ticker='TEST')
        cls.ca4 = CharacterAudit.objects.create(character=char4)

        char5 = EveCharacter.objects.create(character_id=5,
                                            character_name='character.name5',
                                            corporation_id=3,
                                            corporation_name='corporation.name3',
                                            corporation_ticker='ABC3',
                                            alliance_id=4,
                                            alliance_name='test alliance2',
                                            alliance_ticker='TEST')
        cls.ca5 = CharacterAudit.objects.create(character=char5)

        cls.user3.profile.main_character = char5
        CharacterOwnership.objects.create(
            user=cls.user3, character=char5, owner_hash="abc432")

        cls.user3.profile.save()
        cls.user3.profile.refresh_from_db()

        char6 = EveCharacter.objects.create(character_id=6,
                                            character_name='character.name6',
                                            corporation_id=3,
                                            corporation_name='corporation.name3',
                                            corporation_ticker='ABC3',
                                            alliance_id=4,
                                            alliance_name='test alliance2',
                                            alliance_ticker='TEST2')
        cls.ca6 = CharacterAudit.objects.create(character=char6)

        char7 = EveCharacter.objects.create(character_id=7,
                                            character_name='character.name7',
                                            corporation_id=4,
                                            corporation_name='corporation.name4',
                                            corporation_ticker='ABC4',
                                            alliance_id=4,
                                            alliance_name='test alliance2',
                                            alliance_ticker='TEST2')
        cls.ca7 = CharacterAudit.objects.create(character=char7)
        CharacterOwnership.objects.create(
            user=cls.user3, character=char7, owner_hash="def432")

        char8 = EveCharacter.objects.create(character_id=8,
                                            character_name='character.name8',
                                            corporation_id=5,
                                            corporation_name='corporation.name4',
                                            corporation_ticker='ABC4',
                                            alliance_id=3,
                                            alliance_name='test alliance3',
                                            alliance_ticker='TEST3')
        cls.ca8 = CharacterAudit.objects.create(character=char8)

        cls.view_corp_permission = Permission.objects.get_by_natural_key(
            'corp_hr', 'corptools', 'characteraudit')
        cls.view_alliance_permission = Permission.objects.get_by_natural_key(
            'alliance_hr', 'corptools', 'characteraudit')
        cls.view_all_permission = Permission.objects.get_by_natural_key(
            'global_hr', 'corptools', 'characteraudit')
        cls.view_module = Permission.objects.get_by_natural_key(
            'view_characteraudit', 'corptools', 'characteraudit')

        cls.char9 = EveCharacter.objects.create(character_id=9,
                                                character_name='character.name9',
                                                corporation_id=2,
                                                corporation_name='corporation.name2',
                                                corporation_ticker='ABC2',
                                                alliance_id=3,
                                                alliance_name='test alliance2',
                                                alliance_ticker='TEST')
        CharacterOwnership.objects.create(
            user=cls.user4, character=cls.char9, owner_hash="def432a")

        char10 = EveCharacter.objects.create(character_id=10,
                                             character_name='character.name10',
                                             corporation_id=2,
                                             corporation_name='corporation.name2',
                                             corporation_ticker='ABC2',
                                             alliance_id=3,
                                             alliance_name='test alliance2',
                                             alliance_ticker='TEST')
        cls.ca10 = CharacterAudit.objects.create(character=char10)
        CharacterOwnership.objects.create(
            user=cls.user4, character=char10, owner_hash="def432b")
        cls.user4.profile.main_character = cls.char9
        cls.user4.profile.save()
        cls.user4.profile.refresh_from_db()

    def test_no_perms_get_self_u1(self):  # always get self.
        request = mock.Mock()
        request.user = self.user1

        perms, main_char = helpers.get_main_character(
            request, self.ca1.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca2.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca3.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca3.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca5.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca7.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.char9.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.char9)

        perms, main_char = helpers.get_main_character(
            request, self.ca10.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.char9)

    def test_get_self_u1(self):  # always get self.
        request = mock.Mock()
        request.user = self.user1
        self.user1.user_permissions.add(self.view_module)

        perms, main_char = helpers.get_main_character(
            request, self.ca1.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca2.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca3.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca3.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca5.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca7.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.char9.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.char9)

        perms, main_char = helpers.get_main_character(
            request, self.ca10.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.char9)

    def test_no_perms_get_self_u2(self):  # always get self.
        request = mock.Mock()
        request.user = self.user2
        perms, main_char = helpers.get_main_character(
            request, self.ca1.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca2.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca3.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca3.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca5.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca7.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.char9.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.char9)

        perms, main_char = helpers.get_main_character(
            request, self.ca10.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.char9)

    def test_get_self_u2(self):  # always get self.
        request = mock.Mock()
        request.user = self.user2
        self.user2.user_permissions.add(self.view_module)

        perms, main_char = helpers.get_main_character(
            request, self.ca1.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca2.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca3.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca3.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca5.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca7.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.char9.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.char9)

        perms, main_char = helpers.get_main_character(
            request, self.ca10.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.char9)

    def test_no_perms_get_self_u3(self):  # always get self.
        request = mock.Mock()
        request.user = self.user3
        perms, main_char = helpers.get_main_character(
            request, self.ca1.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca2.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca3.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca3.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca5.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca7.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.char9.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.char9)

        perms, main_char = helpers.get_main_character(
            request, self.ca10.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.char9)

    def test_get_self_u3(self):  # always get self.
        request = mock.Mock()
        request.user = self.user3
        self.user3.user_permissions.add(self.view_module)

        perms, main_char = helpers.get_main_character(
            request, self.ca1.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca2.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca3.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca3.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca5.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca7.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.char9.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.char9)

        perms, main_char = helpers.get_main_character(
            request, self.ca10.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.char9)

    def test_get_corp_in_alliance(self):
        self.user2.user_permissions.add(self.view_corp_permission)
        self.user2.user_permissions.add(self.view_module)
        request = mock.Mock()
        request.user = self.user2
        perms, main_char = helpers.get_main_character(
            request, self.ca1.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca2.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca3.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca3.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca5.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca7.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.char9.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.char9)

        perms, main_char = helpers.get_main_character(
            request, self.ca10.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.char9)

    def test_get_alliance(self):
        self.user3.user_permissions.add(self.view_alliance_permission)
        self.user3.user_permissions.add(self.view_module)
        request = mock.Mock()
        request.user = self.user3
        perms, main_char = helpers.get_main_character(
            request, self.ca1.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca2.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca3.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.ca3.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca5.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca7.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.char9.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.char9)

        perms, main_char = helpers.get_main_character(
            request, self.ca10.character.character_id)
        self.assertFalse(perms)
        self.assertEqual(main_char, self.char9)

    def test_global_perms_u1(self):
        self.user1.user_permissions.add(self.view_all_permission)
        self.user1.user_permissions.add(self.view_module)

        request = mock.Mock()
        request.user = self.user1

        perms, main_char = helpers.get_main_character(
            request, self.ca1.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca2.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca3.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca3.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca5.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca7.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.char9.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.char9)

        perms, main_char = helpers.get_main_character(
            request, self.ca10.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.char9)

    def test_global_perms_u2(self):
        self.user2.user_permissions.add(self.view_all_permission)
        self.user2.user_permissions.add(self.view_module)

        request = mock.Mock()
        request.user = self.user2
        perms, main_char = helpers.get_main_character(
            request, self.ca1.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca2.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca3.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca3.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca5.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca7.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.char9.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.char9)

        perms, main_char = helpers.get_main_character(
            request, self.ca10.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.char9)

    def test_global_perms_u3(self):
        self.user3.user_permissions.add(self.view_all_permission)
        self.user3.user_permissions.add(self.view_module)

        request = mock.Mock()
        request.user = self.user3
        perms, main_char = helpers.get_main_character(
            request, self.ca1.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca2.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca1.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca3.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca3.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca5.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.ca7.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.ca5.character)

        perms, main_char = helpers.get_main_character(
            request, self.char9.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.char9)

        perms, main_char = helpers.get_main_character(
            request, self.ca10.character.character_id)
        self.assertTrue(perms)
        self.assertEqual(main_char, self.char9)
