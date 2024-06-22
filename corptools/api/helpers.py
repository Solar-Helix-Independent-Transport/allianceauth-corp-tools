from datetime import timedelta

from ninja import Field, Schema
from ninja.pagination import LimitOffsetPagination
from ninja.types import DictStrAny

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import F, QuerySet, Sum
from django.utils import timezone

from allianceauth.eveonline.models import EveCharacter
from allianceauth.services.hooks import get_extension_logger

from .. import app_settings, models

logger = get_extension_logger(__name__)


class Paginator(LimitOffsetPagination):
    class Input(Schema):
        limit: int = Field(app_settings.CT_PAGINATION_SIZE, ge=1)
        offset: int = Field(0, ge=0)

    def paginate_queryset(
        self,
        queryset: QuerySet,
        pagination: Input,
        **params: DictStrAny,
    ) -> any:
        offset = pagination.offset
        limit: int = pagination.limit
        return {
            "items": queryset[offset: offset + limit],
            "count": self._items_count(queryset),
        }


def get_main_character(request, character_id):
    perms = True
    main_char = EveCharacter.objects\
        .select_related('character_ownership', 'character_ownership__user__profile', 'character_ownership__user__profile__main_character', )\
        .get(character_id=character_id)
    try:
        main_char = main_char.character_ownership.user.profile.main_character
    except (ObjectDoesNotExist):
        pass

    # check access
    visible = models.CharacterAudit.objects.visible_eve_characters(
        request.user)
    if main_char not in visible:
        account_chars = request.user.profile.main_character.character_ownership.user.character_ownerships.all(
        )
        logger.warning(
            f"{request.user} Can See {list(visible)}, requested {main_char.id}")
        if main_char in account_chars:
            pass
        else:
            perms = False

    if not request.user.has_perm('corptools.view_characteraudit'):
        logger.warning(
            f"{request.user} does not have Perm requested, Requested {main_char.id}")
        perms = False

    return perms, main_char


def get_alts_queryset(main_char):
    try:
        linked_characters = main_char.character_ownership.user.character_ownerships.all(
        ).values_list('character_id', flat=True)

        return EveCharacter.objects.filter(id__in=linked_characters)
    except ObjectDoesNotExist:
        return EveCharacter.objects.filter(pk=main_char.pk)


def get_corporation_characters(request, corporation_id):
    return EveCharacter.objects.filter(
        character_ownership__user__profile__main_character__corporation_id=corporation_id,
        character_id__in=models.CharacterAudit.objects.visible_eve_characters(
            request.user
        ).values_list("character_id", flat=True)
    )


def round_or_null(value, digits=2):
    if value:
        return round(value, digits)
    else:
        return value


def wallet_check(characters, types, first_parties=None, minimum_amount=None, look_back=30):
    start_date = timezone.now() - timedelta(days=look_back)
    if isinstance(types, str):
        types = [types]

    if isinstance(first_parties, str):
        first_parties = [first_parties]

    qry = models.CharacterWalletJournalEntry.objects.filter(
        character__character__in=characters,
        ref_type__in=types,
        date__gte=start_date)

    if first_parties:
        qry = qry.filter(
            first_party_id__in=first_parties
        )

    if minimum_amount:
        qry = qry.filter(
            amount__gte=minimum_amount
        )

    return qry


def mining_check(characters, groups, look_back=30):
    start_date = timezone.now() - timedelta(days=look_back)
    return models.CharacterMiningLedger.objects.filter(
        character__character__in=characters,
        type_name__group_id__in=groups,
        date__gte=start_date
    )


def glance_incursion_check(characters):
    from_ids = [1000125]
    types = ["corporate_reward_payout"]
    return wallet_check(characters, types, first_parties=from_ids).aggregate(total=Sum("amount"))["total"]


def glances_missions_check(characters):
    types = ["agent_mission_reward", "agent_mission_time_bonus_reward"]
    return wallet_check(characters, types).aggregate(total=Sum("amount"))["total"]


def glances_ratting_check(characters):
    types = ["bounty_prizes"]
    min_amount = 5000000
    # 5 mill ticks should cover gate rats etc. but still show passive ratting
    return wallet_check(characters, types, minimum_amount=min_amount).aggregate(total=Sum("amount"))["total"]


def glances_pochven_check(characters):
    from_ids = [1000298]
    types = ["corporate_reward_payout"]
    return wallet_check(characters, types, first_parties=from_ids).aggregate(total=Sum("amount"))["total"]


def glances_market_check(characters):
    types = ["brokers_fee", "market_provider_tax"]
    return wallet_check(characters, types).exists()


def glances_industry_check(characters):
    types = ["industry_job_tax"]
    return wallet_check(characters, types).exists()


def glances_pi_check(characters):
    types = ["planetary_import_tax",
             "planetary_export_tax", "planetary_construction"]
    return wallet_check(characters, types).exists()


def glances_ore_check(characters):
    group_ids = [
        450,
        451,
        452,
        453,
        454,
        455,
        456,
        457,
        458,
        459,
        460,
        461,
        462,
        467,
        468,
        469,
        2024,
        4029,
        4030,
        4031,
        4513,
        4514,
        4515,
        4516,
        4568
    ]
    return mining_check(
        characters,
        group_ids
    ).aggregate(
        total=Sum(F("quantity") * F("type_name__volume"))
    )["total"]


def glances_moon_check(characters):
    group_ids = [
        1884,
        1920,
        1921,
        1922,
        1920
    ]
    return mining_check(
        characters,
        group_ids
    ).aggregate(
        total=Sum(F("quantity") * F("type_name__volume"))
    )["total"]


def glances_ice_check(characters):
    group_ids = [
        465,
        903
    ]
    return mining_check(
        characters,
        group_ids
    ).aggregate(
        total=Sum(F("quantity") * F("type_name__volume"))
    )["total"]


def glances_gas_check(characters):
    group_ids = [711]
    return mining_check(
        characters,
        group_ids
    ).aggregate(
        total=Sum(F("quantity") * F("type_name__volume"))
    )["total"]


def roundFloat(input):
    if input:
        return int(input)
    else:
        return input
