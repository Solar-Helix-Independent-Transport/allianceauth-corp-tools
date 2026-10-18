"""
The one "back off from ESI" flag shared by every task.

There used to be two: `esi_error_timeout`, set and checked by
esi_error_retry on 420/429, and `esi_errors_timeout`, set when the error
budget header ran low and checked only by the location/name tasks. Neither
side saw the other's flag.

Kept free of other corptools imports so both tasks/ and task_helpers/ can
import it without a cycle.
"""
# Standard Library
import datetime

# Django
from django.core.cache import cache
from django.utils import timezone

ERROR_FLAG_KEY = "esi_error_timeout"
ERROR_FLAG_SECONDS = 60
# Back off once ESI says fewer than this many errors are left in the window.
ERROR_BUDGET_THRESHOLD = 50
ERROR_BUDGET_HEADER = "x-esi-error-limit-remain"


def set_error_flag(timeout=ERROR_FLAG_SECONDS):
    tout = timezone.now() + datetime.timedelta(seconds=timeout)
    cache.set(ERROR_FLAG_KEY, tout, timeout=timeout + 1)


def get_error_flag():
    return cache.get(ERROR_FLAG_KEY, default=timezone.now())


def clear_error_flag():
    cache.delete(ERROR_FLAG_KEY)


def error_flag_active():
    return get_error_flag() > timezone.now()


def error_budget_low(headers) -> bool:
    """True only when ESI actually reported a low error budget. A missing or
    unparseable header says nothing about the budget, so it must not trip
    the global back-off."""
    if not headers:
        return False
    remain = headers.get(ERROR_BUDGET_HEADER)
    if remain is None:
        return False
    try:
        return int(remain) < ERROR_BUDGET_THRESHOLD
    except (TypeError, ValueError):
        return False
