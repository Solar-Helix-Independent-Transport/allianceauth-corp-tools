# Standard Library
import datetime

# Third Party
from celery import shared_task

# Django
from django.core.cache import cache
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
    CorporationAudit,
    EveLocation,
    JumpClone,
)
from ..task_helpers.update_tasks import (
    LocationUnresolvable,
    fetch_location_name,
    resolve_location,
    untried_characters,
)
from .utils import (
    esi_error_retry,
    get_error_count_flag,
    no_fail_chain,
    rate_limited_task,
)

logger = get_extension_logger(__name__)

# Bulk Updates


# Whole-location cooloff: distinct from the per-(location, character)
# cooloff in task_helpers/update_tasks.py (used by resolve_location). This
# tracks "no untried characters are left for this location at all", which is
# only meaningful here where we have a whole candidate list to iterate -
# resolve_location's single-character callers have no equivalent concept.
LOCATION_COOLOFF_DAYS = 7


def _location_cooloff_cache_tag(location_id):
    return f"cooldown_loc_id_{location_id}"


def get_location_cooloff(location_id):
    return cache.get(_location_cooloff_cache_tag(location_id), False)


def set_location_cooloff(location_id):
    return cache.set(
        _location_cooloff_cache_tag(location_id),
        True,
        (60 * 60 * 24 * LOCATION_COOLOFF_DAYS)
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
        location = resolve_location(location_id, c_id)
        if location is not None:
            location.save()
            return update_missing_locations(location_id)
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
def update_all_locations(
    self, character_filter=None, corp_filter=None, force_citadels=False,
    update_all=False, chain=[]
):
    location_flags = [
        'Deliveries',
        'Hangar',
        'HangarAll'
    ]

    expire = timezone.now() - datetime.timedelta(days=30)  # 1 week refresh

    asset_tops = CharacterAsset.objects.all().values_list("item_id", flat=True)

    # character_filter/corp_filter are independent scopes. A per-character
    # call (character_filter=[id]) should only touch that character's
    # locations, not every corp's - and vice versa. Only a bare call with
    # neither filter set (a full sweep) should touch everything.
    if character_filter is not None:
        char_filter = CharacterAudit.objects.filter(
            character__character_id__in=character_filter)
    elif corp_filter is None:
        char_filter = CharacterAudit.objects.all()
    else:
        char_filter = CharacterAudit.objects.none()

    corp_asset_tops = CorpAsset.objects.all().values_list("item_id", flat=True)

    if corp_filter is not None:
        corp_audit_filter = CorporationAudit.objects.filter(
            corporation__corporation_id__in=corp_filter)
    elif character_filter is None:
        corp_audit_filter = CorporationAudit.objects.all()
    else:
        corp_audit_filter = CorporationAudit.objects.none()

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

    # Same "only locations actually in use" filtering as the character-asset
    # queries above (queryset1/queryset5), just scoped to CorpAsset/
    # CorporateContract instead of doing this inline in corp_update_assets.
    queryset9 = list(
        CorpAsset.objects.filter(
            location_flag__in=location_flags,
            location_name=None,
            corporation__in=corp_audit_filter
        ).exclude(
            location_id__in=corp_asset_tops
        ).values_list('location_id', flat=True)
    )

    queryset10 = list(
        CorpAsset.objects.filter(
            location_flag='AssetSafety',
            location_name=None,
            corporation__in=corp_audit_filter
        ).values_list('location_id', flat=True)
    )
    logger.debug(
        f"CT LOCATIONS: {corp_filter} CorpAssets {queryset9 + queryset10}")

    queryset11 = list(
        CorporateContract.objects.filter(
            start_location_name=None,
            start_location_id__isnull=False,
            corporation__in=corp_audit_filter
        ).values_list('start_location_id', flat=True)
    )
    logger.debug(f"CT LOCATIONS: {corp_filter} CorporateContract {queryset11}")

    queryset12 = list(
        CorporateContract.objects.filter(
            end_location_name=None,
            end_location_id__isnull=False,
            corporation__in=corp_audit_filter
        ).values_list('end_location_id', flat=True)
    )
    logger.debug(f"CT LOCATIONS: {corp_filter} CorporateContract {queryset12}")

    all_locations = set(
        queryset1 + queryset3 + queryset8 +
        queryset4 + queryset5 + queryset6 +
        queryset7 + queryset9 + queryset10 +
        queryset11 + queryset12
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
            JumpClone.objects.all().values_list(
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

        corp_asset_all = list(
            CorpAsset.objects.all().values_list(
                'location_id',
                flat=True
            )
        )

        queryset2 = list(
            EveLocation.objects.filter(
                last_update__lte=expire,
                location_id__in=set(
                    clones_all + jump_clones_all + asset_all + corp_asset_all
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
