# Standard Library
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

# Django
from django.test import TestCase

# AA Example App
from corptools.models import CharacterAudit
from corptools.models.eve_models import (
    EveItemCategory,
    EveItemGroup,
    EveItemType,
    EveName,
    MapSystem,
    MapSystemMoon,
    MapSystemPlanet,
)

from . import CorptoolsTestCase

# ---------------------------------------------------------------------------
# EveNameManager
# ---------------------------------------------------------------------------


class TestEveNameManagerGetOrCreateFromEsi(TestCase):
    def test_existing_entity_returned_without_esi_call(self):
        EveName.objects.create(
            eve_id=1001, name="Existing Pilot", category="character")
        with patch("corptools.managers.providers") as mock_providers:
            entity, created = EveName.objects.get_or_create_from_esi(1001)
        self.assertFalse(created)
        self.assertEqual(entity.name, "Existing Pilot")
        mock_providers.esi_openapi.client.Universe.PostUniverseNames.assert_not_called()

    @patch("corptools.managers.providers")
    def test_not_found_calls_esi_and_creates(self, mock_providers):
        mock_result = SimpleNamespace(
            id=2001, name="New Pilot", category="character")
        mock_providers.esi_openapi.client.Universe.PostUniverseNames.return_value.result.return_value = [
            mock_result]

        entity, created = EveName.objects.get_or_create_from_esi(2001)

        self.assertTrue(created)
        self.assertEqual(entity.eve_id, 2001)
        self.assertEqual(entity.name, "New Pilot")
        mock_providers.esi_openapi.client.Universe.PostUniverseNames.assert_called_once_with(body=[
                                                                                             2001])


class TestEveNameManagerCreateBulkFromEsi(TestCase):
    def test_empty_list_returns_true_without_esi(self):
        with patch("corptools.managers.providers") as mock_providers:
            result = EveName.objects.create_bulk_from_esi([])
        self.assertTrue(result)
        mock_providers.esi_openapi.client.Universe.PostUniverseNames.assert_not_called()

    @patch("corptools.managers.providers")
    def test_non_empty_list_calls_esi_and_bulk_creates(self, mock_providers):
        mock_result = SimpleNamespace(
            id=3001, name="Bulk Corp", category="corporation")
        mock_providers.esi_openapi.client.Universe.PostUniverseNames.return_value.result.return_value = [
            mock_result]

        result = EveName.objects.create_bulk_from_esi([3001])

        self.assertTrue(result)
        self.assertTrue(EveName.objects.filter(eve_id=3001).exists())
        mock_providers.esi_openapi.client.Universe.PostUniverseNames.assert_called_once_with(body=[
                                                                                             3001])

    @patch("corptools.managers.providers")
    def test_large_list_is_chunked(self, mock_providers):
        mock_providers.esi_openapi.client.Universe.PostUniverseNames.return_value.result.return_value = []
        ids = list(range(1000, 2001))  # 1001 IDs → two chunks

        EveName.objects.create_bulk_from_esi(ids)

        self.assertEqual(
            mock_providers.esi_openapi.client.Universe.PostUniverseNames.call_count, 2
        )


class TestEveNameManagerUpdateOrCreateFromEsi(TestCase):
    @patch("corptools.managers.providers")
    def test_success_creates_new_entity(self, mock_providers):
        mock_result = SimpleNamespace(
            id=4001, name="Created Pilot", category="character")
        mock_providers.esi_openapi.client.Universe.PostUniverseNames.return_value.result.return_value = [
            mock_result]

        entity, created = EveName.objects.update_or_create_from_esi(4001)

        self.assertTrue(created)
        self.assertEqual(entity.eve_id, 4001)
        self.assertEqual(entity.name, "Created Pilot")
        self.assertEqual(entity.category, "character")

    @patch("corptools.managers.providers")
    def test_success_updates_existing_entity(self, mock_providers):
        EveName.objects.create(
            eve_id=5001, name="Old Name", category="character")
        mock_result = SimpleNamespace(
            id=5001, name="Updated Name", category="character")
        mock_providers.esi_openapi.client.Universe.PostUniverseNames.return_value.result.return_value = [
            mock_result]

        entity, created = EveName.objects.update_or_create_from_esi(5001)

        self.assertFalse(created)
        self.assertEqual(entity.name, "Updated Name")

    @patch("corptools.managers.providers")
    def test_esi_exception_is_reraised(self, mock_providers):
        mock_providers.esi_openapi.client.Universe.PostUniverseNames.return_value.result.side_effect = RuntimeError(
            "ESI down")

        with self.assertRaises(RuntimeError):
            EveName.objects.update_or_create_from_esi(9999)


