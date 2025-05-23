import bz2
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests
from bravado.exception import HTTPForbidden

from django.core.cache import cache

from allianceauth.services.hooks import get_extension_logger
from esi.models import Token

from corptools import providers
from corptools.models import (
    EveItemCategory, EveItemDogmaAttribute, EveItemGroup, EveItemType,
    EveLocation, InvTypeMaterials, MapConstellation, MapRegion, MapSystem,
    MapSystemGate, MapSystemMoon, MapSystemPlanet,
)

logger = get_extension_logger(__name__)

# from celery.utils.debug import sample_mem, memdump


def process_map_from_esi():
    # sample_mem()
    _regions = providers.esi.client.Universe.get_universe_regions().result()
    _region_models_updates = []
    _region_models_creates = []

    _constelations = []
    _constelation_model_updates = []
    _constelation_model_creates = []

    _systems = []
    _system_models_updates = []
    _system_models_creates = []

    _gate_links_array = []

    _processes = []
    _current_regions = MapRegion.objects.all().values_list('region_id', flat=True)
    with ThreadPoolExecutor(max_workers=20) as executor:
        for region in _regions:
            _processes.append(executor.submit(
                providers.esi._get_region, region, _current_regions))

    for task in as_completed(_processes):
        __region_upd, __region_new, __constelation_list = task.result()
        _constelations += __constelation_list
        if __region_upd:
            _region_models_updates.append(__region_upd)
        if __region_new:
            _region_models_creates.append(__region_new)

    MapRegion.objects.bulk_update(_region_models_updates, [
                                  'name', 'description'], batch_size=1000)  # bulk update
    MapRegion.objects.bulk_create(
        _region_models_creates, batch_size=1000, ignore_conflicts=True)  # bulk create
    # sample_mem()
    _processes = []
    _current_constellations = MapConstellation.objects.all(
    ).values_list('constellation_id', flat=True)
    with ThreadPoolExecutor(max_workers=20) as executor:
        for constellation in _constelations:
            _processes.append(executor.submit(
                providers.esi._get_constellation, constellation, _current_constellations))

    for task in as_completed(_processes):
        __constelation_upd, __constelation_new, __system_list = task.result()
        _systems += __system_list
        if __constelation_upd:
            _constelation_model_updates.append(__constelation_upd)
        if __constelation_new:
            _constelation_model_creates.append(__constelation_new)

    MapConstellation.objects.bulk_update(_constelation_model_updates, [
                                         'name', 'region_id'], batch_size=1000)  # bulk update
    MapConstellation.objects.bulk_create(
        _constelation_model_creates, batch_size=1000, ignore_conflicts=True)  # bulk create
    # sample_mem()
    _processes = []
    _current_systems = MapSystem.objects.all().values_list('system_id', flat=True)
    with ThreadPoolExecutor(max_workers=50) as executor:
        for system in _systems:
            _processes.append(executor.submit(
                providers.esi._get_system, system, _current_systems))

    for task in as_completed(_processes):
        __system_upd, __system_new, _gates = task.result()
        if __system_upd:
            _system_models_updates.append(__system_upd)
        if __system_new:
            _system_models_creates.append(__system_new)
        if _gates:
            _gate_links_array += _gates

    MapSystem.objects.bulk_update(_system_models_updates, [
                                  'name', 'constellation_id', 'star_id', 'security_class', 'x', 'y', 'z', 'security_status'], batch_size=1000)  # bulk update
    MapSystem.objects.bulk_create(
        _system_models_creates, batch_size=1000, ignore_conflicts=True)  # bulk update
    # sample_mem()
    _processes = []
    _gate_links_array = set(_gate_links_array)
    with ThreadPoolExecutor(max_workers=50) as executor:
        for gate in _gate_links_array:
            _processes.append(executor.submit(
                providers.esi._get_stargate, gate))

    _unique_gate_links = {}
    gate_models = []
    for task in as_completed(_processes):
        _to_sys, _from_sys = task.result()
        if _to_sys not in _unique_gate_links:
            _unique_gate_links[_to_sys] = []
        if _from_sys not in _unique_gate_links:
            _unique_gate_links[_to_sys].append(_from_sys)
            gate_models.append(MapSystemGate(
                from_solar_system_id=_to_sys, to_solar_system_id=_from_sys))
        elif _to_sys not in _unique_gate_links[_from_sys]:
            _unique_gate_links[_to_sys].append(_from_sys)
            gate_models.append(MapSystemGate(
                from_solar_system_id=_to_sys, to_solar_system_id=_from_sys))

    MapSystemGate.objects.all().delete()
    MapSystemGate.objects.bulk_create(gate_models)
    # sample_mem()
    output = "Regions: (Updated:{}, Created:{}) " \
             "Constellations: (Updated:{}, Created:{}) " \
             "Systems: (Updated:{}, Created:{}) "\
             "Gates: (Created: {}/{})".format(len(_region_models_updates),
                                              len(_region_models_creates),
                                              len(_constelation_model_updates),
                                              len(_constelation_model_creates),
                                              len(_system_models_updates),
                                              len(_system_models_creates),
                                              len(gate_models), len(_gate_links_array))
    # memdump()
    return output


