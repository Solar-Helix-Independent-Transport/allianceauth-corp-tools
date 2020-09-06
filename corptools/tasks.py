import datetime
import logging
import os
import json

from celery import shared_task, chain
from django.utils import timezone
from django.core.cache import cache

from allianceauth.services.tasks import QueueOnce
from django.core.serializers.json import DjangoJSONEncoder
from django.utils import timezone

from .task_helpers.update_tasks import process_map_from_esi, update_ore_comp_table_from_fuzzworks, process_category_from_esi, fetch_location_name
from .task_helpers.char_tasks import update_corp_history, update_character_assets, update_character_skill_list, update_character_clones, update_character_skill_queue, update_character_wallet, update_character_orders, update_character_order_history
from .task_helpers.corp_helpers import update_corp_wallet_division
from .models import CharacterAudit, CharacterAsset, EveLocation, CorporationAudit, JumpClone, Clone, CharacterMarketOrder
from . import providers

logger = logging.getLogger(__name__)

###### Bulk Updates
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
def process_all_categories():
    categories = providers.esi.client.Universe.get_universe_categories().result()
    que = []

    for category in categories:
        que.append(update_category.si(category))

    chain(que).apply_async(priority=7)

    return "Queued {} Tasks".format(len(que))

###### Character Tasks
@shared_task
def update_all_characters():
    characters = CharacterAudit.objects.all().select_related('character')
    for char in characters:
        update_character.apply_async(args=[char.character.character_id])

@shared_task
def update_character(char_id):
    character = CharacterAudit.objects.filter(character__character_id=char_id).first()
    logger.info("Starting Updates for {}".format(character.character.character_name))
    que = []
    que.append(update_char_corp_history.si(character.character.character_id))
    que.append(update_char_skill_list.si(character.character.character_id))
    que.append(update_char_skill_queue.si(character.character.character_id))
    que.append(update_clones.si(character.character.character_id))
    que.append(update_char_wallet.si(character.character.character_id))
    que.append(update_char_orders.si(character.character.character_id))
    que.append(update_char_order_history.si(character.character.character_id))
    que.append(update_char_assets.si(character.character.character_id))
    chain(que).apply_async(priority=6)

@shared_task(bind=True, base=QueueOnce)
def update_char_corp_history(self, character_id):
    try:
        return update_corp_history(character_id)
    except Exception as e:
        logger.exception(e)
        return "Failed"

@shared_task(bind=True, base=QueueOnce)
def update_char_skill_list(self, character_id):
    try:
        return update_character_skill_list(character_id)
    except Exception as e:
        logger.exception(e)
        return "Failed"

@shared_task(bind=True, base=QueueOnce)
def update_char_skill_queue(self, character_id):
    try:
        return update_character_skill_queue(character_id)
    except Exception as e:
        logger.exception(e)
        return "Failed"


@shared_task(bind=True, base=QueueOnce)
def update_char_assets(self, character_id):
    try:
        results = update_character_assets(character_id)
        update_all_locations.apply_async(priority=7)
        return results

    except Exception as e:
        logger.exception(e)
        return "Failed"

@shared_task(bind=True, base=QueueOnce)
def update_char_wallet(self, character_id):
    try:
        return update_character_wallet(character_id)
    except Exception as e:
        logger.exception(e)
        return "Failed"

@shared_task(bind=True, base=QueueOnce)
def update_char_orders(self, character_id):
    try:
        return update_character_orders(character_id)
    except Exception as e:
        logger.exception(e)
        return "Failed"

@shared_task(bind=True, base=QueueOnce)
def update_char_order_history(self, character_id):
    try:
        return update_character_order_history(character_id)
    except Exception as e:
        logger.exception(e)
        return "Failed"

def build_location_cache_tag(location_id):
    return "loc_id_{}".format(location_id)

def get_error_count_flag():
    return cache.get("esi_errors_timeout", False)

def location_get(location_id):
    cache_tag = build_location_cache_tag(location_id)
    data = json.loads(cache.get(cache_tag,'{"date":false, "characters":[]}'))
    if data.get('date') is not False:
        data['date'] = datetime.datetime.strptime(data.get('date'), "%Y-%m-%dT%H:%M:%S.%fZ").replace(tzinfo=timezone.utc)
    return data

def location_set(location_id, character_id):
    cache_tag = build_location_cache_tag(location_id)
    date = datetime.datetime.utcnow().replace(tzinfo=timezone.utc) - datetime.timedelta(days=7)
    data = location_get(location_id)
    if data.get('date') is not False:
        if data.get('date') < date:
            data.get('characters').append(character_id) 
            cache.set(cache_tag, json.dumps(data, cls=DjangoJSONEncoder), None)
            return True
        else:
            data['date'] = datetime.datetime.utcnow().replace(tzinfo=timezone.utc)
            data['characters'] = [character_id]
            cache.set(cache_tag, json.dumps(data, cls=DjangoJSONEncoder), None)

    if character_id not in data.get('characters'):
        data.get('characters').append(character_id) 
        data['date'] = datetime.datetime.utcnow().replace(tzinfo=timezone.utc)
        cache.set(cache_tag, json.dumps(data, cls=DjangoJSONEncoder), None)
        return True
    
    return False

