import datetime

from model_utils import Choices

from django.db import models
from django.utils import timezone

from .audits import CorporationAudit, CorptoolsConfiguration
from .eve_models import EveItemType, MapSystem, MapSystemMoon, MapSystemPlanet


class BridgeOzoneLevel(models.Model):
    id = models.AutoField(primary_key=True)
    station_id = models.CharField(max_length=500)
    quantity = models.BigIntegerField()
    used = models.BigIntegerField(default=0)
    date = models.DateTimeField(auto_now=True)


class StructureCelestial(models.Model):
    structure_id = models.BigIntegerField()
    celestial_name = models.CharField(max_length=500, null=True, default=None)


class Structure(models.Model):
    corporation = models.ForeignKey(
        CorporationAudit, on_delete=models.CASCADE, related_name='ct_structure')

    fuel_expires = models.DateTimeField(null=True, default=None)
    next_reinforce_apply = models.DateTimeField(null=True, default=None)
    next_reinforce_hour = models.IntegerField(null=True, default=None)
    next_reinforce_weekday = models.IntegerField(null=True, default=None)
    profile_id = models.IntegerField()
    reinforce_hour = models.IntegerField()
    reinforce_weekday = models.IntegerField(null=True, default=None)
    _state_enum = Choices('anchor_vulnerable', 'anchoring', 'armor_reinforce', 'armor_vulnerable', 'deploy_vulnerable',
                          'fitting_invulnerable', 'hull_reinforce', 'hull_vulnerable', 'online_deprecated',
                          'onlining_vulnerable', 'shield_vulnerable', 'unanchored', 'unknown')
    state = models.CharField(max_length=25, choices=_state_enum)
    state_timer_end = models.DateTimeField(null=True, default=None)
    state_timer_start = models.DateTimeField(null=True, default=None)
    structure_id = models.BigIntegerField()
    system_id = models.IntegerField()
    type_id = models.IntegerField()
    unanchors_at = models.DateTimeField(null=True, default=None)

    # extra
    name = models.CharField(max_length=150)
    system_name = models.ForeignKey(
        MapSystem, on_delete=models.SET_NULL, null=True, default=None)
    type_name = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None)
    closest_celestial = models.ForeignKey(
        StructureCelestial, on_delete=models.SET_NULL, null=True, default=None)
    last_online_time = models.DateTimeField(null=True, default=None)

    @property
    def services(self):
        return StructureService.objects.filter(structure=self)

    @property
    def ozone_level(self):
        try:
            last_ozone = BridgeOzoneLevel.objects.filter(
                station_id=self.structure_id).order_by('-date')[:1][0].quantity
            return last_ozone
        except Exception:
            return False

    @property
    def abandoned(self):
        if self.last_online_time:
            abandonded = self.last_online_time + datetime.timedelta(days=7)
            if timezone.now() > abandonded:
                return True
            else:
                return False
        return True  # Fallback to abandonded. wosrt case its 7 days early

    @classmethod
    def get_visible(cls, user):
        corps_vis = CorporationAudit.objects.visible_to(user)
        if user.has_perm("corptools.holding_corp_structures"):
            corps_holding = CorptoolsConfiguration.get_solo().holding_corp_qs()
            corps_vis = corps_vis | corps_holding
        update_time_filter = timezone.now() - datetime.timedelta(days=7)
        return cls.objects.filter(corporation__in=corps_vis, corporation__last_update_structures__gte=update_time_filter)


