from ..models import CorporationAudit
from ..models.interactions import CharacterRoles
from . import CorptoolsTestCase


class TestCorptoolsCorpAccessPerms(CorptoolsTestCase):
    def test_no_perms_get_self_u1(self):
        cs = CorporationAudit.objects.visible_to(self.user1)
        self.assertNotIn(self.cp1, cs)
        self.assertNotIn(self.cp2, cs)
        self.assertNotIn(self.cp3, cs)
        self.assertNotIn(self.cp4, cs)

    def test_no_perms_get_self_u2(self):
        cs = CorporationAudit.objects.visible_to(self.user2)
        self.assertNotIn(self.cp1, cs)
        self.assertNotIn(self.cp2, cs)
        self.assertNotIn(self.cp3, cs)
        self.assertNotIn(self.cp4, cs)

    def test_no_perms_get_self_u3(self):
        cs = CorporationAudit.objects.visible_to(self.user3)
        self.assertNotIn(self.cp1, cs)
        self.assertNotIn(self.cp2, cs)
        self.assertNotIn(self.cp3, cs)
        self.assertNotIn(self.cp4, cs)

    def test_get_corp_u1(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.user1.refresh_from_db()
        cs = CorporationAudit.objects.visible_to(self.user1)
        self.assertIn(self.cp1, cs)
        self.assertNotIn(self.cp2, cs)
        self.assertNotIn(self.cp3, cs)
        self.assertNotIn(self.cp4, cs)

    def test_get_corp_u2(self):
        self.user2.user_permissions.add(self.own_corp_manager)
        self.user2.refresh_from_db()
        cs = CorporationAudit.objects.visible_to(self.user2)
        self.assertNotIn(self.cp1, cs)
        self.assertIn(self.cp2, cs)
        self.assertNotIn(self.cp3, cs)
        self.assertNotIn(self.cp4, cs)

    def test_get_corp_u3(self):
        self.user3.user_permissions.add(self.own_corp_manager)
        self.user3.refresh_from_db()
        cs = CorporationAudit.objects.visible_to(self.user3)
        self.assertNotIn(self.cp1, cs)
        self.assertNotIn(self.cp2, cs)
        self.assertIn(self.cp3, cs)
        self.assertNotIn(self.cp4, cs)

    def test_get_alliance_u1(self):
        self.user1.user_permissions.add(self.alliance_corp_manager)
        self.user1.refresh_from_db()
        cs = CorporationAudit.objects.visible_to(self.user1)
        self.assertIn(self.cp1, cs)
        self.assertNotIn(self.cp2, cs)
        self.assertNotIn(self.cp3, cs)
        self.assertNotIn(self.cp4, cs)

    def test_get_alliance_u2(self):
        self.user2.user_permissions.add(self.alliance_corp_manager)
        self.user2.refresh_from_db()
        cs = CorporationAudit.objects.visible_to(self.user2)
        self.assertNotIn(self.cp1, cs)
        self.assertIn(self.cp2, cs)
        self.assertNotIn(self.cp3, cs)
        self.assertNotIn(self.cp4, cs)

    def test_get_alliance_u3(self):
        self.user3.user_permissions.add(self.alliance_corp_manager)
        self.user3.refresh_from_db()
        cs = CorporationAudit.objects.visible_to(self.user3)
        self.assertNotIn(self.cp1, cs)
        self.assertNotIn(self.cp2, cs)
        self.assertIn(self.cp3, cs)
        self.assertIn(self.cp4, cs)

    def test_global_perms_u1(self):
        self.user1.user_permissions.add(self.global_corp_manager)
        self.user1.refresh_from_db()
        cs = CorporationAudit.objects.visible_to(self.user1)
        self.assertIn(self.cp1, cs)
        self.assertIn(self.cp2, cs)
        self.assertIn(self.cp3, cs)
        self.assertIn(self.cp4, cs)

    def test_global_perms_u2(self):
        self.user2.user_permissions.add(self.global_corp_manager)
        self.user2.refresh_from_db()
        cs = CorporationAudit.objects.visible_to(self.user2)
        self.assertIn(self.cp1, cs)
        self.assertIn(self.cp2, cs)
        self.assertIn(self.cp3, cs)
        self.assertIn(self.cp4, cs)

    def test_global_perms_u3(self):
        self.user3.user_permissions.add(self.global_corp_manager)
        self.user3.refresh_from_db()
        cs = CorporationAudit.objects.visible_to(self.user3)
        self.assertIn(self.cp1, cs)
        self.assertIn(self.cp2, cs)
        self.assertIn(self.cp3, cs)
        self.assertIn(self.cp4, cs)

    def test_director_perms_u3(self):
        # own corp 3
        # alt corp 4
        self.user3.user_permissions.add(self.own_corp_manager)
        self.user3.user_permissions.add(self.director_manager)
        CharacterRoles.objects.create(
            character=self.ca7,
            director=True
        )
        self.user3.refresh_from_db()
        cs = CorporationAudit.objects.visible_to(self.user3)
        self.assertNotIn(self.cp1, cs)
        self.assertNotIn(self.cp2, cs)
        self.assertIn(self.cp3, cs)
        self.assertIn(self.cp4, cs)

    def test_director_perms_after_corp_change_u3(self):
        # own corp 3
        # alt corp 4
        self.user3.user_permissions.add(self.own_corp_manager)
        self.user3.user_permissions.add(self.director_manager)
        CharacterRoles.objects.create(
            character=self.ca7,
            director=True
        )
        self.user3.refresh_from_db()

        # swap alliance on char7 to corp 1
        self.char7.alliance_id = 109
        self.char7.alliance_name = "alliance.name1"
        self.char7.alliance_ticker = "ABC-d"
        self.char7.save()

        # No Changes
        cs = CorporationAudit.objects.visible_to(self.user3)
        self.assertNotIn(self.cp1, cs)
        self.assertNotIn(self.cp2, cs)
        self.assertIn(self.cp3, cs)
        self.assertIn(self.cp4, cs)

        # swap corps on char7 to corp 1
        self.char7.corporation_id = 123
        self.char7.corporation_name = "corporation.name1"
        self.char7.corporation_ticker = "ABC"
        self.char7.save()

        # refresh the char
        self.user3.refresh_from_db()

        # prove no leaks in perms
        cs = CorporationAudit.objects.visible_to(self.user3)
        self.assertNotIn(self.cp1, cs)
        self.assertNotIn(self.cp2, cs)
        self.assertIn(self.cp3, cs)
        self.assertNotIn(self.cp4, cs)

    def test_only_director_perms_u3(self):
        # own corp 3
        # alt corp 4
        self.user3.user_permissions.add(self.director_manager)
        CharacterRoles.objects.create(
            character=self.ca7,
            director=True
        )
        self.user3.refresh_from_db()
        cs = CorporationAudit.objects.visible_to(self.user3)
        self.assertNotIn(self.cp1, cs)
        self.assertNotIn(self.cp2, cs)
        self.assertNotIn(self.cp3, cs)
        self.assertIn(self.cp4, cs)
