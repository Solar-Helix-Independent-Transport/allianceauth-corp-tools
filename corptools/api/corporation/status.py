from ninja import NinjaAPI

from django.utils.translation import gettext as _

from allianceauth.services.hooks import get_extension_logger

from corptools import app_settings, models
from corptools.api import helpers, schema

logger = get_extension_logger(__name__)


class StatusApiEndpoints:

    tags = ["Corporation"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "corp/{corporation_id}/status",
            response={200: schema.CorpStatus, 403: str},
            tags=self.tags
        )
        def get_corporation_status(request, corporation_id: int):
            if not corporation_id:
                corporation_id = request.user.profile.main_character.corporation_id
            corp = models.CorporationAudit.objects.visible_to(
                request.user).filter(corporation__corporation_id=corporation_id)
            if corp.exists():

                c = corp.first()
                _updates = {}
                for grp in app_settings.get_corp_update_attributes():
                    _updates[grp[0]] = getattr(c, grp[1])
                all_id = None
                all_nm = None
                if c.corporation.alliance:
                    all_id = c.corporation.alliance.alliance_id
                    all_nm = c.corporation.alliance.alliance_name

                _out = {"corporation": {"corporation_id": c.corporation.corporation_id,
                                        "corporation_name": c.corporation.corporation_name,
                                        "alliance_id": all_id,
                                        "alliance_name": all_nm},
                        "characters": c.corporation.member_count,
                        "active": True,
                        "last_updates": _updates}
                return 200, _out
            return 403, "Not Found"

        @api.get(
            "corporation/{corporation_id}/character/status",
            response={200: dict, 403: str},
            tags=self.tags
        )
        def get_corporation_character_status(request, corporation_id: int):
            if not corporation_id:
                corporation_id = request.user.profile.main_character.corporation_id

            corp = models.CorporationAudit.objects.visible_to(
                request.user
            ).get(
                corporation__corporation_id=corporation_id
            )

            if not corp:
                return 403, _("Permission Denied")

            characters = helpers.get_corporation_characters(
                request, corporation_id)

            characters = characters.select_related(
                'characteraudit'
            )

            output = {
                "characters": {
                    "known_and_alts": 0,
                    "known_in_corp": 0,
                    "bad": 0,
                    "in_corp": corp.corporation.member_count,
                    "liquid": 0
                },
                "corporation": {
                    'id': corp.corporation.corporation_id,
                    'name': corp.corporation.corporation_name,
                }
            }

            for character in characters:
                output["characters"]["known_and_alts"] += 1
                if character.corporation_id == corporation_id:
                    output["characters"]["known_in_corp"] += 1

                try:
                    output["characters"]["liquid"] += character.characteraudit.balance
                    if not character.characteraudit.is_active():
                        output["characters"]["bad"] += 1
                except models.CharacterAudit.DoesNotExist:
                    output["characters"]["bad"] += 1

            output["characters"]["liquid"] = helpers.roundFloat(
                output["characters"]["liquid"]
            )

            return 200, output
