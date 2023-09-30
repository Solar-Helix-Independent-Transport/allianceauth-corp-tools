from .asset_pinger import AssetPingApiEndpoints
from .fittings import FittingsApiEndpoints


def setup(api):
    FittingsApiEndpoints(api)
    AssetPingApiEndpoints(api)
