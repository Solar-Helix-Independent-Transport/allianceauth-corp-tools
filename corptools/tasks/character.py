import ast
import datetime
import json
from random import random

import yaml
from celery import chain as Chain, shared_task

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count
from django.utils import timezone

from allianceauth.eveonline.models import EveCharacter
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce
from esi.errors import TokenExpiredError
from esi.models import Token

from .. import app_settings, providers
from ..models import (
    CharacterAudit, CharacterBountyEvent, CharacterBountyStat,
    CharacterWalletJournalEntry, CorptoolsConfiguration, EveItemDogmaAttribute,
    EveItemType,
)
from ..task_helpers.char_tasks import (
    update_character_assets, update_character_clones,
    update_character_contacts, update_character_contract_items,
    update_character_contracts, update_character_industry_jobs,
    update_character_location, update_character_loyaltypoints,
    update_character_mail_headers, update_character_mining,
    update_character_notifications, update_character_order_history,
    update_character_orders, update_character_roles,
    update_character_skill_list, update_character_skill_queue,
    update_character_titles, update_character_transactions,
    update_character_wallet, update_corp_history,
)
from .locations import update_all_locations
from .updates import update_all_eve_names
from .utils import enqueue_next_task, esi_error_retry, no_fail_chain

TZ_STRING = "%Y-%m-%dT%H:%M:%SZ"


logger = get_extension_logger(__name__)


@shared_task(name="corptools.tasks.clear_all_etags")
def clear_all_etags():
    try:
        from django_redis import get_redis_connection
        _client = get_redis_connection("default")
    except (NotImplementedError, ModuleNotFoundError):
        from django.core.cache import caches
        default_cache = caches['default']
        _client = default_cache.get_master_client()

    keys = _client.keys(":?:etag-*")
    deleted = _client.delete(*keys)

    return f"Deleted {deleted} etag keys"


@shared_task(name="corptools.tasks.update_all_characters")
def update_all_characters():
    characters = CharacterAudit.objects.all().select_related('character')
    for char in characters:
        update_character.apply_async(args=[char.character.character_id])


@shared_task(bind=True, base=QueueOnce, name="corptools.tasks.update_subset_of_characters")
def update_subset_of_characters(self, subset=48, min_runs=15, force=False):
    amount_of_updates = max(
        CharacterAudit.objects.all().count() / subset, min_runs)
    characters = CharacterAudit.get_oldest_qs()[:amount_of_updates]
    char_ids = []
    for char in characters:
        char_ids.append(char.character.character_id)
        update_character.apply_async(args=[char.character.character_id], kwargs={
                                     "force_refresh": force})

    update_all_eve_names.apply_async(priority=7, kwargs={"chunk": 500})

    process_corp_histories.apply_async(priority=6)

    return f"Queued {len(characters)} Character Updates"


@shared_task(name="corptools.tasks.re_que_corp_histories")
def re_que_corp_histories():
    process_corp_histories.apply_async(priority=6)


@shared_task(bind=True, base=QueueOnce, name="corptools.tasks.process_corp_histories")
def process_corp_histories(self):
    cid = CharacterAudit.objects.all().order_by(
        'last_update_pub_data'
    ).first().character.character_id
    update_char_corp_history(cid)
    re_que_corp_histories.apply_async(countdown=2)
    return f"{(cid)} Character historys Updated"


@shared_task(name="corptools.tasks.check_account")
def check_account(character_id):
    char = EveCharacter.objects\
        .select_related('character_ownership',
                        'character_ownership__user__profile',
                        'character_ownership__user__profile__main_character', )\
        .get(character_id=int(character_id))\
        .character_ownership.user.profile.main_character

    linked_characters = char.character_ownership.user.character_ownerships.all(
    ).values_list('character__character_id', flat=True)
    for cid in linked_characters:
        update_character.apply_async(args=[cid], priority=6)


