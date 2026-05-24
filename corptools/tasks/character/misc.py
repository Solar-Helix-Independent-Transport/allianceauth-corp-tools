# Third Party
from celery import shared_task

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce

from ...task_helpers.char_tasks import (
    update_character_industry_jobs,
    update_character_location,
    update_character_loyaltypoints,
    update_character_mining,
    update_character_roles,
    update_character_titles,
    update_corp_history,
)
from ..utils import esi_error_retry, no_fail_chain

logger = get_extension_logger(__name__)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_corp_history"
)
@no_fail_chain
@esi_error_retry
def update_char_corp_history(self, character_id, force_refresh=False, chain=[]):
    return update_corp_history(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_roles"
)
@no_fail_chain
@esi_error_retry
def update_char_roles(self, character_id, force_refresh=False, chain=[]):
    return update_character_roles(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_titles"
)
@no_fail_chain
@esi_error_retry
def update_char_titles(self, character_id, force_refresh=False, chain=[]):
    return update_character_titles(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_location"
)
@no_fail_chain
@esi_error_retry
def update_char_location(self, character_id, force_refresh=False, chain=[]):
    return update_character_location(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_loyaltypoints"
)
@no_fail_chain
@esi_error_retry
def update_char_loyaltypoints(self, character_id, force_refresh=False, chain=[]):
    return update_character_loyaltypoints(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_industry_jobs"
)
@no_fail_chain
@esi_error_retry
def update_char_industry_jobs(self, character_id, force_refresh=False, chain=[]):
    return update_character_industry_jobs(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_mining_ledger"
)
@no_fail_chain
@esi_error_retry
def update_char_mining_ledger(self, character_id, force_refresh=False, chain=[]):
    return update_character_mining(character_id, force_refresh=force_refresh)
