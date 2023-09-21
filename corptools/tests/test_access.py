from allianceauth.authentication.models import State

from ..models import CharacterAudit
from . import CorptoolsTestCase


class TestCorptoolsCharAccessPerms(CorptoolsTestCase):
    def test_no_perms_get_self_u1(self):  # always get self.
        cs = CharacterAudit.objects.visible_to(self.user1)
        self.assertIn(self.ca1, cs)
        self.assertIn(self.ca2, cs)
        self.assertNotIn(self.ca3, cs)
        self.assertNotIn(self.ca4, cs)
        self.assertNotIn(self.ca5, cs)
        self.assertNotIn(self.ca6, cs)
        self.assertNotIn(self.ca7, cs)
        self.assertNotIn(self.ca8, cs)
        self.assertNotIn(self.ca10, cs)

    def test_no_perms_get_self_u1_ec(self):  # always get self.
        cs = CharacterAudit.objects.visible_eve_characters(self.user1)
        self.assertIn(self.ca1.character, cs)
        self.assertIn(self.ca2.character, cs)
        self.assertNotIn(self.ca3.character, cs)
        self.assertNotIn(self.ca4.character, cs)
        self.assertNotIn(self.ca5.character, cs)
        self.assertNotIn(self.ca6.character, cs)
        self.assertNotIn(self.ca7.character, cs)
        self.assertNotIn(self.ca8.character, cs)
        self.assertNotIn(self.char9, cs)
        self.assertNotIn(self.ca10.character, cs)

    def test_no_perms_get_self_u2(self):  # always get self.
        cs = CharacterAudit.objects.visible_to(self.user2)
        self.assertNotIn(self.ca1, cs)
        self.assertNotIn(self.ca2, cs)
        self.assertIn(self.ca3, cs)
        self.assertNotIn(self.ca4, cs)
        self.assertNotIn(self.ca5, cs)
        self.assertNotIn(self.ca6, cs)
        self.assertNotIn(self.ca7, cs)
        self.assertNotIn(self.ca8, cs)
        self.assertNotIn(self.ca10, cs)

    def test_no_perms_get_self_u2_ec(self):  # always get self.
        cs = CharacterAudit.objects.visible_eve_characters(self.user2)
        self.assertNotIn(self.ca1.character, cs)
        self.assertNotIn(self.ca2.character, cs)
        self.assertIn(self.ca3.character, cs)
        self.assertNotIn(self.ca4.character, cs)
        self.assertNotIn(self.ca5.character, cs)
        self.assertNotIn(self.ca6.character, cs)
        self.assertNotIn(self.ca7.character, cs)
        self.assertNotIn(self.ca8.character, cs)
        self.assertNotIn(self.char9, cs)
        self.assertNotIn(self.ca10.character, cs)

    def test_no_perms_get_self_u3(self):  # always get self.
        cs = CharacterAudit.objects.visible_to(self.user3)
        self.assertNotIn(self.ca1, cs)
        self.assertNotIn(self.ca2, cs)
        self.assertNotIn(self.ca3, cs)
        self.assertNotIn(self.ca4, cs)
        self.assertIn(self.ca5, cs)
        self.assertNotIn(self.ca6, cs)
        self.assertIn(self.ca7, cs)
        self.assertNotIn(self.ca8, cs)
        self.assertNotIn(self.ca10, cs)

    def test_no_perms_get_self_u3_ec(self):  # always get self.
        cs = CharacterAudit.objects.visible_eve_characters(self.user3)
        self.assertNotIn(self.ca1.character, cs)
        self.assertNotIn(self.ca2.character, cs)
        self.assertNotIn(self.ca3.character, cs)
        self.assertNotIn(self.ca4.character, cs)
        self.assertIn(self.ca5.character, cs)
        self.assertNotIn(self.ca6.character, cs)
        self.assertIn(self.ca7.character, cs)
        self.assertNotIn(self.ca8.character, cs)
        self.assertNotIn(self.char9, cs)
        self.assertNotIn(self.ca10.character, cs)

    def test_no_perms_get_self_in_alliance(self):
        cs = CharacterAudit.objects.visible_to(self.user2)
        self.assertNotIn(self.ca1, cs)
        self.assertNotIn(self.ca2, cs)
        self.assertIn(self.ca3, cs)
        self.assertNotIn(self.ca4, cs)
        self.assertNotIn(self.ca5, cs)
        self.assertNotIn(self.ca6, cs)
        self.assertNotIn(self.ca7, cs)
        self.assertNotIn(self.ca8, cs)
        self.assertNotIn(self.ca10, cs)

    def test_no_perms_get_self_in_alliance_ec(self):
        cs = CharacterAudit.objects.visible_eve_characters(self.user2)
        self.assertNotIn(self.ca1.character, cs)
        self.assertNotIn(self.ca2.character, cs)
        self.assertIn(self.ca3.character, cs)
        self.assertNotIn(self.ca4.character, cs)
        self.assertNotIn(self.ca5.character, cs)
        self.assertNotIn(self.ca6.character, cs)
        self.assertNotIn(self.ca7.character, cs)
        self.assertNotIn(self.ca8.character, cs)
        self.assertNotIn(self.char9, cs)
        self.assertNotIn(self.ca10.character, cs)

    def test_get_corp_in_alliance(self):
        self.user2.user_permissions.add(self.view_corp_permission)
        self.user2.refresh_from_db()
        cs = CharacterAudit.objects.visible_to(self.user2)
        self.assertNotIn(self.ca1, cs)
        self.assertNotIn(self.ca2, cs)
        self.assertIn(self.ca3, cs)
        self.assertIn(self.ca4, cs)
        self.assertNotIn(self.ca5, cs)
        self.assertNotIn(self.ca6, cs)
        self.assertNotIn(self.ca7, cs)
        self.assertNotIn(self.ca8, cs)
        self.assertIn(self.ca10, cs)

    def test_get_corp_in_alliance_ec(self):
        self.user2.user_permissions.add(self.view_corp_permission)
        self.user2.refresh_from_db()
        cs = CharacterAudit.objects.visible_eve_characters(self.user2)
        self.assertNotIn(self.ca1.character, cs)
        self.assertNotIn(self.ca2.character, cs)
        self.assertIn(self.ca3.character, cs)
        self.assertIn(self.ca4.character, cs)
        self.assertNotIn(self.ca5.character, cs)
        self.assertNotIn(self.ca6.character, cs)
        self.assertNotIn(self.ca7.character, cs)
        self.assertNotIn(self.ca8.character, cs)
        self.assertIn(self.char9, cs)
        self.assertIn(self.ca10.character, cs)

    def test_get_alliance(self):
        self.user3.user_permissions.add(self.view_alliance_permission)
        self.user3.refresh_from_db()
        cs = CharacterAudit.objects.visible_to(self.user3)
        self.assertNotIn(self.ca1, cs)
        self.assertNotIn(self.ca2, cs)
        self.assertNotIn(self.ca3, cs)
        self.assertNotIn(self.ca4, cs)
        self.assertIn(self.ca5, cs)
        self.assertIn(self.ca6, cs)
        self.assertIn(self.ca7, cs)
        self.assertIn(self.ca8, cs)
        self.assertNotIn(self.ca10, cs)

    def test_get_alliance_ec(self):
        self.user3.user_permissions.add(self.view_alliance_permission)
        self.user3.refresh_from_db()
        cs = CharacterAudit.objects.visible_eve_characters(self.user3)
        self.assertNotIn(self.ca1.character, cs)
        self.assertNotIn(self.ca2.character, cs)
        self.assertNotIn(self.ca3.character, cs)
        self.assertNotIn(self.ca4.character, cs)
        self.assertIn(self.ca5.character, cs)
        self.assertIn(self.ca6.character, cs)
        self.assertIn(self.ca7.character, cs)
        self.assertIn(self.ca8.character, cs)
        self.assertNotIn(self.char9, cs)
        self.assertNotIn(self.ca10.character, cs)

    def test_global_perms_u1(self):
        self.user1.user_permissions.add(self.view_all_permission)
        self.user1.refresh_from_db()
        cs = CharacterAudit.objects.visible_to(self.user1)
        self.assertIn(self.ca1, cs)
        self.assertIn(self.ca2, cs)
        self.assertIn(self.ca3, cs)
        self.assertIn(self.ca4, cs)
        self.assertIn(self.ca5, cs)
        self.assertIn(self.ca6, cs)
        self.assertIn(self.ca7, cs)
        self.assertIn(self.ca8, cs)
        self.assertIn(self.ca10, cs)

    def test_global_perms_u1_ec(self):
        self.user1.user_permissions.add(self.view_all_permission)
        self.user1.refresh_from_db()
        cs = CharacterAudit.objects.visible_eve_characters(self.user1)
        self.assertIn(self.ca1.character, cs)
        self.assertIn(self.ca2.character, cs)
        self.assertIn(self.ca3.character, cs)
        self.assertIn(self.ca4.character, cs)
        self.assertIn(self.ca5.character, cs)
        self.assertIn(self.ca6.character, cs)
        self.assertIn(self.ca7.character, cs)
        self.assertIn(self.ca8.character, cs)
        self.assertIn(self.char9, cs)
        self.assertIn(self.ca10.character, cs)
        self.assertIn(self.char9, cs)
        self.assertIn(self.ca10.character, cs)

    def test_global_perms_u2(self):
        self.user2.user_permissions.add(self.view_all_permission)
        self.user2.refresh_from_db()
        cs = CharacterAudit.objects.visible_to(self.user2)
        self.assertIn(self.ca1, cs)
        self.assertIn(self.ca2, cs)
        self.assertIn(self.ca3, cs)
        self.assertIn(self.ca4, cs)
        self.assertIn(self.ca5, cs)
        self.assertIn(self.ca6, cs)
        self.assertIn(self.ca7, cs)
        self.assertIn(self.ca8, cs)
        self.assertIn(self.ca10, cs)

    def test_global_perms_u2_ec(self):
        self.user2.user_permissions.add(self.view_all_permission)
        self.user2.refresh_from_db()
        cs = CharacterAudit.objects.visible_eve_characters(self.user2)
        self.assertIn(self.ca1.character, cs)
        self.assertIn(self.ca2.character, cs)
        self.assertIn(self.ca3.character, cs)
        self.assertIn(self.ca4.character, cs)
        self.assertIn(self.ca5.character, cs)
        self.assertIn(self.ca6.character, cs)
        self.assertIn(self.ca7.character, cs)
        self.assertIn(self.ca8.character, cs)
        self.assertIn(self.char9, cs)
        self.assertIn(self.ca10.character, cs)

    def test_global_perms_u3(self):
        self.user3.user_permissions.add(self.view_all_permission)
        self.user3.refresh_from_db()
        cs = CharacterAudit.objects.visible_to(self.user3)
        self.assertIn(self.ca1, cs)
        self.assertIn(self.ca2, cs)
        self.assertIn(self.ca3, cs)
        self.assertIn(self.ca4, cs)
        self.assertIn(self.ca5, cs)
        self.assertIn(self.ca6, cs)
        self.assertIn(self.ca7, cs)
        self.assertIn(self.ca8, cs)
        self.assertIn(self.ca10, cs)

    def test_global_perms_u3_ec(self):
        self.user3.user_permissions.add(self.view_all_permission)
        self.user3.refresh_from_db()
        cs = CharacterAudit.objects.visible_eve_characters(self.user3)
        self.assertIn(self.ca1.character, cs)
        self.assertIn(self.ca2.character, cs)
        self.assertIn(self.ca3.character, cs)
        self.assertIn(self.ca4.character, cs)
        self.assertIn(self.ca5.character, cs)
        self.assertIn(self.ca6.character, cs)
        self.assertIn(self.ca7.character, cs)
        self.assertIn(self.ca8.character, cs)
        self.assertIn(self.char9, cs)
        self.assertIn(self.ca10.character, cs)

    def test_guest_perms_u1(self):
        m = State.objects.get(name="Member")
        m.member_characters.add(self.char1)
        m.member_characters.add(self.char3)
        self.user1.user_permissions.add(self.view_guest_permission)
        self.user1.refresh_from_db()
        cs = CharacterAudit.objects.visible_eve_characters(self.user1)
        self.assertIn(self.ca1.character, cs)       # own
        self.assertIn(self.ca2.character, cs)       # own
        self.assertNotIn(self.ca3.character, cs)    # member
        self.assertNotIn(self.ca4.character, cs)    # unlinked
        self.assertIn(self.ca5.character, cs)       # u3 guest
        self.assertNotIn(self.ca6.character, cs)    # unlinked
        self.assertIn(self.ca7.character, cs)       # u3 guest
        self.assertNotIn(self.ca8.character, cs)    # unlinked
        self.assertNotIn(self.char9, cs)            # u4 no main
        self.assertNotIn(self.ca10.character, cs)   # u4 no main

    def test_state_perms_u1(self):
        m = State.objects.get(name="Member")
        m.member_characters.add(self.char1)
        m.member_characters.add(self.char3)
        self.user1.user_permissions.add(self.view_state_permission)
        self.user1.refresh_from_db()
        cs = CharacterAudit.objects.visible_eve_characters(self.user1)
        self.assertIn(self.ca1.character, cs)       # own
        self.assertIn(self.ca2.character, cs)       # own
        self.assertIn(self.ca3.character, cs)       # member
        self.assertNotIn(self.ca4.character, cs)    # unlinked
        self.assertNotIn(self.ca5.character, cs)    # u3 guest
        self.assertNotIn(self.ca6.character, cs)    # unlinked
        self.assertNotIn(self.ca7.character, cs)    # u3 guest
        self.assertNotIn(self.ca8.character, cs)    # unlinked
        self.assertNotIn(self.char9, cs)            # u4 no main
        self.assertNotIn(self.ca10.character, cs)   # u4 no main

    def test_state_and_guest_perms_u1(self):
        m = State.objects.get(name="Member")
        m.member_characters.add(self.char1)
        m.member_characters.add(self.char3)
        self.user1.user_permissions.add(self.view_state_permission)
        self.user1.user_permissions.add(self.view_guest_permission)
        self.user1.refresh_from_db()
        cs = CharacterAudit.objects.visible_eve_characters(self.user1)
        self.assertIn(self.ca1.character, cs)       # own
        self.assertIn(self.ca2.character, cs)       # own
        self.assertIn(self.ca3.character, cs)       # member
        self.assertNotIn(self.ca4.character, cs)    # unlinked
        self.assertIn(self.ca5.character, cs)       # u3 guest
        self.assertNotIn(self.ca6.character, cs)    # unlinked
        self.assertIn(self.ca7.character, cs)       # u3 guest
        self.assertNotIn(self.ca8.character, cs)    # unlinked
        self.assertNotIn(self.char9, cs)            # u4 no main
        self.assertNotIn(self.ca10.character, cs)   # u4 no main

    def test_guest_perms_u1_ca(self):
        m = State.objects.get(name="Member")
        m.member_characters.add(self.char1)
        m.member_characters.add(self.char3)
        self.user1.user_permissions.add(self.view_guest_permission)
        self.user1.refresh_from_db()
        cs = CharacterAudit.objects.visible_to(self.user1)
        self.assertIn(self.ca1, cs)       # own
        self.assertIn(self.ca2, cs)       # own
        self.assertNotIn(self.ca3, cs)    # member
        self.assertNotIn(self.ca4, cs)    # unlinked
        self.assertIn(self.ca5, cs)       # u3 guest
        self.assertNotIn(self.ca6, cs)    # unlinked
        self.assertIn(self.ca7, cs)       # u3 guest
        self.assertNotIn(self.ca8, cs)    # unlinked
        self.assertNotIn(self.ca10, cs)   # u4 no main

    def test_state_perms_u1_ca(self):
        m = State.objects.get(name="Member")
        m.member_characters.add(self.char1)
        m.member_characters.add(self.char3)
        self.user1.user_permissions.add(self.view_state_permission)
        self.user1.refresh_from_db()
        cs = CharacterAudit.objects.visible_to(self.user1)
        self.assertIn(self.ca1, cs)       # own
        self.assertIn(self.ca2, cs)       # own
        self.assertIn(self.ca3, cs)       # member
        self.assertNotIn(self.ca4, cs)    # unlinked
        self.assertNotIn(self.ca5, cs)    # u3 guest
        self.assertNotIn(self.ca6, cs)    # unlinked
        self.assertNotIn(self.ca7, cs)    # u3 guest
        self.assertNotIn(self.ca8, cs)    # unlinked
        self.assertNotIn(self.ca10, cs)   # u4 no main

    def test_state_and_guest_perms_u1_ca(self):
        m = State.objects.get(name="Member")
        m.member_characters.add(self.char1)
        m.member_characters.add(self.char3)
        self.user1.user_permissions.add(self.view_state_permission)
        self.user1.user_permissions.add(self.view_guest_permission)
        self.user1.refresh_from_db()
        cs = CharacterAudit.objects.visible_to(self.user1)
        self.assertIn(self.ca1, cs)       # own
        self.assertIn(self.ca2, cs)       # own
        self.assertIn(self.ca3, cs)       # member
        self.assertNotIn(self.ca4, cs)    # unlinked
        self.assertIn(self.ca5, cs)       # u3 guest
        self.assertNotIn(self.ca6, cs)    # unlinked
        self.assertIn(self.ca7, cs)       # u3 guest
        self.assertNotIn(self.ca8, cs)    # unlinked
        self.assertNotIn(self.ca10, cs)   # u4 no main
