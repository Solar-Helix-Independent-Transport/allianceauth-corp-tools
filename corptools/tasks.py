import datetime
import logging
import os

from celery import shared_task, chain
from django.utils import timezone

from allianceauth.services.tasks import QueueOnce

from .task_helpers.update_tasks import process_map_from_esi, update_ore_comp_table_from_fuzzworks, process_category_from_esi, fetch_location_name
from .task_helpers.char_tasks import update_corp_history, update_character_assets, update_character_skill_list, update_character_skill_queue, update_character_wallet
from .models import CharacterAudit, CharacterAsset
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
    que.append(update_char_wallet.si(character.character.character_id))
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
        return update_character_assets(character_id)
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
def update_location(self, location_id):
    asset = CharacterAsset.objects.filter(location_id=location_id).first()
    location = fetch_location_name(location_id, asset.location_flag, asset.character.character.character_id)
    if location is not None:
        location.save()
        CharacterAsset.objects.filter(location_id=location_id).update(location_name_id=location_id)
    else:
        logger.error("Failed Location_id: {} will try again in 7 days".format(location_id))
        # TODO add caching blocks

def location_last_checked(location_id):
    cache_tag = "loc_id_{}".format(location_id)
    #cache.get(cache_tag)
    
@shared_task
def update_all_locations():
    location_flags = ['AssetSafety',
                      'Deliveries',
                      'Hangar',
                      'HangarAll']

    expire = datetime.datetime.utcnow().replace(tzinfo=timezone.utc) - datetime.timedelta(days=7)  # 1 week refresh

    queryset = CharacterAsset.objects.filter(location_flag__in=location_flags, location_name=None)
    queryset = queryset | CharacterAsset.objects.filter(location_flag__in=location_flags, location_name__last_update__lte=expire)

    for location in queryset.values('location_id').distinct():
        print(location.get('location_id'))
        update_location.apply_async(args=[location.get('location_id')], priority=6)
    