# Standard Library
import datetime
import json
from datetime import timezone as tz

# Third Party
from celery import shared_task

# Django
from django.core.cache import cache
from django.core.serializers.json import DjangoJSONEncoder
from django.utils import timezone

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger
from allianceauth.services.tasks import QueueOnce

from ..models import (
    CharacterAsset,
    CharacterAudit,
    CharacterMarketOrder,
    Clone,
    Contract,
    CorpAsset,
    CorporateContract,
    EveLocation,
    JumpClone,
)
from ..task_helpers.update_tasks import LocationUnresolvable, fetch_location_name
from .utils import (
    esi_error_retry,
    get_error_count_flag,
    no_fail_chain,
    rate_limited_task,
)

TZ_STRING = "%Y-%m-%dT%H:%M:%SZ"


logger = get_extension_logger(__name__)

# Bulk Updates


# Location cooloff/retry tracking.
#
# There are two distinct pieces of state, both cached per location_id:
#  - which characters have already been (unsuccessfully) tried for this
#    location within the last COOLOFF_DAYS, so we don't hammer the same
#    token repeatedly
#  - whether the location as a whole has no untried characters left, so we
#    can skip it entirely until the cooloff window passes
COOLOFF_DAYS = 7
# A structure that 404s is gone for good, not just temporarily inaccessible -
# cool it off much longer than a normal "no docking access" failure.
UNRESOLVABLE_COOLOFF_DAYS = 30
# cache entry TTL, longer than the freshness window itself
CACHE_TIMEOUT = 60 * 60 * 24 * 30


def _location_state_cache_tag(location_id):
    return f"loc_id_{location_id}"


def _location_cooloff_cache_tag(location_id):
    return f"cooldown_loc_id_{location_id}"


def _get_location_state(location_id):
    """Returns {"<character_id>": "<iso tried_at>"} for a location_id."""
    cache_tag = _location_state_cache_tag(location_id)
    raw = cache.get(cache_tag)
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


def get_location_cooloff(location_id):
    return cache.get(_location_cooloff_cache_tag(location_id), False)


def set_location_cooloff(location_id):
    return cache.set(
        _location_cooloff_cache_tag(location_id),
        True,
        (60 * 60 * 24 * COOLOFF_DAYS)
    )


@shared_task(
    bind=True,
    base=QueueOnce,
    max_retries=None,
    name="corptools.tasks.update_citadel_names"
)
@esi_error_retry
def update_citadel_names(self):
    citadels = EveLocation.objects.filter(
        location_id__gte=64000000, managed=False)
    for c in citadels:
        update_location.apply_async(
            args=[c.location_id],
            kwargs={"force_citadel": True},
            priority=7
        )


def get_character_lists(location_id):
    asset = CharacterAsset.objects.filter(
        location_id=location_id).select_related('character__character')
    clone = Clone.objects.filter(
        location_id=location_id).select_related('character__character')
    jumpclone = JumpClone.objects.filter(
        location_id=location_id).select_related('character__character')
    marketorder = CharacterMarketOrder.objects.filter(
        location_id=location_id).select_related('character__character')

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

    return untried_characters(location_id, set(char_ids))


def update_missing_locations(location_id):
    count = CharacterAsset.objects.filter(
        location_id=location_id,
        location_name__isnull=True
    ).update(location_name_id=location_id)

    count = CorpAsset.objects.filter(
        location_id=location_id,
        location_name__isnull=True
    ).update(location_name_id=location_id)

    count += Clone.objects.filter(
        location_id=location_id,
    ).update(location_name_id=location_id)

    count += JumpClone.objects.filter(
        location_id=location_id,
        location_name__isnull=True
    ).update(location_name_id=location_id)

    count += CharacterMarketOrder.objects.filter(
        location_id=location_id,
        location_name__isnull=True
    ).update(location_name_id=location_id)

    count += Contract.objects.filter(
        start_location_id=location_id,
        start_location_name__isnull=True
    ).update(start_location_name_id=location_id)

    count += CorporateContract.objects.filter(
        start_location_id=location_id,
        start_location_name__isnull=True
    ).update(start_location_name_id=location_id)

    count += Contract.objects.filter(
        end_location_id=location_id,
        end_location_name__isnull=True
    ).update(end_location_name_id=location_id)

    count += CorporateContract.objects.filter(
        end_location_id=location_id,
        end_location_name__isnull=True
    ).update(end_location_name_id=location_id)

    logger.info(f"CT LOCATIONS: Updated {count} models!")
    return count


