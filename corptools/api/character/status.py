from typing import List

from ninja import NinjaAPI

from django.db.models import F, Sum
from django.utils.translation import gettext as _

from corptools import app_settings, models
from corptools.api import schema
from corptools.api.helpers import get_alts_queryset, get_main_character


class StatusApiEndpoints:

    tags = ["Account"]

    def __init__(self, api: NinjaAPI):

        @api.get(
            "account/{character_id}/status",
            response={200: schema.AccountStatus, 403: str},
            tags=self.tags
        )
        def get_character_status(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id
            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            char_skill_total = models.Skill.objects\
                .filter(character__character__in=characters)\
                .values('character')\
                .annotate(char=F('character__character__character_id'))\
                .annotate(total_sp=Sum('skillpoints_in_skill'))

            skills = {}

            for c in char_skill_total:
                skills[c.get('char')] = c.get('total_sp')

            characters = characters.select_related(
                'characteraudit', "characteraudit__location")
            output = {"characters": [],
                      "main": main
                      }
            for character in characters:
                last_login = None
                last_logout = None
                total_logins = 0
                if hasattr(character, "characteraudit"):
                    last_login = character.characteraudit.last_known_login
                    last_logout = character.characteraudit.last_known_logoff
                    total_logins = character.characteraudit.total_logins

                _o = {
                    "character": character,
                    "isk": 0,
                    "location": "Unknown",
                    "ship": "Unknown",
                    "ship_name": "Unknown",
                    "sp": skills.get(character.character_id, 0),
                    "active": False,
                    "last_updates": None,
                    "last_login": last_login,
                    "last_logout": last_logout,
                    "total_logins": total_logins
                }
                try:
                    _updates = {}
                    for grp in app_settings.get_character_update_attributes():
                        _updates[grp[0]] = getattr(
                            character.characteraudit, grp[1])
                    _o.update({
                        "isk": character.characteraudit.balance,
                        "active": character.characteraudit.is_active(),
                        "last_updates": _updates
                    })
                    try:
                        _o.update({
                            "location": character.characteraudit.location.current_location.location_name,
                            "ship": f"{character.characteraudit.location.current_ship.name}",
                            "ship_name": f"{character.characteraudit.location.current_ship_name}"
                        })
                    except Exception:
                        pass
                except models.CharacterAudit.DoesNotExist:
                    pass
                output["characters"].append(_o)

            output["characters"] = sorted(
                output["characters"], reverse=True, key=lambda d: d['sp']
            )
            return 200, output

        @api.get(
            "account/{character_id}/qs",
            tags=self.tags
        )
        def get_qs_test(request, character_id: int, total=500):
            if not request.user.is_superuser:
                return 403, _("Permission Denied")
            q = models.CharacterAudit.get_oldest_qs()

            out = []
            for s in q[:total]:
                out.append(
                    {
                        "Character": s.character.character_name,
                        "avg_date": s.avg_date
                    }
                )

            return out

        @api.get(
            "account/{character_id}/pubdata",
            response={200: List[schema.CharacterHistory], 403: str},
            tags=self.tags
        )
        def get_character_pubdata(request, character_id: int):
            if character_id == 0:
                character_id = request.user.profile.main_character.character_id

            response, main = get_main_character(request, character_id)

            if not response:
                return 403, _("Permission Denied")

            characters = get_alts_queryset(main)

            corp_histories = models.CorporationHistory.objects\
                .filter(character__character__in=characters)\
                .select_related(
                    'character__character', 'corporation_name'
                ).order_by("-record_id")

            histories = {}
            for h in corp_histories:
                if h.character.character_id not in histories:
                    histories[h.character.character_id] = []
                _h = {
                    "corporation": {
                        "corporation_name": h.corporation_name.name,
                        "corporation_id": h.corporation_name.eve_id,
                    },
                    "start": h.start_date
                }
                if h.corporation_name.alliance:
                    _h['corporation'].update({
                        "alliance_id": h.corporation_name.alliance.eve_id,
                        "alliance_name": h.corporation_name.alliance.name,
                    })
                histories[h.character.character_id].append(_h)

            characters = characters.select_related('characteraudit')
            output = []

            for character in characters:
                _o = {
                    "character": character,
                }
                try:
                    _o.update({
                        "history": histories[character.id],
                    })
                except KeyError:
                    pass
                output.append(_o)
            return 200, output
