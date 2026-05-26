# Third Party
from ninja import NinjaAPI

# Django
from django.db.models import F, Sum
from django.utils.translation import gettext as _

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger

# AA Example App
from corptools import models
from corptools.api import schema
from corptools.api.helpers import (
    glance_capital_count,
    glance_incursion_check,
    glance_officers_count,
    glance_officers_cruiser_count,
    glance_officers_frigate_count,
    glance_rest_count,
    glance_supers_count,
    glance_titans_count,
    glances_assets_character,
    glances_gas_check,
    glances_ice_check,
    glances_industry_check,
    glances_market_check,
    glances_missions_check,
    glances_moon_check,
    glances_ore_check,
    glances_pi_check,
    glances_pochven_check,
    glances_ratting_check,
    resolve_character,
    round_or_null,
)

logger = get_extension_logger(__name__)


class GlanceApiEndpoints:

    tags = ["Character At a Glance"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "account/{character_id}/glance/assets",
            response={200: schema.GlanceAssets, 403: str},
            tags=self.tags
        )
        def get_glance_assets(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            return glances_assets_character(characters)

        @api.get(
            "account/{character_id}/glance/activities",
            response={200: schema.GlanceActivities, 403: str},
            tags=self.tags
        )
        def get_glance_activities(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            return {
                "ratting": round_or_null(glances_ratting_check(characters)),
                "incursion": round_or_null(glance_incursion_check(characters)),
                "pochven": round_or_null(glances_pochven_check(characters)),
                "mission": round_or_null(glances_missions_check(characters)),
                "market": round_or_null(glances_market_check(characters)),
                "industry": glances_industry_check(characters),
                "pi": round_or_null(glances_pi_check(characters)),
                "mining_ore": round_or_null(glances_ore_check(characters)),
                "mining_moon": round_or_null(glances_moon_check(characters)),
                "mining_gas": round_or_null(glances_gas_check(characters)),
                "mining_ice": round_or_null(glances_ice_check(characters)),
            }

        @api.get(
            "account/{character_id}/glance/ratting",
            response={200: schema.GlanceRatting, 403: str},
            tags=self.tags
        )
        def get_glance_ratting_counts(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

            return {
                "subcap": glance_rest_count(characters),
                "capital": glance_capital_count(characters),
                "supers": glance_supers_count(characters),
                "titans": glance_titans_count(characters),
                "officer": glance_officers_count(characters),
                "officer_cruiser": glance_officers_cruiser_count(characters),
                "officer_frigate": glance_officers_frigate_count(characters),
            }

        @api.get(
            "account/{character_id}/glance/faction",
            response={200: schema.GlanceFaction, 403: str},
            tags=self.tags
        )
        def get_glance_factions(request, character_id: int):
            err, main, characters = resolve_character(request, character_id)
            if err:
                return err

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

            for character in characters:
                if character.faction_id is not None:
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
