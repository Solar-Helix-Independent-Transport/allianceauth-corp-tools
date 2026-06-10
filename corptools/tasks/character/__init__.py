# Standard Library
import datetime
from random import random

# Third Party
from celery import shared_task

# Django
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

# Alliance Auth
from allianceauth.eveonline.models import EveCharacter
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce
from esi.errors import TokenExpiredError
from esi.models import Token

from ... import app_settings
from ...models import CharacterAudit, CorptoolsConfiguration
from ..locations import update_all_locations
from ..utils import enqueue_next_task
from .assets import update_char_assets
from .clones import update_char_clones
from .misc import (
    update_char_corp_history,
    update_char_industry_jobs,
    update_char_location,
    update_char_loyaltypoints,
    update_char_mining_ledger,
    update_char_roles,
    update_char_titles,
)
from .skills import (
    cache_user_skill_list,
    update_char_skill_list,
    update_char_skill_queue,
)
from .social import (
    update_char_contacts,
    update_char_mail,
    update_char_notifications,
)
from .wallet import (  # noqa: F401
    update_char_contract_items,
    update_char_contracts,
    update_char_order_history,
    update_char_orders,
    update_char_transactions,
    update_char_wallet,
    update_char_wallet_bounty_text,
)

logger = get_extension_logger(__name__)


def _needs_update(last_update, skip_date, force_refresh, min_date):
    """Return True if a character update field is stale or a force refresh was requested."""
    return (last_update or min_date) <= skip_date or force_refresh


@shared_task(name="corptools.tasks.update_all_characters")
def update_all_characters(force_refresh=False, now=False):
    characters = CharacterAudit.objects.all().select_related('character')
    for char in characters:
        update_character.apply_async(
            args=[char.character.character_id],
            kwargs={"force_refresh": force_refresh, "now": now},
            priority=6
        )


