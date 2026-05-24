# Third Party
from celery import shared_task

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger

from ..models import CharacterWalletJournalEntry
from ..task_helpers.housekeeping_tasks import remove_old_notifications

logger = get_extension_logger(__name__)


@shared_task(name="corptools.tasks.run_housekeeping")
def run_housekeeping():
    return remove_old_notifications()


@shared_task(name="corptools.tasks.clear_all_skill_caches")
def clear_all_skill_caches():
    try:
        # Third Party
        from django_redis import get_redis_connection
        _client = get_redis_connection("default")
    except (NotImplementedError, ModuleNotFoundError):
        # Django
        from django.core.cache import caches
        _client = caches['default'].get_master_client()

    keys = _client.keys(":?:SKILL_LISTS_*")
    deleted = 0
    if keys:
        deleted = _client.delete(*keys)
    return f"Deleted {deleted} skill cache keys"


@shared_task(name="corptools.tasks.clear_all_etags")
def clear_all_etags():
    try:
        # Third Party
        from django_redis import get_redis_connection
        _client = get_redis_connection("default")
    except (NotImplementedError, ModuleNotFoundError):
        # Django
        from django.core.cache import caches
        _client = caches['default'].get_master_client()

    keys = _client.keys(":?:etag-*")
    deleted = 0
    if keys:
        deleted = _client.delete(*keys)
    return f"Deleted {deleted} etag keys"


@shared_task(name="corptools.tasks.update_wallet_currency")
def update_wallet_currency(pk):
    m = CharacterWalletJournalEntry.objects.get(pk=pk)
    reason = m.reason
    if not reason.endswith("ISK"):
        reason = reason.replace(" @ $", " @ ")
        m.reason = reason + " ISK"
        m.save()