def update_ore_comp_table_from_fuzzworks():
    # prime the provider or th ram will go bye bye
    providers.esi.client.Status.get_status().result()
    # Get needed SDE file
    inv_url = 'https://www.fuzzwork.co.uk/dump/latest/invTypeMaterials.csv.bz2'

    invNames_req = requests.get(inv_url)
    with open('invTypeMaterials.csv.bz2', 'wb') as iN:
        iN.write(invNames_req.content)

    # Decompress SDE files
    open('invTypeMaterials.csv', 'wb').write(
        bz2.open('invTypeMaterials.csv.bz2', 'rb').read()
    )

    # Parse file(s) and Update names object(s)
    ore_details = []  # new stuff
    mets = set()  # new stuff
    with open('invTypeMaterials.csv', encoding='UTF-8') as iN:
        csv_list = iN.read().split('\n')
        for row in csv_list[1:]:
            spl = row.split(',')
            if len(spl) > 1:
                mets.add(spl[1])
                mets.add(spl[0])
                ore_details.append(InvTypeMaterials(
                    qty=spl[2],
                    type_id=spl[0],
                    eve_type_id=spl[0],
                    material_type_id=spl[1],
                    met_type_id=spl[1]
                ))

    process_bulk_types_from_esi(mets)
    # delete it all and start again
    InvTypeMaterials.objects.all().delete()
    InvTypeMaterials.objects.bulk_create(
        ore_details, batch_size=500, ignore_conflicts=True)


