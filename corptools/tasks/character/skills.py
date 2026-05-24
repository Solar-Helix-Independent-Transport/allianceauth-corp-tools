# Third Party
from celery import shared_task

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce

from ... import providers
from ...task_helpers.char_tasks import (
    update_character_skill_list,
    update_character_skill_queue,
)
from ..utils import esi_error_retry, no_fail_chain

logger = get_extension_logger(__name__)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_skill_list"
)
@no_fail_chain
@esi_error_retry
def update_char_skill_list(self, character_id, force_refresh=False, chain=[]):
    return update_character_skill_list(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_skill_queue"
)
@no_fail_chain
@esi_error_retry
def update_char_skill_queue(self, character_id, force_refresh=False, chain=[]):
    return update_character_skill_queue(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"keys": ["user_id"]},
    name="corptools.tasks.cache_user_skill_list"
)
@no_fail_chain
@esi_error_retry
def cache_user_skill_list(self, user_id, force_refresh=False, chain=[]):
    providers.skills.get_and_cache_user(user_id, force_rebuild=force_refresh)
