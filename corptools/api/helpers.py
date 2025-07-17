from datetime import timedelta

from ninja import Field, Schema
from ninja.pagination import LimitOffsetPagination
from ninja.types import DictStrAny

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import F, Q, QuerySet, Sum
from django.utils import timezone

from allianceauth.eveonline.models import EveCharacter
from allianceauth.services.hooks import get_extension_logger

from corptools.constants.types import (
    MINING_GAS_GROUPS, MINING_ICE_GROUPS, MINING_MOON_GROUPS,
    MINING_ORE_GROUPS, RAT_CAPITAL_GROUPS, RAT_OFFICER_CRUISER_GROUPS,
    RAT_OFFICER_FRIGATE_GROUPS, RAT_OFFICER_GROUPS, RAT_SUPER_GROUPS,
    RAT_TITAN_GROUPS,
)

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


def bounty_check(characters, groups, look_back=30):
    start_date = timezone.now() - timedelta(days=look_back)
    return models.CharacterBountyStat.objects.filter(
        event__entry__character__character__in=characters,
        type_name__group_id__in=groups,
        event__entry__date__gte=start_date
    )


def rats_killed_check(characters, groups):
    return models.CharacterBountyStat.objects.filter(
        event__entry__character__character__in=characters,
        type_name__group_id__in=groups
    )


def glance_rest_count(characters):
    excluded_groups = RAT_CAPITAL_GROUPS
    excluded_groups += RAT_SUPER_GROUPS
    excluded_groups += RAT_TITAN_GROUPS
    excluded_groups += RAT_OFFICER_GROUPS
    excluded_groups += RAT_OFFICER_CRUISER_GROUPS
    excluded_groups += RAT_OFFICER_FRIGATE_GROUPS

    return models.CharacterBountyStat.objects.filter(
        event__entry__character__character__in=characters
    ).exclude(
        type_name__group_id__in=excluded_groups
    ).aggregate(total=Sum("qty"))["total"]


def glance_capital_count(characters):
    return rats_killed_check(
        characters,
        RAT_CAPITAL_GROUPS
    ).aggregate(total=Sum("qty"))["total"]


def glance_supers_count(characters):
    return rats_killed_check(
        characters,
        RAT_SUPER_GROUPS
    ).aggregate(total=Sum("qty"))["total"]


def glance_titans_count(characters):
    return rats_killed_check(
        characters,
        RAT_TITAN_GROUPS
    ).aggregate(total=Sum("qty"))["total"]


def glance_officers_count(characters):
    return rats_killed_check(
        characters,
        RAT_OFFICER_GROUPS
    ).aggregate(total=Sum("qty"))["total"]


def glance_officers_cruiser_count(characters):
    return rats_killed_check(
        characters,
        RAT_OFFICER_CRUISER_GROUPS
    ).aggregate(total=Sum("qty"))["total"]


def glance_officers_frigate_count(characters):
    return rats_killed_check(
        characters,
        RAT_OFFICER_FRIGATE_GROUPS
    ).aggregate(total=Sum("qty"))["total"]


def glance_incursion_check(characters):
    from_ids = [1000125]
    types = ["corporate_reward_payout"]
    return wallet_check(characters, types, first_parties=from_ids).aggregate(total=Sum("amount"))["total"]


def glances_missions_check(characters):
    types = ["agent_mission_reward", "agent_mission_time_bonus_reward"]
    return wallet_check(characters, types).aggregate(total=Sum("amount"))["total"]


def glances_ratting_check(characters):
    types = ["bounty_prizes"]
    min_amount = 1000000
    # 5 mill ticks should cover gate rats etc. but still show passive ratting
    return wallet_check(characters, types, minimum_amount=min_amount).aggregate(total=Sum("amount"))["total"]
    # return wallet_check(characters, types).aggregate(total=Sum("amount"))["total"]


