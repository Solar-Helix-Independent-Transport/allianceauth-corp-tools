from celery import app
from django.conf import settings
from django.contrib import admin
from django.utils.html import format_html

from . import app_settings, models

admin.site.register(models.CorptoolsConfiguration)
admin.site.register(models.CharacterAudit)
admin.site.register(models.CorporationAudit)


@admin.register(models.MapSystem)
class SystemAdmin(admin.ModelAdmin):
    list_display = ['name', 'get_region', 'get_constellation']
    search_fields = [
        'name', 'constellation__region__name', 'constellation__name']

    def get_region(self, obj):
        return obj.constellation.region.name

    def get_constellation(self, obj):
        return obj.constellation.name

    def get_queryset(self, request):
        return super(SystemAdmin, self).get_queryset(request).select_related('constellation', 'constellation__region')

    def get_model_perms(self, request):
        return {}


@admin.register(models.MapRegion)
class MapRegionAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

    def get_model_perms(self, request):
        return {}


@admin.register(models.MapConstellation)
class MapConstellationAdmin(admin.ModelAdmin):
    list_display = ['name', 'get_region']
    search_fields = ['name', 'region__name']

    def get_region(self, obj):
        return obj.region.name

    def get_queryset(self, request):
        return super(MapConstellationAdmin, self).get_queryset(request).select_related('region')

    def get_model_perms(self, request):
        return {}


@admin.register(models.MapSystemMoon)
class MapSystemMoonAdmin(admin.ModelAdmin):
    list_display = ['name', 'get_region', 'get_constellation', 'get_system']
    search_fields = ['name', 'system__constellation__region__name',
                     'system__constellation__name', 'system__name']

    def get_region(self, obj):
        return obj.system.constellation.region.name

    def get_constellation(self, obj):
        return obj.system.constellation.name

    def get_system(self, obj):
        return obj.system.name

    def get_queryset(self, request):
        return super(MapSystemMoonAdmin, self).get_queryset(request).select_related('system__constellation__region', 'system__constellation', 'system')

    def get_model_perms(self, request):
        return {}


@admin.register(models.EveName)
class EveNameAdmin(admin.ModelAdmin):
    search_fields = ['name']


@admin.register(models.CorporationWalletJournalEntry)
class CorporationWalletJournalEntryAdmin(admin.ModelAdmin):
    list_display = ['date', 'first_party_name', 'second_party_name',
                    'entry_id', 'ref_type', 'reason', 'amount']
    search_fields = ['description', 'entry_id', 'reason',
                     'first_party_name__name', 'second_party_name__name', ]
    list_filter = ['ref_type']
    list_select_related = (
        'first_party_name', 'second_party_name',
    )


@admin.register(models.SkillList)
class SkillListAdmin(admin.ModelAdmin):
    list_display = ['order_weight', 'name', 'last_update']
    search_fields = ['name', 'skill_list', ]


class BridgeAdmin(admin.ModelAdmin):

    list_select_related = (
        'from_solar_system',
        'to_solar_system',
    )

    autocomplete_fields = ['from_solar_system', 'to_solar_system', 'owner']


admin.site.register(models.MapJumpBridge, BridgeAdmin)


