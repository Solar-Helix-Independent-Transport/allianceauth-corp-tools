import datetime
from functools import wraps

from bravado.exception import HTTPError
from celery import signature
from celery.exceptions import Retry
from celery_once import AlreadyQueued

from django.core.cache import cache
from django.utils import timezone

from allianceauth.services.hooks import get_extension_logger

logger = get_extension_logger(__name__)


def enqueue_next_task(chain, delay=1):
    """
        Queue next task, and attach the rest of the chain to it.
    """
    while (len(chain)):
        _t = chain.pop(0)
        _t = signature(_t)
        _t.kwargs.update({"chain": chain})
        try:
            _t.apply_async(priority=6, countdown=delay)
        except AlreadyQueued:
            # skip this task as it is already in the queue
            logger.warning(f"Skipping task as its already queued {_t}")
            continue
        break


def set_error_flag(timeout):
    tout = timezone.now() + datetime.timedelta(seconds=timeout)
    cache.set("esi_error_timeout", tout, timeout=timeout + 1)


def get_error_flag():
    return cache.get("esi_error_timeout", default=timezone.now())


def clear_error_flag():
    cache.delete("esi_error_timeout")


def esi_error_retry(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        _ret = None

        if get_error_flag() >= timezone.now():
            logger.warning("Hit ESI error limit! will retry tasks!")
            args[0].retry(countdown=61)
        else:
            clear_error_flag()
        try:
            _ret = func(*args, **kwargs)
        except Exception as e:
            if isinstance(e, (HTTPError)):
                code = e.status_code
                if code == 420:
                    logger.warning(f"Hit ESI error limit! Pausing Tasks! {e}")
                    set_error_flag(60)
                    args[0].retry(countdown=61)
            elif isinstance(e, (OSError)):
                logger.warning(f"Hit ESI error limit! Pausing Tasks! {e}")
            raise e
        return _ret
    return wrapper


def no_fail_chain(func):
    """
        Decorator to chain tasks provided in the chain kwargs regardless of task failures.
        Be sure to add chain=[] to your kwargs. TODO make this not needed.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        excp = None
        _ret = None
        try:
            _ret = func(*args, **kwargs)
        except Exception as e:
            excp = e
        finally:
            _chn = kwargs.get("chain", [])
            if not isinstance(excp, Retry):
                enqueue_next_task(_chn)
            if excp:
                raise excp
        return _ret
    return wrapper
