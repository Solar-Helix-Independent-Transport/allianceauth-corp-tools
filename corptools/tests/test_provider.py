import json
from unittest import mock

from django.test import TestCase

from corptools import providers

from ..models import (
    EveItemCategory, EveItemDogmaAttribute, EveItemGroup, EveItemType,
)


class TestEveCategory(TestCase):
    def setUp(self):
        self.category_json = '{"category_id":25,"groups":[450,451,452],"name":"Asteroid","published":true}'
        providers.esi._client = None

    @mock.patch('esi.clients.SwaggerClient')
    def test_get_category(self, SwaggerClient):
        SwaggerClient.return_value.Universe.get_universe_categories_category_id.return_value.result.return_value = json.loads(
            self.category_json)
        category = providers.esi._get_category(25)
        self.assertIsInstance(category, EveItemCategory)
        self.assertEqual(category.category_id, 25)

    @mock.patch('esi.clients.SwaggerClient')
    def test_get_category_update_avail(self, SwaggerClient):
        SwaggerClient.return_value.Universe.get_universe_categories_category_id.return_value.result.return_value = json.loads(
            self.category_json)
        category, created, groups = providers.esi._get_category(25, updates=[
                                                                25])
        self.assertIsInstance(category, EveItemCategory)
        self.assertIsInstance(groups, list)
        self.assertFalse(created)
        self.assertEqual(category.category_id, 25)

    @mock.patch('esi.clients.SwaggerClient')
    def test_get_category_new(self, SwaggerClient):
        SwaggerClient.return_value.Universe.get_universe_categories_category_id.return_value.result.return_value = json.loads(
            self.category_json)
        category, created, groups = providers.esi._get_category(25, updates=[
                                                                50])
        self.assertIsInstance(category, EveItemCategory)
        self.assertIsInstance(groups, list)
        self.assertTrue(created)
        self.assertEqual(category.category_id, 25)


class TestEveGroup(TestCase):
    def setUp(self):
        self.group_json = '{"category_id":25,"group_id":450,"name":"Arkonor","published":true,"types":[22,23]}'
        providers.esi._client = None

    @mock.patch('esi.clients.SwaggerClient')
    def test_get_group(self, SwaggerClient):
        SwaggerClient.return_value.Universe.get_universe_groups_group_id.return_value.result.return_value = json.loads(
            self.group_json)

        group = providers.esi._get_group(450)
        self.assertIsInstance(group, EveItemGroup)
        self.assertEqual(group.group_id, 450)
        self.assertEqual(group.category_id, 25)

    @mock.patch('esi.clients.SwaggerClient')
    def test_get_group_update_avail(self, SwaggerClient):
        SwaggerClient.return_value.Universe.get_universe_groups_group_id.return_value.result.return_value = json.loads(
            self.group_json)
        group, created, items = providers.esi._get_group(450, updates=[450])
        self.assertIsInstance(group, EveItemGroup)
        self.assertIsInstance(items, list)
        self.assertFalse(created)
        self.assertEqual(group.group_id, 450)
        self.assertEqual(group.category_id, 25)

    @mock.patch('esi.clients.SwaggerClient')
    def test_get_group_new(self, SwaggerClient):
        SwaggerClient.return_value.Universe.get_universe_groups_group_id.return_value.result.return_value = json.loads(
            self.group_json)
        group, created, groups = providers.esi._get_group(450, updates=[900])
        self.assertIsInstance(group, EveItemGroup)
        self.assertIsInstance(groups, list)
        self.assertTrue(created)
        self.assertEqual(group.group_id, 450)
        self.assertEqual(group.category_id, 25)


class TestEveType(TestCase):
    def setUp(self):
        self.type_json = '{"capacity":0,"description":"One of the rarest and most sought-after ores in the known universe.","dogma_attributes":[{"attribute_id":161,"value":16},{"attribute_id":162,"value":1},{"attribute_id":2115,"value":0},{"attribute_id":4,"value":1e+35},{"attribute_id":182,"value":3386},{"attribute_id":38,"value":0},{"attribute_id":2699,"value":1},{"attribute_id":1940,"value":28367},{"attribute_id":277,"value":1},{"attribute_id":790,"value":12180},{"attribute_id":2711,"value":22},{"attribute_id":1980,"value":0.85},{"attribute_id":1981,"value":600},{"attribute_id":1941,"value":100}],"group_id":450,"icon_id":1277,"market_group_id":512,"mass":1e+35,"name":"Arkonor","packaged_volume":16,"portion_size":100,"published":true,"radius":1,"type_id":22,"volume":16}'
        providers.esi._client = None

    @mock.patch('esi.clients.SwaggerClient')
    def test_get_type(self, SwaggerClient):
        SwaggerClient.return_value.Universe.get_universe_types_type_id.return_value.result.return_value = json.loads(
            self.type_json)
        item, dogma = providers.esi._get_eve_type(22)
        self.assertIsInstance(item, EveItemType)
        self.assertIsInstance(dogma, list)
        for att in dogma:
            self.assertIsInstance(att, EveItemDogmaAttribute)
        self.assertEqual(item.type_id, 22)
        self.assertEqual(item.group_id, 450)

    @mock.patch('esi.clients.SwaggerClient')
    def test_get_type_update_avail(self, SwaggerClient):
        SwaggerClient.return_value.Universe.get_universe_types_type_id.return_value.result.return_value = json.loads(
            self.type_json)
        item, created, dogma = providers.esi._get_eve_type(22, updates=[22])
        self.assertIsInstance(item, EveItemType)
        self.assertIsInstance(dogma, list)
        for att in dogma:
            self.assertIsInstance(att, EveItemDogmaAttribute)
        self.assertFalse(created)
        self.assertEqual(item.type_id, 22)
        self.assertEqual(item.group_id, 450)

    @mock.patch('esi.clients.SwaggerClient')
    def test_get_type_new(self, SwaggerClient):
        SwaggerClient.return_value.Universe.get_universe_types_type_id.return_value.result.return_value = json.loads(
            self.type_json)
        item, created, dogma = providers.esi._get_eve_type(22, updates=[44])
        self.assertIsInstance(item, EveItemType)
        self.assertIsInstance(dogma, list)
        for att in dogma:
            self.assertIsInstance(att, EveItemDogmaAttribute)
        self.assertTrue(created)
        self.assertEqual(item.type_id, 22)
        self.assertEqual(item.group_id, 450)
