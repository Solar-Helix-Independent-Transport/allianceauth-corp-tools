import datetime
import json
import logging
from urllib import response

from allianceauth.eveonline.models import EveCharacter
from allianceauth.eveonline.providers import provider as eve_names
from allianceauth.services.tasks import QueueOnce
from celery import chain, shared_task
from django.core.cache import cache
from django.core.serializers.json import DjangoJSONEncoder
from django.utils import timezone
from esi.errors import TokenExpiredError
from esi.models import Token
from requests.adapters import MaxRetryError

from corptools.task_helpers.housekeeping_tasks import remove_old_notifications

from . import app_settings, providers
from .models import (CharacterAsset, CharacterAudit, CharacterMarketOrder,
                     Clone, CorporationAudit, EveLocation, EveName, JumpClone)
from .task_helpers import corp_helpers
from .task_helpers.char_tasks import (process_mail_list,
                                      update_character_assets,
                                      update_character_clones,
                                      update_character_contacts,
                                      update_character_mail,
                                      update_character_notifications,
                                      update_character_order_history,
                                      update_character_orders,
                                      update_character_roles,
                                      update_character_skill_list,
                                      update_character_skill_queue,
                                      update_character_titles,
                                      update_character_transactions,
                                      update_character_wallet,
                                      update_corp_history)
from .task_helpers.update_tasks import (fetch_location_name,
                                        process_category_from_esi,
                                        process_map_from_esi,
                                        set_error_count_flag,
                                        update_ore_comp_table_from_fuzzworks)

TZ_STRING = "%Y-%m-%dT%H:%M:%SZ"

logger = logging.getLogger(__name__)

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
    needs_update = timezone.now() - datetime.timedelta(days=7)
    en = EveName.objects.filter(last_update__lte=needs_update)
    if chunk:
        en = en[:chunk]
    for e in en:
        update_eve_name.apply_async(args=[e.eve_id], priority=7)


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

    chain(que).apply_async(priority=8)

    return "Queued {} Tasks".format(len(que))

# Character Tasks


@shared_task
def update_all_characters():
    characters = CharacterAudit.objects.all().select_related('character')
    for char in characters:
        update_character.apply_async(args=[char.character.character_id])


@shared_task
def update_subset_of_characters(subset=48, min_runs=5, force=False):
    amount_of_updates = max(
        CharacterAudit.objects.all().count()/subset, min_runs)
    characters = CharacterAudit.objects.all().order_by(
        'last_update_pub_data')[:amount_of_updates]
    for char in characters:
        update_character.apply_async(args=[char.character.character_id], kwargs={
                                     "force_refresh": force})
    update_all_eve_names.apply_async(priority=7, kwargs={"chunk": 5000})
    return f"Queued {len(characters)} Character Updates"


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


@shared_task
def update_character(char_id, force_refresh=False):
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
            logger.info("No Tokens for {}".format(char_id))
            return False

    logger.info("Starting Updates for {}".format(
        character.character.character_name))
    que = []
    que.append(update_char_roles.si(
        character.character.character_id, force_refresh=force_refresh))
    que.append(update_char_titles.si(
        character.character.character_id, force_refresh=force_refresh))
    que.append(update_char_corp_history.si(
        character.character.character_id, force_refresh=force_refresh))
    que.append(update_char_notifications.si(
        character.character.character_id, force_refresh=force_refresh))
    que.append(update_char_assets.si(
        character.character.character_id, force_refresh=force_refresh))
    que.append(update_char_skill_list.si(
        character.character.character_id, force_refresh=force_refresh))
    que.append(update_char_skill_queue.si(
        character.character.character_id, force_refresh=force_refresh))
    que.append(update_clones.si(
        character.character.character_id, force_refresh=force_refresh))
    que.append(update_char_wallet.si(
        character.character.character_id, force_refresh=force_refresh))
    que.append(update_char_orders.si(
        character.character.character_id, force_refresh=force_refresh))
    que.append(update_char_contacts.si(
        character.character.character_id, force_refresh=force_refresh))
    que.append(update_char_order_history.si(
        character.character.character_id, force_refresh=force_refresh))
    que.append(update_char_transactions.si(
        character.character.character_id, force_refresh=force_refresh))
    if app_settings.CT_CHAR_MAIL_MODULE:
        que.append(update_char_mail.si(
            character.character.character_id, force_refresh=force_refresh))
    chain(que).apply_async(priority=6)