def glances_pochven_check(characters):
    from_ids = [1000298]
    types = ["corporate_reward_payout"]
    return wallet_check(characters, types, first_parties=from_ids).aggregate(total=Sum("amount"))["total"]


def glances_market_check(characters):
    types = ["brokers_fee", "market_provider_tax",
             "market_transaction", "transaction_tax"]
    return wallet_check(characters, types).aggregate(total=Sum("amount"))["total"]


def glances_industry_check(characters):
    types = ["industry_job_tax"]
    return wallet_check(characters, types).count()


def glances_pi_check(characters):
    types = ["planetary_import_tax",
             "planetary_export_tax"]
    return wallet_check(characters, types).aggregate(total=Sum("amount"))["total"]


def glances_ore_check(characters):
    return mining_check(
        characters,
        MINING_ORE_GROUPS
    ).aggregate(
        total=Sum(F("quantity") * F("type_name__volume"))
    )["total"]


def glances_moon_check(characters):
    return mining_check(
        characters,
        MINING_MOON_GROUPS
    ).aggregate(
        total=Sum(F("quantity") * F("type_name__volume"))
    )["total"]


def glances_ice_check(characters):
    return mining_check(
        characters,
        MINING_ICE_GROUPS
    ).aggregate(
        total=Sum(F("quantity") * F("type_name__volume"))
    )["total"]


def glances_gas_check(characters):
    return mining_check(
        characters,
        MINING_GAS_GROUPS
    ).aggregate(
        total=Sum(F("quantity") * F("type_name__volume"))
    )["total"]


def roundFloat(input):
    if input:
        return int(input)
    else:
        return input


def glances_assets_character(characters):
    cats = [6, 65, 22]
    injector_grp = 1739
    sp_types = [
        40519,  # extractor
    ]

    ship_assets = models.CharacterAsset.objects.filter(
        Q(type_name__group__category_id__in=cats)
        | Q(type_name__group_id=injector_grp),
        character__character__in=characters,
    ).values(
        'type_name__group__group_id'
    ).annotate(
        grp_total=Sum('quantity')
    ).annotate(
        grp_name=F('type_name__group__name')
    ).annotate(
        grp_id=F('type_name__group_id')
    ).annotate(
        cat_id=F('type_name__group__category_id')
    ).order_by(
        '-grp_total'
    )

    sp_assets = models.CharacterAsset.objects.filter(
        character__character__in=characters,
        type_name__type_id__in=sp_types
    ).values(
        'type_name__type_id'
    ).annotate(
        type_total=Sum('quantity')
    )

    den_assets = models.CharacterAsset.objects.filter(
        character__character__in=characters,
        type_name__type_id=85230,
        location_type="solar_system"
    ).values(
        'type_name__type_id'
    ).annotate(
        type_total=Sum('quantity')
    )

    sp_assets = sp_assets | den_assets

    return assets_glances(ship_assets, sp_assets)


def glances_assets_corporation(characters, corp_id, user=None):
    cats = [6, 65]
    injector_grp = 1739
    sp_types = [
        40519,  # extractor
    ]

    ship_assets = models.CorpAsset.objects.get_queryset()
    if user:
        ship_assets = models.CorpAsset.get_visible(
            user
        )

    ship_assets = models.CorpAsset.objects.filter(
        Q(type_name__group__category_id__in=cats)
        | Q(type_name__group_id=injector_grp),
        corporation__corporation__corporation_id=corp_id,
    ).values(
        'type_name__group__group_id'
    ).annotate(
        grp_total=Sum('quantity')
    ).annotate(
        grp_name=F('type_name__group__name')
    ).annotate(
        grp_id=F('type_name__group_id')
    ).annotate(
        cat_id=F('type_name__group__category_id')
    ).order_by(
        '-grp_total'
    )

    sp_assets = models.CorpAsset.objects.get_queryset()

    if user:
        sp_assets = models.CorpAsset.get_visible(
            user
        )

    sp_assets = models.CorpAsset.objects.filter(
        corporation__corporation__corporation_id=corp_id,
        type_name__type_id__in=sp_types
    ).values(
        'type_name__type_id'
    ).annotate(
        type_total=Sum('quantity')
    )

    return {
        "corporate": assets_glances(ship_assets, sp_assets),
        "character": glances_assets_character(characters)
    }


