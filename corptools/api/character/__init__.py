from .assets import AssetsApiEndpoints
from .at_a_glance import GlanceApiEndpoints
from .clones import CloneApiEndpoints
from .finances import FinancesApiEndpoints
from .industry import IndustryApiEndpoints
from .interactions import InteractionApiEndpoints
from .list import ListApiEndpoints
from .mining import MiningApiEndpoints
from .refresh import RefreshApiEndpoints
from .roles import RolesApiEndpoints
from .skills import SkillApiEndpoints
from .status import StatusApiEndpoints


def setup(api):
    AssetsApiEndpoints(api)
    IndustryApiEndpoints(api)
    CloneApiEndpoints(api)
    FinancesApiEndpoints(api)
    InteractionApiEndpoints(api)
    ListApiEndpoints(api)
    MiningApiEndpoints(api)
    RolesApiEndpoints(api)
    SkillApiEndpoints(api)
    StatusApiEndpoints(api)
    RefreshApiEndpoints(api)
    GlanceApiEndpoints(api)
