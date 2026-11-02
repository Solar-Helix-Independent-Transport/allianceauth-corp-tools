"""
Stale data in the structure/starbase updates:
- services were only synced when ESI listed some, so removing the last
  service module left the old ones showing online.
- a starbase whose detail 304'd was skipped whole, so state/timers from the
  (changed) listing were never written.
- starbase names were overwritten with None on runs without an assets token.
"""
# Standard Library
from datetime import timedelta
from unittest.mock import MagicMock, patch

# Third Party
from eve_sde import models as sde_models

# Django
from django.utils import timezone

# Alliance Auth
from esi.exceptions import HTTPNotModified

# AA Example App
from corptools.models import (
    Starbase,
    Structure,
    StructureCelestial,
    StructureService,
)
from corptools.tasks.corporation.structures import (
    corp_starbase_update,
    corp_structure_update,
)

from . import CorptoolsTestCase
from .test_corp_structure_update import _fake_structure

STRUCTURES = "corptools.tasks.corporation.structures"
JITA = 30000142
CONTROL_TOWER = 12235
STARBASE_ID = 1001


def _service(name, state):
    service = MagicMock(state=state)
    service.name = name
    return service


def _asset_name(name):
    asset = MagicMock(item_id=STARBASE_ID)
    asset.name = name
    return asset


class _MapMixin:

    def setUp(self):
        super().setUp()
        region = sde_models.Region.objects.create(id=1, name="Test Region")
        constellation = sde_models.Constellation.objects.create(
            id=1, name="Test Constellation", region=region)
        sde_models.SolarSystem.objects.create(
            id=JITA, name="Jita", security_status=0.9, x=0, y=0, z=0,
            security_class="hisec", constellation=constellation)


@patch(f"{STRUCTURES}.get_corp_token", return_value=MagicMock(character_id=1))
@patch(f"{STRUCTURES}.providers")
class TestStructureServices(_MapMixin, CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        sde_models.ItemType.objects.create(
            id=34, name="Test Structure Type", published=True)
        # skips the nearest-celestial HTTP lookup
        StructureCelestial.objects.create(
            structure_id=1000000000000, celestial_name="Some Moon")

    def _run(self, mock_providers, services):
        structure = _fake_structure(1000000000000, name="Keepstar")
        structure.services = services
        mock_providers.esi_openapi.client.Corporation.GetCorporationsCorporationIdStructures.return_value.results.return_value = [
            structure]
        corp_structure_update(self.corp1.corporation_id, force_refresh=False)

    def _services(self):
        return dict(StructureService.objects.filter(
            structure__structure_id=1000000000000).values_list("name", "state"))

    def test_services_sync_in_place(self, mock_providers, *_):
        self._run(mock_providers, [_service("Market", "online"),
                                   _service("Clone Bay", "online")])
        market = StructureService.objects.get(name="Market").pk

        self._run(mock_providers, [_service("Market", "offline")])

        self.assertEqual(self._services(), {"Market": "offline"})
        self.assertEqual(StructureService.objects.get(
            name="Market").pk, market)

    def test_last_service_removed_clears(self, mock_providers, *_):
        self._run(mock_providers, [_service("Market", "online")])

        self._run(mock_providers, None)

        self.assertEqual(self._services(), {})

    def test_duplicate_services_collapse(self, mock_providers, *_):
        self._run(mock_providers, [_service("Market", "online")])
        StructureService.objects.create(
            structure=Structure.objects.get(), name="Market", state="online")

        self._run(mock_providers, [_service("Market", "online")])

        self.assertEqual(StructureService.objects.count(), 1)


@patch(f"{STRUCTURES}.providers")
class TestStarbaseStaleData(_MapMixin, CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        sde_models.ItemType.objects.create(
            id=CONTROL_TOWER, name="Amarr Control Tower", published=True)

    def _listing(self, state="online", reinforced_until=None):
        return MagicMock(
            starbase_id=STARBASE_ID, moon_id=None, onlined_since=None,
            reinforced_until=reinforced_until, unanchor_at=None, state=state,
            system_id=JITA, type_id=CONTROL_TOWER)

    def _detail(self):
        return MagicMock(
            allow_alliance_members=True, allow_corporation_members=True,
            anchor="config_starbase_equipment_role",
            attack_if_at_war=True, attack_if_other_security_status_dropping=False,
            attack_security_status_threshold=None, attack_standing_threshold=None,
            fuel_bay_take="config_starbase_equipment_role",
            fuel_bay_view="config_starbase_equipment_role",
            offline="config_starbase_equipment_role",
            online="config_starbase_equipment_role",
            unanchor="config_starbase_equipment_role",
            use_alliance_standings=False, fuels=[])

    def _run(self, mock_providers, listing, detail=None, names=None, assets_token=True):
        corp = mock_providers.esi_openapi.client.Corporation
        corp.GetCorporationsCorporationIdStarbases.return_value.results.return_value = [
            listing]
        detail_call = corp.GetCorporationsCorporationIdStarbasesStarbaseId.return_value.result
        detail_call.reset_mock()
        if detail is None:
            detail_call.side_effect = HTTPNotModified(304, {})
        else:
            detail_call.side_effect = None
            detail_call.return_value = detail
        mock_providers.esi_openapi.client.Assets.PostCorporationsCorporationIdAssetsNames.return_value.result.return_value = [
            _asset_name(n) for n in (names or [])]

        with patch(f"{STRUCTURES}.get_corp_token",
                   side_effect=[MagicMock(), MagicMock() if assets_token else None]):
            corp_starbase_update(
                self.corp1.corporation_id, force_refresh=False)
        return detail_call

    def test_listing_change_written_when_detail_unchanged(self, mock_providers):
        self._run(mock_providers, self._listing(),
                  self._detail(), names=["Tower"])
        until = timezone.now() + timedelta(days=1)

        self._run(mock_providers,
                  self._listing(state="reinforced", reinforced_until=until),
                  detail=None, names=["Tower"])

        sb = Starbase.objects.get(starbase_id=STARBASE_ID)
        self.assertEqual((sb.state, sb.reinforced_until),
                         ("reinforced", until))
        self.assertTrue(sb.allow_alliance_members)

    def test_unknown_starbase_skips_etag(self, mock_providers):
        detail_call = self._run(
            mock_providers, self._listing(), self._detail())

        self.assertFalse(detail_call.call_args.kwargs["use_etag"])
        self.assertTrue(Starbase.objects.filter(
            starbase_id=STARBASE_ID).exists())

    def test_name_kept_without_assets_token(self, mock_providers):
        self._run(mock_providers, self._listing(),
                  self._detail(), names=["Tower"])

        self._run(mock_providers, self._listing(state="reinforced"),
                  self._detail(), assets_token=False)

        sb = Starbase.objects.get(starbase_id=STARBASE_ID)
        self.assertEqual((sb.name, sb.state), ("Tower", "reinforced"))
