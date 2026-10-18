"""
build_managed_asset_locations names every corp office's 7 hangar divisions
("Jita IV > Main Hangar") as managed EveLocations with synthetic negative ids,
and points the assets in each division at them.
"""
# Standard Library
from unittest.mock import MagicMock, patch

# Django
from django.db import connection
from django.test.utils import CaptureQueriesContext

# AA Example App
from corptools.models import CorpAsset, EveLocation
from corptools.tasks.corporation.assets import build_managed_asset_locations

from . import CorptoolsTestCase

CORP_ASSETS = "corptools.tasks.corporation.assets"
STATION = 60003760


class TestBuildManagedAssetLocations(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        EveLocation.objects.create(
            location_id=STATION, location_name="Jita IV")

    def _asset(self, item_id, location_id, location_flag):
        return CorpAsset.objects.create(
            corporation=self.cp1, singleton=True, item_id=item_id,
            location_flag=location_flag, location_id=location_id,
            location_type="item", quantity=1, type_id=34,
        )

    def _office(self, item_id):
        office = self._asset(item_id, STATION, "OfficeFolder")
        office.location_name_id = STATION
        office.save()
        return office

    @staticmethod
    def _hangar_id(office_item_id, division):
        return -int(f"{office_item_id}{division}")

    @patch(f"{CORP_ASSETS}.get_corp_token", return_value=None)
    def test_creates_all_seven_hangars_and_points_assets_at_them(self, _token):
        self._office(1000)
        in_sag1 = self._asset(2001, 1000, "CorpSAG1")
        in_sag3 = self._asset(2003, 1000, "CorpSAG3")

        build_managed_asset_locations(self.corp1.corporation_id)

        hangars = EveLocation.objects.filter(
            managed=True, managed_corp=self.cp1)
        self.assertEqual(
            sorted(hangars.values_list("location_id", flat=True)),
            sorted(self._hangar_id(1000, j) for j in range(1, 8)))
        self.assertEqual(
            EveLocation.objects.get(
                location_id=self._hangar_id(1000, 3)).location_name,
            "Jita IV > CorpSAG3")
        in_sag1.refresh_from_db()
        in_sag3.refresh_from_db()
        self.assertEqual(in_sag1.location_name_id, self._hangar_id(1000, 1))
        self.assertEqual(in_sag3.location_name_id, self._hangar_id(1000, 3))

    @patch(f"{CORP_ASSETS}.providers")
    @patch(f"{CORP_ASSETS}.get_corp_token")
    def test_existing_hangars_are_renamed_from_divisions(self, mock_token, mock_providers):
        self._office(1000)
        EveLocation.objects.create(
            location_id=self._hangar_id(1000, 1), location_name="old name",
            managed=True, managed_corp=self.cp1)
        mock_token.return_value = MagicMock()
        division = MagicMock(division=1)
        division.name = "Main Hangar"
        mock_providers.esi_openapi.client.Corporation.GetCorporationsCorporationIdDivisions.return_value.result.return_value = MagicMock(
            hangar=[division])

        build_managed_asset_locations(self.corp1.corporation_id)

        self.assertEqual(
            EveLocation.objects.get(
                location_id=self._hangar_id(1000, 1)).location_name,
            "Jita IV > Main Hangar")
        self.assertEqual(
            EveLocation.objects.get(
                location_id=self._hangar_id(1000, 2)).location_name,
            "Jita IV > CorpSAG2")

    @patch(f"{CORP_ASSETS}.get_corp_token", return_value=None)
    def test_hangars_of_offices_that_are_gone_are_removed(self, _token):
        EveLocation.objects.create(
            location_id=self._hangar_id(999, 1), location_name="closed office",
            managed=True, managed_corp=self.cp1)
        self._office(1000)

        build_managed_asset_locations(self.corp1.corporation_id)

        self.assertFalse(
            EveLocation.objects.filter(location_id=self._hangar_id(999, 1)).exists())

    @patch(f"{CORP_ASSETS}.get_corp_token", return_value=None)
    def test_query_count_does_not_grow_per_office(self, _token):
        # Used to run an update_or_create + an UPDATE for each of the 7
        # hangars of every office - 14+ queries per office.
        def run(offices):
            CorpAsset.objects.all().delete()
            for n in range(offices):
                self._office(1000 + n)
                self._asset(5000 + n, 1000 + n, "CorpSAG1")
            with CaptureQueriesContext(connection) as ctx:
                build_managed_asset_locations(self.corp1.corporation_id)
            return len(ctx.captured_queries)

        self.assertEqual(run(1), run(5))