@shared_task(bind=True, base=QueueOnce, name="corptools.tasks.update_character")
def update_character(self, char_id, force_refresh=False):
    character = CharacterAudit.objects.filter(
        character__character_id=char_id).first()
    if character is None:
        token = Token.get_token(char_id, app_settings.get_character_scopes())
        if token:
            try:
                if token.valid_access_token():
                    character, created = CharacterAudit.objects.update_or_create(
                        character=EveCharacter.objects.get_character_by_id(token.character_id))
            except TokenExpiredError:
                return False
        else:
            logger.info(f"No Tokens for {char_id}")
            return False

    logger.info("Processing Updates for {}".format(
        character.character.character_name))

    skip_date = timezone.now() - datetime.timedelta(hours=2)  # hook into the settings

    que = []

    # TODO review this later
    if force_refresh:
        que.append(
            update_char_corp_history.si(
                character.character.character_id,
                force_refresh=force_refresh
            )
        )

    mindt = timezone.now() - datetime.timedelta(days=90)

    ct_conf = CorptoolsConfiguration.get_solo()

    if app_settings.CT_CHAR_ROLES_MODULE and not ct_conf.disable_update_roles:
        if (character.last_update_roles or mindt) <= skip_date or force_refresh:
            que.append(update_char_roles.si(
                character.character.character_id,
                force_refresh=force_refresh
            )
            )
        if (character.last_update_titles or mindt) <= skip_date or force_refresh:
            que.append(update_char_titles.si(
                character.character.character_id, force_refresh=force_refresh))

    if app_settings.CT_CHAR_NOTIFICATIONS_MODULE and not ct_conf.disable_update_notif:
        if (character.last_update_notif or mindt) <= skip_date or force_refresh:
            que.append(update_char_notifications.si(
                character.character.character_id, force_refresh=force_refresh))

    if app_settings.CT_CHAR_ASSETS_MODULE and not ct_conf.disable_update_assets:
        if (character.last_update_assets or mindt) <= skip_date or force_refresh:
            que.append(update_char_assets.si(
                character.character.character_id, force_refresh=force_refresh))

    if app_settings.CT_CHAR_SKILLS_MODULE and not ct_conf.disable_update_skills:

        if (character.last_update_skills or mindt) <= skip_date or force_refresh:
            que.append(update_char_skill_list.si(
                character.character.character_id, force_refresh=force_refresh))

        if (character.last_update_skill_que or mindt) <= skip_date or force_refresh:
            que.append(update_char_skill_queue.si(
                character.character.character_id, force_refresh=force_refresh))

    if app_settings.CT_CHAR_CLONES_MODULE and not ct_conf.disable_update_clones:
        if (character.last_update_clones or mindt) <= skip_date or force_refresh:
            que.append(update_char_clones.si(
                character.character.character_id, force_refresh=force_refresh))

    if app_settings.CT_CHAR_CONTACTS_MODULE and not ct_conf.disable_update_contacts:
        if (character.last_update_contacts or mindt) <= skip_date or force_refresh:
            que.append(update_char_contacts.si(
                character.character.character_id, force_refresh=force_refresh))

    if app_settings.CT_CHAR_MINING_MODULE and not ct_conf.disable_update_mining:
        if (character.last_update_mining or mindt) <= skip_date or force_refresh:
            que.append(update_char_mining_ledger.si(
                character.character.character_id, force_refresh=force_refresh))

    if app_settings.CT_CHAR_WALLET_MODULE and not ct_conf.disable_update_wallet:
        if (character.last_update_wallet or mindt) <= skip_date or force_refresh:
            que.append(update_char_wallet.si(
                character.character.character_id, force_refresh=force_refresh))
            que.append(update_char_transactions.si(
                character.character.character_id, force_refresh=force_refresh))
        if (character.last_update_orders or mindt) <= skip_date or force_refresh:
            que.append(update_char_orders.si(
                character.character.character_id, force_refresh=force_refresh))
            que.append(update_char_order_history.si(
                character.character.character_id, force_refresh=force_refresh))
        if force_refresh or not app_settings.CT_CHAR_PAUSE_CONTRACTS:  # only on manual refreshes
            if (character.last_update_contracts or mindt) <= skip_date or force_refresh:
                que.append(update_char_contracts.si(
                    character.character.character_id, force_refresh=force_refresh))

    if app_settings.CT_CHAR_LOCATIONS_MODULE and not ct_conf.disable_update_location:
        que.append(update_char_location.si(
            character.character.character_id, force_refresh=force_refresh))

    if app_settings.CT_CHAR_MAIL_MODULE and not ct_conf.disable_update_mails:
        que.append(update_char_mail.si(
            character.character.character_id, force_refresh=force_refresh))

    if app_settings.CT_CHAR_LOYALTYPOINTS_MODULE and not ct_conf.disable_update_loyaltypoints:
        que.append(update_char_loyaltypoints.si(
            character.character.character_id, force_refresh=force_refresh))

    if app_settings.CT_CHAR_INDUSTRY_MODULE and not ct_conf.disable_update_indy:
        que.append(update_char_industry_jobs.si(
            character.character.character_id, force_refresh=force_refresh))

    # We've updated this character, lets get all the missing locations.
    que.append(
        update_all_locations.s(
            character_filter=[character.character.character_id]
        )
    )

    if app_settings.CT_CHAR_SKILLS_MODULE and not ct_conf.disable_update_skills:
        # Must be last due to this being not a user level queue, Celery once will stall the queue here if characters on an account block.
        # TODO: make this better
        if (character.last_update_skills or mindt) <= skip_date or force_refresh:
            try:
                que.append(cache_user_skill_list.s(
                    character.character.character_ownership.user_id, force_refresh=force_refresh
                ))
            except ObjectDoesNotExist:
                pass

    # Spread out updates over 10 min to try be nice to ESI?
    delay = random() * app_settings.CT_TASK_SPREAD_DELAY
    if force_refresh:
        delay = 1  # If forced GO NOW!

    enqueue_next_task(que, delay=delay)

    logger.info(
        "Queued {} Updates for {} in {} seconds".format(
            len(que) + 1,
            character.character.character_name,
            delay
        )
    )


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_corp_history"
)
@no_fail_chain
@esi_error_retry
def update_char_corp_history(self, character_id, force_refresh=False, chain=[]):
    return update_corp_history(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_roles"
)
@no_fail_chain
@esi_error_retry
def update_char_roles(self, character_id, force_refresh=False, chain=[]):
    return update_character_roles(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_skill_list"
)
@no_fail_chain
@esi_error_retry
def update_char_skill_list(self, character_id, force_refresh=False, chain=[]):
    return update_character_skill_list(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_location"
)
@no_fail_chain
@esi_error_retry
def update_char_location(self, character_id, force_refresh=False, chain=[]):
    return update_character_location(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "keys": ["user_id"]
    },
    name="corptools.tasks.cache_user_skill_list"
)
@no_fail_chain
@esi_error_retry
def cache_user_skill_list(self, user_id, force_refresh=False, chain=[]):
    providers.skills.get_and_cache_user(
        user_id, force_rebuild=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_industry_jobs"
)
@no_fail_chain
@esi_error_retry
def update_char_industry_jobs(self, character_id, force_refresh=False, chain=[]):
    return update_character_industry_jobs(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_skill_queue"
)
@no_fail_chain
@esi_error_retry
def update_char_skill_queue(self, character_id, force_refresh=False, chain=[]):
    return update_character_skill_queue(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_mining_ledger"
)
@no_fail_chain
@esi_error_retry
def update_char_mining_ledger(self, character_id, force_refresh=False, chain=[]):
    return update_character_mining(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_notifications"
)
@no_fail_chain
@esi_error_retry
def update_char_notifications(self, character_id, force_refresh=False, chain=[]):
    return update_character_notifications(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_assets"
)
@no_fail_chain
@esi_error_retry
def update_char_assets(self, character_id, force_refresh=False, chain=[]):
    return update_character_assets(
        character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_wallet"
)
@no_fail_chain
@esi_error_retry
def update_char_wallet(self, character_id, force_refresh=False, chain=[]):
    msg = update_character_wallet(character_id, force_refresh=force_refresh)

    for entry in CharacterWalletJournalEntry.objects.filter(
        character__character__character_id=character_id,
        ref_type="bounty_prizes",
        processed=False
    ):
        update_char_wallet_bounty_text.apply_async(
            args=[
                character_id,
                entry.entry_id
            ],
            priority=9
        )

    return msg


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_contacts"
)
@no_fail_chain
@esi_error_retry
def update_char_contacts(self, character_id, force_refresh=False, chain=[]):
    return update_character_contacts(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_orders"
)
@no_fail_chain
@esi_error_retry
def update_char_orders(self, character_id, force_refresh=False, chain=[]):
    return update_character_orders(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_transactions"
)
@no_fail_chain
@esi_error_retry
def update_char_transactions(self, character_id, force_refresh=False, chain=[]):
    return update_character_transactions(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_titles"
)
@no_fail_chain
@esi_error_retry
def update_char_titles(self, character_id, force_refresh=False, chain=[]):
    return update_character_titles(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_mail"
)
@no_fail_chain
@esi_error_retry
def update_char_mail(self, character_id, force_refresh=False, chain=[]):
    update_character_mail_headers(
        character_id, force_refresh=force_refresh)
    return "Completed mail pre-fetch for: %s" % str(character_id)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": True,
        "keys": ["character_id", "contract_id"]
    },
    name="corptools.tasks.update_char_contract_items"
)
def update_char_contract_items(self, character_id, contract_id, force_refresh=False):
    return update_character_contract_items(
        character_id, contract_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": True,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_contracts"
)
@no_fail_chain
@esi_error_retry
def update_char_contracts(self, character_id, force_refresh=False, chain=[]):
    _, ids = update_character_contracts(
        character_id, force_refresh=force_refresh)

    _chain = []
    for id in ids:
        _chain.append(update_char_contract_items.si(
            character_id, id, force_refresh=force_refresh))
    Chain(_chain).apply_async(priority=8)

    return "Completed Contracts for: %s" % str(character_id)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_order_history"
)
@no_fail_chain
@esi_error_retry
def update_char_order_history(self, character_id, force_refresh=False, chain=[]):
    return update_character_order_history(character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_clones"
)
@no_fail_chain
@esi_error_retry
def update_char_clones(self, character_id, force_refresh=False, chain=[]):
    return update_character_clones(
        character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "graceful": False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_loyaltypoints"
)
@no_fail_chain
@esi_error_retry
def update_char_loyaltypoints(self, character_id, force_refresh=False, chain=[]):
    return update_character_loyaltypoints(
        character_id, force_refresh=force_refresh)


