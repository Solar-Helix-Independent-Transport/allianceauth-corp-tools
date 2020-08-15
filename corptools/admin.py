from django.contrib import admin

from . import models

admin.site.register(models.CharacterAudit)
admin.site.register(models.SkillList)

@admin.register(models.MapSystem)
class SystemAdmin(admin.ModelAdmin):
    search_fields = ['name']

@admin.register(models.EveName)
class EveNameAdmin(admin.ModelAdmin):
    search_fields = ['name']

class BridgeAdmin(admin.ModelAdmin):
    list_select_related = (
        'from_solar_system',
        'to_solar_system',
    )

    autocomplete_fields = ['from_solar_system','to_solar_system', 'owner']

admin.site.register(models.MapJumpBridge,BridgeAdmin)