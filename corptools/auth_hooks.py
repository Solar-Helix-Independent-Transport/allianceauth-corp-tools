from allianceauth.services.hooks import MenuItemHook, UrlHook
from django.utils.translation import ugettext_lazy as _
from allianceauth import hooks
from . import urls
from . import models
from . import app_settings


class MemberAudit(MenuItemHook):
    def __init__(self):

        MenuItemHook.__init__(self,
                              _('Audit'),
                              'far fa-eye fa-fw',
                              'corptools:view',
                              navactive=['corptools:'])

    def render(self, request):
        if request.user.has_perm('corptools.view_characteraudit'):
            return MenuItemHook.render(self, request)
        return ''


@hooks.register('menu_item_hook')
def register_menu():
    return MemberAudit()


@hooks.register('url_hook')
def register_url():
    return UrlHook(urls, 'corptools', r'^audit/')


@hooks.register("secure_group_filters")
def filters():
    return [models.AssetsFilter, models.FullyLoadedFilter, models.Skillfilter, models.TimeInCorpFilter, models.Rolefilter, models.Titlefilter]


@hooks.register('discord_cogs_hook')
def register_cogs():
    return app_settings.CORPTOOLS_DISCORD_BOT_COGS
