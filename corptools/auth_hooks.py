from allianceauth import hooks
from allianceauth.services.hooks import MenuItemHook, UrlHook

from . import app_settings, models, urls


class MemberAudit(MenuItemHook):
    def __init__(self):

        MenuItemHook.__init__(
            self,
            app_settings.CORPTOOLS_APP_NAME,
            'far fa-eye fa-fw',
            'corptools:react',
            navactive=[
                'corptools:reactmain',
                'corptools:view',
                'corptools:react',
            ]
        )

    def render(self, request):
        if request.user.has_perm('corptools.view_characteraudit'):
            chars = request.user.character_ownerships.all(

            ).select_related('character__characteraudit')

            inactive_count = 0
            for c in chars:
                try:
                    if not c.character.characteraudit.is_active():
                        inactive_count += 1
                except models.CharacterAudit.DoesNotExist:
                    inactive_count += 1
            if inactive_count:
                self.count = inactive_count
            return MenuItemHook.render(self, request)
        return ''


class CorporationAudit(MenuItemHook):
    def __init__(self):

        MenuItemHook.__init__(self,
                              "Corporation Audit",
                              'far fa-building fa-fw',
                              'corptools:corp_react',
                              navactive=['corptools:corp_react'])

    def render(self, request):
        if any(
            request.user.has_perm(perm)
            for perm in [
                "corptools.own_corp_manager",
                "corptools.alliance_corp_manager",
                "corptools.state_corp_manager",
                "corptools.global_corp_manager",
                "corptools.holding_corp_structures",
                "corptools.holding_corp_assets",
                "corptools.holding_corp_wallets",
            ]
        ):
            return MenuItemHook.render(self, request)
        return ''


@hooks.register('menu_item_hook')
def register_menu():
    return MemberAudit()


@hooks.register('menu_item_hook')
def register_corp():
    return CorporationAudit()


@hooks.register('url_hook')
def register_url():
    return UrlHook(urls, 'corptools', r'^audit/')


@hooks.register("secure_group_filters")
def filters():
    # Hey nerd, if you create a filter BEFORE its registered here. It wont appear until you edit and save it.
    return [
        models.AssetsFilter,
        models.LastLoginfilter,
        models.FullyLoadedFilter,
        models.Skillfilter,
        models.TimeInCorpFilter,
        models.CharacterAgeFilter,
        models.Rolefilter,
        models.Titlefilter,
        models.HighestSPFilter,
        models.CurrentShipFilter,
        models.HomeStationFilter,
        models.JumpCloneFilter
    ]


@hooks.register('discord_cogs_hook')
def register_cogs():
    return app_settings.CORPTOOLS_DISCORD_BOT_COGS