class Poco(models.Model):
    corporation = models.ForeignKey(
        CorporationAudit, on_delete=models.CASCADE, related_name='ct_poco')

    office_id = models.BigIntegerField()

    standing_level = models.CharField(max_length=50)

    alliance_tax_rate = models.FloatField(null=True, default=None)
    corporation_tax_rate = models.FloatField(null=True, default=None)

    terrible_standing_tax_rate = models.FloatField(null=True, default=None)
    bad_standing_tax_rate = models.FloatField(null=True, default=None)
    neutral_standing_tax_rate = models.FloatField(null=True, default=None)
    good_standing_tax_rate = models.FloatField(null=True, default=None)
    excellent_standing_tax_rate = models.FloatField(null=True, default=None)

    reinforce_exit_end = models.IntegerField()
    reinforce_exit_start = models.IntegerField()

    standing_level = models.CharField(max_length=150, null=True, default=None)

    allow_access_with_standings = models.BooleanField(null=True, default=None)
    allow_alliance_access = models.BooleanField(null=True, default=None)

    system_id = models.IntegerField()

    name = models.CharField(max_length=150, null=True,
                            default=None, blank=True)

    planet = models.ForeignKey(
        MapSystemPlanet, on_delete=models.SET_NULL, null=True, default=None)
    system_name = models.ForeignKey(
        MapSystem, on_delete=models.SET_NULL, null=True, default=None)

    @classmethod
    def get_visible(cls, user):
        corps_vis = CorporationAudit.objects.visible_to(user)
        if user.has_perm("corptools.holding_corp_structures"):
            corps_holding = CorptoolsConfiguration.get_solo().holding_corp_qs()
            corps_vis = corps_vis | corps_holding
        # update_time_filter = timezone.now() - datetime.timedelta(days=7)
        # , corporation__last_update_pocos__gte=update_time_filter)
        return cls.objects.filter(corporation__in=corps_vis)


class StructureService(models.Model):
    structure = models.ForeignKey(Structure, on_delete=models.CASCADE)

    name = models.CharField(max_length=100)
    _state_enum = Choices('online', 'offline', 'cleanup')
    state = models.CharField(max_length=8, choices=_state_enum)


class Starbase(models.Model):
    corporation = models.ForeignKey(
        CorporationAudit,
        on_delete=models.CASCADE
    )
    starbase_id = models.BigIntegerField()
    name = models.CharField(max_length=255, default="", null=True, blank=True)
    onlined_since = models.DateTimeField(null=True, default=None)
    reinforced_until = models.DateTimeField(null=True, default=None)
    unanchor_at = models.DateTimeField(null=True, default=None)

    moon = models.ForeignKey(
        MapSystemMoon,
        on_delete=models.CASCADE,
        null=True,
        default=None
    )
    system = models.ForeignKey(
        MapSystem,
        on_delete=models.CASCADE,
        null=True,
        default=None
    )
    type_name = models.ForeignKey(
        EveItemType,
        on_delete=models.CASCADE,
        null=True,
        default=None
    )

    allow_alliance_members = models.BooleanField(default=False)
    allow_corporation_members = models.BooleanField(default=False)
    attack_if_at_war = models.BooleanField(default=False)
    attack_if_other_security_status_dropping = models.BooleanField(
        default=False)
    use_alliance_standings = models.BooleanField(default=False)

    attack_security_status_threshold = models.FloatField(
        null=True, default=None)
    attack_standing_threshold = models.FloatField(null=True, default=None)

    _state_enum = Choices('online', 'offline', 'onlining',
                          'reinforced', 'unanchoring')
    state = models.CharField(max_length=12, choices=_state_enum)

    _perm_enum = Choices(
        'alliance_member',
        'config_starbase_equipment_role',
        'corporation_member',
        'starbase_fuel_technician_role'
    )

    anchor = models.CharField(
        max_length=31,
        choices=_perm_enum,
        null=True,
        default=None
    )
    online = models.CharField(
        max_length=31,
        choices=_perm_enum,
        null=True,
        default=None
    )
    offline = models.CharField(
        max_length=31,
        choices=_perm_enum,
        null=True,
        default=None
    )
    unanchor = models.CharField(
        max_length=31,
        choices=_perm_enum,
        null=True,
        default=None
    )
    fuel_bay_take = models.CharField(
        max_length=31,
        choices=_perm_enum,
        null=True,
        default=None
    )
    fuel_bay_view = models.CharField(
        max_length=31,
        choices=_perm_enum,
        null=True,
        default=None
    )

    fuels = models.TextField(null=True, default="", blank=True)

    @classmethod
    def get_visible(cls, user):
        corps_vis = CorporationAudit.objects.visible_to(user)
        if user.has_perm("corptools.holding_corp_structures"):
            corps_holding = CorptoolsConfiguration.get_solo().holding_corp_qs()
            corps_vis = corps_vis | corps_holding
        # update_time_filter = timezone.now() - datetime.timedelta(days=7)
        return cls.objects.filter(corporation__in=corps_vis)
