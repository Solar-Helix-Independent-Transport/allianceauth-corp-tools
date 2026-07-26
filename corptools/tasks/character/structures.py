# Standard Library
import datetime

# Third Party
from celery import shared_task

# Django
from django.utils import timezone

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce

from ... import app_settings
from ...models import CharacterAudit, CorptoolsConfiguration
from ...task_helpers.char_tasks import (
    update_character_mercenary_dens,
    update_character_mercenary_tactical_operations,
)
from ..utils import _needs_update, esi_error_retry, no_fail_chain

logger = get_extension_logger(__name__)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_mercenary_dens"
)
@no_fail_chain
@esi_error_retry
def update_char_mercenary_dens(self, character_id, force_refresh=False, chain=[]):
    return update_character_mercenary_dens(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_mercenary_dens_for_den_holders"
)
def update_mercenary_dens_for_den_holders(self, force_refresh=False):
    """Out-of-band refresh of mercenary dens for every character with a known den.

    Mercenary den data is cached by ESI for an hour, so re-fetching sooner than that
    just burns a call for a 304/cached response. Each den holder is only re-queued
    once their last successful update is more than an hour old (or force_refresh).
    """
    if not app_settings.CT_CHAR_STRUCTURES_MODULE:
        return "Disabled"

    if CorptoolsConfiguration.get_solo().disable_update_mercenary_dens:
        return "Disabled"

    skip_date = timezone.now() - datetime.timedelta(hours=1)
    min_date = timezone.now() - datetime.timedelta(days=90)

    characters = CharacterAudit.objects.filter(
        ct_mercenary_den__isnull=False
    ).select_related('character').distinct()

    queued = 0
    for character in characters:
        if _needs_update(character.get_update_time("mercenary_dens"), skip_date, force_refresh, min_date):
            update_char_mercenary_dens.apply_async(
                args=[character.character.character_id],
                kwargs={"force_refresh": force_refresh}
            )
            queued += 1

    return f"Queued {queued} Mercenary Den Updates"


@shared_task(
    bind=True,
    base=QueueOnce,
    once={"graceful": False, "keys": ["character_id"]},
    name="corptools.tasks.update_char_mercenary_tactical_operations"
)
@no_fail_chain
@esi_error_retry
def update_char_mercenary_tactical_operations(self, character_id, force_refresh=False, chain=[]):
    return update_character_mercenary_tactical_operations(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_mercenary_tactical_operations_for_den_holders"
)
def update_mercenary_tactical_operations_for_den_holders(self, force_refresh=False):
    """Out-of-band refresh of mercenary tactical operations for every character with a den.

    Tactical operations expire within hours, so they can't wait for a character's turn in
    the normal per-character update rotation. This is queued directly off the subset task
    for anyone who holds a mercenary den, independent of `update_character`'s schedule.
    """
    if not app_settings.CT_CHAR_STRUCTURES_MODULE:
        return "Disabled"

    if CorptoolsConfiguration.get_solo().disable_update_mercenary_tactical_operations:
        return "Disabled"

    character_ids = list(
        CharacterAudit.objects.filter(
            ct_mercenary_den__isnull=False
        ).values_list(
            'character__character_id', flat=True
        ).distinct()
    )

    for character_id in character_ids:
        update_char_mercenary_tactical_operations.apply_async(
            args=[character_id],
            kwargs={"force_refresh": force_refresh}
        )

    return f"Queued {len(character_ids)} Mercenary Tactical Operation Updates"
