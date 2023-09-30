from .assets import AssetsApiEndpoints
from .dashboards import DashboardApiEndpoints
from .finances import FinancesApiEndpoints
from .list import ListApiEndpoints
from .status import StatusApiEndpoints
from .structures import StructureApiEndpoints


def setup(api):
    AssetsApiEndpoints(api)
    FinancesApiEndpoints(api)
    ListApiEndpoints(api)
    StatusApiEndpoints(api)
    DashboardApiEndpoints(api)
    StructureApiEndpoints(api)
