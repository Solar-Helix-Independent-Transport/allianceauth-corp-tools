# Standard Library
import bz2
from concurrent.futures import ThreadPoolExecutor, as_completed

# Third Party
import requests
from bravado.exception import HTTPForbidden

# Django
from django.core.cache import cache

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from esi.models import Token

# AA Example App
from corptools import providers
from corptools.models import (
    EveItemCategory,
    EveItemDogmaAttribute,
    EveItemGroup,
    EveItemType,
    EveLocation,
    InvTypeMaterials,
    MapSystem,
    MapSystemMoon,
    MapSystemPlanet,
)

logger = get_extension_logger(__name__)


def update_ore_comp_table_from_fuzzworks():
    # prime the provider or th ram will go bye bye
    providers.esi_openapi.client.Status.GetStatus().result()
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
        ore_details, batch_size=500,
        ignore_conflicts=True
    )


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
             "Items: (Updated:{}, Created:{}, Dogma Attributes:{}".format(
                 category_id,
                 len(_groups_model_updates),
                 len(_groups_model_creates),
                 len(_items_models_updates),
                 len(_items_models_creates),
                 len(_dogma_models_creates)
             )

    return output


def process_bulk_types_from_esi(type_ids, update_models=False):
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

    _current_items = set(
        EveItemType.objects.all().values_list('type_id', flat=True)
    )
    _current_groups = set(
        EveItemGroup.objects.all().values_list('group_id', flat=True)
    )
    _current_categories = set(
        EveItemCategory.objects.all().values_list('category_id', flat=True)
    )

    for type_id in set(type_ids):
        if type_id not in _current_items or update_models:
            __item = providers.esi_openapi.client.Universe.GetUniverseTypesTypeId(
                type_id=type_id
            ).result()

            _items_processed.append(type_id)

            if __item.dogma_attributes:
                for da in __item.dogma_attributes:
                    _da = EveItemDogmaAttribute.from_esi_model(type_id, da)
                    _dogma_models_creates.append(_da)

            eve_type = EveItemType.from_esi_model(__item)

            if type_id not in _current_items:
                _items_models_creates.append(eve_type)
            else:
                _items_models_updates.append(eve_type)

            if __item.group_id not in _current_groups or update_models:
                _groups.append(__item.group_id)

    for group_id in set(_groups):
        if group_id not in _current_groups or update_models:
            __group = providers.esi_openapi.client.Universe.GetUniverseGroupsGroupId(
                group_id=group_id
            ).result()

            eve_group = EveItemGroup.from_esi_model(__group)

            if group_id not in _current_groups:
                _groups_model_creates.append(eve_group)
            else:
                _groups_model_updates.append(eve_group)

            if __group.category_id not in _current_categories or update_models:
                _categories.append(__group.category_id)

    for category_id in set(_categories):
        __category = providers.esi_openapi.client.Universe.GetUniverseCategoriesCategoryId(
            category_id=category_id
        ).result()

        eve_category = EveItemCategory.from_esi_model(__category)

        if category_id not in _current_categories:
            _categories_model_creates.append(eve_category)
        else:
            _categories_model_updates.append(eve_category)

    # Create Cats
    if len(_categories_model_creates) > 0:
        EveItemCategory.objects.bulk_create(
            _categories_model_creates,
            batch_size=500,
            ignore_conflicts=True
        )
    if len(_categories_model_updates) > 0:
        EveItemCategory.objects.bulk_update(
            _categories_model_updates,
            ['name']
        )

    # Create Grps
    if len(_groups_model_creates) > 0:
        EveItemGroup.objects.bulk_create(
            _groups_model_creates,
            batch_size=500,
            ignore_conflicts=True
        )
    if len(_groups_model_updates) > 0:
        EveItemGroup.objects.bulk_update(
            _groups_model_updates,
            [
                'name',
                'category_id'
            ],
            batch_size=1000
        )

    # Create Items
    if len(_items_models_creates) > 0:
        EveItemType.objects.bulk_create(
            _items_models_creates,
            batch_size=500,
            ignore_conflicts=True
        )
    if len(_items_models_updates) > 0:
        EveItemType.objects.bulk_update(
            _items_models_updates,
            [
                'name',
                'group_id',
                'description',
                'mass',
                'packaged_volume',
                'portion_size',
                'volume',
                'published',
                'radius'
            ]
        )

    # Create/Update Dogma
    if len(_dogma_models_creates) > 0:
        dogma_query = EveItemDogmaAttribute.objects.filter(
            eve_type_id__in=_items_processed
        )
        if dogma_query.exists():
            # speed and we are not caring about f-keys or signals on these models
            dogma_query._raw_delete(dogma_query.db)

        EveItemDogmaAttribute.objects.bulk_create(
            _dogma_models_creates,
            ignore_conflicts=True
        )

    output = (
        f"Category: (Updated:{len(_categories_model_updates)}, Created:{len(_categories_model_creates)}): "
        f"Groups: (Updated:{len(_groups_model_updates)}, Created:{len(_groups_model_creates)}) "
        f"Items: (Updated:{len(_items_models_updates)}, Created:{len(_items_models_creates)}, "
        f"Dogma Attributes:{len(_dogma_models_creates)})"
    )
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
        station = providers.esi_openapi.client.Universe.GetUniverseStationsStationId(
            station_id=location_id
        ).result()
        system = MapSystem.objects.filter(system_id=station.system_id)
        if not system.exists():
            logger.error("Unknown System, Have you populated the map?")
            # TODO Do i fire the map population task here?
            return None
        return EveLocation(
            location_id=location_id,
            location_name=station.name,
            system_id=station.system_id
        )

    req_scopes = ['esi-universe.read_structures.v1']

    token = Token.get_token(character_id, req_scopes)

    if not token:
        return None

    else:  # Structure id?
        try:
            structure = providers.esi_openapi.client.Universe.GetUniverseStructuresStructureId(
                structure_id=location_id,
                token=token.valid_access_token()
            ).result()
        except HTTPForbidden as e:  # no access
            if int(e.response.headers.get('x-esi-error-limit-remain')) < 50:
                set_error_count_flag()
            logger.debug("Failed to get location:{}, Error:{}, Errors Remaining:{}, Time Remaining: {}".format(
                location_id,
                e.message,
                e.response.headers.get('x-esi-error-limit-remain'),
                e.response.headers.get('x-esi-error-limit-reset')
            )
            )
            return None
        system = MapSystem.objects.filter(
            system_id=structure.solar_system_id
        )
        if not system.exists():
            logger.error("Unknown System, Have you populated the map?")
            # TODO Do i fire the map population task here?
            return None
        if current_loc:
            existing.location_name = structure.name
            return existing
        else:
            return EveLocation(location_id=location_id,
                               location_name=structure.name,
                               system_id=structure.solar_system_id)


def load_system(system_id, moons_update=False):
    _sys = providers.esi_openapi.client.Universe.GetUniverseSystemsSystemId(
        system_id=system_id
    ).result()
    for p in _sys.planets:
        MapSystemPlanet.objects.get_or_create_from_esi(p.planet_id)
        if "moons" in p and moons_update:
            if p.moons:
                for m in p.moons:
                    MapSystemMoon.objects.get_or_create_from_esi(m)
