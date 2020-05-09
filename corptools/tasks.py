import logging
import os

from celery import shared_task

from .task_helpers.update_tasks import process_map_from_esi, update_ore_comp_table_from_fuzzworks, process_category_from_esi
from .task_helpers.char_tasks import update_corp_history


###### Bulk Updates
@shared_task
def update_or_create_map():
    return process_map_from_esi()

@shared_task
def update_ore_comp_table():
    return update_ore_comp_table_from_fuzzworks()

@shared_task
def process_ores_from_esi():
    return process_category_from_esi(25)

###### Character Tasks
@shared_task
def update_char_corp_history(character_id):
    return update_corp_history(character_id)


