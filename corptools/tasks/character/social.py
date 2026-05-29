# Third Party
from celery import shared_task

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce

from ...task_helpers.char_tasks import (
    update_character_contacts,
    update_character_mail_headers,
    update_character_notifications,
)
from ..utils import esi_error_retry, no_fail_chain

logger = get_extension_logger(__name__)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_contacts"
)
@no_fail_chain
@esi_error_retry
def update_char_contacts(self, character_id, force_refresh=False, chain=[]):
    return update_character_contacts(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_notifications"
)
@no_fail_chain
@esi_error_retry
def update_char_notifications(self, character_id, force_refresh=False, chain=[]):
    return update_character_notifications(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_mail"
)
@no_fail_chain
@esi_error_retry
def update_char_mail(self, character_id, force_refresh=False, chain=[]):
    update_character_mail_headers(character_id, force_refresh=force_refresh)
    return "Completed mail pre-fetch for: %s" % str(character_id)