@shared_task(bind=True, base=QueueOnce)
def update_char_corp_history(self, character_id, force_refresh=False):
    try:
        return update_corp_history(character_id, force_refresh=force_refresh)
    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task(bind=True, base=QueueOnce)
def update_char_roles(self, character_id, force_refresh=False):
    try:
        return update_character_roles(character_id, force_refresh=force_refresh)
    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task(bind=True, base=QueueOnce)
def update_char_skill_list(self, character_id, force_refresh=False):
    try:
        return update_character_skill_list(character_id, force_refresh=force_refresh)
    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task(bind=True, base=QueueOnce)
def cache_user_skill_list(self, character_id, force_refresh=False):
    try:
        providers.skills.get_and_cache_user(character_id)
    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task(bind=True, base=QueueOnce)
def update_char_skill_queue(self, character_id, force_refresh=False):
    try:
        return update_character_skill_queue(character_id, force_refresh=force_refresh)
    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task(bind=True, base=QueueOnce)
def update_char_notifications(self, character_id, force_refresh=False):
    try:
        return update_character_notifications(character_id, force_refresh=force_refresh)
    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task(bind=True, base=QueueOnce)
def update_char_assets(self, character_id, force_refresh=False):
    try:
        results = update_character_assets(
            character_id, force_refresh=force_refresh)
        # update_all_locations.apply_async(priority=7)
        return results

    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task(bind=True, base=QueueOnce)
def update_char_wallet(self, character_id, force_refresh=False):
    try:
        return update_character_wallet(character_id, force_refresh=force_refresh)
    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task(bind=True, base=QueueOnce)
def update_char_contacts(self, character_id, force_refresh=False):
    try:
        return update_character_contacts(character_id, force_refresh=force_refresh)
    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task(bind=True, base=QueueOnce)
def update_char_orders(self, character_id, force_refresh=False):
    try:
        return update_character_orders(character_id, force_refresh=force_refresh)
    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task(bind=True, base=QueueOnce)
def update_char_transactions(self, character_id, force_refresh=False):
    try:
        return update_character_transactions(character_id, force_refresh=force_refresh)
    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task(bind=True, base=QueueOnce)
def update_char_titles(self, character_id, force_refresh=False):
    try:
        return update_character_titles(character_id, force_refresh=force_refresh)
    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task(bind=True, base=QueueOnce)
def update_char_mail(self, character_id, force_refresh=False):
    try:
        mail_ids = update_character_mail(
            character_id, force_refresh=force_refresh)
        # Get and Create messages
        if mail_ids:
            chunks = [mail_ids[i:i + 50] for i in range(0, len(mail_ids), 50)]
            for chunk in chunks:
                # Process mails in chunks of 500
                process_char_mail.apply_async(
                    priority=9, args=[character_id, chunk])
        return "Completed mail pre-fetch for: %s" % str(character_id)
    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task(bind=True)
def process_char_mail(self, character_id, ids):
    try:
        return process_mail_list(character_id, ids)
    except Exception as e:
        logger.exception(e)
        self.retry(exc=e, max_retries=5)
        return "Failed"


@shared_task(bind=True, base=QueueOnce)
def update_char_order_history(self, character_id, force_refresh=False):
    try:
        return update_character_order_history(character_id, force_refresh=force_refresh)
    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task
