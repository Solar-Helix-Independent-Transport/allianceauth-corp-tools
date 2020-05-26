import logging
import os

from celery import shared_task, chain

from .task_helpers.update_tasks import process_map_from_esi, update_ore_comp_table_from_fuzzworks, process_category_from_esi
from .task_helpers.char_tasks import update_corp_history, update_character_assets, update_character_skill_list, update_character_skill_queue, update_character_wallet
from .models import CharacterAudit
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

@shared_task
def update_char_corp_history(character_id):
    try:
        return update_corp_history(character_id)
    except Exception as e:
        logger.exception(e)
        return False

@shared_task
def update_char_skill_list(character_id):
    try:
        return update_character_skill_list(character_id)
    except Exception as e:
        logger.exception(e)
        return False


@shared_task
def update_char_skill_queue(character_id):
    try:
        return update_character_skill_queue(character_id)
    except Exception as e:
        logger.exception(e)
        return False


@shared_task
def update_char_assets(character_id):
    try:
        return update_character_assets(character_id)
    except Exception as e:
        logger.exception(e)
        return False

@shared_task
def update_char_wallet(character_id):
    try:
        return update_character_wallet(character_id)
    except Exception as e:
        logger.exception(e)
        return False
