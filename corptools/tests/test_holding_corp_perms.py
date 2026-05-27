"""
Tests for the holding-corp permission layer on model get_visible() methods.

Each model that supports the holding-corp concept has a classmethod:

    get_visible(user) -> queryset

The logic is always the same shape:
  1. Start from CorporationAudit.objects.visible_to(user)   (corp-manager perms)
  2. If the user has the relevant holding-corp perm, add the configured
     holding corps on top.

Three separate permissions, each tested via its primary model:
  - holding_corp_structures  →  Poco.get_visible()
  - holding_corp_assets      →  CorpAsset.get_visible()
  - holding_corp_wallets     →  CorporationWalletDivision.get_visible()

Fixture layout (from CorptoolsTestCase):
  user1  main=char1  corp1  cp1
  user2  main=char3  corp2  cp2
  corp3  cp3  ← designated as the holding corp in each setUp
"""

# Django
from django.contrib.auth.models import Permission

# AA Example App
from corptools.models import (
    CorpAsset,
    CorporationWalletDivision,
    CorptoolsConfiguration,
    Poco,
)

from . import CorptoolsTestCase


def _holding_perm(codename):
    return Permission.objects.get_by_natural_key(
        codename, 'corptools', 'corptoolsconfiguration')


# ---------------------------------------------------------------------------
# Poco  (tests holding_corp_structures perm)
# ---------------------------------------------------------------------------

class TestPocoGetVisibleHoldingCorpPerm(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        self.holding_structures = _holding_perm('holding_corp_structures')

        config, _ = CorptoolsConfiguration.objects.get_or_create(pk=1)
        config.holding_corps.add(self.corp3)

        self.poco_cp1 = Poco.objects.create(
            corporation=self.cp1, office_id=1001,
            reinforce_exit_end=0, reinforce_exit_start=0, system_id=30000142)
        self.poco_cp3 = Poco.objects.create(
            corporation=self.cp3, office_id=2001,
            reinforce_exit_end=0, reinforce_exit_start=0, system_id=30000143)

    def test_no_perms_returns_empty(self):
        qs = Poco.get_visible(self.user1)
        self.assertEqual(qs.count(), 0)

    def test_own_corp_manager_sees_own_corp_not_holding(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.user1.refresh_from_db()
        qs = Poco.get_visible(self.user1)
        self.assertIn(self.poco_cp1, qs)
        self.assertNotIn(self.poco_cp3, qs)

    def test_holding_perm_sees_holding_corp_not_own(self):
        self.user1.user_permissions.add(self.holding_structures)
        self.user1.refresh_from_db()
        qs = Poco.get_visible(self.user1)
        self.assertNotIn(self.poco_cp1, qs)
        self.assertIn(self.poco_cp3, qs)

    def test_both_perms_see_own_and_holding(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.user1.user_permissions.add(self.holding_structures)
        self.user1.refresh_from_db()
        qs = Poco.get_visible(self.user1)
        self.assertIn(self.poco_cp1, qs)
        self.assertIn(self.poco_cp3, qs)


# ---------------------------------------------------------------------------
# CorpAsset  (tests holding_corp_assets perm)
# ---------------------------------------------------------------------------

class TestCorpAssetGetVisibleHoldingCorpPerm(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        self.holding_assets = _holding_perm('holding_corp_assets')

        config, _ = CorptoolsConfiguration.objects.get_or_create(pk=1)
        config.holding_corps.add(self.corp3)

        self.asset_cp1 = CorpAsset.objects.create(
            corporation=self.cp1, singleton=False, item_id=1001,
            location_flag='Cargo', location_id=60003760,
            location_type='station', quantity=1, type_id=35)
        self.asset_cp3 = CorpAsset.objects.create(
            corporation=self.cp3, singleton=False, item_id=2001,
            location_flag='Cargo', location_id=60003761,
            location_type='station', quantity=5, type_id=35)

    def test_no_perms_returns_empty(self):
        qs = CorpAsset.get_visible(self.user1)
        self.assertEqual(qs.count(), 0)

    def test_own_corp_manager_sees_own_corp_not_holding(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.user1.refresh_from_db()
        qs = CorpAsset.get_visible(self.user1)
        self.assertIn(self.asset_cp1, qs)
        self.assertNotIn(self.asset_cp3, qs)

    def test_holding_perm_sees_holding_corp_not_own(self):
        self.user1.user_permissions.add(self.holding_assets)
        self.user1.refresh_from_db()
        qs = CorpAsset.get_visible(self.user1)
        self.assertNotIn(self.asset_cp1, qs)
        self.assertIn(self.asset_cp3, qs)

    def test_both_perms_see_own_and_holding(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.user1.user_permissions.add(self.holding_assets)
        self.user1.refresh_from_db()
        qs = CorpAsset.get_visible(self.user1)
        self.assertIn(self.asset_cp1, qs)
        self.assertIn(self.asset_cp3, qs)


# ---------------------------------------------------------------------------
# CorporationWalletDivision  (tests holding_corp_wallets perm)
# ---------------------------------------------------------------------------

class TestCorporationWalletDivisionGetVisibleHoldingCorpPerm(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        self.holding_wallets = _holding_perm('holding_corp_wallets')

        config, _ = CorptoolsConfiguration.objects.get_or_create(pk=1)
        config.holding_corps.add(self.corp3)

        self.div_cp1 = CorporationWalletDivision.objects.create(
            corporation=self.cp1, balance='1000000.00', division=1)
        self.div_cp3 = CorporationWalletDivision.objects.create(
            corporation=self.cp3, balance='9999999.00', division=1)

    def test_no_perms_returns_empty(self):
        qs = CorporationWalletDivision.get_visible(self.user1)
        self.assertEqual(qs.count(), 0)

    def test_own_corp_manager_sees_own_corp_not_holding(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.user1.refresh_from_db()
        qs = CorporationWalletDivision.get_visible(self.user1)
        self.assertIn(self.div_cp1, qs)
        self.assertNotIn(self.div_cp3, qs)

    def test_holding_perm_sees_holding_corp_not_own(self):
        self.user1.user_permissions.add(self.holding_wallets)
        self.user1.refresh_from_db()
        qs = CorporationWalletDivision.get_visible(self.user1)
        self.assertNotIn(self.div_cp1, qs)
        self.assertIn(self.div_cp3, qs)

    def test_both_perms_see_own_and_holding(self):
        self.user1.user_permissions.add(self.own_corp_manager)
        self.user1.user_permissions.add(self.holding_wallets)
        self.user1.refresh_from_db()
        qs = CorporationWalletDivision.get_visible(self.user1)
        self.assertIn(self.div_cp1, qs)
        self.assertIn(self.div_cp3, qs)
