"""
Updates used to flush every row for a character/corp and recreate it. That
churned pks, cascaded away child rows (coordinates) and blanked the columns
filled in by follow-up calls (names, blueprint ME/TE) until they ran again.
sync_rows brings the stored rows in line with ESI in place instead.
"""
# Standard Library
from unittest.mock import MagicMock, patch

# Third Party
from eve_sde import models as sde_models

# AA Example App
from corptools.models import (
    AssetCoordiante,
    CharacterAsset,
    CharAssetCoordiante,
    CorpAsset,
    EveLocation,
)
from corptools.task_helpers.char_tasks import update_character_assets
from corptools.task_helpers.sync import sync_rows
from corptools.tasks.corporation.assets import corp_update_assets

from . import CorptoolsTestCase

CHAR_TASKS = "corptools.task_helpers.char_tasks"
CORP_ASSETS = "corptools.tasks.corporation.assets"

ASSET_FIELDS = ["quantity", "location_id"]


def _corp_asset(corp, item_id, quantity=1, location_id=60003760, **kwargs):
    return CorpAsset(
        corporation=corp, singleton=False, item_id=item_id,
        location_flag="Hangar", location_id=location_id, location_type="station",
        quantity=quantity, type_id=34, type_name_id=34, **kwargs)


def _esi_asset(item_id, quantity=1, location_id=60003760, location_flag="Hangar"):
    return MagicMock(
        item_id=item_id, location_id=location_id, location_flag=location_flag,
        location_type="station", type_id=34, quantity=quantity,
        is_blueprint_copy=None, is_singleton=False)


