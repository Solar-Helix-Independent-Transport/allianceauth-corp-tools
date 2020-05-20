import logging
import requests
import bz2
import json

from concurrent.futures import ThreadPoolExecutor, as_completed

from corptools import providers
from corptools.models import MapConstellation, MapRegion, MapSystem, InvTypeMaterials, EveItemCategory, EveItemGroup, EveItemType, EveItemDogmaAttribute

import logging
logger = logging.getLogger(__name__)

def process_map_from_esi():
    _regions = providers.esi.client.Universe.get_universe_regions().result()
    _region_models_updates = []
    _region_models_creates = []

    _constelations = []
    _constelation_model_updates = []
    _constelation_model_creates = []

    _systems = []
    _system_models_updates = []
    _system_models_creates = []

    _processes = []
    _current_regions = MapRegion.objects.all().values_list('region_id', flat=True)
    with ThreadPoolExecutor(max_workers=20) as executor:
        for region in _regions:
            _processes.append(executor.submit(providers.esi._get_region, region, _current_regions))

    for task in as_completed(_processes):
        __region_upd, __region_new, __constelation_list = task.result()
        _constelations += __constelation_list
        if __region_upd:
            _region_models_updates.append(__region_upd)
        if __region_new:
            _region_models_creates.append(__region_new)

    MapRegion.objects.bulk_update(_region_models_updates, ['name', 'description'], batch_size=1000)  # bulk update
    MapRegion.objects.bulk_create(_region_models_creates, batch_size=1000)  # bulk create

    _processes = []
    _current_constellations = MapConstellation.objects.all().values_list('constellation_id', flat=True)
    with ThreadPoolExecutor(max_workers=20) as executor:
        for constellation in _constelations:
            _processes.append(executor.submit(providers.esi._get_constellation, constellation, _current_constellations))

    for task in as_completed(_processes):
        __constelation_upd, __constelation_new, __system_list = task.result()
        _systems += __system_list
        if __constelation_upd:
            _constelation_model_updates.append(__constelation_upd)
        if __constelation_new:
            _constelation_model_creates.append(__constelation_new)

    MapConstellation.objects.bulk_update(_constelation_model_updates, ['name', 'region_id'], batch_size=1000)  # bulk update
    MapConstellation.objects.bulk_create(_constelation_model_creates, batch_size=1000)  # bulk create

    _processes = []
    _current_systems = MapSystem.objects.all().values_list('system_id', flat=True)
    with ThreadPoolExecutor(max_workers=50) as executor:
        for system in _systems:
            _processes.append(executor.submit(providers.esi._get_system, system, _current_systems))

    for task in as_completed(_processes):
        __system_upd, __system_new = task.result()
        if __system_upd:
            _system_models_updates.append(__system_upd)
        if __system_new:
            _system_models_creates.append(__system_new)

    MapSystem.objects.bulk_update(_system_models_updates, ['name', 'constellation_id', 'star_id', 'security_class', 'x', 'y', 'z', 'security_status'], batch_size=1000)  # bulk update
    MapSystem.objects.bulk_create(_system_models_creates, batch_size=1000)  # bulk update
   
    output = "Regions: (Updated:{}, Created:{}) " \
             "Constellations: (Updated:{}, Created:{}) " \
             "Systems: (Updated:{}, Created:{})".format(len(_region_models_updates),
                                                      len(_region_models_creates),
                                                      len(_constelation_model_updates),
                                                      len(_constelation_model_creates),
                                                      len(_system_models_updates),
                                                      len(_system_models_creates))

    return output