def update_clones(character_id, force_refresh=False):
    try:
        output = update_character_clones(
            character_id, force_refresh=force_refresh)
        # update_all_locations.apply_async(priority=7)
        return output
    except Exception as e:
        logger.exception(e)
        return "Failed"


def build_location_cache_tag(location_id):
    return "loc_id_{}".format(location_id)


def build_location_cooloff_cache_tag(location_id):
    return "cooldown_loc_id_{}".format(location_id)


def get_location_cooloff(location_id):
    return cache.get(build_location_cooloff_cache_tag(location_id), False)


def set_location_cooloff(location_id):
    # timeout for 7 days
    return cache.set(build_location_cooloff_cache_tag(location_id), True, (60*60*24*7))


def get_error_count_flag():
    return cache.get("esi_errors_timeout", False)


def location_get(location_id):
    cache_tag = build_location_cache_tag(location_id)
    data = json.loads(cache.get(cache_tag, '{"date":false, "characters":[]}'))
    if data.get('date') is not False:
        try:
            data['date'] = datetime.datetime.strptime(
                data.get('date'), TZ_STRING).replace(tzinfo=timezone.utc)
        except:
            data['date'] = datetime.datetime.min.replace(tzinfo=timezone.utc)
    return data


def location_set(location_id, character_id):
    cache_tag = build_location_cache_tag(location_id)
    date = timezone.now() - datetime.timedelta(days=7)
    data = location_get(location_id)
    if data.get('date') is not False:
        if data.get('date') > date:
            data.get('characters').append(character_id)
            cache.set(cache_tag, json.dumps(data, cls=DjangoJSONEncoder), None)
            return True
        else:
            data['date'] = timezone.now().strftime(TZ_STRING)
            data['characters'] = [character_id]
            cache.set(cache_tag, json.dumps(data, cls=DjangoJSONEncoder), None)

    if character_id not in data.get('characters'):
        data.get('characters').append(character_id)
        data['date'] = timezone.now().strftime(TZ_STRING)
        cache.set(cache_tag, json.dumps(data, cls=DjangoJSONEncoder), None)
        return True

    return False


@shared_task(bind=True, base=QueueOnce, max_retries=None)
def update_citadel_names(self):
    citadels = EveLocation.objects.filter(location_id__gte=64000000)
    for c in citadels:
        update_location.apply_async(
            args=[c.location_id],
            kwargs={"force_citadel": True},
            priority=7
        )


@shared_task(bind=True, base=QueueOnce, max_retries=None)
def update_location(self, location_id, force_citadel=False):
    if get_error_count_flag():
        self.retry(countdown=300)

    if get_location_cooloff(location_id):
        if force_citadel and location_id > 64000000:
            pass
        else:
            return "Cooloff on ID: {}".format(location_id)

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

    location_flag = None
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

    char_ids = set(char_ids)

    if location_id < 64000000:
        location = fetch_location_name(location_id, None, 0, update=True)
        if location is not None:
            location.save()
            count = CharacterAsset.objects.filter(
                location_id=location_id, location_name__isnull=True).update(location_name_id=location_id)
            count += Clone.objects.filter(location_id=location_id,
                                          location_name__isnull=True).update(location_name_id=location_id)
            count += JumpClone.objects.filter(location_id=location_id,
                                              location_name__isnull=True).update(location_name_id=location_id)
            count += CharacterMarketOrder.objects.filter(
                location_id=location_id, location_name__isnull=True).update(location_name_id=location_id)
            return count
        else:
            if get_error_count_flag():
                self.retry(countdown=300)

    if len(char_ids) == 0:
        set_location_cooloff(location_id)
        return "No more Characters for Location_id: {} cooling off for a while".format(location_id)

    for c_id in char_ids:
        location = fetch_location_name(location_id, None, c_id)
        if location is not None:
            location.save()
            count = CharacterAsset.objects.filter(
                location_id=location_id, location_name__isnull=True).update(location_name_id=location_id)
            count += Clone.objects.filter(location_id=location_id,
                                          location_name__isnull=True).update(location_name_id=location_id)
            count += JumpClone.objects.filter(location_id=location_id,
                                              location_name__isnull=True).update(location_name_id=location_id)
            count += CharacterMarketOrder.objects.filter(
                location_id=location_id, location_name__isnull=True).update(location_name_id=location_id)
            return count
        else:
            location_set(location_id, c_id)
            if get_error_count_flag():
                self.retry(countdown=300)

    set_location_cooloff(location_id)
    return "No more Characters for Location_id: {} cooling off for a while".format(location_id)


