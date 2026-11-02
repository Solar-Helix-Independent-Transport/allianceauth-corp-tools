"""
django-esi stores a response's ETag as soon as it arrives, before we've
written anything. If the task then fails, the next run gets a 304 and skips
the write, and keeps doing so (each 304 renews the ETag) until the data
changes in game.

clear_etags_on_error() records every ETag stored or renewed inside it and
deletes them if the block raises, so the next run fetches in full.
"""
# Standard Library
from contextlib import contextmanager
from contextvars import ContextVar
from functools import wraps

# Django
from django.core.cache import cache

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from esi.exceptions import HTTPNotModified
from esi.openapi_clients import EsiOperation

logger = get_extension_logger(__name__)

_tracked_keys: ContextVar = ContextVar("corptools_etag_keys", default=None)


def _track(method):
    @wraps(method)
    def wrapper(self, *args, **kwargs):
        result = method(self, *args, **kwargs)
        keys = _tracked_keys.get()
        if keys is not None:
            keys.add(self._etag_key())
        return result
    wrapper._corptools_tracked = True
    return wrapper


def install():
    for name in ("_store_etag", "_update_etag_ttl"):
        method = getattr(EsiOperation, name)
        if not getattr(method, "_corptools_tracked", False):
            setattr(EsiOperation, name, _track(method))


install()


@contextmanager
def clear_etags_on_error():
    keys = set()
    token = _tracked_keys.set(keys)
    try:
        yield
    except HTTPNotModified:
        # a 304 means nothing new was fetched, so nothing went unwritten
        raise
    except BaseException:
        if keys:
            logger.info(
                f"CT: clearing {len(keys)} etags after a failed update")
            cache.delete_many(list(keys))
        raise
    finally:
        _tracked_keys.reset(token)
