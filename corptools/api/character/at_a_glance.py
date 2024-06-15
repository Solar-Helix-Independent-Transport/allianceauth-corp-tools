from datetime import timedelta

from ninja import NinjaAPI

from django.db.models import F, Q, Sum
from django.utils import timezone
from django.utils.translation import gettext as _

from allianceauth.services.hooks import get_extension_logger

from corptools import models
# from corptools.api import schema
from corptools.api.helpers import get_alts_queryset, get_main_character

logger = get_extension_logger(__name__)


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


class GlanceApiEndpoints:

    tags = ["At a Glance"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "account/{character_id}/glance/assets",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_glance_assets(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id

            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            ship_cat = [6]
            injector_grp = 1739

            ship_assets = models.CharacterAsset.objects.filter(
                Q(type_name__group__category_id__in=ship_cat)
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

            mining_groups = [463, 543]
            frig_groups = [25, 324, 830, 831, 834, 893, 1283, 1527, 2078]
            destroyer_groups = [420, 541, 1305, 1534]
            cruiser_groups = [26, 358, 832, 833, 894, 906, 963, 1972]
            bc_groups = [419, 540, 1201]
            bs_groups = [27, 381, 898, 900]
            indy_groups = [28, 380, 1202, 941]
            dread_groups = [485, 4594]
            cap_indy_groups = [902, 513, 883]

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
                "extractor": 0
            }

            for group in ship_assets:
                # this is ugly...
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

            sp_types = [
                40519,  # extractor
            ]

            sp_assets = models.CharacterAsset.objects.filter(
                character__character__in=characters,
                type_name__type_id__in=sp_types
            ).values(
                'type_name__type_id'
            ).annotate(
                type_total=Sum('quantity')
            )

            for sp_type in sp_assets:
                _type = sp_type["type_name__type_id"]
                if _type == 40519:
                    out_groups["extractor"] += sp_type["type_total"]

            return out_groups

        @api.get(
            "account/{character_id}/glance/activities",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_glance_activities(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id

            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            output = {}

            output["ratting"] = glances_ratting_check(characters)
            output["incursion"] = glance_incursion_check(characters)
            output["pochven"] = glances_pochven_check(characters)
            output["mission"] = glances_missions_check(characters)

            output["market"] = glances_market_check(characters)
            output["industry"] = glances_industry_check(characters)

            output["pi"] = glances_pi_check(characters)

            output["mining_ore"] = glances_ore_check(characters)
            output["mining_moon"] = glances_moon_check(characters)
            output["mining_gas"] = glances_gas_check(characters)
            output["mining_ice"] = glances_ice_check(characters)

            return output

        @api.get(
            "account/{character_id}/glance/faction",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_glance_factions(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id

            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            output = {
                "factions": {
                    "amarr": False,
                    "caldari": False,
                    "gallente": False,
                    "minmatar": False,
                    "angel": False,
                    "guristas": False,
                },
                "lp": {
                    "total": 0,
                    "top_five": []
                }
            }

            # Check for any militia stuff
            for character in characters:
                if character.faction_id is not None:
                    # check_faction
                    if character.faction_id == 500003:
                        output["factions"]["amarr"] = True
                    elif character.faction_id == 500010:
                        output["factions"]["guristas"] = True
                    elif character.faction_id == 500004:
                        output["factions"]["gallente"] = True
                    elif character.faction_id == 500011:
                        output["factions"]["angel"] = True
                    elif character.faction_id == 500001:
                        output["factions"]["caldari"] = True
                    elif character.faction_id == 500002:
                        output["factions"]["minmatar"] = True

            account_lp = models.LoyaltyPoint.objects.filter(
                character__character__in=characters,
            ).values(
                corp_id=F("corporation__eve_id")
            ).annotate(
                total_lp=Sum("amount")
            ).annotate(
                corp_name=F("corporation__name")
            ).order_by("-total_lp")[:5]

            for lp in account_lp:
                output["lp"]["top_five"].append({
                    "corp_id": lp.get("corp_id"),
                    "lp": lp.get("total_lp"),
                    "corp_name": lp.get("corp_name"),
                })

            output["lp"]["total"] = models.LoyaltyPoint.objects.filter(
                character__character__in=characters,
            ).aggregate(total_lp=Sum("amount"))["total_lp"]

            return output
