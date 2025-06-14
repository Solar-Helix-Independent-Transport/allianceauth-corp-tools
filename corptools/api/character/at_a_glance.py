from ninja import NinjaAPI

from django.db.models import F, Q, Sum
from django.utils.translation import gettext as _

from allianceauth.services.hooks import get_extension_logger

from corptools import models
from corptools.api.helpers import (
    get_alts_queryset, get_main_character, glance_capital_count,
    glance_incursion_check, glance_officers_count,
    glance_officers_cruiser_count, glance_officers_frigate_count,
    glance_rest_count, glance_supers_count, glance_titans_count,
    glances_assets_character, glances_gas_check, glances_ice_check,
    glances_industry_check, glances_market_check, glances_missions_check,
    glances_moon_check, glances_ore_check, glances_pi_check,
    glances_pochven_check, glances_ratting_check, roundFloat,
)

# from corptools.api import schema


logger = get_extension_logger(__name__)


class GlanceApiEndpoints:

    tags = ["Character At a Glance"]

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

            return glances_assets_character(characters)

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

            output["ratting"] = roundFloat(glances_ratting_check(characters))
            output["incursion"] = roundFloat(
                glance_incursion_check(characters))
            output["pochven"] = roundFloat(glances_pochven_check(characters))
            output["mission"] = roundFloat(glances_missions_check(characters))

            output["market"] = roundFloat(glances_market_check(characters))
            output["industry"] = glances_industry_check(characters)

            output["pi"] = roundFloat(glances_pi_check(characters))

            output["mining_ore"] = roundFloat(glances_ore_check(characters))
            output["mining_moon"] = roundFloat(glances_moon_check(characters))
            output["mining_gas"] = roundFloat(glances_gas_check(characters))
            output["mining_ice"] = roundFloat(glances_ice_check(characters))

            return output

        @api.get(
            "account/{character_id}/glance/ratting",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_glance_ratting_counts(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id

            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            output = {}

            output["subcap"] = glance_rest_count(characters)
            output["capital"] = glance_capital_count(characters)
            output["supers"] = glance_supers_count(characters)
            output["titans"] = glance_titans_count(characters)
            output["officer"] = glance_officers_count(characters)
            output["officer_cruiser"] = glance_officers_cruiser_count(
                characters)
            output["officer_frigate"] = glance_officers_frigate_count(
                characters)

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
                    "amarr": 0,
                    "caldari": 0,
                    "gallente": 0,
                    "minmatar": 0,
                    "angel": 0,
                    "guristas": 0,
                },
                "lp": {
                    "total": 0,
                    "evermark": [],
                    "top_five": []
                }
            }

            # Check for any militia stuff
            for character in characters:
                if character.faction_id is not None:
                    # check_faction
                    if character.faction_id == 500003:
                        output["factions"]["amarr"] += 1
                    elif character.faction_id == 500010:
                        output["factions"]["guristas"] += 1
                    elif character.faction_id == 500004:
                        output["factions"]["gallente"] += 1
                    elif character.faction_id == 500011:
                        output["factions"]["angel"] += 1
                    elif character.faction_id == 500001:
                        output["factions"]["caldari"] += 1
                    elif character.faction_id == 500002:
                        output["factions"]["minmatar"] += 1

            account_lp = models.LoyaltyPoint.objects.filter(
                character__character__in=characters,
                amount__gte=1
            ).values(
                corp_id=F("corporation__eve_id")
            ).annotate(
                total_lp=Sum("amount")
            ).annotate(
                corp_name=F("corporation__name")
            ).order_by("-total_lp")[:5]

            for lp in account_lp:
                # Evermarks and anything future
                if lp.get('corp_id') in [1000419,]:
                    output["lp"]["evermark"].append({
                        "corp_id": lp.get("corp_id"),
                        "lp": lp.get("total_lp"),
                        "corp_name": lp.get("corp_name"),
                    })
                else:
                    output["lp"]["top_five"].append({
                        "corp_id": lp.get("corp_id"),
                        "lp": lp.get("total_lp"),
                        "corp_name": lp.get("corp_name"),
                    })

            output["lp"]["total"] = models.LoyaltyPoint.objects.filter(
                character__character__in=characters,
            ).exclude(
                corporation__eve_id__in=[1000419,]
            ).aggregate(total_lp=Sum("amount"))["total_lp"]

            return output
