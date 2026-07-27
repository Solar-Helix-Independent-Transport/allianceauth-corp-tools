# Standard Library
from unittest.mock import MagicMock, patch

# Third Party
from eve_sde import models as sde_models

# Alliance Auth
from esi.exceptions import HTTPClientError

# AA Example App
from corptools.models import EveLocation, Structure, StructureCelestial
from corptools.tasks.corporation.structures import corp_structure_update

from . import CorptoolsTestCase


def _fake_structure(structure_id, name="", system_id=30000142):
    # `name` is a reserved MagicMock constructor kwarg (controls its repr),
    # so the attribute has to be set separately rather than passed in.
    structure = MagicMock(
        structure_id=structure_id,
        type_id=34,
        fuel_expires=None,
        next_reinforce_apply=None,
        profile_id=1,
        reinforce_hour=1,
        state="shield_vulnerable",
        state_timer_end=None,
        state_timer_start=None,
        system_id=system_id,
        unanchors_at=None,
        services=[],
    )
    structure.name = name
    return structure


class CorpStructureUpdateLocationHandlingTests(CorptoolsTestCase):
    """corp_structure_update used to wrap its fetch_location_name fallback
    (for structures ESI doesn't return a name for) in a bare
    `except Exception: structure_info = False`, which silently swallowed
    everything - including a 420 ESI-error-limit signal that should have
    reached esi_error_retry, and any real bug. It now goes through
    resolve_location like every other caller, so 420s propagate (to be
    caught by update_corp_audit's existing HTTPError handling, the same
    pattern already used by every other corp task) instead of vanishing."""

    def setUp(self):
        super().setUp()
        sde_models.ItemType.objects.create(
            id=34, name="Test Structure Type", published=True)

        region = sde_models.Region.objects.create(id=1, name="Test Region")
        constellation = sde_models.Constellation.objects.create(
            id=1, name="Test Constellation", region=region)
        sde_models.SolarSystem.objects.create(
            id=30000142, name="Jita", security_status=0.9,
            x=0, y=0, z=0, security_class="hisec", constellation=constellation,
        )

        # Pre-existing so _structures_db_update skips the (real HTTP call)
        # nearest-celestial lookup branch entirely - irrelevant to what
        # we're testing here.
        StructureCelestial.objects.create(
            structure_id=1000000000000, celestial_name="Some Moon")

    @patch("corptools.tasks.corporation.structures.resolve_location")
    @patch("corptools.tasks.corporation.structures.get_corp_token")
    @patch("corptools.tasks.corporation.structures.providers")
    def test_falls_back_to_resolve_location_when_esi_omits_the_name(
        self, mock_providers, mock_get_corp_token, mock_resolve_location
    ):
        mock_providers.esi_openapi.client.Corporation.GetCorporationsCorporationIdStructures.return_value.results.return_value = [
            _fake_structure(1000000000000)
        ]
        mock_get_corp_token.return_value = MagicMock(character_id=1)
        mock_resolve_location.return_value = EveLocation(
            location_id=1000000000000, location_name="Resolved Name")

        corp_structure_update(
            self.corp1.corporation_id, force_refresh=False)

        mock_resolve_location.assert_called_once_with(1000000000000, 1)
        structure = Structure.objects.get(structure_id=1000000000000)
        self.assertEqual(structure.name, "Resolved Name")

    @patch("corptools.tasks.corporation.structures.resolve_location")
    @patch("corptools.tasks.corporation.structures.get_corp_token")
    @patch("corptools.tasks.corporation.structures.providers")
    def test_esi_error_limit_propagates_instead_of_being_silently_swallowed(
        self, mock_providers, mock_get_corp_token, mock_resolve_location
    ):
        mock_providers.esi_openapi.client.Corporation.GetCorporationsCorporationIdStructures.return_value.results.return_value = [
            _fake_structure(1000000000000)
        ]
        mock_get_corp_token.return_value = MagicMock(character_id=1)
        mock_resolve_location.side_effect = HTTPClientError(
            420, {}, MagicMock())

        # update_corp_audit's own except HTTPError handles this (the same
        # pattern every other corp task already relies on) - it must not
        # raise out of corp_structure_update itself.
        result = corp_structure_update(
            self.corp1.corporation_id, force_refresh=False)

        self.assertIsNone(result)
        self.assertFalse(
            Structure.objects.filter(structure_id=1000000000000).exists())


class CorpStructureUpdateDirectNameTests(CorptoolsTestCase):
    """When ESI already includes the structure's name directly (the normal
    case for a corp's own structures - no docking-access lookup needed),
    corp_structure_update writes straight to EveLocation instead of going
    through resolve_location. That's fine w.r.t. ESI/cooloff (no ESI call is
    being made here at all), but unlike every resolve_location-backed path
    it didn't check the referenced SolarSystem actually exists locally
    before assigning system_id - a stale/incomplete SDE would raise an
    unhandled IntegrityError instead of degrading gracefully like the rest
    of the resolution paths do."""

    def setUp(self):
        super().setUp()
        sde_models.ItemType.objects.create(
            id=34, name="Test Structure Type", published=True)

        region = sde_models.Region.objects.create(id=1, name="Test Region")
        constellation = sde_models.Constellation.objects.create(
            id=1, name="Test Constellation", region=region)
        sde_models.SolarSystem.objects.create(
            id=30000142, name="Jita", security_status=0.9,
            x=0, y=0, z=0, security_class="hisec", constellation=constellation,
        )

        StructureCelestial.objects.create(
            structure_id=1000000000000, celestial_name="Some Moon")
        StructureCelestial.objects.create(
            structure_id=2000000000000, celestial_name="Some Moon")

    @patch("corptools.tasks.corporation.structures.resolve_location")
    @patch("corptools.tasks.corporation.structures.get_corp_token")
    @patch("corptools.tasks.corporation.structures.providers")
    def test_known_system_writes_location_directly_without_resolve_location(
        self, mock_providers, mock_get_corp_token, mock_resolve_location
    ):
        mock_providers.esi_openapi.client.Corporation.GetCorporationsCorporationIdStructures.return_value.results.return_value = [
            _fake_structure(1000000000000, name="Keepstar",
                            system_id=30000142)
        ]
        mock_get_corp_token.return_value = MagicMock(character_id=1)

        corp_structure_update(
            self.corp1.corporation_id, force_refresh=False)

        mock_resolve_location.assert_not_called()
        location = EveLocation.objects.get(location_id=1000000000000)
        self.assertEqual(location.location_name, "Keepstar")
        structure = Structure.objects.get(structure_id=1000000000000)
        self.assertEqual(structure.name, "Keepstar")

    # Note: an unknown system_id will still raise further down in
    # _structures_db_update, which unconditionally sets
    # Structure.system_name_id with no existence check of its own. New
    # systems are rare enough in practice that this is left alone for now -
    # see the TODO next to that assignment in structures.py.
