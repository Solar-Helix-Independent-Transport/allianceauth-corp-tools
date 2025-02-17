from typing import List

from ninja import NinjaAPI

from django.utils.translation import gettext as _

from ... import app_settings
from .. import schema


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
                "name": _("Interactions"),
                "links": []
            }
            _finance = {
                "name": _("Finances"),
                "links": []
            }
            _industry = {
                "name": _("Industry"),
                "links": []
            }
            _char = {
                "name": _("Characters"),
                "links": [
                    {
                        "name": _("Status"),
                        "link": "account/status"
                    },
                    {
                        "name": _("Corp History"),
                        "link": "account/pubdata"
                    }
                ]
            }

            if app_settings.CT_CHAR_CONTACTS_MODULE:
                _inter["links"].append({
                    "name": _("Contact"),
                    "link": "account/contact"
                })

            if app_settings.CT_CHAR_NOTIFICATIONS_MODULE:
                _inter["links"].append({
                    "name": _("Notifications"),
                    "link": "account/notifications"
                })

            # if app_settings.CT_CHAR_STANDINGS_MODULE:
            #    _inter["links"].append({
            #        "name": "Standings",
            #        "link": "/account/standings"
            #    })

            if app_settings.CT_CHAR_WALLET_MODULE:
                _finance["links"].append({
                    "name": _("Wallet"),
                    "link": "account/wallet"
                })
                if (request.user.has_perm("corptools.global_corp_manager")
                    or request.user.has_perm("corptools.state_corp_manager")
                    or request.user.has_perm("corptools.alliance_corp_manager")
                        or request.user.has_perm("corptools.own_corp_manager")):
                    _finance["links"].append({
                        "name": _("Wallet Activity"),
                        "link": "account/walletactivity"
                    })
                _finance["links"].append({
                    "name": _("Contracts"),
                    "link": "account/contract"
                })

                _finance["links"].append({
                    "name": _("Market"),
                    "link": "account/market"
                })

            if app_settings.CT_CHAR_LOYALTYPOINTS_MODULE:
                _finance["links"].append({
                    "name": _("Loyalty Points"),
                    "link": "account/lp"
                })

            if app_settings.CT_CHAR_ASSETS_MODULE:
                _char["links"].append({
                    "name": _("Asset Overview"),
                    "link": "account/assets"
                })
                _char["links"].append({
                    "name": _("Asset List"),
                    "link": "account/listassets"
                })

            if app_settings.CT_CHAR_MINING_MODULE:
                _industry["links"].append({
                    "name": _("Mining Ledger"),
                    "link": "account/mining"
                })

            if app_settings.CT_CHAR_CLONES_MODULE:
                _char["links"].append({
                    "name": _("Clones"),
                    "link": "account/clones"
                })

            if app_settings.CT_CHAR_ROLES_MODULE:
                _char["links"].append({
                    "name": _("Roles"),
                    "link": "account/roles"
                })

            if app_settings.CT_CHAR_MAIL_MODULE:
                _inter["links"].append({
                    "name": _("Mail"),
                    "link": "account/mail"
                })

            if app_settings.CT_CHAR_SKILLS_MODULE:
                _char["links"].append({
                    "name": _("Skills"),
                    "link": "account/skills"
                })
                _char["links"].append({
                    "name": _("Skill Queues"),
                    "link": "account/skillqueue"
                })
                _char["links"].append({
                    "name": _("Skill List Checks"),
                    "link": "account/doctrines"
                })
            admin = {
                "name": _("Admin"),
                "link": "/audit/admin"
            }
            out = []
            if len(_char['links']):
                out.append(_char)

            if len(_finance['links']):
                out.append(_finance)

            if len(_industry['links']):
                out.append(_industry)

            if len(_inter['links']):
                out.append(_inter)

            if request.user.is_superuser:
                out.append(admin)

            return out
