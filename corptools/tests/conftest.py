# Third Party
import pytest


@pytest.fixture(autouse=True)
def _fresh_universe_map_cache():
    """The whole-universe space map is cached per process (see
    corptools.api.spacemap) - start every test without one, so a map cached
    in one test's SDE data can't be served in another's."""
    # AA Example App
    from corptools.api import spacemap

    spacemap._universe_map_cache.clear()
    yield
    spacemap._universe_map_cache.clear()
