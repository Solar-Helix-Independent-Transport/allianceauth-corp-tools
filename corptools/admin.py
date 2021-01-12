from django.contrib import admin

from . import models
from django.conf import settings

admin.site.register(models.CharacterAudit)
admin.site.register(models.CorporationAudit)

@admin.register(models.MapSystem)
class SystemAdmin(admin.ModelAdmin):
    search_fields = ['name']

@admin.register(models.EveName)
class EveNameAdmin(admin.ModelAdmin):
    search_fields = ['name']

@admin.register(models.CorporationWalletJournalEntry)
class CorporationWalletJournalEntryAdmin(admin.ModelAdmin):
    list_display = ['first_party_name', 'second_party_name', 'entry_id', 'ref_type', 'amount']
    search_fields = ['description', 'entry_id', 'reason', 'first_party_name__name', 'second_party_name__name',]
    list_filter = ['ref_type']

@admin.register(models.SkillList)
class SkillListAdmin(admin.ModelAdmin):
    list_display = ['order_weight', 'name', 'last_update']
    search_fields = ['name', 'skill_list',]

class BridgeAdmin(admin.ModelAdmin):

    list_select_related = (
        'from_solar_system',
        'to_solar_system',
    )

    autocomplete_fields = ['from_solar_system','to_solar_system', 'owner']

admin.site.register(models.MapJumpBridge,BridgeAdmin)


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

    list_display = ['__str__', '_required_skill_lists', '_single_req_skill_lists']
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
        my_single_req_skill_lists = [x.name for x in obj.single_req_skill_lists.order_by('name')]
        
        return self._list_2_html_w_tooltips(
            my_single_req_skill_lists, 
            10
        )
    _single_req_skill_lists.short_description = 'Require One'

    def _required_skill_lists(self, obj):
        my_required_skill_lists = [x.name for x in obj.required_skill_lists.order_by('name')]
        
        return self._list_2_html_w_tooltips(
            my_required_skill_lists, 
            10
        )
    _required_skill_lists.short_description = 'Required'

if 'securegroups' in settings.INSTALLED_APPS:
    admin.site.register(models.FullyLoadedFilter)
    admin.site.register(models.AssetsFilter,assetFilterAdmin)
    admin.site.register(models.Skillfilter, skillsFilterAdmin)