class TestSyncRows(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        sde_models.ItemType.objects.create(
            id=34, name="Tritanium", published=True)

    def test_creates_updates_and_deletes_in_place(self):
        kept = _corp_asset(self.cp1, 1)
        kept.save()
        changed = _corp_asset(self.cp1, 2, quantity=5)
        changed.save()
        gone = _corp_asset(self.cp1, 3)
        gone.save()
        other_corp = _corp_asset(self.cp2, 3)
        other_corp.save()

        result = sync_rows(
            CorpAsset.objects.filter(corporation=self.cp1),
            [_corp_asset(self.cp1, 1), _corp_asset(self.cp1, 2, quantity=9),
             _corp_asset(self.cp1, 4)],
            key_fields=["item_id"], fields=ASSET_FIELDS)

        self.assertEqual(
            (result.created, result.updated, result.deleted), (1, 1, 1))
        rows = {a.item_id: a for a in CorpAsset.objects.filter(
            corporation=self.cp1)}
        self.assertEqual(set(rows), {1, 2, 4})
        self.assertEqual(rows[1].pk, kept.pk)
        self.assertEqual(rows[2].pk, changed.pk)
        self.assertEqual(rows[2].quantity, 9)
        # outside the queryset, so untouched
        self.assertTrue(CorpAsset.objects.filter(pk=other_corp.pk).exists())

    def test_unlisted_columns_survive(self):
        _corp_asset(self.cp1, 1, name="My Box", material_efficiency=10).save()

        sync_rows(
            CorpAsset.objects.filter(corporation=self.cp1),
            [_corp_asset(self.cp1, 1, quantity=2)],
            key_fields=["item_id"], fields=ASSET_FIELDS)

        row = CorpAsset.objects.get(corporation=self.cp1)
        self.assertEqual(
            (row.quantity, row.name, row.material_efficiency), (2, "My Box", 10))

    def test_unchanged_rows_are_not_written(self):
        _corp_asset(self.cp1, 1).save()

        with patch.object(CorpAsset.objects, "bulk_create") as bulk_create:
            result = sync_rows(
                CorpAsset.objects.filter(corporation=self.cp1),
                [_corp_asset(self.cp1, 1)],
                key_fields=["item_id"], fields=ASSET_FIELDS)

        bulk_create.assert_not_called()
        self.assertEqual(
            (result.created, result.updated, result.deleted), (0, 0, 0))

    def test_duplicate_stored_keys_collapse_to_one_row(self):
        first = _corp_asset(self.cp1, 1)
        first.save()
        _corp_asset(self.cp1, 1).save()

        sync_rows(
            CorpAsset.objects.filter(corporation=self.cp1),
            [_corp_asset(self.cp1, 1, quantity=3)],
            key_fields=["item_id"], fields=ASSET_FIELDS)

        rows = list(CorpAsset.objects.filter(corporation=self.cp1))
        self.assertEqual([(r.pk, r.quantity) for r in rows], [(first.pk, 3)])

    def test_duplicate_incoming_keys_last_wins(self):
        sync_rows(
            CorpAsset.objects.filter(corporation=self.cp1),
            [_corp_asset(self.cp1, 1, quantity=1),
             _corp_asset(self.cp1, 1, quantity=2)],
            key_fields=["item_id"], fields=ASSET_FIELDS)

        self.assertEqual(
            list(CorpAsset.objects.values_list("item_id", "quantity")), [(1, 2)])

    def test_merge_hook_sees_each_matched_pair(self):
        _corp_asset(self.cp1, 1, location_id=111).save()
        seen = []

        def merge(existing, incoming):
            seen.append((existing.location_id, incoming.location_id))
            incoming.quantity = 42

        sync_rows(
            CorpAsset.objects.filter(corporation=self.cp1),
            [_corp_asset(self.cp1, 1, location_id=222),
             _corp_asset(self.cp1, 2)],
            key_fields=["item_id"], fields=ASSET_FIELDS, merge=merge)

        self.assertEqual(seen, [(111, 222)])
        self.assertEqual(CorpAsset.objects.get(item_id=1).quantity, 42)


@patch(f"{CORP_ASSETS}.enqueue_next_task")
@patch(f"{CORP_ASSETS}.update_corporation_blueprints")
@patch(f"{CORP_ASSETS}.corp_update_asset_names")
@patch(f"{CORP_ASSETS}.get_corp_token")
@patch(f"{CORP_ASSETS}.providers")
class TestCorpAssetsSyncInPlace(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        sde_models.ItemType.objects.create(
            id=34, name="Tritanium", published=True)
        EveLocation.objects.create(
            location_id=60003760, location_name="Jita IV - Moon 4")

    def _run(self, mock_providers, mock_token, assets):
        mock_token.return_value = MagicMock(character_id=1)
        mock_providers.esi_openapi.client.Assets.GetCorporationsCorporationIdAssets.return_value.results.return_value = assets
        corp_update_assets(self.corp1.corporation_id)

    def test_refresh_keeps_rows_and_enrichment(self, mock_providers, mock_token, *_):
        self._run(mock_providers, mock_token,
                  [_esi_asset(1), _esi_asset(2), _esi_asset(3)])
        before = dict(CorpAsset.objects.values_list("item_id", "pk"))
        CorpAsset.objects.filter(item_id=1).update(
            name="Loot Can", material_efficiency=10, time_efficiency=20, runs=-1)

        self._run(mock_providers, mock_token,
                  [_esi_asset(1), _esi_asset(2, quantity=7), _esi_asset(4)])

        rows = {a.item_id: a for a in CorpAsset.objects.all()}
        self.assertEqual(set(rows), {1, 2, 4})
        self.assertEqual(rows[1].pk, before[1])
        self.assertEqual(rows[2].pk, before[2])
        self.assertEqual(rows[2].quantity, 7)
        self.assertEqual(
            (rows[1].name, rows[1].material_efficiency,
             rows[1].time_efficiency, rows[1].runs),
            ("Loot Can", 10, 20, -1))

    def test_coordinates_kept_unless_asset_moved(self, mock_providers, mock_token, *_):
        self._run(mock_providers, mock_token,
                  [_esi_asset(1, location_id=30000142),
                   _esi_asset(2, location_id=30000142)])
        for a in CorpAsset.objects.all():
            AssetCoordiante.objects.create(item=a, x=1, y=2, z=3)

        self._run(mock_providers, mock_token,
                  [_esi_asset(1, location_id=30000142),
                   _esi_asset(2, location_id=30000144)])

        self.assertEqual(
            list(AssetCoordiante.objects.values_list(
                "item__item_id", flat=True)),
            [1])

    def test_managed_hangar_location_survives_refresh(self, mock_providers, mock_token, *_):
        office = 1000000000001
        self._run(mock_providers, mock_token,
                  [_esi_asset(1, location_id=office, location_flag="CorpSAG1"),
                   _esi_asset(2, location_id=office, location_flag="CorpSAG1")])
        hangar = EveLocation.objects.create(
            location_id=-int(f"{office}1"), location_name="Jita > Hangar 1",
            managed=True, managed_corp=self.cp1)
        CorpAsset.objects.update(location_name=hangar)

        self._run(mock_providers, mock_token,
                  [_esi_asset(1, location_id=office, location_flag="CorpSAG1"),
                   _esi_asset(2, location_id=60003760)])

        rows = {a.item_id: a.location_name_id for a in CorpAsset.objects.all()}
        # still in the hangar: keeps the managed location rather than nulling it
        self.assertEqual(rows[1], hangar.location_id)
        # moved out to a known station: takes the new location
        self.assertEqual(rows[2], 60003760)


@patch(f"{CHAR_TASKS}.update_character_blueprints")
@patch(f"{CHAR_TASKS}.update_den_locations")
@patch(f"{CHAR_TASKS}.update_character_assets_names")
@patch(f"{CHAR_TASKS}.update_asset_locations")
@patch(f"{CHAR_TASKS}.get_current_ship_location", return_value=None)
@patch(f"{CHAR_TASKS}.get_token")
@patch(f"{CHAR_TASKS}.providers")
class TestCharacterAssetsSyncInPlace(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        sde_models.ItemType.objects.create(
            id=34, name="Tritanium", published=True)

    def _run(self, mock_providers, mock_token, assets):
        mock_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Assets.GetCharactersCharacterIdAssets.return_value.results.return_value = assets
        update_character_assets(self.char1.character_id)

    def test_refresh_keeps_rows_enrichment_and_coordinates(self, mock_providers, mock_token, *_):
        self._run(mock_providers, mock_token,
                  [_esi_asset(1, location_id=30000142),
                   _esi_asset(2, location_id=30000142),
                   _esi_asset(3)])
        before = dict(CharacterAsset.objects.values_list("item_id", "pk"))
        CharacterAsset.objects.filter(item_id=1).update(
            name="Home Base", runs=5)
        for a in CharacterAsset.objects.filter(item_id__in=[1, 2]):
            CharAssetCoordiante.objects.create(item=a, x=1, y=2, z=3)

        self._run(mock_providers, mock_token,
                  [_esi_asset(1, location_id=30000142),
                   _esi_asset(2, location_id=30000144, quantity=4)])

        rows = {a.item_id: a for a in CharacterAsset.objects.filter(
            character=self.ca1)}
        self.assertEqual(set(rows), {1, 2})
        self.assertEqual(rows[1].pk, before[1])
        self.assertEqual(rows[2].pk, before[2])
        self.assertEqual((rows[1].name, rows[1].runs), ("Home Base", 5))
        self.assertEqual(rows[2].quantity, 4)
        self.assertEqual(
            list(CharAssetCoordiante.objects.values_list(
                "item__item_id", flat=True)),
            [1])
