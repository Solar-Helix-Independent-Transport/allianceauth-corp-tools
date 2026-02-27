# Standard Library
import bz2
from concurrent.futures import ThreadPoolExecutor, as_completed

# Third Party
import requests
from bravado.exception import HTTPForbidden
from eve_sde.models import (
    DogmaAttribute,
    ItemCategory,
    ItemGroup,
    ItemType,
    ItemTypeMaterials,
    Moon,
    Planet,
    SolarSystem,
)

# Django
from django.core.cache import cache

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from esi.models import Token

# AA Example App
from corptools import providers
from corptools.models import EveLocation

logger = get_extension_logger(__name__)


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
        system = SolarSystem.objects.filter(system_id=location_id)
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
        system = SolarSystem.objects.filter(system_id=station.system_id)
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
        system = SolarSystem.objects.filter(
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
