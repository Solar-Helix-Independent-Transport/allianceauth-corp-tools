from django.contrib import admin

from . import models

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