@shared_task(bind=True, base=QueueOnce)
def update_location(self, location_id):
    if get_error_count_flag():
        self.retry(countdown=60)
    cached_data = location_get(location_id)
    date = datetime.datetime.utcnow().replace(tzinfo=timezone.utc) - datetime.timedelta(days=7)
    asset = CharacterAsset.objects.filter(location_id=location_id)
    clone = Clone.objects.filter(location_id=location_id)
    jumpclone = JumpClone.objects.filter(location_id=location_id)
    marketorder = CharacterMarketOrder.objects.filter(location_id=location_id)

    if cached_data.get('date') is not False:
        if cached_data.get('date') > date:
            asset = asset.exclude(character__character__character_id__in=cached_data.get('characters'))
            clone = clone.exclude(character__character__character_id__in=cached_data.get('characters'))
            jumpclone = jumpclone.exclude(character__character__character_id__in=cached_data.get('characters'))
            marketorder = marketorder.exclude(character__character__character_id__in=cached_data.get('characters'))
    
    location_flag = None
    char_id = None

    if asset.exists():
        asset = asset.first()
        char_id = asset.character.character.character_id
        location_flag = asset.location_flag
    elif clone.exists():
        clone = clone.first()
        char_id = clone.character.character.character_id
    elif jumpclone.exists():
        jumpclone = jumpclone.first()
        char_id = jumpclone.character.character.character_id
    elif marketorder.exists():
        marketorder = marketorder.first()
        char_id = marketorder.character.character.character_id

    if char_id is None:
        return "No more Characters for Location_id: {}".format(location_id)

    location = fetch_location_name(location_id, location_flag, char_id)
    if location is not None:
        location.save()
        CharacterAsset.objects.filter(location_id=location_id).update(location_name_id=location_id)
        Clone.objects.filter(location_id=location_id).update(location_name_id=location_id)
        JumpClone.objects.filter(location_id=location_id).update(location_name_id=location_id)
        CharacterMarketOrder.objects.filter(location_id=location_id).update(location_name_id=location_id)
    else:
        location_set(location_id, asset.character.character.character_id)
        self.retry(countdown=1)

@shared_task(bind=True, base=QueueOnce)
def update_all_locations(self):
    location_flags = ['Deliveries',
                      'Hangar',
                      'HangarAll']

    expire = datetime.datetime.utcnow().replace(tzinfo=timezone.utc) - datetime.timedelta(days=7)  # 1 week refresh

    asset_tops = CharacterAsset.objects.all().values_list("item_id", flat=True)  
    
    queryset1 = list(CharacterAsset.objects.filter(location_flag__in=location_flags, 
                        location_name=None).exclude(location_id__in=asset_tops).values_list('location_id', flat=True))

    queryset5 = list(CharacterAsset.objects.filter(location_flag='AssetSafety', 
                        location_name=None).values_list('location_id', flat=True))

    queryset3 = list(Clone.objects.filter(location_id__isnull=False, 
                        location_name_id__isnull=True).values_list('location_id', flat=True))
                        
    queryset4 = list(JumpClone.objects.filter(location_id__isnull=False, 
                        location_name_id__isnull=True).values_list('location_id', flat=True))
    
    clones_all = list(Clone.objects.all().values_list('location_id', flat=True))
    jump_clones_all = list(Clone.objects.all().values_list('location_id', flat=True))
    asset_all = list(CharacterAsset.objects.all().values_list('location_id', flat=True))

    queryset2 = list(EveLocation.objects.filter(last_update__lte=expire, 
                location_id__in=set(clones_all + jump_clones_all + asset_all)).values_list('location_id', flat=True))

    queryset6 = list(CharacterMarketOrder.objects.filter(location_name_id__isnull=True).values_list('location_id', flat=True))

    all_locations = set(queryset1 + queryset2 + queryset3 + queryset4 + queryset5 + queryset6)
    print(all_locations)
    for location in all_locations:
        update_location.apply_async(args=[location], priority=6)

@shared_task(bind=True, base=QueueOnce)
def update_corp_wallet(self, corp_id):
    update_corp_wallet_division(corp_id)

@shared_task
def update_corp(corp_id):
    corp = CorporationAudit.objects.get(corporation__corporation_id=corp_id)
    logger.info("Starting Updates for {}".format(corp.corporation.corporation_name))
    que = []
    que.append(update_corp_wallet.si(corp_id))
    chain(que).apply_async(priority=6)

@shared_task
def update_all_corps():
    corps = CorporationAudit.objects.all().select_related('corporation')
    for corp in corps:
        update_corp.apply_async(args=[corp.corporation.corporation_id])

@shared_task
def update_clones(char_id):
    update_character_clones(char_id)
    update_all_locations.apply_async(priority=7)
