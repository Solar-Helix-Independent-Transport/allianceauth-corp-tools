# Standard Library
from unittest.mock import MagicMock, patch

# Third Party
from eve_sde import models as sde_models

# AA Example App
from corptools.models import CorpAsset, EveLocation
from corptools.tasks.corporation.assets import corp_update_assets

from . import CorptoolsTestCase


def _fake_asset(item_id, location_id, type_id=34, location_flag="Hangar"):
    return MagicMock(
        item_id=item_id,
        location_id=location_id,
        location_flag=location_flag,
        location_type="station",
        type_id=type_id,
        quantity=1,
        is_blueprint_copy=None,
        is_singleton=False,
    )


class CorpUpdateAssetsLocationHandlingTests(CorptoolsTestCase):
    """corp_update_assets used to resolve unknown asset locations inline via
    fetch_location_name, one ESI call per unresolved location_id, with no
    rate limiting or cooloff - the code's own comment called this out as
    the cause of ESI 420 errors. Location resolution is now handled entirely
    by the async update_all_locations/update_location pipeline instead;
    corp_update_assets should only attach the FK when the location is
    *already* known, and queue update_all_locations(corp_filter=[corp_id])
    for anything it isn't."""

    def setUp(self):
        super().setUp()
        sde_models.ItemType.objects.create(
            id=34, name="Tritanium", published=True)

        self.known_location = EveLocation.objects.create(
            location_id=60003760, location_name="Jita IV - Moon 4"
        )

    @patch("corptools.tasks.corporation.assets.chain")
    @patch("corptools.tasks.corporation.assets.update_all_locations")
    @patch("corptools.tasks.corporation.assets.build_managed_asset_locations")
    @patch("corptools.tasks.corporation.assets.run_ozone_levels")
    @patch("corptools.tasks.corporation.assets.fetch_coordiantes")
    @patch("corptools.tasks.corporation.assets.update_corporation_blueprints")
    @patch("corptools.tasks.corporation.assets.corp_update_asset_names")
    @patch("corptools.tasks.corporation.assets.get_corp_token")
    @patch("corptools.tasks.corporation.assets.providers")
    def test_known_location_attached_unknown_left_null_and_queued(
        self,
        mock_providers,
        mock_get_corp_token,
        mock_asset_names,
        mock_update_bp,
        mock_fetch_coords,
        mock_ozone,
        mock_build_managed,
        mock_update_all_locations,
        mock_chain,
    ):
        mock_get_corp_token.return_value = MagicMock(character_id=1)
        mock_providers.esi_openapi.client.Assets.GetCorporationsCorporationIdAssets.return_value.results.return_value = [
            _fake_asset(item_id=1001, location_id=60003760),
            _fake_asset(item_id=1002, location_id=1000000000000),
        ]

        corp_update_assets(self.corp1.corporation_id, force_refresh=False)

        # The already-known location is attached directly...
        known_asset = CorpAsset.objects.get(item_id=1001)
        self.assertEqual(known_asset.location_name_id, 60003760)

        # ...the unknown one is left null rather than resolved inline.
        unknown_asset = CorpAsset.objects.get(item_id=1002)
        self.assertIsNone(unknown_asset.location_name_id)

        # No inline ESI location lookups of any kind should happen anymore.
        mock_providers.esi_openapi.client.Universe.GetUniverseStationsStationId.assert_not_called()
        mock_providers.esi_openapi.client.Universe.GetUniverseStructuresStructureId.assert_not_called()

        # Resolution is instead deferred to the async pipeline, scoped to
        # just this corp.
        mock_update_all_locations.si.assert_called_once_with(
            corp_filter=[self.corp1.corporation_id]
        )
        self.assertIn(
            mock_update_all_locations.si.return_value,
            mock_chain.call_args[0][0],
        )
