from datetime import datetime

from ninja import NinjaAPI

from django.db.models import F, Q, Sum
from django.utils import timezone
from django.utils.translation import gettext as _

from allianceauth.services.hooks import get_extension_logger

from corptools import models
# from corptools.api import schema
from corptools.api.helpers import (
    get_corporation_characters, glance_incursion_check,
    glances_assets_corporation, glances_gas_check, glances_ice_check,
    glances_industry_check, glances_market_check, glances_missions_check,
    glances_moon_check, glances_ore_check, glances_pi_check,
    glances_pochven_check, glances_ratting_check, roundFloat,
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
            response={200: dict, 403: str},
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
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_glance_activities_pve(request, corporation_id: int):
            if corporation_id == 0:
                corporation_id = request.user.profile.main_character.corporation_id

            characters = get_corporation_characters(request, corporation_id)

            if not check_permisions(corporation_id, request.user):
                return 403, _("Permission Denied")

            output = {}

            output["ratting"] = roundFloat(
                glances_ratting_check(characters)
            )
            output["incursion"] = roundFloat(
                glance_incursion_check(characters)
            )
            output["pochven"] = roundFloat(
                glances_pochven_check(characters)
            )
            output["mission"] = roundFloat(
                glances_missions_check(characters)
            )

            output["market"] = glances_market_check(characters)
            output["industry"] = glances_industry_check(characters)

            return output

        @api.get(
            "corporation/{corporation_id}/glance/activities/indy",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_glance_activities_indy(request, corporation_id: int):
            if corporation_id == 0:
                corporation_id = request.user.profile.main_character.corporation_id

            characters = get_corporation_characters(request, corporation_id)

            if not check_permisions(corporation_id, request.user):
                return 403, _("Permission Denied")

            output = {}

            output["market"] = glances_market_check(characters)
            output["industry"] = glances_industry_check(characters)
            output["pi"] = glances_pi_check(characters)

            return output

        @api.get(
            "corporation/{corporation_id}/glance/activities/mining",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_glance_activities(request, corporation_id: int):
            if corporation_id == 0:
                corporation_id = request.user.profile.main_character.corporation_id

            characters = get_corporation_characters(request, corporation_id)

            if not check_permisions(corporation_id, request.user):
                return 403, _("Permission Denied")

            output = {}

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
                amount__gte=0
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
            ).aggregate(total_lp=Sum("amount"))["total_lp"]

            return output
