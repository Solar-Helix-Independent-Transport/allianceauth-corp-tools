from typing import List

from ninja import NinjaAPI

from django.db.models import Q

from esi.models import Token

from corptools import app_settings, models
from corptools.api import schema


class ListApiEndpoints:

    tags = ["Corporation"]

    def __init__(self, api: NinjaAPI):
        @api.get(
            "corp/list",
            response={200: List[schema.CorpStatus], 403: str},
            tags=self.tags
        )
        def get_visible_corporation_status(request):
            corps = models.CorporationAudit.objects.visible_to(
                request.user
            ).filter(
                corporation__corporation_id__gte=2000000
            )

            if (request.user.has_perm("corptools.holding_corp_wallets")
                or request.user.has_perm("corptools.holding_corp_assets")
                    or request.user.has_perm("corptools.holding_corp_structures")):
                corps_holding = models.CorptoolsConfiguration.objects.get(
                    id=1).holding_corp_qs()
                corps = corps | corps_holding

            chars = models.CharacterAudit.objects.filter(
                character__corporation_id__in=corps.values_list(
                    "corporation__corporation_id",
                    flat=True
                ),
                active=True
            )
            chars = chars.select_related(
                "characterroles",
                "character"
            ).filter(
                Q(characterroles__accountant=True)
                or Q(characterroles__director=True)
                or Q(characterroles__station_manager=True)
            )

            corp_chars = {}

            for c in corps:
                corp_chars[c.corporation.corporation_id] = {
                    "a": {
                        "c": 0,
                        "t": 0
                    },
                    "w": {
                        "c": 0,
                        "t": 0
                    },
                    "s": {
                        "c": 0,
                        "t": 0
                    },
                    "m": {
                        "c": 0,
                        "t": 0
                    },
                }

            _c = {}
            for c in chars:
                _c[c.character.character_id] = c.character.corporation_id
                if c.characterroles.director:
                    corp_chars[c.character.corporation_id]["a"]["c"] += 1
                    corp_chars[c.character.corporation_id]["w"]["c"] += 1
                    corp_chars[c.character.corporation_id]["s"]["c"] += 1
                    corp_chars[c.character.corporation_id]["m"]["c"] += 1
                else:
                    if c.characterroles.station_manager:
                        corp_chars[c.character.corporation_id]["s"]["c"] += 1
                    if c.characterroles.accountant:
                        corp_chars[c.character.corporation_id]["w"]["c"] += 1
                        corp_chars[c.character.corporation_id]["m"]["c"] += 1

            # TODO rethink how we do this Issue #121

            # tokens = Token.objects.filter(character_id__in=chars.values_list(
            #     "character__character_id", flat=True))

            # def token_scope_filter(qs, scopes):
            #     for s in scopes:
            #         qs = qs.filter(scopes__name=s)
            #     return qs

            # def filter_token(qs, grp):
            #     for t in qs:
            #         corp_chars[_c[t.character_id]][grp]["t"] += 1

            # a_tokens = token_scope_filter(
            #     tokens, app_settings._corp_scopes_base + app_settings._corp_scopes_assets)
            # filter_token(a_tokens, "a")
            # w_tokens = token_scope_filter(
            #     tokens, app_settings._corp_scopes_base + app_settings._corp_scopes_wallets)
            # filter_token(w_tokens, "w")
            # s_tokens = token_scope_filter(
            #     tokens, app_settings._corp_scopes_base + app_settings._corp_scopes_structures)
            # filter_token(s_tokens, "s")
            # m_tokens = token_scope_filter(
            #     tokens, app_settings._corp_scopes_base + app_settings._corp_scopes_moons)
            # filter_token(m_tokens, "m")

            output = []
            for c in corps:
                _updates = {}
                for grp in app_settings.get_corp_update_attributes():
                    _updates[grp[0]] = {
                        "update": getattr(c, grp[1]),
                        "chars": corp_chars[c.corporation.corporation_id][grp[2]]["c"],
                        "tokens": corp_chars[c.corporation.corporation_id][grp[2]]["t"]
                    }
                all_id = None
                all_nm = None
                if c.corporation.alliance:
                    all_id = c.corporation.alliance.alliance_id
                    all_nm = c.corporation.alliance.alliance_name

                _out = {
                    "corporation": {
                        "corporation_id": c.corporation.corporation_id,
                        "corporation_name": c.corporation.corporation_name,
                        "alliance_id": all_id,
                        "alliance_name": all_nm
                    },
                    "characters": c.corporation.member_count,
                    "active": True,
                    "last_updates": _updates
                }
                output.append(_out)
            return output