@shared_task(bind=True, base=QueueOnce)
def update_all_locations(self, force_citadels=False):
    location_flags = ['Deliveries',
                      'Hangar',
                      'HangarAll']

    expire = timezone.now() - datetime.timedelta(days=7)  # 1 week refresh

    asset_tops = CharacterAsset.objects.all().values_list("item_id", flat=True)

    queryset1 = list(CharacterAsset.objects.filter(location_flag__in=location_flags,
                                                   location_name=None).exclude(location_id__in=asset_tops).values_list('location_id', flat=True))

    queryset5 = list(CharacterAsset.objects.filter(location_flag='AssetSafety',
                                                   location_name=None).values_list('location_id', flat=True))

    queryset3 = list(Clone.objects.filter(location_id__isnull=False,
                                          location_name_id__isnull=True).values_list('location_id', flat=True))

    queryset4 = list(JumpClone.objects.filter(location_id__isnull=False,
                                              location_name_id__isnull=True).values_list('location_id', flat=True))

    clones_all = list(Clone.objects.all().values_list(
        'location_id', flat=True))
    jump_clones_all = list(
        Clone.objects.all().values_list('location_id', flat=True))
    asset_all = list(CharacterAsset.objects.all(
    ).values_list('location_id', flat=True))

    queryset2 = list(EveLocation.objects.filter(last_update__lte=expire,
                                                location_id__in=set(clones_all + jump_clones_all + asset_all)).values_list('location_id', flat=True))

    queryset6 = list(CharacterMarketOrder.objects.filter(
        location_name_id__isnull=True).values_list('location_id', flat=True))

    all_locations = set(queryset1 + queryset2 + queryset3 +
                        queryset4 + queryset5 + queryset6)
    # print(all_locations)
    print(f"{len(all_locations)} Locations to find")
    count = 0
    for location in all_locations:
        if not get_location_cooloff(location):
            update_location.apply_async(args=[location], priority=8)
            count += 1
    return f"Sent {count} location_update tasks"


@shared_task(bind=True, base=QueueOnce)
def update_corp_wallet(self, corp_id, full_update=False):
    return corp_helpers.update_corp_wallet_division(corp_id, full_update=full_update)


@shared_task(bind=True, base=QueueOnce)
def update_corp_structures(self, corp_id):
    return corp_helpers.update_corp_structures(corp_id)


@shared_task(bind=True, base=QueueOnce)
def update_corp_assets(self, corp_id):
    return corp_helpers.update_corp_assets(corp_id)


@shared_task
def update_corp(corp_id):
    corp = CorporationAudit.objects.get(corporation__corporation_id=corp_id)
    logger.info("Starting Updates for {}".format(
        corp.corporation.corporation_name))
    que = []
    que.append(update_corp_wallet.si(corp_id))
    que.append(update_corp_structures.si(corp_id))
    que.append(update_corp_assets.si(corp_id))
    chain(que).apply_async(priority=6)


@shared_task
def update_all_corps():
    corps = CorporationAudit.objects.all().select_related('corporation')
    for corp in corps:
        update_corp.apply_async(args=[corp.corporation.corporation_id])


@shared_task
def run_housekeeping():
    notifs = remove_old_notifications()

    return notifs
