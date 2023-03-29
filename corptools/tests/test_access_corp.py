from ..models import CorporationAudit
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
        cs = CorporationAudit.objects.visible_to(self.user2)
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
