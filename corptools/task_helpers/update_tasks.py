# Standard Library
import datetime
import json
from datetime import timezone as tz

# Third Party
from eve_sde.models import (
    SolarSystem,
)

# Django
from django.core.cache import cache
from django.core.serializers.json import DjangoJSONEncoder
from django.utils import timezone

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from esi.exceptions import HTTPClientError, HTTPNotModified
from esi.models import Token

# AA Example App
from corptools import providers
from corptools.models import EveLocation

logger = get_extension_logger(__name__)

# Solar system IDs fall in this range; used to tell "in space" location_ids
# apart from stations/structures.
SOLAR_SYSTEM_ID_MIN = 30000000
SOLAR_SYSTEM_ID_MAX = 33000000

TZ_STRING = "%Y-%m-%dT%H:%M:%SZ"

# Per-(location, character) cooloff tracking: how long to wait before
# retrying a character/location pair that has already failed to resolve.
COOLOFF_DAYS = 7
# A structure that 404s is gone for good, not just temporarily inaccessible -
# cool it off much longer than a normal "no docking access" failure.
UNRESOLVABLE_COOLOFF_DAYS = 30
# cache entry TTL, longer than the freshness window itself
CACHE_TIMEOUT = 60 * 60 * 24 * 30


def set_error_count_flag():
    return cache.set("esi_errors_timeout", 1, 60)


def _location_state_cache_tag(location_id):
    return f"loc_id_{location_id}"


def _get_location_state(location_id):
    """Returns {"<character_id>": "<iso expires_at>"} for a location_id."""
    raw = cache.get(_location_state_cache_tag(location_id))
    if raw is None:
        return {}
    return json.loads(raw)


def _save_location_state(location_id, state):
    cache.set(
        _location_state_cache_tag(location_id),
        json.dumps(state, cls=DjangoJSONEncoder),
        CACHE_TIMEOUT
    )


def is_character_on_cooloff(location_id, character_id):
    """Has this character already been tried (and failed) for this location recently?"""
    expires_at = _get_location_state(location_id).get(str(character_id))
    if not expires_at:
        return False
    expires_at = datetime.datetime.strptime(
        expires_at, TZ_STRING).replace(tzinfo=tz.utc)
    return expires_at > timezone.now()


def set_character_cooloff(location_id, character_id, days=COOLOFF_DAYS):
    """Record that this character was just tried (and failed) for this location."""
    state = _get_location_state(location_id)
    state[str(character_id)] = (
        timezone.now() + datetime.timedelta(days=days)
    ).strftime(TZ_STRING)
    _save_location_state(location_id, state)


def untried_characters(location_id, character_ids):
    """Filters character_ids down to those not currently on cooloff for this location."""
    return {
        c_id for c_id in character_ids
        if not is_character_on_cooloff(location_id, c_id)
    }


class LocationUnresolvable(Exception):
    """Raised when a location_id will never resolve (e.g. a destroyed structure),
    so the caller can apply a longer cooloff than a merely-denied-access failure."""


def _handle_esi_client_error(e, location_id):
    """Decide how to react to an HTTPClientError hit while resolving location_id.

    - 420/429 (ESI globally error-limited): this isn't about this location or
      character at all, so re-raise and let the calling task's esi_error_retry
      decorator pause and retry the whole task.
    - 404 (object no longer exists, e.g. a destroyed structure): raise
      LocationUnresolvable so the caller can cool it off for longer than a
      normal "no access right now" failure.
    - anything else (typically 403 - no docking access): log and return,
      treated by the caller as a normal per-character resolution failure.
    """
    if int(e.headers.get('x-esi-error-limit-remain', 0)) < 50:
        set_error_count_flag()

    if e.status_code in (420, 429):
        raise e

    logger.debug(
        "Failed to get location:{}, Error:{}, Errors Remaining:{}, Time Remaining: {}".format(
            location_id,
            e,
            e.headers.get('x-esi-error-limit-remain'),
            e.headers.get('x-esi-error-limit-reset')
        )
    )

    if e.status_code == 404:
        raise LocationUnresolvable(location_id) from e


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
    elif SOLAR_SYSTEM_ID_MIN < location_id < SOLAR_SYSTEM_ID_MAX:  # Solar System
        system = SolarSystem.objects.filter(id=location_id)
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
        try:
            station = providers.esi_openapi.client.Universe.GetUniverseStationsStationId(
                station_id=location_id
            ).result()
        except HTTPClientError as e:
            _handle_esi_client_error(e, location_id)
            return None
        system = SolarSystem.objects.filter(id=station.system_id)
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
                token=token
            ).result(use_etag=False)
        except HTTPClientError as e:
            _handle_esi_client_error(e, location_id)
            return None
        system = SolarSystem.objects.filter(
            id=structure.solar_system_id
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


def resolve_location(location_id, character_id):
    """Best-effort location resolution for a specific character's token.

    Wraps fetch_location_name with the cooloff bookkeeping every caller
    needs: never raises for a per-character/location failure (returns None
    instead, same as a straightforward "couldn't resolve it" from
    fetch_location_name), and never retries a character/location pair that
    already failed recently. HTTPClientError for 420/429 is deliberately
    left to propagate - that's an ESI-wide problem, not a per-character one,
    so the calling task's esi_error_retry decorator should handle it instead
    of this function eating it into a per-character cooloff.
    """
    if is_character_on_cooloff(location_id, character_id):
        return None

    try:
        location = fetch_location_name(location_id, None, character_id)
    except LocationUnresolvable:
        set_character_cooloff(
            location_id, character_id, days=UNRESOLVABLE_COOLOFF_DAYS)
        return None

    if location is None:
        set_character_cooloff(location_id, character_id)
        return None

    return location
