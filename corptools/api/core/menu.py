# Standard Library
from typing import List

# Third Party
from ninja import NinjaAPI

# Django
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
                _inter["links"].append({
                    "name": _("Activity Map"),
                    "link": "account/activitymap"
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

            if app_settings.CT_CHAR_STRUCTURES_MODULE:
                _char["links"].append({
                    "name": _("Mercenary Dens"),
                    "link": "account/mercenarydens"
                })
                _char["links"].append({
                    "name": _("Mercenary Tactical Operations"),
                    "link": "account/mercenarytacticaloperations"
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
                _char["links"].append({
                    "name": _("Fitting Skill Checks"),
                    "link": "account/fitcheck"
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

        @api.get(
            "corp/menu",
            response=List[schema.MenuCategory],
            tags=self.tags
        )
        def get_corporation_menu(request):
            user = request.user

            # Same manager-tier set every corp/* endpoint's permission gate
            # checks (own/alliance/state/global_corp_manager, show_if_director
            # via CorporationAudit.objects.visible_to()).
            manager_tier = (
                user.has_perm("corptools.own_corp_manager")
                or user.has_perm("corptools.alliance_corp_manager")
                or user.has_perm("corptools.state_corp_manager")
                or user.has_perm("corptools.global_corp_manager")
                or user.has_perm("corptools.show_if_director")
            )
            has_structures = manager_tier or user.has_perm(
                "corptools.holding_corp_structures")
            has_wallets = manager_tier or user.has_perm(
                "corptools.holding_corp_wallets")
            has_assets = manager_tier or user.has_perm(
                "corptools.holding_corp_assets")
            # Activity map aggregates structure/asset/wallet data, so any one
            # of the three domain perms is enough to see it.
            has_activity_map = has_structures or has_wallets or has_assets

            _structures = {
                "name": _("Structures"),
                "links": []
            }
            if has_structures:
                _structures["links"].append(
                    {"name": _("Structures"), "link": "structures"})
                _structures["links"].append(
                    {"name": _("Pocos"), "link": "pocos"})
                _structures["links"].append(
                    {"name": _("Starbases"), "link": "starbases"})
                _structures["links"].append(
                    {"name": _("Sovereignty Hubs"), "link": "sovhubs"})
                _structures["links"].append(
                    {"name": _("Sovereignty Map"), "link": "sovmap"})

            _assets = {
                "name": _("Assets"),
                "links": []
            }
            if has_assets:
                _assets["links"].append(
                    {"name": _("Asset Overview"), "link": "assetgroup"})
                _assets["links"].append(
                    {"name": _("Asset List"), "link": "assetlist"})

            _dashboards = {
                "name": _("Dashboards"),
                "links": []
            }
            if has_structures:
                _dashboards["links"].append(
                    {"name": _("Fuel"), "link": "/audit/corp/dashboard/fuel"})
                _dashboards["links"].append(
                    {"name": _("Metenox"), "link": "/audit/corp/dashboard/metenox"})
                _dashboards["links"].append(
                    {"name": _("Bridges"), "link": "bridges"})
            if has_wallets:
                _dashboards["links"].append(
                    {"name": _("Character Mining Ledger"), "link": "mining"})
            if has_activity_map:
                _dashboards["links"].append(
                    {"name": _("Activity Map"), "link": "activitymap"})

            out = []

            # Mirrors at_a_glance.check_permisions: manager-tier or
            # holding_corp_structures.
            if manager_tier or user.has_perm("corptools.holding_corp_structures"):
                out.append({"name": _("Overview"), "link": "glance"})

            if len(_structures["links"]):
                out.append(_structures)

            if has_wallets:
                out.append({"name": _("Wallets"), "link": "wallets"})

            if len(_assets["links"]):
                out.append(_assets)

            if len(_dashboards["links"]):
                out.append(_dashboards)

            if user.is_superuser:
                out.append({"name": _("Admin"), "link": "/audit/admin"})

            return out