def process_category_from_esi(category_id):
    _current_categories = list(
        EveItemCategory.objects.all().values_list('category_id', flat=True))
    _category, _category_creates, _groups = providers.esi._get_category(
        category_id, updates=_current_categories)

    if not _category_creates:
        EveItemCategory.objects.bulk_update([_category], ['name'])
    else:
        _category.save()

    _groups_model_updates = []
    _groups_model_creates = []

    _items = []
    _items_models_updates = []
    _items_models_creates = []
    _dogma_models_creates = []

    _processes = []
    _current_groups = list(
        EveItemGroup.objects.all().values_list('group_id', flat=True))
    with ThreadPoolExecutor(max_workers=20) as executor:
        for group in _groups:
            _processes.append(executor.submit(
                providers.esi._get_group, group, updates=_current_groups))

    for task in as_completed(_processes):
        __group, __group_new, __items_list = task.result()
        _items += __items_list
        if not __group_new:
            _groups_model_updates.append(__group)
        else:
            _groups_model_creates.append(__group)

    EveItemGroup.objects.bulk_update(
        # bulk update
        _groups_model_updates, ['name', 'category_id'], batch_size=1000)
    EveItemGroup.objects.bulk_create(
        _groups_model_creates, batch_size=1000)  # bulk create

    _processes = []
    _current_items = list(
        EveItemType.objects.all().values_list('type_id', flat=True))
    with ThreadPoolExecutor(max_workers=50) as executor:
        for item in _items:
            _processes.append(executor.submit(
                providers.esi._get_eve_type, item, updates=_current_items))

    for task in as_completed(_processes):
        __item, __item_new, __item_dogma = task.result()
        _dogma_models_creates += __item_dogma
        if not __item_new:
            _items_models_updates.append(__item)
        else:
            _items_models_creates.append(__item)

    EveItemType.objects.bulk_update(_items_models_updates,
                                    ['name', 'group_id', 'description',
                                        'mass', 'packaged_volume', 'portion_size',
                                        'volume', 'published', 'radius'], batch_size=1000)  # bulk update
    EveItemType.objects.bulk_create(
        _items_models_creates, batch_size=1000)  # bulk create

    dogma_query = EveItemDogmaAttribute.objects.filter(eve_type_id__in=_items)
    if dogma_query.exists():
        # speed and we are not caring about f-keys or signals on these models
        dogma_query._raw_delete(dogma_query.db)

    EveItemDogmaAttribute.objects.bulk_create(
        _dogma_models_creates, batch_size=1000)  # bulk create

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
    _items = set(type_ids)
    _items_processed = []
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
    _current_items = list(
        EveItemType.objects.all().values_list('type_id', flat=True))
    _current_groups = list(
        EveItemGroup.objects.all().values_list('group_id', flat=True))
    _current_categories = list(
        EveItemCategory.objects.all().values_list('category_id', flat=True))

    with ThreadPoolExecutor(max_workers=50) as executor:
        for item in _items:
            if item not in _current_items or update_models:
                _processes.append(executor.submit(
                    providers.esi._get_eve_type, item, updates=_current_items))

    for task in as_completed(_processes):
        __item, __item_new, __item_dogma = task.result()
        _items_processed.append(__item.type_id)

        if __item_new:
            _items_models_creates.append(__item)
        else:
            _items_models_updates.append(__item)
        if __item.group_id not in _current_groups or update_models:
            _groups.append(__item.group_id)

        _dogma_models_creates += __item_dogma

    _processes = []
    with ThreadPoolExecutor(max_workers=50) as executor:
        for group in set(_groups):
            if group not in _current_groups or update_models:
                _processes.append(executor.submit(
                    providers.esi._get_group, group, updates=_current_groups))
                # _current_groups.append(group)

    for task in as_completed(_processes):
        __group, __group_new, types = task.result()
        if __group_new:
            _groups_model_creates.append(__group)
        else:
            _groups_model_updates.append(__group)

        if __group.category_id not in _current_categories or update_models:
            _categories.append(__group.category_id)

    _processes = []
    with ThreadPoolExecutor(max_workers=50) as executor:
        for category in set(_categories):
            if category not in _current_categories or update_models:
                _processes.append(executor.submit(
                    providers.esi._get_category, category, updates=_current_categories))
                # _current_categories.append(category)

    for task in as_completed(_processes):
        __category, __category_new, groups = task.result()
        if __category_new:
            _categories_model_creates.append(__category)
        else:
            _categories_model_updates.append(__category)

    if len(_categories_model_creates) > 0:
        EveItemCategory.objects.bulk_create(
            _categories_model_creates, batch_size=1000, ignore_conflicts=True)  # bulk create
    if len(_categories_model_updates) > 0:
        EveItemCategory.objects.bulk_update(
            _categories_model_updates, ['name'])  # bulk update

    if len(_groups_model_creates) > 0:
        EveItemGroup.objects.bulk_create(
            _groups_model_creates, batch_size=1000, ignore_conflicts=True)  # bulk create
    if len(_groups_model_updates) > 0:
        EveItemGroup.objects.bulk_update(
            # bulk update
            _groups_model_updates, ['name', 'category_id'], batch_size=1000)

    if len(_items_models_creates) > 0:
        EveItemType.objects.bulk_create(
            _items_models_creates, batch_size=1000, ignore_conflicts=True)  # bulk create
    if len(_items_models_updates) > 0:
        EveItemType.objects.bulk_update(_items_models_updates,
                                        ['name', 'group_id', 'description',
                                         'mass', 'packaged_volume', 'portion_size',
                                         'volume', 'published', 'radius'], batch_size=1000)  # bulk update
    if len(_dogma_models_creates) > 0:
        dogma_query = EveItemDogmaAttribute.objects.filter(
            eve_type_id__in=_items_processed)
        if dogma_query.exists():
            # speed and we are not caring about f-keys or signals on these models
            dogma_query._raw_delete(dogma_query.db)

        EveItemDogmaAttribute.objects.bulk_create(
            _dogma_models_creates, batch_size=1000, ignore_conflicts=True)  # bulk create

    output = "Category: (Updated:{}, Created:{}): " \
             "Groups: (Updated:{}, Created:{}) " \
             "Items: (Updated:{}, Created:{}, Dogma Attributes:{})".format(
                 len(_categories_model_updates),
                 len(_categories_model_creates),
                 len(_groups_model_updates),
                 len(_groups_model_creates),
                 len(_items_models_updates),
                 len(_items_models_creates),
                 len(_dogma_models_creates))

    logger.debug(output)

    return True