def update_ore_comp_table_from_fuzzworks():
    InvTypeMaterials.objects.all().delete()
    # Get needed SDE file
    sysNames_url = 'https://www.fuzzwork.co.uk/dump/latest/invTypeMaterials.csv.bz2'

    sysNames_req = requests.get(sysNames_url)
    with open('invTypeMaterials.csv.bz2', 'wb') as iN:
        iN.write(sysNames_req.content)

    # Decompress SDE files
    open('invTypeMaterials.csv', 'wb').write(bz2.open('invTypeMaterials.csv.bz2', 'rb').read())

    # Parse file(s) and Update names object(s)
    ore_details = []
    with open('invTypeMaterials.csv', 'r', encoding='UTF-8') as iN:
        csv_list = iN.read().split('\n')
        for row in csv_list[1:]:
            spl = row.split(',')
            if len(spl) > 1:
                ore_details.append(InvTypeMaterials(
                    qty = spl[2],
                    type_id = spl[0],
                    material_type_id = spl[1]
                ))

        InvTypeMaterials.objects.bulk_create(ore_details, batch_size=500)


def process_category_from_esi(category_id):
    _current_categories = EveItemCategory.objects.all().values_list('category_id', flat=True)
    _category_models_updates, _category_models_creates, _groups = providers.esi._get_category(category_id, updates=_current_categories)

    if _category_models_updates:
        EveItemCategory.objects.bulk_update([_category_models_updates], ['name'])
    if _category_models_creates:
        _category_models_creates.save()

    _groups_model_updates = []
    _groups_model_creates = []

    _items = []
    _items_models_updates = []
    _items_models_creates = []
    _dogma_models_creates = []

    _processes = []
    _current_groups = EveItemGroup.objects.all().values_list('group_id', flat=True)
    with ThreadPoolExecutor(max_workers=20) as executor:
        for group in _groups:
            _processes.append(executor.submit(providers.esi._get_group, group, _current_groups))

    for task in as_completed(_processes):
        __group_upd, __group_new, __items_list = task.result()
        _items += __items_list
        if __group_upd:
            _groups_model_updates.append(__group_upd)
        if __group_new:
            _groups_model_creates.append(__group_new)

    EveItemGroup.objects.bulk_update(_groups_model_updates, ['name', 'category_id'], batch_size=1000)  # bulk update
    EveItemGroup.objects.bulk_create(_groups_model_creates, batch_size=1000)  # bulk create

    _processes = []
    _current_items = EveItemType.objects.all().values_list('type_id', flat=True)
    with ThreadPoolExecutor(max_workers=50) as executor:
        for item in _items:
            _processes.append(executor.submit(providers.esi._get_eve_type, item, _current_items))

    for task in as_completed(_processes):
        __item_upd, __item_new, __item_dogma = task.result()
        _dogma_models_creates += __item_dogma
        if __item_upd:
            _items_models_updates.append(__item_upd)
        if __item_new:
            _items_models_creates.append(__item_new)

    dogma_query = EveItemDogmaAttribute.objects.filter(eve_type_id__in=_items)
    if dogma_query.exists():
        dogma_query._raw_delete(dogma_query.db) # speed and we are not caring about f-keys or signals on these models 

    EveItemType.objects.bulk_update(_items_models_updates, 
                                        ['name', 'group_id', 'description', 
                                        'mass', 'packaged_volume','portion_size',
                                        'volume','published','radius'], batch_size=1000)  # bulk update
    EveItemType.objects.bulk_create(_items_models_creates, batch_size=1000)  # bulk create
    EveItemDogmaAttribute.objects.bulk_create(_dogma_models_creates, batch_size=1000)  # bulk create

    output = "Category ({}): " \
             "Groups: (Updated:{}, Created:{}) " \
             "Items: (Updated:{}, Created:{}, Dogma Attributes:{}".format(category_id,
                                                      len(_groups_model_updates),
                                                      len(_groups_model_creates),
                                                      len(_items_models_updates),
                                                      len(_items_models_creates),
                                                      len(_dogma_models_creates))

    return output