# ---------------------------------------------------------------------------
# EveCategoryManager
# ---------------------------------------------------------------------------

class TestEveCategoryManagerGetOrCreateFromEsi(TestCase):
    def test_existing_entity_returned_without_esi(self):
        EveItemCategory.objects.create(category_id=6, name="Ships")
        with patch("corptools.managers.providers") as mock_providers:
            entity, created = EveItemCategory.objects.get_or_create_from_esi(6)
        self.assertFalse(created)
        self.assertEqual(entity.name, "Ships")
        mock_providers.esi._get_category.assert_not_called()

    @patch("corptools.managers.providers")
    def test_not_found_calls_esi_and_creates(self, mock_providers):
        mock_providers.esi._get_category.return_value = SimpleNamespace(
            category_id=7, name="Modules")

        entity, created = EveItemCategory.objects.get_or_create_from_esi(7)

        self.assertTrue(created)
        self.assertEqual(entity.name, "Modules")
        mock_providers.esi._get_category.assert_called_once_with(7, False)

    @patch("corptools.managers.providers")
    def test_esi_exception_is_reraised(self, mock_providers):
        mock_providers.esi._get_category.side_effect = RuntimeError(
            "ESI Error")

        with self.assertRaises(RuntimeError):
            EveItemCategory.objects.get_or_create_from_esi(99)


# ---------------------------------------------------------------------------
# EveGroupManager
# ---------------------------------------------------------------------------

class TestEveGroupManagerGetOrCreateFromEsi(TestCase):
    def test_existing_entity_returned_without_esi(self):
        cat = EveItemCategory.objects.create(category_id=6, name="Ships")
        EveItemGroup.objects.create(group_id=25, name="Frigate", category=cat)
        with patch("corptools.managers.providers") as mock_providers:
            entity, created = EveItemGroup.objects.get_or_create_from_esi(25)
        self.assertFalse(created)
        self.assertEqual(entity.name, "Frigate")
        mock_providers.esi._get_group.assert_not_called()

    @patch("corptools.managers.providers")
    def test_not_found_calls_esi_and_creates(self, mock_providers):
        EveItemCategory.objects.create(category_id=6, name="Ships")
        mock_providers.esi._get_group.return_value = SimpleNamespace(
            group_id=26, name="Destroyer", category_id=6
        )

        entity, created = EveItemGroup.objects.get_or_create_from_esi(26)

        self.assertTrue(created)
        self.assertEqual(entity.name, "Destroyer")
        mock_providers.esi._get_group.assert_called_once_with(26, False)

    @patch("corptools.managers.providers")
    def test_esi_exception_is_reraised(self, mock_providers):
        mock_providers.esi._get_group.side_effect = RuntimeError("ESI Error")

        with self.assertRaises(RuntimeError):
            EveItemGroup.objects.get_or_create_from_esi(99)


# ---------------------------------------------------------------------------
# EveItemTypeManager
# ---------------------------------------------------------------------------

class TestEveItemTypeManagerGetOrCreateFromEsi(TestCase):
    def test_existing_entity_returned_without_esi(self):
        cat = EveItemCategory.objects.create(category_id=6, name="Ships")
        grp = EveItemGroup.objects.create(
            group_id=25, name="Frigate", category=cat)
        EveItemType.objects.create(
            type_id=587, name="Rifter", group=grp, published=True)
        with patch("corptools.managers.providers") as mock_providers:
            entity, created = EveItemType.objects.get_or_create_from_esi(587)
        self.assertFalse(created)
        self.assertEqual(entity.name, "Rifter")
        mock_providers.esi._get_eve_type.assert_not_called()


# ---------------------------------------------------------------------------
# EveMoonManager
# ---------------------------------------------------------------------------