@shared_task(bind=True, base=QueueOnce, name="corptools.tasks.update_subset_of_characters")
def update_subset_of_characters(self, subset=48, min_runs=15, force=False):
    amount_of_updates = max(
        CharacterAudit.objects.all().count() // subset, min_runs)
    characters = CharacterAudit.get_oldest_qs()[:amount_of_updates]
    for char in characters:
        update_character.apply_async(
            args=[char.character.character_id],
            kwargs={"force_refresh": force}
        )
    process_corp_histories.apply_async(priority=6)
    return f"Queued {len(characters)} Character Updates"


@shared_task(name="corptools.tasks.re_que_corp_histories")
def re_que_corp_histories():
    process_corp_histories.apply_async(priority=6)


@shared_task(bind=True, base=QueueOnce, name="corptools.tasks.process_corp_histories")
def process_corp_histories(self):
    after = timezone.now() - datetime.timedelta(
        hours=24 * (app_settings.CT_CHAR_MAX_INACTIVE_DAYS - 1)
    )
    oldest = CharacterAudit.objects.filter(
        update_timestamps__pub_data__lte=after.isoformat()
    ).order_by('update_timestamps__pub_data').first()

    if oldest is None:
        return "No characters to process"

    cid = oldest.character.character_id
    update_char_corp_history(cid)
    re_que_corp_histories.apply_async(countdown=1)
    return f"{cid} corporation history updated"


@shared_task(name="corptools.tasks.check_account")
def check_account(character_id):
    char = EveCharacter.objects.select_related(
        'character_ownership',
        'character_ownership__user__profile',
        'character_ownership__user__profile__main_character',
    ).get(character_id=int(character_id)).character_ownership.user.profile.main_character

    linked_characters = char.character_ownership.user.character_ownerships.all(
    ).values_list('character__character_id', flat=True)
    for cid in linked_characters:
        update_character.apply_async(args=[cid], priority=6)


@shared_task(bind=True, base=QueueOnce, name="corptools.tasks.update_character")
def update_character(self, char_id, force_refresh=False, now=False):
    character = CharacterAudit.objects.filter(
        character__character_id=char_id).first()
    if character is None:
        token = Token.get_token(char_id, app_settings.get_character_scopes())
        if token:
            try:
                if token.valid_access_token():
                    character, _ = CharacterAudit.objects.update_or_create(
                        character=EveCharacter.objects.get_character_by_id(
                            token.character_id)
                    )
            except TokenExpiredError:
                return False
        else:
            logger.info(f"No Tokens for {char_id}")
            return False

    logger.info("Processing Updates for %s" %
                character.character.character_name)

    skip_date = timezone.now() - datetime.timedelta(hours=2)
    min_date = timezone.now() - datetime.timedelta(days=90)
    ct_conf = CorptoolsConfiguration.get_solo()
    que = []

    if force_refresh:
        que.append(update_char_corp_history.si(
            character.character.character_id, force_refresh=force_refresh
        ))

    if app_settings.CT_CHAR_ROLES_MODULE and not ct_conf.disable_update_roles:
        if _needs_update(character.get_update_time("roles"), skip_date, force_refresh, min_date):
            que.append(update_char_roles.si(
                character.character.character_id, force_refresh=force_refresh
            ))
        if _needs_update(character.get_update_time("titles"), skip_date, force_refresh, min_date):
            que.append(update_char_titles.si(
                character.character.character_id, force_refresh=force_refresh
            ))

    if app_settings.CT_CHAR_NOTIFICATIONS_MODULE and not ct_conf.disable_update_notif:
        if _needs_update(character.get_update_time("notif"), skip_date, force_refresh, min_date):
            que.append(update_char_notifications.si(
                character.character.character_id, force_refresh=force_refresh
            ))

    if app_settings.CT_CHAR_ASSETS_MODULE and not ct_conf.disable_update_assets:
        if _needs_update(character.get_update_time("assets"), skip_date, force_refresh, min_date):
            que.append(update_char_assets.si(
                character.character.character_id, force_refresh=force_refresh
            ))

    if app_settings.CT_CHAR_SKILLS_MODULE and not ct_conf.disable_update_skills:
        if _needs_update(character.get_update_time("skills"), skip_date, force_refresh, min_date):
            que.append(update_char_skill_list.si(
                character.character.character_id, force_refresh=force_refresh
            ))
        if _needs_update(character.get_update_time("skill_que"), skip_date, force_refresh, min_date):
            que.append(update_char_skill_queue.si(
                character.character.character_id, force_refresh=force_refresh
            ))

    if app_settings.CT_CHAR_CLONES_MODULE and not ct_conf.disable_update_clones:
        if _needs_update(character.get_update_time("clones"), skip_date, force_refresh, min_date):
            que.append(update_char_clones.si(
                character.character.character_id, force_refresh=force_refresh
            ))

    if app_settings.CT_CHAR_CONTACTS_MODULE and not ct_conf.disable_update_contacts:
        if _needs_update(character.get_update_time("contacts"), skip_date, force_refresh, min_date):
            que.append(update_char_contacts.si(
                character.character.character_id, force_refresh=force_refresh
            ))

    if app_settings.CT_CHAR_MINING_MODULE and not ct_conf.disable_update_mining:
        if _needs_update(character.get_update_time("mining"), skip_date, force_refresh, min_date):
            que.append(update_char_mining_ledger.si(
                character.character.character_id, force_refresh=force_refresh
            ))

    if app_settings.CT_CHAR_WALLET_MODULE and not ct_conf.disable_update_wallet:
        if _needs_update(character.get_update_time("wallet"), skip_date, force_refresh, min_date):
            que.append(update_char_wallet.si(
                character.character.character_id, force_refresh=force_refresh
            ))
            que.append(update_char_transactions.si(
                character.character.character_id, force_refresh=force_refresh
            ))
        if _needs_update(character.get_update_time("orders"), skip_date, force_refresh, min_date):
            que.append(update_char_orders.si(
                character.character.character_id, force_refresh=force_refresh
            ))
            que.append(update_char_order_history.si(
                character.character.character_id, force_refresh=force_refresh
            ))
        if force_refresh or not app_settings.CT_CHAR_PAUSE_CONTRACTS:
            if _needs_update(character.get_update_time("contracts"), skip_date, force_refresh, min_date):
                que.append(update_char_contracts.si(
                    character.character.character_id, force_refresh=force_refresh
                ))

    if app_settings.CT_CHAR_LOCATIONS_MODULE and not ct_conf.disable_update_location:
        que.append(update_char_location.si(
            character.character.character_id, force_refresh=force_refresh
        ))

    if app_settings.CT_CHAR_MAIL_MODULE and not ct_conf.disable_update_mails:
        que.append(update_char_mail.si(
            character.character.character_id, force_refresh=force_refresh
        ))

    if app_settings.CT_CHAR_LOYALTYPOINTS_MODULE and not ct_conf.disable_update_loyaltypoints:
        que.append(update_char_loyaltypoints.si(
            character.character.character_id, force_refresh=force_refresh
        ))

    if app_settings.CT_CHAR_INDUSTRY_MODULE and not ct_conf.disable_update_indy:
        que.append(update_char_industry_jobs.si(
            character.character.character_id, force_refresh=force_refresh
        ))

    que.append(update_all_locations.s(
        character_filter=[character.character.character_id]
    ))

    # cache_user_skill_list must be last — it uses a non-character-level QueueOnce key
    # and will stall the chain for other characters on the same account if placed earlier.
    if app_settings.CT_CHAR_SKILLS_MODULE and not ct_conf.disable_update_skills:
        if _needs_update(character.get_update_time("skills"), skip_date, force_refresh, min_date):
            try:
                que.append(cache_user_skill_list.s(
                    character.character.character_ownership.user_id,
                    force_refresh=force_refresh
                ))
            except ObjectDoesNotExist:
                pass

    delay = random() * app_settings.CT_TASK_SPREAD_DELAY
    if force_refresh or now:
        delay = 1

    enqueue_next_task(que, delay=delay)

    logger.info("Queued %d Updates for %s in %.1f seconds" % (
        len(que) + 1,
        character.character.character_name,
        delay
    ))