@shared_task(
    bind=True,
    base=QueueOnce,
    once={
        "keys": ["character_id", "entry_id"]
    },
    name="corptools.tasks.translate_char_wallet_bounty_text"
)
def update_char_wallet_bounty_text(self, character_id, entry_id, force_refresh=False):
    logger.info(f"Translating {character_id} - {entry_id}")
    try:
        entry = CharacterWalletJournalEntry.objects.get(
            character__character__character_id=character_id,
            entry_id=entry_id,
            processed=False,
            ref_type="bounty_prizes"
        )
    except CharacterWalletJournalEntry.DoesNotExist:
        return "Unable to find {character_id} - {entry_id}"
    except CharacterWalletJournalEntry.MultipleObjectsReturned:
        clear_dupes(character_id, entry_id)
        self.retry()

    bounties = []

    logger.debug(f"Found {entry.reason}")

    for bty in entry.reason.split(","):
        b = bty.split(":")
        ship_type, _ = EveItemType.objects.get_or_create_from_esi(
            b[0].strip()
        )
        ship_dogma = EveItemDogmaAttribute.objects.filter(
            eve_type_id=ship_type.type_id,
            attribute_id=481
        ).first()
        bounties.append(
            {
                "msg": f"{b[1].strip()}x {ship_type.name} @ {ship_dogma.value:,.0f} ISK",
                "type_id": ship_type.type_id,
                "qty": b[1].strip()
            }
        )

    msg = "\n".join([b["msg"] for b in bounties])

    event = CharacterBountyEvent.objects.create(
        entry=entry,
        message=msg
    )
    for b in bounties:
        CharacterBountyStat.objects.create(
            event=event,
            type_name_id=b["type_id"],
            qty=b["qty"]
        )
    entry.processed = True
    entry.save()

    logger.info(f"Completed {character_id} - {entry_id}\n{event.message}")


def clear_dupes(character_id, entry_id):
    # dupe_ids = CharacterWalletJournalEntry.objects.filter(
    #     ref_type="bounty_prizes",
    #     character__character__character_id=character_id,
    #     entry_id=entry_id
    # ).values(
    #     'entry_id'
    # ).annotate(
    #     count=Count('entry_id')
    # ).filter(count__gt=1)

    logger.warning(f"Cleaning up `{entry_id}` duplicates in wallet.")

    ls = list(
        CharacterWalletJournalEntry.objects.filter(
            ref_type="bounty_prizes",
            character__character__character_id=character_id,
            entry_id=entry_id
        )
    )
    ls.pop()
    logger.warning(f"Found `{len(ls)}` duplicates.")
    for l in ls:
        l.delete()