def assets_glances(ship_assets, sp_assets):
    injector_grp = 1739
    mining_groups = [463, 543]
    frig_groups = [25, 324, 830, 831, 834, 893, 1283, 1527, 2078]
    destroyer_groups = [420, 541, 1305, 1534]
    cruiser_groups = [26, 358, 832, 833, 894, 906, 963, 1972]
    bc_groups = [419, 540, 1201]
    bs_groups = [27, 381, 898, 900]
    indy_groups = [28, 380, 1202]
    indy_command_groups = [941]
    dread_groups = [485, 4594]
    cap_indy_groups = [902, 513, 883]
    citadel_groups = [1657,]
    eng_comp_groups = [1404, ]
    refinary_groups = [1406, 4744]
    flex_groups = [1408, 2016, 2017]
    merc_den_groups = [4810, ]

    out_groups = {
        "frigate": 0,
        "destroyer": 0,
        "cruiser": 0,
        "battlecruiser": 0,
        "battleship": 0,
        "carrier": 0,
        "fax": 0,
        "dread": 0,
        "supercarrier": 0,
        "titan": 0,
        "mining": 0,
        "hauler": 0,
        "indy_command": 0,
        "capital_indy": 0,
        "injector": 0,
        "extractor": 0,
        "citadel": 0,
        "eng_comp": 0,
        "refinary": 0,
        "flex": 0,
        "merc_den_grp": 0,
        "merc_den": 0,
    }

    for group in ship_assets:
        # this is ugly... but functional...
        grp = group["type_name__group__group_id"]

        if grp in frig_groups:
            out_groups["frigate"] += group["grp_total"]
        elif grp in destroyer_groups:
            out_groups["destroyer"] += group["grp_total"]
        elif grp in cruiser_groups:
            out_groups["cruiser"] += group["grp_total"]
        elif grp in bc_groups:
            out_groups["battlecruiser"] += group["grp_total"]
        elif grp in bs_groups:
            out_groups["battleship"] += group["grp_total"]
        elif grp in indy_groups:
            out_groups["hauler"] += group["grp_total"]
        elif grp in indy_command_groups:
            out_groups["indy_command"] += group["grp_total"]
        elif grp in mining_groups:
            out_groups["mining"] += group["grp_total"]
        elif grp in dread_groups:
            out_groups["dread"] += group["grp_total"]
        elif grp in cap_indy_groups:
            out_groups["capital_indy"] += group["grp_total"]
        elif grp == 30:
            out_groups["titan"] += group["grp_total"]
        elif grp == 547:
            out_groups["carrier"] += group["grp_total"]
        elif grp == 1538:
            out_groups["fax"] += group["grp_total"]
        elif grp == 659:
            out_groups["supercarrier"] += group["grp_total"]
        elif grp == injector_grp:
            out_groups["injector"] += group["grp_total"]
        elif grp in citadel_groups:
            out_groups["citadel"] += group["grp_total"]
        elif grp in eng_comp_groups:
            out_groups["eng_comp"] += group["grp_total"]
        elif grp in refinary_groups:
            out_groups["refinary"] += group["grp_total"]
        elif grp in flex_groups:
            out_groups["flex"] += group["grp_total"]
        elif grp in merc_den_groups:
            out_groups["merc_den_grp"] += group["grp_total"]

    for sp_type in sp_assets:
        _type = sp_type["type_name__type_id"]
        if _type == 40519:
            out_groups["extractor"] += sp_type["type_total"]
        elif _type == 85230:
            out_groups["merc_den"] += sp_type["type_total"]

    return out_groups
