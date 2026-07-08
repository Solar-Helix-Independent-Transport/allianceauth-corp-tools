# Standard Library
from unittest.mock import MagicMock, patch

# AA Example App
from corptools.models import (
    CharacterAsset,
    CharacterAudit,
    CorpAsset,
    CorptoolsConfiguration,
)
from corptools.task_helpers.char_tasks import update_character_blueprints
from corptools.tasks.corporation.assets import update_corporation_blueprints

from . import CorptoolsTestCase


def _bp(item_id, me=10, te=20, runs=50):
    bp = MagicMock()
    bp.item_id = item_id
    bp.material_efficiency = me
    bp.time_efficiency = te
    bp.runs = runs
    return bp


def _mock_providers(mock_providers, blueprints, tag="Character",
                    operation="GetCharactersCharacterIdBlueprints"):
    op = getattr(getattr(mock_providers.esi_openapi.client, tag), operation)
    op.return_value.results.return_value = blueprints
    # chunk_ids is used to batch the asset update; keep it a real chunker.
    mock_providers.esi_openapi.chunk_ids.side_effect = \
        lambda lo, n=750: [lo[i:i + n] for i in range(0, len(lo), n)]


class TestCharacterBlueprintEnrichment(CorptoolsTestCase):
    def setUp(self):
        super().setUp()
        self.audit, _ = CharacterAudit.objects.get_or_create(
            character=self.char1)
        self.asset = CharacterAsset.objects.create(
            character=self.audit,
            type_id=999,
            item_id=5001,
            location_id=60003760,
            location_flag="Hangar",
            location_type="station",
            quantity=1,
            singleton=True,
            blueprint_copy=True,
        )

    @patch("corptools.task_helpers.char_tasks.get_token")
    def test_disabled_via_config_skips_pull(self, mock_get_token):
        config = CorptoolsConfiguration.get_solo()
        config.disable_update_blueprints = True
        config.save()

        result = update_character_blueprints(self.char1.character_id)

        self.assertEqual(result, "Disabled")
        mock_get_token.assert_not_called()

    @patch("corptools.task_helpers.char_tasks.get_token")
    def test_no_token_returns_early(self, mock_get_token):
        mock_get_token.return_value = False

        result = update_character_blueprints(self.char1.character_id)

        self.assertEqual(result, "No Tokens")
        self.asset.refresh_from_db()
        self.assertIsNone(self.asset.material_efficiency)

    @patch("corptools.task_helpers.char_tasks.providers")
    @patch("corptools.task_helpers.char_tasks.get_token")
    def test_enriches_assets_by_item_id(self, mock_get_token, mock_providers):
        mock_get_token.return_value = MagicMock()
        _mock_providers(
            mock_providers, [_bp(5001), _bp(4040)])  # 4040: no matching asset

        update_character_blueprints(self.char1.character_id)

        self.asset.refresh_from_db()
        self.assertEqual(self.asset.material_efficiency, 10)
        self.assertEqual(self.asset.time_efficiency, 20)
        self.assertEqual(self.asset.runs, 50)


class TestCorporationBlueprintEnrichment(CorptoolsTestCase):
    def setUp(self):
        super().setUp()
        self.asset = CorpAsset.objects.create(
            corporation=self.cp1,
            type_id=999,
            item_id=6001,
            location_id=60003760,
            location_flag="CorpSAG1",
            location_type="station",
            quantity=1,
            singleton=True,
            blueprint_copy=True,
        )

    @patch("corptools.tasks.corporation.assets.get_corp_token")
    def test_disabled_via_config_skips_pull(self, mock_get_corp_token):
        config = CorptoolsConfiguration.get_solo()
        config.disable_update_blueprints = True
        config.save()

        result = update_corporation_blueprints(
            self.corp1.corporation_id)

        self.assertEqual(result, "Disabled")
        mock_get_corp_token.assert_not_called()

    @patch("corptools.tasks.corporation.assets.providers")
    @patch("corptools.tasks.corporation.assets.get_corp_token")
    def test_enriches_assets_by_item_id(self, mock_get_corp_token,
                                        mock_providers):
        mock_get_corp_token.return_value = MagicMock()
        _mock_providers(
            mock_providers, [_bp(6001, me=5, te=10, runs=-1)],
            tag="Corporation", operation="GetCorporationsCorporationIdBlueprints")

        update_corporation_blueprints(self.corp1.corporation_id)

        self.asset.refresh_from_db()
        self.assertEqual(self.asset.material_efficiency, 5)
        self.assertEqual(self.asset.time_efficiency, 10)
        self.assertEqual(self.asset.runs, -1)
