"""
HTTP-level permission enforcement tests.

Classes:
  TestCharacterApiHttpPermissions  — character API (resolve_character path)
  TestCorpApiHttpPermissions       — corporation API (corp-manager perm check)
  TestCorpMiningLedgerPermissions  — corp mining ledger (corp-manager perms
                                     plus holding_corp_wallets)
  TestCorporationMenuPermissions   — corp/menu reflects the caller's actual
                                     per-domain access rather than a fixed list
  TestWalletActivityPermissions    — character wallet/activity (needs BOTH
                                     corp-manager AND character access)
  TestViewPermissions              — Django views with @permission_required /
                                     inline PermissionDenied raises
"""

# Django
from django.contrib.auth.models import Permission
from django.utils import timezone

# AA Example App
from corptools.models import Contract, CorporateContract, EveName

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
# mining ledger — same corp-manager gate as its siblings, plus
# holding_corp_wallets (it reports ISK value, so it's grouped with the
# wallet-tier holding perm rather than holding_corp_structures/assets)
# ---------------------------------------------------------------------------

class TestCorpMiningLedgerPermissions(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        self.holding_wallets = Permission.objects.get_by_natural_key(
            'holding_corp_wallets', 'corptools', 'corptoolsconfiguration')
        self._url = f"/audit/api/corporation/{self.corp1.corporation_id}/mining"

    def test_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.get(self._url)
        self.assertEqual(resp.status_code, 403)

    def test_own_corp_manager_returns_200(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(self._url)
        self.assertEqual(resp.status_code, 200)

    def test_holding_corp_wallets_returns_200(self):
        self.user1.user_permissions.add(self.holding_wallets)
        self.client.force_login(self.user1)
        resp = self.client.get(self._url)
        self.assertEqual(resp.status_code, 200)


# ---------------------------------------------------------------------------
# corp/menu — reflects the caller's actual per-domain access
# ---------------------------------------------------------------------------

class TestCorporationMenuPermissions(CorptoolsTestCase):

    _MENU_URL = "/audit/api/corp/menu"

    @staticmethod
    def _names(menu):
        # top-level entries and every nested link name, flattened
        out = set()
        for cat in menu:
            out.add(cat["name"])
            for link in cat.get("links") or []:
                out.add(link["name"])
        return out

    def test_no_perms_returns_no_categories(self):
        self.client.force_login(self.user1)
        resp = self.client.get(self._MENU_URL)
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json(), [])

    def test_own_corp_manager_sees_everything(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.get(self._MENU_URL)
        names = self._names(resp.json())
        for expected in (
            "Overview", "Structures", "Pocos", "Starbases",
            "Sovereignty Hubs", "Sovereignty Map", "Wallets",
            "Assets", "Asset Overview", "Asset List", "Dashboards",
            "Fuel", "Metenox", "Bridges", "Character Mining Ledger",
            "Activity Map",
        ):
            self.assertIn(expected, names)
        self.assertNotIn("Admin", names)

    def test_superuser_sees_admin(self):
        self.user1.is_superuser = True
        self.user1.save()
        self.client.force_login(self.user1)
        resp = self.client.get(self._MENU_URL)
        self.assertIn("Admin", self._names(resp.json()))

    def test_no_perms_no_admin_link(self):
        self.client.force_login(self.user1)
        resp = self.client.get(self._MENU_URL)
        self.assertNotIn("Admin", self._names(resp.json()))

    def test_holding_corp_wallets_only_sees_wallets_and_mining_not_structures_or_assets(self):
        holding_wallets = Permission.objects.get_by_natural_key(
            'holding_corp_wallets', 'corptools', 'corptoolsconfiguration')
        self.user1.user_permissions.add(holding_wallets)
        self.client.force_login(self.user1)
        resp = self.client.get(self._MENU_URL)
        names = self._names(resp.json())

        self.assertIn("Wallets", names)
        self.assertIn("Character Mining Ledger", names)
        self.assertIn("Activity Map", names)
        # Dashboards still shows since Mining Ledger/Activity Map live in it.
        self.assertIn("Dashboards", names)

        self.assertNotIn("Overview", names)
        self.assertNotIn("Structures", names)
        self.assertNotIn("Assets", names)
        self.assertNotIn("Fuel", names)
        self.assertNotIn("Bridges", names)

    def test_holding_corp_structures_only_sees_structures_dashboards_not_wallets_or_assets(self):
        holding_structures = Permission.objects.get_by_natural_key(
            'holding_corp_structures', 'corptools', 'corptoolsconfiguration')
        self.user1.user_permissions.add(holding_structures)
        self.client.force_login(self.user1)
        resp = self.client.get(self._MENU_URL)
        names = self._names(resp.json())

        self.assertIn("Overview", names)
        self.assertIn("Structures", names)
        self.assertIn("Dashboards", names)
        self.assertIn("Fuel", names)
        self.assertIn("Bridges", names)
        self.assertIn("Activity Map", names)

        self.assertNotIn("Wallets", names)
        self.assertNotIn("Character Mining Ledger", names)
        self.assertNotIn("Assets", names)


# ---------------------------------------------------------------------------
# show_if_director — was wired into visible_to() and the nav menus, but every
# individual corp/* endpoint's own hand-rolled perm gate omitted it. Fixed
# across structures.py, finances.py, assets.py, dashboards.py, mining.py,
# activity_map.py, sovereignty.py, character/finances.py, and views.py.
# ---------------------------------------------------------------------------

class TestShowIfDirectorAcrossEndpoints(CorptoolsTestCase):
    """
    user3 owns char7 (corp4) and char7 is flagged as a director there
    (see CorptoolsTestCase.setUp). show_if_director alone should now be
    enough to pass every one of these gates.
    """

    def setUp(self):
        super().setUp()
        self.user3.user_permissions.add(self.director_manager)
        self.client.force_login(self.user3)

    def test_structures(self):
        resp = self.client.get("/audit/api/corp/structures")
        self.assertEqual(resp.status_code, 200)

    def test_pocos(self):
        resp = self.client.get("/audit/api/corp/pocos")
        self.assertEqual(resp.status_code, 200)

    def test_starbases(self):
        resp = self.client.get("/audit/api/corp/starbases")
        self.assertEqual(resp.status_code, 200)

    def test_wallettypes(self):
        resp = self.client.get("/audit/api/corporation/wallettypes")
        self.assertEqual(resp.status_code, 200)

    def test_wallet(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp4.corporation_id}/wallet")
        self.assertEqual(resp.status_code, 200)

    def test_asset_locations(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp4.corporation_id}/asset/locations")
        self.assertEqual(resp.status_code, 200)

    def test_mining(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp4.corporation_id}/mining")
        self.assertEqual(resp.status_code, 200)

    def test_sovhubs(self):
        resp = self.client.get("/audit/api/corp/sovhubs")
        self.assertEqual(resp.status_code, 200)

    def test_dashboard_gates(self):
        resp = self.client.get("/audit/api/dashboard/gates")
        self.assertEqual(resp.status_code, 200)

    def test_dashboard_dens(self):
        resp = self.client.get("/audit/api/dashboard/dens")
        self.assertEqual(resp.status_code, 200)

    def test_activity_map_assets(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp4.corporation_id}/activitymap/assets")
        self.assertEqual(resp.status_code, 200)

    def test_character_wallet_activity(self):
        # Requires BOTH the corp-tier check (now satisfied by
        # show_if_director) AND resolve_character's own-character check.
        view_module = Permission.objects.get_by_natural_key(
            'view_characteraudit', 'corptools', 'characteraudit')
        self.user3.user_permissions.add(view_module)
        resp = self.client.get(
            f"/audit/api/account/{self.char7.character_id}/wallet/activity")
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
# contract items repull — same resolve_character gate as other account
# endpoints, plus a 404 for a contract that isn't the caller's own
# ---------------------------------------------------------------------------

class TestContractItemsRefreshPermissions(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        self.view_module = Permission.objects.get_by_natural_key(
            'view_characteraudit', 'corptools', 'characteraudit')

        eve_name, _ = EveName.objects.get_or_create(
            eve_id=1, defaults={"name": "Someone", "category": "character"})
        self.contract = Contract.objects.create(
            id=Contract.build_pk(self.ca1.id, 999),
            character=self.ca1,
            contract_id=999,
            acceptor_id=0, acceptor_name=eve_name,
            assignee_id=0, assignee_name=eve_name,
            issuer_id=1, issuer_name=eve_name,
            issuer_corporation_id=1, issuer_corporation_name=eve_name,
            days_to_complete=0,
            for_corporation=False,
            date_expired=timezone.now(),
            date_issued=timezone.now(),
            status="outstanding",
            contract_type="item_exchange",
            availability="private",
            title="",
        )
        self._url = (
            f"/audit/api/account/{self.char1.character_id}"
            f"/contract/{self.contract.contract_id}/items/refresh"
        )

    def test_unauthenticated_redirects_to_login(self):
        resp = self.client.post(self._url)
        self.assertEqual(resp.status_code, 302)

    def test_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.post(self._url)
        self.assertEqual(resp.status_code, 403)

    def test_wrong_contract_id_returns_404(self):
        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.post(
            f"/audit/api/account/{self.char1.character_id}/contract/123456/items/refresh")
        self.assertEqual(resp.status_code, 404)

    def test_other_users_character_returns_403(self):
        # user2 can't view char1 at all, so resolve_character rejects this
        # before the contract lookup is ever reached.
        self.user2.user_permissions.add(self.view_module)
        self.client.force_login(self.user2)
        resp = self.client.post(self._url)
        self.assertEqual(resp.status_code, 403)

    def test_own_contract_returns_200(self):
        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        resp = self.client.post(self._url)
        self.assertEqual(resp.status_code, 200)

    def test_second_request_is_rate_limited(self):
        self.user1.user_permissions.add(self.view_module)
        self.client.force_login(self.user1)
        self.client.post(self._url)
        resp = self.client.post(self._url)
        self.assertEqual(resp.status_code, 200)
        self.assertIn("GO AWAY", resp.json()["message"])


# ---------------------------------------------------------------------------
# corp contract items repull — same corp-manager gate (visible_to()) as
# corp/list and corporation/refresh, plus a 404 for an unknown contract
# ---------------------------------------------------------------------------

class TestCorporationContractItemsRefreshPermissions(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        eve_name, _ = EveName.objects.get_or_create(
            eve_id=1, defaults={"name": "Someone", "category": "character"})
        self.contract = CorporateContract.objects.create(
            id=CorporateContract.build_pk(self.cp1.id, 999),
            corporation=self.cp1,
            contract_id=999,
            acceptor_id=0, acceptor_name=eve_name,
            assignee_id=0, assignee_name=eve_name,
            issuer_id=1, issuer_name=eve_name,
            issuer_corporation_id=1, issuer_corporation_name=eve_name,
            days_to_complete=0,
            for_corporation=True,
            date_expired=timezone.now(),
            date_issued=timezone.now(),
            status="outstanding",
            contract_type="item_exchange",
            availability="private",
            title="",
        )
        self._url = (
            f"/audit/api/corporation/{self.corp1.corporation_id}"
            f"/contract/{self.contract.contract_id}/items/refresh"
        )

    def test_unauthenticated_redirects_to_login(self):
        resp = self.client.post(self._url)
        self.assertEqual(resp.status_code, 302)

    def test_no_perms_returns_403(self):
        self.client.force_login(self.user1)
        resp = self.client.post(self._url)
        self.assertEqual(resp.status_code, 403)

    def test_wrong_contract_id_returns_404(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.post(
            f"/audit/api/corporation/{self.corp1.corporation_id}/contract/123456/items/refresh")
        self.assertEqual(resp.status_code, 404)

    def test_other_corp_manager_cannot_see_own_corp_returns_403(self):
        # user2 manages corp2, not corp1.
        self.user2.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user2)
        resp = self.client.post(self._url)
        self.assertEqual(resp.status_code, 403)

    def test_own_corp_manager_returns_200(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        resp = self.client.post(self._url)
        self.assertEqual(resp.status_code, 200)

    def test_second_request_is_rate_limited(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.client.force_login(self.user1)
        self.client.post(self._url)
        resp = self.client.post(self._url)
        self.assertEqual(resp.status_code, 200)
        self.assertIn("GO AWAY", resp.json()["message"])


# ---------------------------------------------------------------------------
# Django views — @user_passes_test(is_superuser) and inline PermissionDenied
# ---------------------------------------------------------------------------

class TestViewPermissions(CorptoolsTestCase):
    """
    Verifies the two enforcement mechanisms used in views.py:

    1. @user_passes_test(lambda u: u.is_superuser) — redirects (302) when
       the requesting user isn't a superuser. Previously this was
       @permission_required('corptools.admin'), but that permission was
       never defined anywhere, so it was a de facto (accidental)
       superuser-only gate; this makes the actual, intended check explicit.

    2. Inline ``raise PermissionDenied`` in fuel_levels() / metenox_levels()
       — returns 403 when no corp-manager perm is present.
    """

    # ------------------------------------------------------------------
    # @user_passes_test(lambda u: u.is_superuser) views
    # ------------------------------------------------------------------

    def test_admin_view_unauthenticated_redirects(self):
        resp = self.client.get("/audit/admin/")
        self.assertEqual(resp.status_code, 302)

    def test_admin_view_non_superuser_redirects(self):
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

    def test_fuel_levels_show_if_director_returns_200(self):
        self.user3.user_permissions.add(self.director_manager)
        self.client.force_login(self.user3)
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

    def test_metenox_levels_show_if_director_returns_200(self):
        self.user3.user_permissions.add(self.director_manager)
        self.client.force_login(self.user3)
        resp = self.client.get("/audit/corp/dashboard/metenox")
        self.assertEqual(resp.status_code, 200)