class TestEveMoonManagerGetOrCreateFromEsi(TestCase):
    def test_existing_moon_returned_without_esi(self):
        system = MapSystem.objects.create(
            system_id=30000142, name="Jita", security_status=0.9, x=0, y=0, z=0
        )
        MapSystemMoon.objects.create(
            moon_id=40000001, system=system, name="Jita IV - Moon 4", x=0, y=0, z=0
        )
        with patch("corptools.managers.providers") as mock_providers:
            entity, created = MapSystemMoon.objects.get_or_create_from_esi(
                40000001)
        self.assertFalse(created)
        self.assertEqual(entity.name, "Jita IV - Moon 4")
        mock_providers.esi._get_moon.assert_not_called()

    @patch("corptools.managers.providers")
    def test_not_found_calls_esi_and_creates(self, mock_providers):
        system = MapSystem.objects.create(
            system_id=30000143, name="Perimeter", security_status=0.9, x=0, y=0, z=0
        )
        mock_providers.esi._get_moon.return_value = SimpleNamespace(
            moon_id=40000002, system_id=30000143, name="Perimeter Moon 1", x=1.0, y=2.0, z=3.0
        )

        entity, created = MapSystemMoon.objects.get_or_create_from_esi(
            40000002)

        self.assertTrue(created)
        self.assertEqual(entity.name, "Perimeter Moon 1")
        mock_providers.esi._get_moon.assert_called_once_with(40000002, False)


# ---------------------------------------------------------------------------
# EvePlanetManager
# ---------------------------------------------------------------------------

class TestEvePlanetManagerGetOrCreateFromEsi(TestCase):
    def test_existing_planet_returned_without_esi(self):
        system = MapSystem.objects.create(
            system_id=30000142, name="Jita", security_status=0.9, x=0, y=0, z=0
        )
        MapSystemPlanet.objects.create(
            planet_id=20000001, system=system, name="Jita IV", x=0, y=0, z=0
        )
        with patch("corptools.managers.providers") as mock_providers:
            entity, created = MapSystemPlanet.objects.get_or_create_from_esi(
                20000001)
        self.assertFalse(created)
        self.assertEqual(entity.name, "Jita IV")
        mock_providers.esi._get_planet.assert_not_called()

    @patch("corptools.managers.providers")
    def test_not_found_calls_esi_and_creates(self, mock_providers):
        system = MapSystem.objects.create(
            system_id=30000143, name="Perimeter", security_status=0.9, x=0, y=0, z=0
        )
        mock_providers.esi._get_planet.return_value = SimpleNamespace(
            planet_id=20000002, system_id=30000143, name="Perimeter III", x=1.0, y=2.0, z=3.0
        )

        entity, created = MapSystemPlanet.objects.get_or_create_from_esi(
            20000002)

        self.assertTrue(created)
        self.assertEqual(entity.name, "Perimeter III")
        mock_providers.esi._get_planet.assert_called_once_with(20000002, False)


# ---------------------------------------------------------------------------
# AuditCharacterQuerySet — corp_hr with no-alliance corp
# ---------------------------------------------------------------------------

class TestAuditCharacterCorpHrNoAlliance(CorptoolsTestCase):
    """
    User1's main (char1) is in corp1 which has no alliance.
    With only corp_hr, the code falls into the else-branch that appends
    Q(character__corporation_id=...) directly — distinct from the
    alliance_hr path which is already tested elsewhere.
    """

    def test_corp_hr_only_sees_own_corp_chars(self):
        self.user1.user_permissions.add(self.view_corp_permission)
        self.user1.refresh_from_db()
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

    def test_corp_hr_only_visible_eve_characters_sees_own_corp_chars(self):
        self.user1.user_permissions.add(self.view_corp_permission)
        self.user1.refresh_from_db()
        cs = CharacterAudit.objects.visible_eve_characters(self.user1)
        self.assertIn(self.ca1.character, cs)
        self.assertIn(self.ca2.character, cs)
        self.assertNotIn(self.ca3.character, cs)
        self.assertNotIn(self.ca4.character, cs)
        self.assertNotIn(self.ca5.character, cs)
        self.assertNotIn(self.ca6.character, cs)
        self.assertNotIn(self.ca7.character, cs)
        self.assertNotIn(self.ca8.character, cs)
        self.assertNotIn(self.ca10.character, cs)