def process_bulk_types_from_esi(type_ids, update_models=False):

    _items = type_ids
    _items_models_creates = []
    _items_models_updates = []
    _dogma_models_creates = []
    _groups = []
    _groups_model_creates = []
    _groups_model_updates = []
    _categories = []
    _categories_model_creates = []
    _categories_model_updates = []
    _processes = []
    _current_items = EveItemType.objects.all().values_list('type_id', flat=True)
    _current_groups = EveItemGroup.objects.all().values_list('group_id', flat=True)
    _current_categories = EveItemCategory.objects.all().values_list('category_id', flat=True)

    with ThreadPoolExecutor(max_workers=50) as executor:
        for item in _items:
            if item not in _current_items or update_models:
                _processes.append(executor.submit(providers.esi._get_eve_type, item, _current_items))

    for task in as_completed(_processes):
        __item_update, __item_new, __item_dogma = task.result()
        if __item_new:
            if __item_new.group_id not in _current_groups:
                _current_groups.append(__item_new.group_id)
            _groups.append(__item_new.group_id)
            _items_models_creates.append(__item_new)
        if __item_update:
            if __item_update.group_id not in _current_groups:
                _current_groups.append(__item_update.group_id)
            _groups.append(__item_update.group_id)
            _items_models_updates.append(__item_update)
        _dogma_models_creates += __item_dogma

    _processes = []
    with ThreadPoolExecutor(max_workers=50) as executor:
        for group in _groups:
            if group not in _current_groups or update_models:
                _processes.append(executor.submit(providers.esi._get_group, group, _current_groups))

    for task in as_completed(_processes):
        __group_update, __group_new, types = task.result()
        if __group_new:
            if __group_new.category_id not in _current_categories:
                _current_categories.append(__group_new.category_id)
            _categories.append(__group_new.category_id)
            _groups_model_creates.append(__group_new)
        if __group_update:
            if __group_update.category_id not in _current_categories:
                _current_categories.append(__group_update.category_id)
            _categories.append(__group_update.category_id)
            _groups_model_updates.append(__group_update)

    _processes = []
    with ThreadPoolExecutor(max_workers=50) as executor:
        for category in _categories:
            if category not in _current_categories or update_models:
                _processes.append(executor.submit(providers.esi._get_category, category, _current_categories))

    for task in as_completed(_processes):
        __category_update, __category_new, groups = task.result()
        if __category_new:
            _categories_model_creates.append(__category_new)
        if __category_update:
            _categories_model_updates.append(__category_update)

    dogma_query = EveItemDogmaAttribute.objects.filter(eve_type_id__in=_items)
    if dogma_query.exists():
        dogma_query._raw_delete(dogma_query.db) # speed and we are not caring about f-keys or signals on these models 

    if len(_categories_model_creates) > 0:
        EveItemCategory.objects.bulk_create(_categories_model_creates, batch_size=1000, ignore_conflicts=True)  # bulk create
    if len(_categories_model_updates) > 0:
        EveItemCategory.objects.bulk_update(_categories_model_updates, ['name'])  # bulk update

    if len(_groups_model_creates) > 0:
        EveItemGroup.objects.bulk_create(_groups_model_creates, batch_size=1000, ignore_conflicts=True)  # bulk create
    if len(_groups_model_updates) > 0:
        EveItemGroup.objects.bulk_update(_groups_model_updates, ['name', 'category_id'], batch_size=1000)  # bulk update

    if len(_items_models_creates) > 0:
        EveItemType.objects.bulk_create(_items_models_creates, batch_size=1000)  # bulk create
    if len(_items_models_updates) > 0:
        EveItemType.objects.bulk_update(_items_models_updates, 
                                    ['name', 'group_id', 'description', 
                                    'mass', 'packaged_volume','portion_size',
                                    'volume','published','radius'], batch_size=1000)  # bulk update
    if len(_dogma_models_creates) > 0:
        EveItemDogmaAttribute.objects.bulk_create(_dogma_models_creates, batch_size=1000, ignore_conflicts=True)  # bulk create

    output = "Category: (Updated:{}, Created:{}): " \
             "Groups: (Updated:{}, Created:{}) " \
             "Items: (Updated:{}, Created:{}, Dogma Attributes:{}".format(
                                                      len(_categories_model_updates),
                                                      len(_categories_model_creates),
                                                      len(_groups_model_updates),
                                                      len(_groups_model_creates),
                                                      len(_items_models_updates),
                                                      len(_items_models_creates),
                                                      len(_dogma_models_creates))

    logger.debug(output)

    return True