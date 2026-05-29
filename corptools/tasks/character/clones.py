# Third Party
from celery import shared_task

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce

from ...task_helpers.char_tasks import update_character_clones
from ..utils import esi_error_retry, no_fail_chain

logger = get_extension_logger(__name__)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_clones"
)
@no_fail_chain
@esi_error_retry
def update_char_clones(self, character_id, force_refresh=False, chain=[]):
    return update_character_clones(character_id, force_refresh=force_refresh)