class assetFilterAdmin(admin.ModelAdmin):

    list_display = ['__str__', '_types', '_groups', '_cats',
                    '_systems', '_constellations', '_regions']

    def _list_2_html_w_tooltips(self, my_items: list, max_items: int) -> str:
        """converts list of strings into HTML with cutoff and tooltip"""
        items_truncated_str = ', '.join(my_items[:max_items])
        if not my_items:
            result = None
        elif len(my_items) <= max_items:
            result = items_truncated_str
        else:
            items_truncated_str += ', (...)'
            items_all_str = ', '.join(my_items)
            result = format_html(
                '<span data-tooltip="{}" class="tooltip">{}</span>',
                items_all_str,
                items_truncated_str
            )
        return result

    def _types(self, obj):
        my_types = [x.name for x in obj.types.order_by('name')]

        return self._list_2_html_w_tooltips(
            my_types,
            10
        )
    _types.short_description = 'types'

    def _groups(self, obj):
        my_groups = [x.name for x in obj.groups.order_by('name')]

        return self._list_2_html_w_tooltips(
            my_groups,
            10
        )
    _groups.short_description = 'groups'

    def _cats(self, obj):
        my_cats = [x.name for x in obj.categories.order_by('name')]

        return self._list_2_html_w_tooltips(
            my_cats,
            10
        )
    _cats.short_description = 'categories'

    def _systems(self, obj):
        my_systems = [x.name for x in obj.systems.order_by('name')]

        return self._list_2_html_w_tooltips(
            my_systems,
            10
        )
    _systems.short_description = 'systems'

    def _constellations(self, obj):
        my_constels = [x.name for x in obj.constellations.order_by('name')]

        return self._list_2_html_w_tooltips(
            my_constels,
            10
        )
    _constellations.short_description = 'constellations'

    def _regions(self, obj):
        my_regions = [x.name for x in obj.regions.order_by('name')]

        return self._list_2_html_w_tooltips(
            my_regions,
            10
        )
    _regions.short_description = 'regions'

    filter_horizontal = ["types",
                         "groups",
                         "categories",
                         "systems",
                         "constellations",
                         "regions"]


class skillsFilterAdmin(admin.ModelAdmin):

    list_display = ['__str__', '_required_skill_lists',
                    '_single_req_skill_lists']
    filter_horizontal = ["required_skill_lists",
                         "single_req_skill_lists"]

    def _list_2_html_w_tooltips(self, my_items: list, max_items: int) -> str:
        """converts list of strings into HTML with cutoff and tooltip"""
        items_truncated_str = ', '.join(my_items[:max_items])
        if not my_items:
            result = None
        elif len(my_items) <= max_items:
            result = items_truncated_str
        else:
            items_truncated_str += ', (...)'
            items_all_str = ', '.join(my_items)
            result = format_html(
                '<span data-tooltip="{}" class="tooltip">{}</span>',
                items_all_str,
                items_truncated_str
            )
        return result

    def _single_req_skill_lists(self, obj):
        my_single_req_skill_lists = [
            x.name for x in obj.single_req_skill_lists.order_by('name')]

        return self._list_2_html_w_tooltips(
            my_single_req_skill_lists,
            10
        )
    _single_req_skill_lists.short_description = 'Require One'

    def _required_skill_lists(self, obj):
        my_required_skill_lists = [
            x.name for x in obj.required_skill_lists.order_by('name')]

        return self._list_2_html_w_tooltips(
            my_required_skill_lists,
            10
        )
    _required_skill_lists.short_description = 'Required'


class TimeInCorpFilterAdmin(admin.ModelAdmin):

    list_display = ['__str__', 'days_in_corp']


class rolesFilterAdmin(admin.ModelAdmin):

    list_display = ['__str__', 'has_director', 'has_accountant',
                    'has_station_manager', 'has_personnel_manager']


class titleFilterAdmin(admin.ModelAdmin):

    list_display = ['__str__', 'titles']


class titleAdmin(admin.ModelAdmin):
    list_display = ['title', 'corporation_name']
    search_fields = ['title', 'corporation_name']
    list_filter = ['corporation_name']

    def get_model_perms(self, request):
        return {}


admin.site.register(models.CharacterTitle, titleAdmin)


if 'securegroups' in settings.INSTALLED_APPS:
    admin.site.register(models.FullyLoadedFilter)
    admin.site.register(models.TimeInCorpFilter, TimeInCorpFilterAdmin)
    if app_settings.CT_CHAR_ASSETS_MODULE:
        admin.site.register(models.AssetsFilter, assetFilterAdmin)
    if app_settings.CT_CHAR_SKILLS_MODULE:
        admin.site.register(models.Skillfilter, skillsFilterAdmin)
    if app_settings.CT_CHAR_ROLES_MODULE:
        admin.site.register(models.Titlefilter, titleFilterAdmin)
        admin.site.register(models.Rolefilter, rolesFilterAdmin)
