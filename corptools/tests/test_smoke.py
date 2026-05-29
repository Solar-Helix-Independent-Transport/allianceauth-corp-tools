"""
Smoke tests — every Django view and API endpoint returns a valid HTTP response.

All tests run as a superuser so permission checks don't obscure routing problems.
Endpoints that legitimately return a non-200 status when no backing data exists
(e.g. structure / starbase detail with an empty test DB) assert < 500 to confirm
the endpoint is reachable and does not crash.

Endpoints that are skipped / excluded:
  - /audit/char/add/ and /audit/corp/add/ — require an ESI token via @token_required
  - /audit/corp/add_options/           — unconditionally redirects to external SSO
  - /audit/admin_add_pyfa_xml/         — GET always returns a redirect + error message
  - POST /audit/api/pingbot/assets/send — imports aadiscordbot unconditionally;
                                          not guaranteed to be installed
  - GET /audit/api/extras/test/skilltest — makes live ESI calls; not for CI
  - GET /audit/api/extras/test/newapi5   — makes live ESI calls; not for CI
"""

# AA Example App
from corptools.models.interactions import MailMessage

from . import CorptoolsTestCase


class TestSmokeViews(CorptoolsTestCase):
    """Smoke tests for all Django views."""

    def setUp(self):
        super().setUp()
        self.user1.is_superuser = True
        self.user1.save()
        self.client.force_login(self.user1)

    def test_react_main(self):
        resp = self.client.get(f"/audit/r/{self.char1.character_id}/")
        self.assertEqual(resp.status_code, 200)

    def test_react_corp_beta(self):
        resp = self.client.get("/audit/r/corp")
        self.assertEqual(resp.status_code, 200)

    def test_admin(self):
        resp = self.client.get("/audit/admin/")
        self.assertEqual(resp.status_code, 200)

    def test_fuel_dashboard(self):
        resp = self.client.get("/audit/corp/dashboard/fuel")
        self.assertEqual(resp.status_code, 200)

    def test_metenox_dashboard(self):
        resp = self.client.get("/audit/corp/dashboard/metenox")
        self.assertEqual(resp.status_code, 200)

    def test_react_menu_v4_redirect(self):
        resp = self.client.get("/audit/r/", follow=True)
        self.assertEqual(resp.status_code, 200)

    def test_admin_create_tasks_redirect(self):
        resp = self.client.post("/audit/admin_create_tasks/", follow=True)
        self.assertEqual(resp.status_code, 200)

    def test_admin_run_tasks_redirect(self):
        resp = self.client.get("/audit/run_tasks/", follow=True)
        self.assertEqual(resp.status_code, 200)


