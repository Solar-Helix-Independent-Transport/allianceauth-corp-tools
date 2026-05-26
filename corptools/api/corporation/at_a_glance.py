# Standard Library
from datetime import datetime

# Third Party
from ninja import NinjaAPI

# Django
from django.db.models import F, Sum
from django.utils import timezone
from django.utils.translation import gettext as _

# Alliance Auth
from allianceauth.services.hooks import get_extension_logger

# AA Example App
from corptools import models
from corptools.api import schema
from corptools.api.helpers import (
    get_corporation_characters,
    glance_incursion_check,
    glances_assets_corporation,
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
    round_or_null,
)

logger = get_extension_logger(__name__)


def check_permisions(corp_id, user):
    corps_vis = models.CorporationAudit.objects.visible_to(user)
    if user.has_perm("corptools.holding_corp_structures"):
        corps_holding = models.CorptoolsConfiguration.get_solo().holding_corp_qs()
        corps_vis = corps_vis | corps_holding
    return corps_vis.filter(corporation__corporation_id=corp_id).exists()


class CorpGlanceApiEndpoints:

    tags = ["Corporation At a Glance"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "corporation/{corporation_id}/glance/assets",
            response={200: schema.GlanceCorporateAssets, 403: str},
            tags=self.tags
        )
        def get_glance_assets_corp(request, corporation_id: int):
            if corporation_id == 0:
                corporation_id = request.user.profile.main_character.corporation_id

            characters = get_corporation_characters(request, corporation_id)

            if not check_permisions(corporation_id, request.user):
                return 403, _("Permission Denied")

            return glances_assets_corporation(characters, corporation_id, user=request.user)

        @api.get(
            "corporation/{corporation_id}/glance/activities/pve",
            response={200: schema.GlancePveActivities, 403: str},
            tags=self.tags
        )
        def get_glance_activities_pve(request, corporation_id: int):
            if corporation_id == 0:
                corporation_id = request.user.profile.main_character.corporation_id

            characters = get_corporation_characters(request, corporation_id)

            if not check_permisions(corporation_id, request.user):
                return 403, _("Permission Denied")

            return {
                "ratting": round_or_null(glances_ratting_check(characters)),
                "incursion": round_or_null(glance_incursion_check(characters)),
                "pochven": round_or_null(glances_pochven_check(characters)),
                "mission": round_or_null(glances_missions_check(characters)),
                "market": round_or_null(glances_market_check(characters)),
                "industry": glances_industry_check(characters),
            }

        @api.get(
            "corporation/{corporation_id}/glance/activities/indy",
            response={200: schema.GlanceIndyActivities, 403: str},
            tags=self.tags
        )
        def get_glance_activities_indy(request, corporation_id: int):
            if corporation_id == 0:
                corporation_id = request.user.profile.main_character.corporation_id

            characters = get_corporation_characters(request, corporation_id)

            if not check_permisions(corporation_id, request.user):
                return 403, _("Permission Denied")

            return {
                "market": round_or_null(glances_market_check(characters)),
                "industry": glances_industry_check(characters),
                "pi": round_or_null(glances_pi_check(characters)),
            }

        @api.get(
            "corporation/{corporation_id}/glance/activities/mining",
            response={200: schema.GlanceMiningActivities, 403: str},
            tags=self.tags
        )
        def get_glance_activities(request, corporation_id: int):
            if corporation_id == 0:
                corporation_id = request.user.profile.main_character.corporation_id

            characters = get_corporation_characters(request, corporation_id)

            if not check_permisions(corporation_id, request.user):
                return 403, _("Permission Denied")

            return {
                "mining_ore": round_or_null(glances_ore_check(characters)),
                "mining_moon": round_or_null(glances_moon_check(characters)),
                "mining_gas": round_or_null(glances_gas_check(characters)),
                "mining_ice": round_or_null(glances_ice_check(characters)),
            }

        @api.get(
            "corporation/{corporation_id}/glance/faction",
            response={200: schema.GlanceFaction, 403: str},
            tags=self.tags
        )
        def get_glance_factions(request, corporation_id: int):
            if corporation_id == 0:
                corporation_id = request.user.profile.main_character.corporation_id

            characters = get_corporation_characters(request, corporation_id)

            if not check_permisions(corporation_id, request.user):
                return 403, _("Permission Denied")

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
                amount__gte=0
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
            ).aggregate(total_lp=Sum("amount"))["total_lp"]

            return output