def set_error_count_flag():
    return cache.set("esi_errors_timeout", 1, 60)


def fetch_location_name(location_id, location_flag, character_id, update=False):
    """Takes a location_id and character_id and returns a location model for items in a station/structure or in space"""

    accepted_location_flags = ['AssetSafety',
                               'Deliveries',
                               'Hangar',
                               'HangarAll',
                               'solar_system',
                               'OfficeFolder',
                               'AutoFit']

    if location_flag not in accepted_location_flags:
        if location_flag is not None:
            return None  # ship fits or in cargo holds or what ever also dont care

    existing = EveLocation.objects.filter(location_id=location_id)
    current_loc = existing.exists()

    if current_loc and location_id < 64000000:
        return existing.first()
    else:
        existing = existing.first()

    if location_id == 2004:
        # ASSET SAFETY
        return EveLocation(location_id=location_id,
                           location_name="Asset Safety")
    elif 30000000 < location_id < 33000000:  # Solar System
        system = MapSystem.objects.filter(system_id=location_id)
        if not system.exists():
            logger.error("Unknown System, Have you populated the map?")
            # TODO Do i fire the map population task here?
            return None
        else:
            system = system.first()
        return EveLocation(location_id=location_id,
                           location_name=system.name,
                           system=system)
    elif 60000000 < location_id < 64000000:  # Station ID
        station = providers.esi.client.Universe.get_universe_stations_station_id(
            station_id=location_id).result()
        system = MapSystem.objects.filter(system_id=station.get('system_id'))
        if not system.exists():
            logger.error("Unknown System, Have you populated the map?")
            # TODO Do i fire the map population task here?
            return None
        return EveLocation(location_id=location_id,
                           location_name=station.get('name'),
                           system_id=station.get('system_id'))

    req_scopes = ['esi-universe.read_structures.v1']

    token = Token.get_token(character_id, req_scopes)

    if not token:
        return None

    else:  # Structure id?
        try:
            structure = providers.esi.client.Universe.get_universe_structures_structure_id(
                structure_id=location_id, token=token.valid_access_token()).result()
        except HTTPForbidden as e:  # no access
            if int(e.response.headers.get('x-esi-error-limit-remain')) < 50:
                set_error_count_flag()
            logger.debug("Failed to get location:{}, Error:{}, Errors Remaining:{}, Time Remaining: {}".format(
                location_id, e.message, e.response.headers.get('x-esi-error-limit-remain'), e.response.headers.get('x-esi-error-limit-reset')))
            return None
        system = MapSystem.objects.filter(
            system_id=structure.get('solar_system_id'))
        if not system.exists():
            logger.error("Unknown System, Have you populated the map?")
            # TODO Do i fire the map population task here?
            return None
        if current_loc:
            existing.location_name = structure.get('name')
            return existing
        else:
            return EveLocation(location_id=location_id,
                               location_name=structure.get('name'),
                               system_id=structure.get('solar_system_id'))


def load_system(system_id, moons_update=False):
    _sys = providers.esi.client.Universe.get_universe_systems_system_id(
        system_id=system_id
    ).result()
    for p in _sys["planets"]:
        MapSystemPlanet.objects.get_or_create_from_esi(p["planet_id"])
        if "moons" in p and moons_update:
            if p["moons"]:
                for m in p["moons"]:
                    MapSystemMoon.objects.get_or_create_from_esi(m)