@shared_task(
    bind=True,
    base=QueueOnce,
    max_retries=None,
    name="corptools.tasks.update_location"
)
@rate_limited_task("50/5m")
@esi_error_retry
def update_location(self, location_id, character_ids=None, force_citadel=False):

    if get_location_cooloff(location_id):
        if force_citadel and location_id > 64000000:
            pass
        else:
            return f"CT LOCATIONS: Cooloff on ID: {location_id}"

    if get_error_count_flag():
        logger.warning(
            f"CT_LOC: Unable to check {location_id} ESI in cooloff...")
        return "ESI Error Limit reached... We will need to try this again later... Somehow..."
        # self.retry(countdown=300)

    if location_id < 64000000:
        try:
            location = fetch_location_name(location_id, None, 0, update=True)
        except LocationUnresolvable:
            set_location_cooloff(location_id)
            return f"CT LOCATIONS: Location_id: {location_id} unresolvable, cooling off"
        if location is not None:
            location.save()
            return update_missing_locations(location_id)
        else:
            if get_error_count_flag():
                self.retry(countdown=300)

    char_ids = get_character_lists(location_id)

    if len(char_ids) == 0:
        set_location_cooloff(location_id)
        return f"CT LOCATIONS: No more Characters for Location_id: {location_id} cooling off for a while"

    for c_id in char_ids:
        try:
            location = fetch_location_name(location_id, None, c_id)
        except LocationUnresolvable:
            set_character_cooloff(
                location_id, c_id, days=UNRESOLVABLE_COOLOFF_DAYS)
            continue
        if location is not None:
            location.save()
            return update_missing_locations(location_id)
        else:
            set_character_cooloff(location_id, c_id)
            if get_error_count_flag():
                self.retry(countdown=300)

    set_location_cooloff(location_id)
    return f"CT LOCATIONS: No more Characters for Location_id: {location_id} cooling off for a while"


@shared_task(
    bind=True,
    base=QueueOnce,
    name="corptools.tasks.update_all_locations"
)
@no_fail_chain
def update_all_locations(self, character_filter=None, force_citadels=False, update_all=False, chain=[]):
    location_flags = [
        'Deliveries',
        'Hangar',
        'HangarAll'
    ]

    expire = timezone.now() - datetime.timedelta(days=30)  # 1 week refresh

    asset_tops = CharacterAsset.objects.all().values_list("item_id", flat=True)
    char_filter = CharacterAudit.objects.all()

    if character_filter:
        char_filter = char_filter.filter(
            character__character_id__in=character_filter)

    queryset1 = list(
        CharacterAsset.objects.filter(
            location_flag__in=location_flags,
            location_name=None,
            character__in=char_filter
        ).exclude(
            location_id__in=asset_tops
        ).values_list('location_id', flat=True)
    )

    queryset5 = list(
        CharacterAsset.objects.filter(
            location_flag='AssetSafety',
            location_name=None,
            character__in=char_filter
        ).values_list('location_id', flat=True)
    )
    logger.debug(
        f"CT LOCATIONS: {character_filter} Assets {queryset1 + queryset5}")
    queryset3 = list(
        Clone.objects.filter(
            location_id__isnull=False,
            location_name_id__isnull=True,
            character__in=char_filter
        ).values_list('location_id', flat=True)
    )
    logger.debug(f"CT LOCATIONS: {character_filter} Clone {queryset3}")

    queryset4 = list(
        JumpClone.objects.filter(
            location_id__isnull=False,
            location_name_id__isnull=True,
            character__in=char_filter
        ).values_list('location_id', flat=True)
    )
    logger.debug(f"CT LOCATIONS: {character_filter} JumpClone {queryset4}")

    queryset6 = list(
        CharacterMarketOrder.objects.filter(
            location_name_id__isnull=True,
            character__in=char_filter
        ).values_list(
            'location_id',
            flat=True
        )
    )
    logger.debug(
        f"CT LOCATIONS: {character_filter} CharacterMarketOrder {queryset6}")

    queryset7 = list(
        Contract.objects.filter(
            start_location_name=None,
            start_location_id__isnull=False,
            character__in=char_filter
        ).values_list('start_location_id', flat=True)
    )
    logger.debug(f"CT LOCATIONS: {character_filter} Contract {queryset7}")

    queryset8 = list(
        Contract.objects.filter(
            end_location_name=None,
            end_location_id__isnull=False,
            character__in=char_filter
        ).values_list('end_location_id', flat=True)
    )
    logger.debug(f"CT LOCATIONS: {character_filter} Contract {queryset8}")

    all_locations = set(
        queryset1 + queryset3 + queryset8 +
        queryset4 + queryset5 + queryset6 +
        queryset7
    )
    logger.debug(
        f"CT LOCATIONS: {character_filter} all_locations {all_locations}")

    if update_all:
        clones_all = list(
            Clone.objects.all().values_list(
                'location_id',
                flat=True
            )
        )

        jump_clones_all = list(
            Clone.objects.all().values_list(
                'location_id',
                flat=True
            )
        )

        asset_all = list(
            CharacterAsset.objects.all().values_list(
                'location_id',
                flat=True
            )
        )

        queryset2 = list(
            EveLocation.objects.filter(
                last_update__lte=expire,
                location_id__in=set(
                    clones_all + jump_clones_all + asset_all
                )
            ).values_list('location_id', flat=True)
        )

        all_locations.update(queryset2)

    logger.info(f"CT LOCATIONS: {len(all_locations)} Locations to find")

    count = 0
    for location in all_locations:
        if not get_location_cooloff(location):
            update_location.apply_async(
                args=[location],
                kwargs={
                    "force_citadel": force_citadels
                },
                priority=8
            )
            count += 1

    return f"CT LOCATIONS: {character_filter} Sent {count} location_update tasks"
