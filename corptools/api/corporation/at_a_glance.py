from ninja import NinjaAPI

from django.db.models import F, Q, Sum
from django.utils.translation import gettext as _

from allianceauth.services.hooks import get_extension_logger

from corptools import models
# from corptools.api import schema
from corptools.api.helpers import (
    get_corporation_characters, glance_incursion_check, glances_gas_check,
    glances_ice_check, glances_industry_check, glances_market_check,
    glances_missions_check, glances_moon_check, glances_ore_check,
    glances_pi_check, glances_pochven_check, glances_ratting_check, roundFloat,
)

logger = get_extension_logger(__name__)


class CorpGlanceApiEndpoints:

    tags = ["Corporation At a Glance"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "corporation/{corporation_id}/glance/assets",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_glance_assets_corp(request, corporation_id: int):
            if corporation_id == 0:
                corporation_id = request.user.profile.main_character.corporation_id

            characters = get_corporation_characters(request, corporation_id)

            if not characters.count():
                return 403, _("Permission Denied")

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
            "corporation/{corporation_id}/glance/activities",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_glance_activities(request, corporation_id: int):
            if corporation_id == 0:
                corporation_id = request.user.profile.main_character.corporation_id

            characters = get_corporation_characters(request, corporation_id)

            if not characters.count():
                return 403, _("Permission Denied")

            output = {}

            output["ratting"] = roundFloat(glances_ratting_check(characters))
            output["incursion"] = roundFloat(
                glance_incursion_check(characters))
            output["pochven"] = roundFloat(glances_pochven_check(characters))
            output["mission"] = roundFloat(glances_missions_check(characters))

            output["market"] = glances_market_check(characters)
            output["industry"] = glances_industry_check(characters)

            output["pi"] = glances_pi_check(characters)

            output["mining_ore"] = roundFloat(glances_ore_check(characters))
            output["mining_moon"] = roundFloat(glances_moon_check(characters))
            output["mining_gas"] = roundFloat(glances_gas_check(characters))
            output["mining_ice"] = roundFloat(glances_ice_check(characters))

            return output

        @api.get(
            "corporation/{corporation_id}/glance/faction",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_glance_factions(request, corporation_id: int):
            if corporation_id == 0:
                corporation_id = request.user.profile.main_character.corporation_id

            characters = get_corporation_characters(request, corporation_id)

            if not characters.count():
                return 403, _("Permission Denied")

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
