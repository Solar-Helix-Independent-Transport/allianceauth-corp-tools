from .menu import MenuApiEndpoints
from .search import SearchApiEndpoints


def setup(api):
    MenuApiEndpoints(api)
    SearchApiEndpoints(api)
