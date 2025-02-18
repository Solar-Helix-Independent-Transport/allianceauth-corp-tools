import datetime
import json
from functools import wraps
from random import random

import requests
from bravado.exception import HTTPError
from celery import chain as Chain, shared_task, signature
from celery.exceptions import Retry
from celery_once import AlreadyQueued

from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers.json import DjangoJSONEncoder
from django.utils import timezone

from allianceauth.eveonline.models import EveCharacter
from allianceauth.eveonline.providers import provider as eve_names
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce
from esi.errors import TokenExpiredError
from esi.models import Token

from corptools.task_helpers.housekeeping_tasks import remove_old_notifications

from . import app_settings, providers
from .models import (
    CharacterAsset, CharacterAudit, CharacterMarketOrder, Clone, Contract,
    CorpAsset, CorporateContract, CorporationAudit, CorptoolsConfiguration,
    EveItemType, EveLocation, EveName, JumpClone, TypePrice,
)
from .task_helpers import corp_helpers
from .task_helpers.char_tasks import (
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
from .task_helpers.update_tasks import (
    fetch_location_name, process_category_from_esi, process_map_from_esi,
    set_error_count_flag, update_ore_comp_table_from_fuzzworks,
)

TZ_STRING = "%Y-%m-%dT%H:%M:%SZ"


logger = get_extension_logger(__name__)

# Bulk Updates


@shared_task
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


@shared_task
def update_or_create_map():
    return process_map_from_esi()


@shared_task
def update_ore_comp_table():
    return update_ore_comp_table_from_fuzzworks()


@shared_task
def update_category(category_id):
    return process_category_from_esi(category_id)


@shared_task
def process_ores_from_esi():
    return process_category_from_esi(25)


@shared_task
def update_all_eve_names(chunk=False):
    needs_update = timezone.now() - datetime.timedelta(days=30)
    en = EveName.objects.filter(last_update__lte=needs_update)
    if chunk:
        en = en[:chunk]
    for e in en:
        update_eve_name.apply_async(
            args=[e.eve_id],
            priority=7,
            countdown=random() * app_settings.CT_TASK_SPREAD_DELAY
        )


@shared_task(bind=True, base=QueueOnce, max_retries=None)
def update_eve_name(self, id):
    if get_error_count_flag():
        self.retry(countdown=60)

    name = EveName.objects.get(eve_id=id)
    if name.needs_update():
        try:
            if name.category == EveName.CHARACTER:
                update = eve_names.get_character(id)
                name.name = update.name
                if update.alliance:
                    alliance, _ = EveName.objects.update_or_create(
                        eve_id=update.alliance.id,
                        defaults={
                            'name': update.alliance.name,
                            'category': EveName.ALLIANCE,
                        }
                    )
                    name.alliance = alliance
                if update.corp:
                    corporation, _ = EveName.objects.update_or_create(
                        eve_id=update.corp.id,
                        defaults={
                            'name': update.corp.name,
                            'category': EveName.CORPORATION,
                        }
                    )
                    if update.alliance:
                        corporation.alliance_id = update.alliance.id
                        corporation.save()
                    name.corporation = corporation
                name.save()
            if name.category == EveName.ALLIANCE:
                update = eve_names.get_corp(id)
                name.name = update.corporation_name
                if update.alliance:
                    alliance, _ = EveName.objects.update_or_create(
                        eve_id=update.alliance.id,
                        defaults={
                            'name': update.alliance.name,
                            'category': EveName.ALLIANCE,
                        }
                    )
                    name.alliance = alliance
                name.save()
            if name.category == EveName.ALLIANCE:
                update = eve_names.get_alliance(id)
                name.name = update.name
            name.save()
        except Exception as e:  # no access
            if hasattr(e, "response"):
                if hasattr(e.response, "headers"):
                    if int(e.response.headers.get('x-esi-error-limit-remain')) < 50:
                        set_error_count_flag()
            # cooloff for a while
            name.last_updated = timezone.now()
            name.save()


@shared_task
def process_all_categories():
    categories = providers.esi.client.Universe.get_universe_categories().result()
    que = []

    for category in categories:
        que.append(update_category.si(category))

    Chain(que).apply_async(priority=8)

    return f"Queued {len(que)} Tasks"

# Character Tasks


@shared_task
def update_all_characters():
    characters = CharacterAudit.objects.all().select_related('character')
    for char in characters:
        update_character.apply_async(args=[char.character.character_id])


@shared_task(bind=True, base=QueueOnce)
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


@shared_task()
def re_que_corp_histories():
    process_corp_histories.apply_async(priority=6)


@shared_task(bind=True, base=QueueOnce)
def process_corp_histories(self):
    cid = CharacterAudit.objects.all().order_by(
        'last_update_pub_data'
    ).first().character.character_id
    update_char_corp_history(cid)
    re_que_corp_histories.apply_async(countdown=2)
    return f"{(cid)} Character historys Updated"


@shared_task
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


def enqueue_next_task(chain, delay=1):
    """
        Queue next task, and attach the rest of the chain to it.
    """
    while (len(chain)):
        _t = chain.pop(0)
        _t = signature(_t)
        _t.kwargs.update({"chain": chain})
        try:
            _t.apply_async(priority=9, countdown=delay)
        except AlreadyQueued:
            # skip this task as it is already in the queue
            logger.warning(f"Skipping task as its already queued {_t}")
            continue
        break


def set_error_flag(timeout):
    tout = timezone.now() + datetime.timedelta(seconds=timeout)
    cache.set("esi_error_timeout", tout, timeout=timeout + 1)


def get_error_flag():
    return cache.get("esi_error_timeout", default=timezone.now())


def clear_error_flag():
    cache.delete("esi_error_timeout")


def esi_error_retry(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        _ret = None

        if get_error_flag() >= timezone.now():
            logger.warning("Hit ESI error limit! will retry tasks!")
            args[0].retry(countdown=61)
        else:
            clear_error_flag()
        try:
            _ret = func(*args, **kwargs)
        except Exception as e:
            if isinstance(e, (HTTPError)):
                code = e.status_code
                if code == 420:
                    logger.warning(f"Hit ESI error limit! Pausing Tasks! {e}")
                    set_error_flag(60)
                    args[0].retry(countdown=61)
            elif isinstance(e, (OSError)):
                logger.warning(f"Hit ESI error limit! Pausing Tasks! {e}")
            raise e
        return _ret
    return wrapper


def no_fail_chain(func):
    """
        Decorator to chain tasks provided in the chain kwargs regardless of task failures.
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


@shared_task(bind=True, base=QueueOnce)
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
            que.append(update_clones.si(
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
        'graceful': False,
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
        'graceful': False,
        "keys": ["character_id"]
    },
    name="corptools.tasks.update_char_roles"
)
@no_fail_chain
@esi_error_retry
def update_char_roles(self, character_id, force_refresh=False, chain=[]):
    return update_character_roles(character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_skill_list")
@no_fail_chain
@esi_error_retry
def update_char_skill_list(self, character_id, force_refresh=False, chain=[]):
    return update_character_skill_list(character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_location")
@no_fail_chain
@esi_error_retry
def update_char_location(self, character_id, force_refresh=False, chain=[]):
    return update_character_location(character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={"keys": ["user_id"]}, name="corptools.tasks.cache_user_skill_list")
@no_fail_chain
@esi_error_retry
def cache_user_skill_list(self, user_id, force_refresh=False, chain=[]):
    providers.skills.get_and_cache_user(
        user_id, force_rebuild=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_industry_jobs")
@no_fail_chain
@esi_error_retry
def update_char_industry_jobs(self, character_id, force_refresh=False, chain=[]):
    return update_character_industry_jobs(character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_skill_queue")
@no_fail_chain
@esi_error_retry
def update_char_skill_queue(self, character_id, force_refresh=False, chain=[]):
    return update_character_skill_queue(character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_mining_ledger")
@no_fail_chain
@esi_error_retry
def update_char_mining_ledger(self, character_id, force_refresh=False, chain=[]):
    return update_character_mining(character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_notifications")
@no_fail_chain
@esi_error_retry
def update_char_notifications(self, character_id, force_refresh=False, chain=[]):
    return update_character_notifications(character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_assets")
@no_fail_chain
@esi_error_retry
def update_char_assets(self, character_id, force_refresh=False, chain=[]):
    return update_character_assets(
        character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_wallet")
@no_fail_chain
@esi_error_retry
def update_char_wallet(self, character_id, force_refresh=False, chain=[]):
    return update_character_wallet(character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_contacts")
@no_fail_chain
@esi_error_retry
def update_char_contacts(self, character_id, force_refresh=False, chain=[]):
    return update_character_contacts(character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_orders")
@no_fail_chain
@esi_error_retry
def update_char_orders(self, character_id, force_refresh=False, chain=[]):
    return update_character_orders(character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_transactions")
@no_fail_chain
@esi_error_retry
def update_char_transactions(self, character_id, force_refresh=False, chain=[]):
    return update_character_transactions(character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_titles")
@no_fail_chain
@esi_error_retry
def update_char_titles(self, character_id, force_refresh=False, chain=[]):
    return update_character_titles(character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_mail")
@no_fail_chain
@esi_error_retry
def update_char_mail(self, character_id, force_refresh=False, chain=[]):
    update_character_mail_headers(
        character_id, force_refresh=force_refresh)
    return "Completed mail pre-fetch for: %s" % str(character_id)


@shared_task(bind=True, base=QueueOnce, once={'graceful': True, "keys": ["character_id", "contract_id"]}, name="corptools.tasks.update_char_contract_items")
def update_char_contract_items(self, character_id, contract_id, force_refresh=False):
    return update_character_contract_items(
        character_id, contract_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_contracts")
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


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_order_history")
@no_fail_chain
@esi_error_retry
def update_char_order_history(self, character_id, force_refresh=False, chain=[]):
    return update_character_order_history(character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_clones")
@no_fail_chain
@esi_error_retry
def update_clones(self, character_id, force_refresh=False, chain=[]):
    return update_character_clones(
        character_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce, once={'graceful': False, "keys": ["character_id"]}, name="corptools.tasks.update_char_loyaltypoints")
@no_fail_chain
@esi_error_retry
def update_char_loyaltypoints(self, character_id, force_refresh=False, chain=[]):
    return update_character_loyaltypoints(
        character_id, force_refresh=force_refresh)


def build_location_cache_tag(location_id):
    return f"loc_id_{location_id}"


def build_location_cooloff_cache_tag(location_id):
    return f"cooldown_loc_id_{location_id}"


def get_location_cooloff(location_id):
    return cache.get(build_location_cooloff_cache_tag(location_id), False)


def set_location_cooloff(location_id):
    # timeout for 7 days
    return cache.set(build_location_cooloff_cache_tag(location_id), True, (60 * 60 * 24 * 7))


def get_error_count_flag():
    return cache.get("esi_errors_timeout", False)


def location_get(location_id):
    cache_tag = build_location_cache_tag(location_id)
    data = json.loads(cache.get(cache_tag, '{"date":false, "characters":[]}'))
    if data.get('date') is not False:
        try:
            data['date'] = datetime.datetime.strptime(
                data.get('date'), TZ_STRING).replace(tzinfo=timezone.utc)
        except Exception:
            data['date'] = datetime.datetime.min.replace(tzinfo=timezone.utc)
    return data


CACHE_TIMEOUT = 60*60*24*30


def location_set(location_id, character_id):
    cache_tag = build_location_cache_tag(location_id)
    date = timezone.now() - datetime.timedelta(days=7)
    data = location_get(location_id)
    if data.get('date') is not False:
        if data.get('date') > date:
            data.get('characters').append(character_id)
            cache.set(cache_tag, json.dumps(
                data, cls=DjangoJSONEncoder), CACHE_TIMEOUT)
            return True
        else:
            data['date'] = timezone.now().strftime(TZ_STRING)
            data['characters'] = [character_id]
            cache.set(cache_tag, json.dumps(
                data, cls=DjangoJSONEncoder), CACHE_TIMEOUT)

    if character_id not in data.get('characters'):
        data.get('characters').append(character_id)
        data['date'] = timezone.now().strftime(TZ_STRING)
        cache.set(cache_tag, json.dumps(
            data, cls=DjangoJSONEncoder), CACHE_TIMEOUT)
        return True

    return False


@shared_task(bind=True, base=QueueOnce, max_retries=None)
@esi_error_retry
def update_citadel_names(self):
    citadels = EveLocation.objects.filter(location_id__gte=64000000)
    for c in citadels:
        update_location.apply_async(
            args=[c.location_id],
            kwargs={"force_citadel": True},
            priority=7
        )


def get_character_lists(location_id):
    cached_data = location_get(location_id)

    date = timezone.now() - datetime.timedelta(days=7)

    asset = CharacterAsset.objects.filter(
        location_id=location_id).select_related('character__character')
    clone = Clone.objects.filter(
        location_id=location_id).select_related('character__character')
    jumpclone = JumpClone.objects.filter(
        location_id=location_id).select_related('character__character')
    marketorder = CharacterMarketOrder.objects.filter(
        location_id=location_id).select_related('character__character')

    if cached_data.get('date') is not False:
        if cached_data.get('date') > date:
            asset = asset.exclude(
                character__character__character_id__in=cached_data.get('characters'))
            clone = clone.exclude(
                character__character__character_id__in=cached_data.get('characters'))
            jumpclone = jumpclone.exclude(
                character__character__character_id__in=cached_data.get('characters'))
            marketorder = marketorder.exclude(
                character__character__character_id__in=cached_data.get('characters'))

    # location_flag = None
    char_ids = []

    if asset.exists():
        char_ids += list(asset.values_list('character__character__character_id', flat=True))
    if clone.exists():
        char_ids += list(clone.values_list('character__character__character_id', flat=True))
    if jumpclone.exists():
        char_ids += list(jumpclone.values_list(
            'character__character__character_id', flat=True))
    if marketorder.exists():
        char_ids += list(marketorder.values_list(
            'character__character__character_id', flat=True))

    return set(char_ids)


def update_missing_locations(location_id):
    count = CharacterAsset.objects.filter(
        location_id=location_id,
        location_name__isnull=True
    ).update(location_name_id=location_id)

    count = CorpAsset.objects.filter(
        location_id=location_id,
        location_name__isnull=True
    ).update(location_name_id=location_id)

    count += Clone.objects.filter(
        location_id=location_id,
        location_name__isnull=True
    ).update(location_name_id=location_id)

    count += JumpClone.objects.filter(
        location_id=location_id,
        location_name__isnull=True
    ).update(location_name_id=location_id)

    count += CharacterMarketOrder.objects.filter(
        location_id=location_id,
        location_name__isnull=True
    ).update(location_name_id=location_id)

    count += Contract.objects.filter(
        start_location_id=location_id,
        start_location_name__isnull=True
    ).update(start_location_name_id=location_id)

    count += CorporateContract.objects.filter(
        start_location_id=location_id,
        start_location_name__isnull=True
    ).update(start_location_name_id=location_id)

    count += Contract.objects.filter(
        end_location_id=location_id,
        end_location_name__isnull=True
    ).update(end_location_name_id=location_id)

    count += CorporateContract.objects.filter(
        end_location_id=location_id,
        end_location_name__isnull=True
    ).update(end_location_name_id=location_id)

    logger.info(f"CT LOCATIONS: Updated {count} models!")
    return count


@shared_task(bind=True, base=QueueOnce, max_retries=None)
@esi_error_retry
def update_location(self, location_id, character_ids=None, force_citadel=False):
    if get_error_count_flag():
        self.retry(countdown=300)

    if get_location_cooloff(location_id):
        if force_citadel and location_id > 64000000:
            pass
        else:
            return f"CT LOCATIONS: Cooloff on ID: {location_id}"

    if location_id < 64000000:
        location = fetch_location_name(location_id, None, 0, update=True)
        if location is not None:
            location.save()
            return update_missing_locations(location_id)
        else:
            if get_error_count_flag():
                self.retry(countdown=300)

    char_ids = get_character_lists(location_id)

    if len(char_ids) == 0:
        set_location_cooloff(location_id)
        return f"CT LOCATIONS: No more Characters for Location_id: {location_id} cooling off for a while"

    for c_id in char_ids:
        location = fetch_location_name(location_id, None, c_id)
        if location is not None:
            location.save()
            return update_missing_locations(location_id)
        else:
            location_set(location_id, c_id)
            if get_error_count_flag():
                self.retry(countdown=300)

    set_location_cooloff(location_id)
    return f"CT LOCATIONS: No more Characters for Location_id: {location_id} cooling off for a while"


@shared_task(bind=True, base=QueueOnce)
@no_fail_chain
def update_all_locations(self, character_filter=None, force_citadels=False, update_all=False, chain=[]):
    location_flags = [
        'Deliveries',
        'Hangar',
        'HangarAll'
    ]

    expire = timezone.now() - datetime.timedelta(days=30)  # 1 week refresh

    asset_tops = CharacterAsset.objects.all().values_list("item_id", flat=True)
    char_filter = CharacterAudit.objects.all()

    if character_filter:
        char_filter = char_filter.filter(
            character__character_id__in=character_filter)

    queryset1 = list(
        CharacterAsset.objects.filter(
            location_flag__in=location_flags,
            location_name=None,
            character__in=char_filter
        ).exclude(
            location_id__in=asset_tops
        ).values_list('location_id', flat=True)
    )

    queryset5 = list(
        CharacterAsset.objects.filter(
            location_flag='AssetSafety',
            location_name=None,
            character__in=char_filter
        ).values_list('location_id', flat=True)
    )
    logger.debug(
        f"CT LOCATIONS: {character_filter} Assets {queryset1 + queryset5}")
    queryset3 = list(
        Clone.objects.filter(
            location_id__isnull=False,
            location_name_id__isnull=True,
            character__in=char_filter
        ).values_list('location_id', flat=True)
    )
    logger.debug(f"CT LOCATIONS: {character_filter} Clone {queryset3}")

    queryset4 = list(
        JumpClone.objects.filter(
            location_id__isnull=False,
            location_name_id__isnull=True,
            character__in=char_filter
        ).values_list('location_id', flat=True)
    )
    logger.debug(f"CT LOCATIONS: {character_filter} JumpClone {queryset4}")

    queryset6 = list(
        CharacterMarketOrder.objects.filter(
            location_name_id__isnull=True,
            character__in=char_filter
        ).values_list(
            'location_id',
            flat=True
        )
    )
    logger.debug(
        f"CT LOCATIONS: {character_filter} CharacterMarketOrder {queryset6}")

    queryset7 = list(
        Contract.objects.filter(
            start_location_name=None,
            start_location_id__isnull=False,
            character__in=char_filter
        ).values_list('start_location_id', flat=True)
    )
    logger.debug(f"CT LOCATIONS: {character_filter} Contract {queryset7}")

    queryset8 = list(
        Contract.objects.filter(
            end_location_name=None,
            end_location_id__isnull=False,
            character__in=char_filter
        ).values_list('end_location_id', flat=True)
    )
    logger.debug(f"CT LOCATIONS: {character_filter} Contract {queryset8}")

    all_locations = set(
        queryset1 + queryset3 + queryset8 +
        queryset4 + queryset5 + queryset6 +
        queryset7
    )
    logger.debug(
        f"CT LOCATIONS: {character_filter} all_locations {all_locations}")

    if update_all:
        clones_all = list(
            Clone.objects.all().values_list(
                'location_id',
                flat=True
            )
        )

        jump_clones_all = list(
            Clone.objects.all().values_list(
                'location_id',
                flat=True
            )
        )

        asset_all = list(
            CharacterAsset.objects.all().values_list(
                'location_id',
                flat=True
            )
        )

        queryset2 = list(
            EveLocation.objects.filter(
                last_update__lte=expire,
                location_id__in=set(
                    clones_all + jump_clones_all + asset_all
                )
            ).values_list('location_id', flat=True)
        )

        all_locations += set(queryset2)

    logger.info(f"CT LOCATIONS: {len(all_locations)} Locations to find")

    count = 0
    for location in all_locations:
        if not get_location_cooloff(location):
            update_location.apply_async(
                args=[location],
                kwargs={
                    "force_citadel": force_citadels
                },
                priority=8
            )
            count += 1

    return f"CT LOCATIONS: {character_filter} Sent {count} location_update tasks"


@shared_task(bind=True, base=QueueOnce)
@esi_error_retry
def update_corp_wallet(self, corp_id, full_update=False):
    return corp_helpers.update_corp_wallet_division(corp_id, full_update=full_update)


@shared_task(bind=True, base=QueueOnce)
@esi_error_retry
def update_corp_structures(self, corp_id, force_refresh=False):
    return corp_helpers.update_corp_structures(corp_id, force_refresh=force_refresh)


@shared_task(bind=True, base=QueueOnce)
@esi_error_retry
def update_corp_assets(self, corp_id):
    return corp_helpers.update_corp_assets(corp_id)


@shared_task(bind=True, base=QueueOnce)
@esi_error_retry
def update_corp_pocos(self, corp_id):
    return corp_helpers.update_corporation_pocos(corp_id)


@shared_task(bind=True, base=QueueOnce)
@esi_error_retry
def update_corp_logins(self, corp_id):
    return corp_helpers.update_character_logins_from_corp(corp_id)


@shared_task(bind=True, base=QueueOnce)
@esi_error_retry
def update_corp_contracts(self, corp_id, force_refresh=False):
    _, ids = corp_helpers.update_corporate_contracts(
        corp_id, force_refresh=force_refresh)

    _chain = []
    for id in ids:
        _chain.append(corp_helpers.update_corporate_contract_items.si(
            corp_id, id)
        )
    Chain(_chain).apply_async(priority=8)

    return "Completed Que of contract items for: %s" % str(corp_id)


@shared_task
def update_corp(corp_id, force_refresh=False):
    corp = CorporationAudit.objects.get(corporation__corporation_id=corp_id)
    logger.info("Starting Updates for {}".format(
        corp.corporation.corporation_name))
    que = []
    que.append(update_corp_wallet.si(corp_id))
    que.append(update_corp_structures.si(corp_id, force_refresh=force_refresh))
    que.append(update_corp_assets.si(corp_id))
    que.append(update_corp_pocos.si(corp_id))
    que.append(update_corp_contracts.si(corp_id))
    que.append(update_corp_logins.si(corp_id))
    Chain(que).apply_async(priority=6)


@shared_task
def update_all_corps(force_refresh=False):
    corps = CorporationAudit.objects.all().select_related('corporation')
    for corp in corps:
        update_corp.apply_async(
            args=[corp.corporation.corporation_id],
            kwargs={"force_refresh": force_refresh},
            countdown=random()*app_settings.CT_TASK_SPREAD_DELAY*2
        )


@shared_task
def run_housekeeping():
    notifs = remove_old_notifications()

    return notifs


@shared_task
def update_all_raw_minerals():
    _types = EveItemType.objects.filter(group__category_id=4)
    return update_prices_for_types(list(_types.values_list("type_id", flat=True)))


@shared_task
def update_prices_for_types(type_ids: list):
    logger.info(
        "Pulling values from Jita @`buy`-`weightedAverage`"
    )
    _str = str(type_ids.pop())
    for i in type_ids:
        _str += f",{i}"
    url = f"https://market.fuzzwork.co.uk/aggregates/?station=60003760&types={_str}"
    response = requests.get(url)
    price_data = response.json()
    price_cache = {}
    for key, item in price_data.items():
        obj, _ = EveItemType.objects.get_or_create_from_esi(key)

        ob, _ = TypePrice.objects.update_or_create(
            item=obj,
            defaults={
                "price": float(item['buy']["weightedAverage"])
            }
        )
        price_cache[obj.name] = float(item['buy']["weightedAverage"])
    return json.dumps(price_cache, indent=2)
