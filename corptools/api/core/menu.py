from typing import List, Optional

from ninja import Field, Form, NinjaAPI

from ... import app_settings, models
from .. import schema
from ..helpers import get_alts_queryset, get_main_character


class MenuApiEndpoints:

    tags = ["Menus"]

    def __init__(self, api: NinjaAPI):

        @api.get(
            "account/menu",
            response=List[schema.MenuCategory],
            tags=self.tags
        )
        def get_character_menu(request):
            _inter = {
                "name": "Interactions",
                "links": []
            }
            _finance = {
                "name": "Finances",
                "links": []
            }
            _industry = {
                "name": "Industry",
                "links": []
            }
            _char = {
                "name": "Characters",
                "links": []
            }

            if app_settings.CT_CHAR_CONTACTS_MODULE:
                _inter["links"].append({
                    "name": "Contact",
                    "link": "account/contact"
                })

            if app_settings.CT_CHAR_NOTIFICATIONS_MODULE:
                _inter["links"].append({
                    "name": "Notifications",
                    "link": "account/notifications"
                })

            # if app_settings.CT_CHAR_STANDINGS_MODULE:
            #    _inter["links"].append({
            #        "name": "Standings",
            #        "link": "/account/standings"
            #    })

            if app_settings.CT_CHAR_WALLET_MODULE:
                _finance["links"].append({
                    "name": "Wallet",
                    "link": "account/wallet"
                })
                if (request.user.has_perm("corptools.global_corp_manager") or
                    request.user.has_perm("corptools.state_corp_manager") or
                    request.user.has_perm("corptools.alliance_corp_manager") or
                        request.user.has_perm("corptools.own_corp_manager")):
                    _finance["links"].append({
                        "name": "Wallet Activity",
                        "link": "account/walletactivity"
                    })
                _finance["links"].append({
                    "name": "Contracts",
                    "link": "account/contract"
                })

                _finance["links"].append({
                    "name": "Market",
                    "link": "account/market"
                })

            if app_settings.CT_CHAR_LOYALTYPOINTS_MODULE:
                _finance["links"].append({
                    "name": "Loyalty Points",
                    "link": "account/lp"
                })

            if app_settings.CT_CHAR_ASSETS_MODULE:
                _char["links"].append({
                    "name": "Asset Overview",
                    "link": "account/assets"
                })
                _char["links"].append({
                    "name": "Asset List",
                    "link": "account/listassets"
                })

            if app_settings.CT_CHAR_ACTIVE_IGNORE_MINING_MODULE:
                _industry["links"].append({
                    "name": "Mining Ledger",
                    "link": "account/mining"
                })

            if app_settings.CT_CHAR_CLONES_MODULE:
                _char["links"].append({
                    "name": "Clones",
                    "link": "account/clones"
                })

            if app_settings.CT_CHAR_ROLES_MODULE:
                _char["links"].append({
                    "name": "Roles",
                    "link": "account/roles"
                })

            if app_settings.CT_CHAR_MAIL_MODULE:
                _inter["links"].append({
                    "name": "Mail",
                    "link": "account/mail"
                })

            if app_settings.CT_CHAR_SKILLS_MODULE:
                _char["links"].append({
                    "name": "Skills",
                    "link": "account/skills"
                })
                _char["links"].append({
                    "name": "Skill Queues",
                    "link": "account/skillqueue"
                })
                _char["links"].append({
                    "name": "Skill List Checks",
                    "link": "account/doctrines"
                })
            out = []
            if len(_char['links']):
                out.append(_char)

            if len(_finance['links']):
                out.append(_finance)

            if len(_industry['links']):
                out.append(_industry)

            if len(_inter['links']):
                out.append(_inter)

            return out
