"""
Sovereignty hub reagents and upgrades are synced in place rather than flushed
and recreated on every hub detail refresh.
"""
# Standard Library
from unittest.mock import MagicMock, patch

# Third Party
from eve_sde import models as sde_models

# AA Example App
from corptools.models.sovereignty import (
    SovereigntyHub,
    SovereigntyHubReagent,
    SovereigntyHubUpgrade,
)
from corptools.tasks.corporation.sovereignty import (
    corp_sovereignty_hub_detail_update,
)

from . import CorptoolsTestCase

SOV = "corptools.tasks.corporation.sovereignty"

MAGMATIC = 81143
SUPERIONIC = 81144
MINER = 81615
SCANNER = 81616


def _detail(reagents, upgrades):
    detail = MagicMock(id=1, solar_system_id=30000142, resources=None,
                       vulnerability_window=None, workforce_transport=None,
                       fuel_access_list_id=None)
    if reagents is None:
        detail.reagent_bay = None
    else:
        detail.reagent_bay.last_updated = None
        detail.reagent_bay.reagents = [
            MagicMock(type_id=t, amount=a, burning_per_hour=b) for t, a, b in reagents]
    detail.upgrades = None if upgrades is None else [
        MagicMock(type_id=t, power_state=p) for t, p in upgrades]
    return detail


@patch(f"{SOV}.get_corp_token")
@patch(f"{SOV}.providers")
class TestSovHubSync(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        region = sde_models.Region.objects.create(
            id=10000002, name="The Forge")
        const = sde_models.Constellation.objects.create(
            id=20000020, name="Kimotoro", region=region)
        sde_models.SolarSystem.objects.create(
            id=30000142, name="Jita", security_status=0.9, x=0, y=0, z=0,
            constellation=const)
        for i in (MAGMATIC, SUPERIONIC, MINER, SCANNER):
            sde_models.ItemType.objects.create(
                id=i, name=f"type {i}", published=True)

    def _run(self, mock_providers, mock_token, detail):
        mock_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Structures.GetCorporationsStructuresSovereigntyHubsDetail.return_value.result.return_value = detail
        corp_sovereignty_hub_detail_update(self.corp1.corporation_id, 1)

    def test_refresh_updates_in_place(self, mock_providers, mock_token):
        self._run(mock_providers, mock_token, _detail(
            [(MAGMATIC, 1000, 10), (SUPERIONIC, 500, 5)],
            [(MINER, "online"), (SCANNER, "online")]))
        reagents = dict(
            SovereigntyHubReagent.objects.values_list("type_name_id", "pk"))
        upgrades = dict(
            SovereigntyHubUpgrade.objects.values_list("type_name_id", "pk"))

        self._run(mock_providers, mock_token, _detail(
            [(MAGMATIC, 990, 10)],
            [(MINER, "low_power"), (SCANNER, "online")]))

        hub = SovereigntyHub.objects.get(hub_id=1)
        self.assertEqual(
            list(hub.reagents.values_list("pk", "type_name_id", "amount")),
            [(reagents[MAGMATIC], MAGMATIC, 990)])
        self.assertEqual(
            sorted(hub.upgrades.values_list(
                "pk", "type_name_id", "power_state")),
            sorted([(upgrades[MINER], MINER, "low_power"),
                    (upgrades[SCANNER], SCANNER, "online")]))

    def test_missing_bay_and_upgrades_clear(self, mock_providers, mock_token):
        self._run(mock_providers, mock_token, _detail(
            [(MAGMATIC, 1000, 10)], [(MINER, "online")]))

        self._run(mock_providers, mock_token, _detail(None, None))

        hub = SovereigntyHub.objects.get(hub_id=1)
        self.assertFalse(hub.reagents.exists())
        self.assertFalse(hub.upgrades.exists())
