from .asset_pinger import AssetPingApiEndpoints
from .clone_deaths import CloneDeathApiEndpoints
from .fittings import FittingsApiEndpoints
from .testing import TestingApiEndpoints


def setup(api):
    FittingsApiEndpoints(api)
    AssetPingApiEndpoints(api)
    CloneDeathApiEndpoints(api)
    TestingApiEndpoints(api)