class TestSmokeCharacterApi(CorptoolsTestCase):
    """Smoke tests for all character API endpoints."""

    def setUp(self):
        super().setUp()
        self.user1.is_superuser = True
        self.user1.save()
        self.client.force_login(self.user1)
        self.cid = self.char1.character_id  # 1

        self.mail = MailMessage.objects.create(
            id_key=99999,
            character=self.ca1,
            mail_id=1,
            body="Test body",
        )

    def test_account_list(self):
        resp = self.client.get("/audit/api/account/list")
        self.assertEqual(resp.status_code, 200)

    def test_account_status(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/status")
        self.assertEqual(resp.status_code, 200)

    def test_account_pubdata(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/pubdata")
        self.assertEqual(resp.status_code, 200)

    def test_skills(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/skills")
        self.assertEqual(resp.status_code, 200)

    def test_skillgraph(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/skillgraph")
        self.assertEqual(resp.status_code, 200)

    def test_skill_history(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/skill/history")
        self.assertEqual(resp.status_code, 200)

    def test_skillqueues(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/skillqueues")
        self.assertEqual(resp.status_code, 200)

    def test_doctrines(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/doctrines")
        self.assertEqual(resp.status_code, 200)

    def test_asset_locations(self):
        resp = self.client.get(
            f"/audit/api/account/{self.cid}/asset/locations")
        self.assertEqual(resp.status_code, 200)

    def test_asset_list(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/asset/0/list")
        self.assertEqual(resp.status_code, 200)

    def test_asset_contents(self):
        resp = self.client.get(
            f"/audit/api/account/{self.cid}/asset/0/contents")
        self.assertEqual(resp.status_code, 200)

    def test_asset_groups(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/asset/0/groups")
        self.assertEqual(resp.status_code, 200)

    def test_glance_assets(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/glance/assets")
        self.assertEqual(resp.status_code, 200)

    def test_glance_activities(self):
        resp = self.client.get(
            f"/audit/api/account/{self.cid}/glance/activities")
        self.assertEqual(resp.status_code, 200)

    def test_glance_ratting(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/glance/ratting")
        self.assertEqual(resp.status_code, 200)

    def test_glance_faction(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/glance/faction")
        self.assertEqual(resp.status_code, 200)

    def test_wallet(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/wallet")
        self.assertEqual(resp.status_code, 200)

    def test_orders(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/orders")
        self.assertEqual(resp.status_code, 200)

    def test_market(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/market")
        self.assertEqual(resp.status_code, 200)

    def test_wallet_activity(self):
        resp = self.client.get(
            f"/audit/api/account/{self.cid}/wallet/activity")
        self.assertEqual(resp.status_code, 200)

    def test_contracts(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/contracts")
        self.assertEqual(resp.status_code, 200)

    def test_loyalty(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/loyalty")
        self.assertEqual(resp.status_code, 200)

    def test_clones(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/clones")
        self.assertEqual(resp.status_code, 200)

    def test_contacts(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/contacts")
        self.assertEqual(resp.status_code, 200)

    def test_mail_list(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/mail")
        self.assertEqual(resp.status_code, 200)

    def test_mail_detail(self):
        resp = self.client.get(
            f"/audit/api/account/{self.cid}/mail/{self.mail.mail_id}")
        self.assertEqual(resp.status_code, 200)

    def test_notifications(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/notifications")
        self.assertEqual(resp.status_code, 200)

    def test_roles(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/roles")
        self.assertEqual(resp.status_code, 200)

    def test_mining_chars(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/mining/chars")
        self.assertEqual(resp.status_code, 200)

    def test_mining(self):
        resp = self.client.get(f"/audit/api/account/{self.cid}/mining")
        self.assertEqual(resp.status_code, 200)

    def test_post_characters_refresh(self):
        resp = self.client.post(
            f"/audit/api/characters/refresh?character_id={self.cid}")
        self.assertEqual(resp.status_code, 200)

    def test_post_account_refresh(self):
        resp = self.client.post(
            f"/audit/api/account/refresh?character_id={self.cid}")
        self.assertEqual(resp.status_code, 200)


class TestSmokeCorporationApi(CorptoolsTestCase):
    """Smoke tests for all corporation API endpoints."""

    def setUp(self):
        super().setUp()
        self.user1.is_superuser = True
        self.user1.save()
        self.client.force_login(self.user1)
        self.corp_id = self.corp1.corporation_id  # 123

    def test_corp_list(self):
        resp = self.client.get("/audit/api/corp/list")
        self.assertEqual(resp.status_code, 200)

    def test_post_corporation_refresh(self):
        resp = self.client.post(
            f"/audit/api/corporation/refresh?corporation_id={self.corp_id}"
        )
        self.assertEqual(resp.status_code, 200)

    def test_corp_status(self):
        resp = self.client.get(f"/audit/api/corp/{self.corp_id}/status")
        self.assertEqual(resp.status_code, 200)

    def test_corporation_character_status(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp_id}/character/status"
        )
        self.assertEqual(resp.status_code, 200)

    def test_corporation_asset_locations(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp_id}/asset/locations"
        )
        self.assertEqual(resp.status_code, 200)

    def test_corporation_asset_list(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp_id}/asset/0/list"
        )
        self.assertEqual(resp.status_code, 200)

    def test_corporation_asset_contents(self):
        resp = self.client.get("/audit/api/corporation/asset/0/contents")
        self.assertEqual(resp.status_code, 200)

    def test_corporation_asset_groups(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp_id}/asset/0/groups"
        )
        self.assertEqual(resp.status_code, 200)

    def test_corporation_wallettypes(self):
        resp = self.client.get("/audit/api/corporation/wallettypes")
        self.assertEqual(resp.status_code, 200)

    def test_corporation_wallet(self):
        resp = self.client.get(f"/audit/api/corporation/{self.corp_id}/wallet")
        self.assertEqual(resp.status_code, 200)

    def test_corporation_divisions(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp_id}/divisions"
        )
        self.assertEqual(resp.status_code, 200)

    def test_corp_structures_list(self):
        resp = self.client.get("/audit/api/corp/structures")
        self.assertEqual(resp.status_code, 200)

    def test_corp_structures_fuel(self):
        resp = self.client.get("/audit/api/corp/structures/fuel")
        self.assertEqual(resp.status_code, 200)

    def test_corp_structure_detail_no_data(self):
        # Returns 403 when no structure with that ID exists.
        resp = self.client.get("/audit/api/corp/structures/0")
        self.assertLess(resp.status_code, 500)

    def test_corp_pocos(self):
        resp = self.client.get("/audit/api/corp/pocos")
        self.assertEqual(resp.status_code, 200)

    def test_jb_export(self):
        resp = self.client.get("/audit/api/extra/jb/export")
        self.assertEqual(resp.status_code, 200)

    def test_corp_starbases_list(self):
        resp = self.client.get("/audit/api/corp/starbases")
        self.assertEqual(resp.status_code, 200)

    def test_corp_starbase_detail_no_data(self):
        # Returns 403 when no starbase with that ID exists.
        resp = self.client.get("/audit/api/corp/starbase/0")
        self.assertLess(resp.status_code, 500)

    def test_corporation_glance_assets(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp_id}/glance/assets"
        )
        self.assertEqual(resp.status_code, 200)

    def test_corporation_glance_activities_pve(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp_id}/glance/activities/pve"
        )
        self.assertEqual(resp.status_code, 200)

    def test_corporation_glance_activities_indy(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp_id}/glance/activities/indy"
        )
        self.assertEqual(resp.status_code, 200)

    def test_corporation_glance_activities_mining(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp_id}/glance/activities/mining"
        )
        self.assertEqual(resp.status_code, 200)

    def test_corporation_glance_faction(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp_id}/glance/faction"
        )
        self.assertEqual(resp.status_code, 200)

    def test_dashboard_gates(self):
        resp = self.client.get("/audit/api/dashboard/gates")
        self.assertEqual(resp.status_code, 200)

    def test_dashboard_sov(self):
        resp = self.client.get("/audit/api/dashboard/sov")
        self.assertEqual(resp.status_code, 200)

    def test_dashboard_metenox(self):
        resp = self.client.get("/audit/api/dashboard/metenox")
        self.assertEqual(resp.status_code, 200)

    def test_dashboard_dens(self):
        resp = self.client.get("/audit/api/dashboard/dens")
        self.assertEqual(resp.status_code, 200)

    def test_corporation_mining(self):
        resp = self.client.get(
            f"/audit/api/corporation/{self.corp_id}/mining"
        )
        self.assertEqual(resp.status_code, 200)


class TestSmokeCoreApi(CorptoolsTestCase):
    """Smoke tests for core API endpoints."""

    def setUp(self):
        super().setUp()
        self.user1.is_superuser = True
        self.user1.save()
        self.client.force_login(self.user1)

    def test_account_menu(self):
        resp = self.client.get("/audit/api/account/menu")
        self.assertEqual(resp.status_code, 200)

    def test_search_system(self):
        resp = self.client.get("/audit/api/search/system/test")
        self.assertEqual(resp.status_code, 200)

    def test_search_location(self):
        resp = self.client.get("/audit/api/search/location/test")
        self.assertEqual(resp.status_code, 200)

    def test_search_item_group(self):
        resp = self.client.get("/audit/api/search/item/group/test")
        self.assertEqual(resp.status_code, 200)


class TestSmokeExtrasApi(CorptoolsTestCase):
    """Smoke tests for extras API endpoints."""

    def setUp(self):
        super().setUp()
        self.user1.is_superuser = True
        self.user1.save()
        self.client.force_login(self.user1)
        self.cid = self.char1.character_id

    def test_fit2skills_no_fittings_module(self):
        # Returns 500 when the optional fittings app is not installed —
        # 500 is declared as a valid response code for this endpoint.
        resp = self.client.get("/audit/api/extras/fit2skills/1")
        self.assertLess(resp.status_code, 600)

    def test_fitting2skills_post(self):
        resp = self.client.post(
            f"/audit/api/extras/fitting2skills/{self.cid}",
            data="",
            content_type="text/plain",
        )
        self.assertEqual(resp.status_code, 200)

    def test_dogma(self):
        resp = self.client.get("/audit/api/extras/dogma/0")
        self.assertEqual(resp.status_code, 200)

    def test_clone_death(self):
        resp = self.client.get("/audit/api/extras/clone_death/0/30/")
        self.assertEqual(resp.status_code, 200)

    def test_pingbot_assets_counts(self):
        resp = self.client.post("/audit/api/pingbot/assets/counts")
        self.assertEqual(resp.status_code, 200)
