"""
HTTP-level permission enforcement tests.

Classes:
  TestCharacterApiHttpPermissions  — character API (resolve_character path)
  TestCorpApiHttpPermissions       — corporation API (corp-manager perm check)
  TestWalletActivityPermissions    — character wallet/activity (needs BOTH
                                     corp-manager AND character access)
  TestViewPermissions              — Django views with @permission_required /
                                     inline PermissionDenied raises
"""

# Django
from django.contrib.auth.models import Permission

from . import CorptoolsTestCase

_STATUS_URL = "/audit/api/account/{cid}/status"


class TestCharacterApiHttpPermissions(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        self.view_module = Permission.objects.get_by_natural_key(
            'view_characteraudit', 'corptools', 'characteraudit')

    # ------------------------------------------------------------------
    # unauthenticated
    # ------------------------------------------------------------------

    def test_unauthenticated_redirects_to_login(self):
        resp = self.client.get(_STATUS_URL.format(cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 302)

    # ------------------------------------------------------------------
    # own character
    # ------------------------------------------------------------------

    def test_no_perms_own_char_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(_STATUS_URL.format(cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

    def test_view_perm_own_char_returns_200(self):
        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_STATUS_URL.format(cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 200)

    def test_character_id_zero_own_char_returns_200(self):
        # character_id=0 is the "view my own data" shorthand
        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_STATUS_URL.format(cid=0))
        self.assertEqual(resp.status_code, 200)

    # ------------------------------------------------------------------
    # other user's character
    # ------------------------------------------------------------------

    def test_view_perm_other_user_char_returns_403(self):
        # user1 can see themselves but not user2's char3 (different corp, no HR)
        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(_STATUS_URL.format(cid=self.char3.character_id))
        self.assertEqual(resp.status_code, 403)

    def test_corp_hr_same_corp_returns_200(self):
        # user2 (char3, corp2) + corp_hr can see char4 (corp2, no owner)
        self.user2.user_permissions.add(self.view_module)
        self.user2.user_permissions.add(self.view_corp_permission)
        self.client.force_login(self.user2)
        resp = self.client.get(_STATUS_URL.format(cid=self.char4.character_id))
        self.assertEqual(resp.status_code, 200)

    def test_corp_hr_different_corp_returns_403(self):
        # user2 (char3, corp2) + corp_hr cannot see char1 (corp1)
        self.user2.user_permissions.add(self.view_module)
        self.user2.user_permissions.add(self.view_corp_permission)
        self.client.force_login(self.user2)
        resp = self.client.get(_STATUS_URL.format(cid=self.char1.character_id))
        self.assertEqual(resp.status_code, 403)

    def test_global_hr_any_char_returns_200(self):
        # global_hr sees everyone
        self.user1.user_permissions.add(self.view_module)
        self.user1.user_permissions.add(self.view_all_permission)
        self.client.force_login(self.user1)
        resp = self.client.get(_STATUS_URL.format(cid=self.char3.character_id))
        self.assertEqual(resp.status_code, 200)


# ---------------------------------------------------------------------------
# Corporation API — corp-manager perm check
# ---------------------------------------------------------------------------

class TestCorpApiHttpPermissions(CorptoolsTestCase):
    """Corporation API endpoints gate on corp-manager perms, not character perms."""

    # Two representative endpoints with different holding-perm suffixes.
    _STRUCTURES_URL = "/audit/api/corp/structures"
    _WALLETTYPES_URL = "/audit/api/corporation/wallettypes"

    # ------------------------------------------------------------------
    # structures endpoint
    # ------------------------------------------------------------------

    def test_unauthenticated_structures_redirects(self):
        resp = self.client.get(self._STRUCTURES_URL)
        self.assertEqual(resp.status_code, 302)

    def test_no_perms_structures_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(self._STRUCTURES_URL)
        self.assertEqual(resp.status_code, 403)

    def test_own_corp_manager_structures_returns_200(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(self._STRUCTURES_URL)
        self.assertEqual(resp.status_code, 200)

    def test_global_corp_manager_structures_returns_200(self):
        self.user1.user_permissions.add(self.global_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(self._STRUCTURES_URL)
        self.assertEqual(resp.status_code, 200)

    # ------------------------------------------------------------------
    # wallettypes endpoint
    # ------------------------------------------------------------------

    def test_no_perms_wallettypes_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(self._WALLETTYPES_URL)
        self.assertEqual(resp.status_code, 403)

    def test_own_corp_manager_wallettypes_returns_200(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(self._WALLETTYPES_URL)
        self.assertEqual(resp.status_code, 200)


# ---------------------------------------------------------------------------
# wallet/activity — requires BOTH corp-manager AND character access
# ---------------------------------------------------------------------------

class TestWalletActivityPermissions(CorptoolsTestCase):
    """
    /audit/api/account/{cid}/wallet/activity checks corp-manager perms first,
    then calls resolve_character for the character access check.
    """

    def setUp(self):
        super().setUp()
        self.view_module = Permission.objects.get_by_natural_key(
            'view_characteraudit', 'corptools', 'characteraudit')
        self._url = f"/audit/api/account/{self.char1.character_id}/wallet/activity"

    def test_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(self._url)
        self.assertEqual(resp.status_code, 403)

    def test_view_perm_only_no_corp_manager_returns_403(self):
        # view_characteraudit alone is not enough — corp-manager check fires first
        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(self._url)
        self.assertEqual(resp.status_code, 403)

    def test_corp_manager_only_no_char_access_returns_403(self):
        # own_corp_manager alone passes the corp check but resolve_character
        # then rejects because view_characteraudit is missing
        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(self._url)
        self.assertEqual(resp.status_code, 403)

    def test_both_perms_own_char_returns_200(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.get(self._url)
        self.assertEqual(resp.status_code, 200)


# ---------------------------------------------------------------------------
# Django views — @permission_required and inline PermissionDenied
# ---------------------------------------------------------------------------

class TestViewPermissions(CorptoolsTestCase):
    """
    Verifies the two enforcement mechanisms used in views.py:

    1. @permission_required('corptools.admin') — redirects (302) when the
       requesting user lacks the permission.

    2. Inline ``raise PermissionDenied`` in fuel_levels() / metenox_levels()
       — returns 403 when no corp-manager perm is present.
    """

    # ------------------------------------------------------------------
    # @permission_required('corptools.admin') views
    # ------------------------------------------------------------------

    def test_admin_view_unauthenticated_redirects(self):
        resp = self.client.get("/audit/admin/")
        self.assertEqual(resp.status_code, 302)

    def test_admin_view_no_perm_redirects(self):
        # The 'corptools.admin' perm is not granted to any user in tests.
        self.client.force_login(self.user1)
        resp = self.client.get("/audit/admin/")
        self.assertEqual(resp.status_code, 302)

    def test_admin_view_superuser_returns_200(self):
        self.user1.is_superuser = True
        self.user1.save()
        self.client.force_login(self.user1)
        resp = self.client.get("/audit/admin/")
        self.assertEqual(resp.status_code, 200)

    # ------------------------------------------------------------------
    # fuel_levels — inline PermissionDenied
    # ------------------------------------------------------------------

    def test_fuel_levels_no_corp_perm_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get("/audit/corp/dashboard/fuel")
        self.assertEqual(resp.status_code, 403)

    def test_fuel_levels_own_corp_manager_returns_200(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get("/audit/corp/dashboard/fuel")
        self.assertEqual(resp.status_code, 200)

    # ------------------------------------------------------------------
    # metenox_levels — inline PermissionDenied
    # ------------------------------------------------------------------

    def test_metenox_levels_no_corp_perm_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get("/audit/corp/dashboard/metenox")
        self.assertEqual(resp.status_code, 403)

    def test_metenox_levels_own_corp_manager_returns_200(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get("/audit/corp/dashboard/metenox")
        self.assertEqual(resp.status_code, 200)
