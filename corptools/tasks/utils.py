# Standard Library
import functools
import inspect
import math
from functools import wraps
from random import random
from time import time
from typing import Any, Callable

# Third Party
from aiopenapi3.errors import RequestError as RequestError
from celery import Task, signature, states
from celery.exceptions import Retry
from celery.result import EagerResult
from celery_once import AlreadyQueued
from eve_sde.tasks import check_for_sde_updates
from httpx2 import RequestError as httpx2_RequestError

# Django
from django.core.cache import cache
from django.db.models import QuerySet
from django.db.utils import IntegrityError
from django.utils import timezone

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from esi.exceptions import (
    ESIBucketLimitException,
    ESIErrorLimitException,
    HTTPClientError,
    HTTPServerError,
)

# AA Example App
from corptools.esi_errors import (  # - re-exported
    ERROR_FLAG_SECONDS,
    clear_error_flag,
    error_flag_active,
    get_error_flag,
    set_error_flag,
)
from corptools.tasks.rate_limiting import (
    TaskBucketLimitException,
    TaskRateLimitBucket,
    rate_limiter,
    task_bucket_slug_key,
)

logger = get_extension_logger(__name__)


def _needs_update(last_update, skip_date, force_refresh, min_date):
    """Return True if a character update field is stale or a force refresh was requested."""
    return (last_update or min_date) <= skip_date or force_refresh


def _was_rejected(result):
    """
        QueueOnce with graceful=True returns a REJECTED EagerResult instead of
        raising AlreadyQueued. Only check EagerResult, `.state` on a real
        AsyncResult would hit the result backend.
    """
    return isinstance(result, EagerResult) and result.state == states.REJECTED


def enqueue_next_task(chain, delay=1):
    """
        Queue next task, and attach the rest of the chain to it.
        If the next task is already queued, skip it and try the one after,
        so a duplicate never drops the rest of the chain.
        Priority defaults to 6, set it per task with `.set(priority=n)`.
    """
    while (len(chain)):
        _t = chain.pop(0)
        _t = signature(_t)
        _t.kwargs.update({"chain": chain})
        try:
            rejected = _was_rejected(
                _t.apply_async(
                    priority=_t.options.get("priority", 6),
                    countdown=delay
                )
            )
        except AlreadyQueued:
            rejected = True
        if rejected:
            # skip this task as it is already in the queue
            logger.warning(f"Skipping task as its already queued {_t}")
            continue
        break


def get_error_count_flag():
    """Is the shared ESI back-off flag set? (see corptools.esi_errors)"""
    return error_flag_active()


def esi_error_retry(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        _ret = None

        flag = get_error_flag()
        if flag >= timezone.now():
            logger.warning("Hit ESI error limit! will retry tasks!")
            # wait out the flag, which may be longer than a minute if ESI
            # sent a longer reset
            args[0].retry(
                countdown=math.ceil((flag - timezone.now()).total_seconds()) + 1)
        else:
            clear_error_flag()
        try:
            _ret = func(*args, **kwargs)
        except Exception as e:
            if isinstance(e, (ESIBucketLimitException)):  # OpenAPI
                logger.warning(f"Hit ESI rate bucket! Pausing Task! {e}")
                args[0].retry(countdown=e.reset)
            elif isinstance(e, ESIErrorLimitException):  # OpenAPI 420
                # django-esi raises this for a 420, not HTTPClientError, so
                # the status-code branch below never saw a real one.
                reset = math.ceil(e.reset) if e.reset else ERROR_FLAG_SECONDS
                logger.warning(
                    f"Hit ESI error limit! Pausing Tasks for {reset}s! {e}")
                set_error_flag(reset)
                args[0].retry(countdown=reset + 1)
            elif isinstance(e, (HTTPClientError, HTTPServerError)):  # OpenAPI
                code = e.status_code
                if code in (420, 429):
                    logger.warning(f"Hit ESI error limit! Pausing Tasks! {e}")
                    set_error_flag(60)
                    args[0].retry(countdown=61)
            elif isinstance(e, (RequestError, httpx2_RequestError)):  # Generic Request Errors
                logger.warning(f"Uncaught RequestError, Retrying... {e}")
                args[0].retry(countdown=300)
            elif isinstance(e, (OSError)):  # Bravado
                logger.warning(f"Hit ESI error! Skipping task! {e}")
            elif isinstance(e, (IntegrityError)):
                logger.warning(
                    f"Hit DB Integrity Error! SDE not up to date? retrying in 15 minutes! {e}")
                check_for_sde_updates.apply_async(priority=1)
                if args[0].request.retries < 3:
                    sig = inspect.signature(func)

                    if "force_refresh" in sig.parameters:
                        # retry(kwargs=) replaces the kwargs outright, so
                        # merge or we lose `chain` and drop the rest of it.
                        args[0].retry(countdown=90, kwargs={
                                      **kwargs, "force_refresh": True})
                    else:
                        args[0].retry(countdown=90)
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


def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    total = 0
    if isinstance(lst, list):
        total = len(lst)
    elif isinstance(lst, QuerySet):
        total = lst.count()

    for i in range(0, total, n):
        yield lst[i:i + n]


def _rate_limit_backoff(task: Task, bucket: TaskRateLimitBucket, reset) -> float:
    """
        Countdown for a rate limited task: capped exponential backoff with full
        jitter. Retrying everything on the bucket's reset alone makes every
        waiting task wake together, with only one getting through. Each hit by
        the same task doubles its spread, up to the bucket window, so a lone
        task in a chain retries almost immediately while a large backlog thins
        itself out. Capped at the window to keep countdowns well under the
        broker's visibility timeout.
    """
    key = f"task:bucket:hits:{task.request.id}"
    cache.add(key, 0, timeout=bucket.window * 2)
    hits = cache.incr(key)
    spread = min(bucket.ttl * 2 ** hits, bucket.window)
    return reset + random() * spread


def rate_limited_task(rate: str, keys: list | None = None):
    """_summary_

    Args:
        rate (str): Max rate to run this task at, in the format of 100/15m or 10/s etc
        keys (list | bool, optional): optional keys to use for the pool. Otherwise uses task signature. Defaults to False.

    Returns:
        _type_: decorated func
    """
    def decorator_func(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            sig = inspect.signature(func)
            bound_args = sig.bind(*args, **kwargs)
            task: Task = bound_args.arguments["self"]
            key = task_bucket_slug_key(
                task.name,
                bound_args.arguments,
                restrict_to=keys
            )
            bucket = TaskRateLimitBucket.from_rate(key, rate)
            try:
                rate_limiter.check_bucket(bucket)
            except TaskBucketLimitException as ex:
                delay = _rate_limit_backoff(task, bucket, ex.reset)
                task.request.retries = task.request.retries - 1
                return task.retry(countdown=delay)
            else:
                return func(*args, **kwargs)
        return wrapper
    return decorator_func
