# Third Party
from eve_sde.models import ItemType, SolarSystem

# Django
from django.db import models

from .audits import CorporationAudit, CorptoolsConfiguration


class SovereigntyHub(models.Model):
    corporation = models.ForeignKey(
        CorporationAudit, on_delete=models.CASCADE, related_name='ct_sovereignty_hub')

    hub_id = models.BigIntegerField()
    solar_system_id = models.IntegerField()
    solar_system_name = models.ForeignKey(
        SolarSystem, on_delete=models.SET_NULL, null=True, default=None)
    fuel_access_list_id = models.IntegerField(null=True, default=None)

    power_allocated = models.IntegerField(null=True, default=None)
    power_available = models.IntegerField(null=True, default=None)
    workforce_allocated = models.IntegerField(null=True, default=None)
    workforce_available = models.IntegerField(null=True, default=None)

    vuln_window_start = models.DateTimeField(null=True, default=None)
    vuln_window_end = models.DateTimeField(null=True, default=None)

    reagent_last_updated = models.DateTimeField(null=True, default=None)
    workforce_transport = models.JSONField(null=True, default=None)

    class Meta:
        unique_together = ['corporation', 'hub_id']

    @classmethod
    def get_visible(cls, user):
        corps_vis = CorporationAudit.objects.visible_to(user)
        if user.has_perm("corptools.holding_corp_structures"):
            corps_holding = CorptoolsConfiguration.get_solo().holding_corp_qs()
            corps_vis = corps_vis | corps_holding
        return cls.objects.filter(corporation__in=corps_vis)


class SovereigntyHubReagent(models.Model):
    hub = models.ForeignKey(
        SovereigntyHub, on_delete=models.CASCADE, related_name='reagents')
    type_name = models.ForeignKey(
        ItemType, on_delete=models.SET_NULL, null=True, default=None)
    amount = models.IntegerField()
    burning_per_hour = models.IntegerField()


class SovereigntyHubUpgrade(models.Model):
    hub = models.ForeignKey(
        SovereigntyHub, on_delete=models.CASCADE, related_name='upgrades')
    type_name = models.ForeignKey(
        ItemType, on_delete=models.SET_NULL, null=True, default=None)
    power_state = models.CharField(max_length=50)
