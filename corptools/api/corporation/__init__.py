from .assets import AssetsApiEndpoints
from .at_a_glance import CorpGlanceApiEndpoints
from .dashboards import DashboardApiEndpoints
from .finances import FinancesApiEndpoints
from .list import ListApiEndpoints
from .mining import MiningApiEndpoints
from .status import StatusApiEndpoints
from .structures import StructureApiEndpoints


def setup(api):
    AssetsApiEndpoints(api)
    FinancesApiEndpoints(api)
    ListApiEndpoints(api)
    StatusApiEndpoints(api)
    DashboardApiEndpoints(api)
    StructureApiEndpoints(api)
    CorpGlanceApiEndpoints(api)
    MiningApiEndpoints(api)
