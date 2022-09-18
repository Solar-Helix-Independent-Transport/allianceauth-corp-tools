import datetime
import json
import logging
import os
from collections import defaultdict

from allianceauth.authentication.models import CharacterOwnership, UserProfile
from allianceauth.eveonline.evelinks import eveimageserver
from allianceauth.eveonline.models import (EveAllianceInfo, EveCharacter,
                                           EveCorporationInfo)
from allianceauth.notifications import notify
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import models
from django.db.models import Count, Max
from django.utils import timezone
from esi.errors import TokenError
from esi.models import Token
from model_utils import Choices
from pyexpat import model

from . import app_settings, providers, validators
from .managers import (AuditCharacterManager, AuditCorporationManager,
                       EveCategoryManager, EveGroupManager, EveItemTypeManager,
                       EveMoonManager, EveNameManager)

logger = logging.getLogger(__name__)

MAX_INACTIVE_DAYS = 3


class CorptoolsConfiguration(models.Model):
    holding_corps = models.ManyToManyField(EveCorporationInfo)

    class Meta:
        permissions = (
            ('holding_corp_structures',
             'Can access configured holding corp structure data.'),
            ('holding_corp_wallets', 'Can access configured holding corp wallet data.'),
            ('holding_corp_assets', 'Can access configured holding corp asset data.')
        )

        default_permissions = []

    def holding_corp_qs(self):
        return CorporationAudit.objects.filter(corporation__in=self.holding_corps.all())

    def save(self, *args, **kwargs):
        if not self.pk and CorptoolsConfiguration.objects.exists():
            # Force a single object
            raise ValidationError(
                'Only one Settings Model can there be at a time! No Sith Lords there are here!')
        self.pk = self.id = 1  # If this happens to be deleted and recreated, force it to be 1
        return super().save(*args, **kwargs)


class CharacterAudit(models.Model):

    objects = AuditCharacterManager()

    active = models.BooleanField(default=False)

    character = models.OneToOneField(EveCharacter, on_delete=models.CASCADE)

    last_update_pub_data = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_skills = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_skill_que = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_clones = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_contacts = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_assets = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_wallet = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_orders = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_notif = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_roles = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_titles = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_mails = models.DateTimeField(
        null=True, default=None, blank=True)

    balance = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, default=None)

    def __str__(self):
        return "{}'s Character Data".format(self.character.character_name)

    class Meta:
        permissions = (('corp_hr', 'Can access other character\'s data for own corp.'),
                       ('alliance_hr',
                        'Can access other character\'s data for own alliance.'),
                       ('state_hr', 'Can access other character\'s data for own state.'),
                       ('global_hr', 'Can access other character\'s data for characters in any corp/alliance/state.'))

    def is_active(self):
        time_ref = timezone.now() - datetime.timedelta(days=MAX_INACTIVE_DAYS)
        try:
            is_active = (self.last_update_pub_data > time_ref)

            if app_settings.CT_CHAR_ASSETS_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_ASSETS_MODULE:
                is_active = is_active and (self.last_update_assets > time_ref)
            if app_settings.CT_CHAR_CLONES_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_CLONES_MODULE:
                is_active = is_active and (self.last_update_clones > time_ref)
            if app_settings.CT_CHAR_SKILLS_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_SKILLS_MODULE:
                is_active = is_active and (self.last_update_skills > time_ref)
                is_active = is_active and (
                    self.last_update_skill_que > time_ref)
            if app_settings.CT_CHAR_WALLET_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_WALLET_MODULE:
                is_active = is_active and (self.last_update_wallet > time_ref)
                is_active = is_active and (self.last_update_orders > time_ref)
            if app_settings.CT_CHAR_NOTIFICATIONS_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_NOTIFICATIONS_MODULE:
                is_active = is_active and (self.last_update_notif > time_ref)
            if app_settings.CT_CHAR_ROLES_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_ROLES_MODULE:
                is_active = is_active and (self.last_update_roles > time_ref)
            if app_settings.CT_CHAR_MAIL_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_MAIL_MODULE:
                is_active = is_active and (self.last_update_mails > time_ref)

            if self.active != is_active:
                self.active = is_active
                self.save()

            return is_active
        except:
            return False


class CorporationAudit(models.Model):

    objects = AuditCorporationManager()

    corporation = models.OneToOneField(
        EveCorporationInfo, on_delete=models.CASCADE)

    last_update_pub_data = models.DateTimeField(
        null=True, default=None, blank=True)
    cache_expire_pub_data = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_assets = models.DateTimeField(
        null=True, default=None, blank=True)
    cache_expire_assets = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_structures = models.DateTimeField(
        null=True, default=None, blank=True)
    cache_expire_structures = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_moons = models.DateTimeField(
        null=True, default=None, blank=True)
    cache_expire_moons = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_observers = models.DateTimeField(
        null=True, default=None, blank=True)
    cache_expire_observers = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_wallet = models.DateTimeField(
        null=True, default=None, blank=True)
    cache_expire_wallet = models.DateTimeField(
        null=True, default=None, blank=True)

    def __str__(self):
        return "{}'s Corporation Data".format(self.corporation.corporation_name)

    class Meta:
        permissions = (
            ('own_corp_manager',
             'Can access own corporations\'s data.'),
            ('alliance_corp_manager',
             'Can access other corporations\'s data for own alliance.'),
            ('state_corp_manager',
             'Can access other corporations\'s data for own state.'),
            ('global_corp_manager', 'Can access all corporations\'s data.'),
        )

# ************************ Helper Models
# Eve Item Type


class EveItemCategory(models.Model):
    objects = EveCategoryManager()
    category_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)  # unknown max

    def __str__(self):
        return self.name


class EveItemGroup(models.Model):
    objects = EveGroupManager()
    group_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)  # unknown max
    category = models.ForeignKey(
        EveItemCategory, on_delete=models.SET_NULL, null=True, default=None)

    def __str__(self):
        return self.name


class EveItemType(models.Model):
    objects = EveItemTypeManager()
    type_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)  # unknown max
    group = models.ForeignKey(
        EveItemGroup, on_delete=models.SET_NULL, null=True, default=None)
    description = models.TextField(null=True, default=None)
    mass = models.FloatField(null=True, default=None)
    packaged_volume = models.FloatField(null=True, default=None)
    portion_size = models.FloatField(null=True, default=None)
    volume = models.FloatField(null=True, default=None)
    published = models.BooleanField()
    radius = models.FloatField(null=True, default=None)

    def __str__(self):
        return self.name


class EveItemDogmaAttribute(models.Model):
    eve_type = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None)
    attribute_id = models.BigIntegerField(null=True, default=None)
    value = models.FloatField(null=True, default=None)


class InvTypeMaterials(models.Model):
    qty = models.IntegerField()
    eve_type = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None)
    type_id = models.IntegerField()
    material_type_id = models.IntegerField()
    met_type = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None, related_name="met_type")


# Name Class
class EveName(models.Model):
    objects = EveNameManager()

    eve_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50)

    # optionals for character/corp
    corporation = models.ForeignKey(
        'EveName', on_delete=models.SET_NULL, null=True, default=None, related_name="corp")
    alliance = models.ForeignKey(
        'EveName', on_delete=models.SET_NULL, null=True, default=None, related_name="alli")
    last_update = models.DateTimeField(auto_now=True)

    CHARACTER = "character"
    CORPORATION = "corporation"
    ALLIANCE = "alliance"

    def __str__(self):
        return self.name

    def get_image_url(self):
        if self.category == self.CHARACTER:
            return eveimageserver.character_portrait_url(self.eve_id)
        elif self.category == self.CORPORATION:
            return eveimageserver.corporation_logo_url(self.eve_id)
        elif self.category == self.ALLIANCE:
            return eveimageserver.alliance_logo_url(self.eve_id)
        elif self.category == 'faction':  # CCP...
            return eveimageserver.corporation_logo_url(self.eve_id)

    def needs_update(self):
        return self.last_update + datetime.timedelta(days=7) < timezone.now()


class MapRegion(models.Model):
    region_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, default=None, )

    def __str__(self):
        return self.name


class MapConstellation(models.Model):
    constellation_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    region = models.ForeignKey(
        MapRegion, on_delete=models.SET_NULL, null=True, default=None)

    def __str__(self):
        return self.name


class MapSystem(models.Model):
    system_id = models.BigIntegerField(primary_key=True)
    security_status = models.FloatField()
    name = models.CharField(max_length=255)
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    security_class = models.CharField(max_length=255, null=True, default=None)
    star_id = models.IntegerField(null=True, default=None)
    constellation = models.ForeignKey(
        MapConstellation, on_delete=models.SET_NULL, null=True, default=None)

    def __str__(self):
        return self.name


class MapSystemGate(models.Model):
    from_solar_system = models.ForeignKey(
        MapSystem, on_delete=models.CASCADE, related_name="from_system")
    to_solar_system = models.ForeignKey(
        MapSystem, on_delete=models.CASCADE, related_name="to_system")

    def __str__(self):
        return (self.from_solar_system_id, self.to_solar_system_id)


class MapSystemPlanet(models.Model):
    planet_id = models.IntegerField(primary_key=True)
    system = models.ForeignKey(
        MapSystem, on_delete=models.CASCADE, related_name="planet")
    name = models.CharField(max_length=255)

    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()

    eve_type = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None)

    def __str__(self):
        return (self.name)


class MapSystemMoon(models.Model):

    objects = EveMoonManager()

    moon_id = models.IntegerField(primary_key=True)
    system = models.ForeignKey(
        MapSystem, on_delete=models.CASCADE, related_name="moon")
    name = models.CharField(max_length=255)

    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()

    def __str__(self):
        return (self.name)


class MapJumpBridge(models.Model):
    structure_id = models.BigIntegerField(primary_key=True)
    from_solar_system = models.ForeignKey(
        MapSystem, on_delete=models.CASCADE, related_name="bridge_from_system")
    to_solar_system = models.ForeignKey(
        MapSystem, on_delete=models.CASCADE, related_name="bridge_to_system")
    owner = models.ForeignKey(
        EveName, on_delete=models.SET_NULL, null=True, default=None)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.from_solar_system.name} >> {self.to_solar_system.name} ({self.structure_id})"

# ************************ Asset Models


class EveLocation(models.Model):
    location_id = models.BigIntegerField(primary_key=True)
    location_name = models.CharField(max_length=255)
    system = models.ForeignKey(
        MapSystem, on_delete=models.SET_NULL, null=True, default=None)
    last_update = models.DateTimeField(auto_now=True)
    managed = models.BooleanField(default=False)
    managed_corp = models.ForeignKey(
        CorporationAudit, default=None, blank=True, null=True, on_delete=models.CASCADE)
    managed_char = models.ForeignKey(
        CharacterAudit, default=None, blank=True, null=True, on_delete=models.CASCADE)


class Asset(models.Model):
    id = models.BigAutoField(primary_key=True)
    blueprint_copy = models.BooleanField(null=True, default=None)
    singleton = models.BooleanField()
    item_id = models.BigIntegerField()
    location_flag = models.CharField(max_length=50)
    location_id = models.BigIntegerField()
    location_type = models.CharField(max_length=25)
    quantity = models.IntegerField()
    type_id = models.IntegerField()
    type_name = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None)
    location_name = models.ForeignKey(
        EveLocation, on_delete=models.SET_NULL, null=True, default=None)

    # extra's
    name = models.CharField(max_length=255, null=True, default=None)

    class Meta:
        abstract = True
        indexes = [
            models.Index(fields=['location_id']),
            models.Index(fields=['item_id']),
        ]


class CorpAsset(Asset):
    corporation = models.ForeignKey(CorporationAudit, on_delete=models.CASCADE)

    def __str__(self):
        return '{2} {0}x{1} ({3} / {4})'.format(self.type_id, self.quantity, self.corporation,
                                                self.location_id, self.location_type)

    @classmethod
    def get_visible(cls, user):
        corps_vis = CorporationAudit.objects.visible_to(user)
        if user.has_perm("corptools.holding_corp_assets"):
            corps_holding = CorptoolsConfiguration.objects.get(
                id=1).holding_corp_qs()
            corps_vis = corps_vis | corps_holding

        return cls.objects.filter(corporation__in=corps_vis)


class CharacterAsset(Asset):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    def __str__(self):
        return '{2} {0}x{1} ({3} / {4})'.format(self.type_id, self.quantity, self.character,
                                                self.location_id, self.location_type)

# ************************ Character Models
# Character Skill


class SkillTotals(models.Model):
    character = models.OneToOneField(CharacterAudit, on_delete=models.CASCADE)

    total_sp = models.BigIntegerField()
    unallocated_sp = models.IntegerField(null=True, default=None)


class Skill(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    skill_id = models.IntegerField()
    skill_name = models.ForeignKey(
        EveItemType, on_delete=models.CASCADE, null=True, default=None)
    active_skill_level = models.IntegerField()
    skillpoints_in_skill = models.BigIntegerField()
    trained_skill_level = models.IntegerField()

    @property
    def alpha(self):
        if self.trained_skill_level == self.active_skill_level:
            return False
        return True  # is alpha clone

    class Meta:
        unique_together = (("character", "skill_id"),)

# Skill Queue Model


class SkillQueue(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    # Required Fields / Fields Always Present
    finish_level = models.IntegerField()
    queue_position = models.IntegerField()
    skill_id = models.IntegerField()
    skill_name = models.ForeignKey(
        EveItemType, on_delete=models.CASCADE, null=True, default=None)

    # Fields that may or may not be present
    finish_date = models.DateTimeField(null=True, default=None)
    level_end_sp = models.IntegerField(null=True, default=None)
    level_start_sp = models.IntegerField(null=True, default=None)
    start_date = models.DateTimeField(null=True, default=None)
    training_start_sp = models.IntegerField(null=True, default=None)

    @property
    def sp_hour(self):
        return -1  # do some math

# Corporation history


class CorporationHistory(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    corporation_id = models.IntegerField()
    corporation_name = models.ForeignKey(EveName, on_delete=models.CASCADE)
    is_deleted = models.BooleanField(null=True, default=None)
    record_id = models.IntegerField()
    start_date = models.DateTimeField()

# Clone Models


class Clone(models.Model):
    character = models.OneToOneField(CharacterAudit, on_delete=models.CASCADE)

    last_clone_jump_date = models.DateTimeField(null=True, default=None)
    last_station_change_date = models.DateTimeField(null=True, default=None)
    location_id = models.BigIntegerField()
    location_name = models.ForeignKey(
        EveLocation, on_delete=models.SET_NULL, null=True, default=None)
    _type_enum = Choices('station', 'structure')
    location_type = models.CharField(max_length=9, choices=_type_enum)

# Clone Models


class JumpClone(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    jump_clone_id = models.IntegerField(null=True, default=None)
    location_id = models.BigIntegerField(null=True, default=None)
    location_name = models.ForeignKey(
        EveLocation, on_delete=models.SET_NULL, null=True, default=None)
    _type_enum = Choices('station', 'structure')
    location_type = models.CharField(
        max_length=9, choices=_type_enum, null=True, default=None)
    name = models.CharField(max_length=255, null=True, default=None)

# Implant Model


class Implant(models.Model):
    clone = models.ForeignKey(JumpClone, on_delete=models.CASCADE)
    type_name = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None)

# ************************ Wallet Models


class WalletJournalEntry(models.Model):
    amount = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, default=None)
    balance = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, default=None)
    context_id = models.BigIntegerField(null=True, default=None)
    _context_type_enum = Choices('structure_id', 'station_id', 'market_transaction_id', 'character_id',
                                 'corporation_id', 'alliance_id', 'eve_system', 'industry_job_id',
                                 'contract_id', 'planet_id', 'system_id', 'type_id')
    context_id_type = models.CharField(
        max_length=30, choices=_context_type_enum, null=True, default=None)
    date = models.DateTimeField()
    description = models.CharField(max_length=500)
    first_party_id = models.IntegerField(null=True, default=None)
    entry_id = models.BigIntegerField()
    reason = models.CharField(max_length=500, null=True, default=None)
    ref_type = models.CharField(max_length=72)
    second_party_id = models.IntegerField(null=True, default=None)
    tax = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, default=None)
    tax_receiver_id = models.IntegerField(null=True, default=None)

    class Meta:
        abstract = True


class CorporationWalletDivision(models.Model):
    corporation = models.ForeignKey(
        CorporationAudit, on_delete=models.CASCADE, related_name='corporation_division')
    name = models.CharField(max_length=100, null=True, default=None)
    balance = models.DecimalField(max_digits=20, decimal_places=2)
    division = models.IntegerField()


class CorporationWalletJournalEntry(WalletJournalEntry):
    division = models.ForeignKey(
        CorporationWalletDivision, on_delete=models.CASCADE)
    first_party_name = models.ForeignKey(
        EveName, on_delete=models.SET_NULL, null=True, default=None, related_name='corp_first_party')
    second_party_name = models.ForeignKey(
        EveName, on_delete=models.SET_NULL, null=True, default=None, related_name='corp_second_party')

    def __str__(self):
        return "{} '{}' {}: {}isk".format(
            self.first_party_name.name,
            self.ref_type,
            self.second_party_name.name,
            self.amount
        )

    @classmethod
    def get_visible(cls, user):
        corps_vis = CorporationAudit.objects.visible_to(user)
        if user.has_perm("corptools.holding_corp_wallets"):
            corps_holding = CorptoolsConfiguration.objects.get(
                id=1).holding_corp_qs()
            corps_vis = corps_vis | corps_holding

        return cls.objects.filter(division__corporation__in=corps_vis)


class CharacterWalletJournalEntry(WalletJournalEntry):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    first_party_name = models.ForeignKey(
        EveName, on_delete=models.SET_NULL, null=True, default=None, related_name='char_first_party')
    second_party_name = models.ForeignKey(
        EveName, on_delete=models.SET_NULL, null=True, default=None, related_name='char_second_party')

# Market Models


class MarketOrder(models.Model):
    order_id = models.BigIntegerField(primary_key=True)

    duration = models.IntegerField()
    escrow = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, default=None)
    is_buy_order = models.BooleanField(null=True, default=None)
    issued = models.DateTimeField()
    location_id = models.BigIntegerField()
    location_name = models.ForeignKey(
        EveLocation, on_delete=models.SET_NULL, null=True, default=None)

    min_volume = models.IntegerField(null=True, default=None)
    price = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, default=None)
    _range_enum = Choices('1', '10', '2', '20', '3', '30',
                          '4', '40', '5', 'region', 'solarsystem', 'station')
    order_range = models.CharField(max_length=30, choices=_range_enum)
    region_id = models.IntegerField()
    region_name = models.ForeignKey(
        MapRegion, on_delete=models.SET_NULL, null=True, default=None)
    type_id = models.IntegerField()
    type_name = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None)
    volume_remain = models.IntegerField()
    volume_total = models.IntegerField()

    _state_enum = Choices('cancelled', 'expired', 'active')
    state = models.CharField(max_length=30, choices=_state_enum)

    class Meta:
        abstract = True


class CorporationMarketOrder(MarketOrder):
    wallet_division = models.ForeignKey(
        CorporationWalletDivision, on_delete=models.CASCADE)
    issued_by = models.IntegerField()


class CharacterMarketOrder(MarketOrder):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    is_corporation = models.BooleanField()

# ************************ Fit Models


class SkillList(models.Model):
    last_update = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=500, null=True, default=None)
    skill_list = models.TextField(
        null=True, default="", validators=[validators.valid_json])
    show_on_audit = models.BooleanField(default=True)
    order_weight = models.IntegerField(default=0)

    def get_skills(self):
        return json.loads(self.skill_list)

    def __str__(self):
        return "({}){} (Updated: {})".format(self.order_weight, self.name, self.last_update.strftime("%Y-%m-%d %H:%M:%S"))

# ************************ Corp Models
# Structure models


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
        except:
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
            corps_holding = CorptoolsConfiguration.objects.get(
                id=1).holding_corp_qs()
            corps_vis = corps_vis | corps_holding

        return cls.objects.filter(corporation__in=corps_vis)


class StructureService(models.Model):
    structure = models.ForeignKey(Structure, on_delete=models.CASCADE)

    name = models.CharField(max_length=100)
    _state_enum = Choices('online', 'offline', 'cleanup')
    state = models.CharField(max_length=8, choices=_state_enum)


# Market History ( GMetrics )


class OrePrice(models.Model):
    item = models.ForeignKey(EveItemType, on_delete=models.DO_NOTHING)
    price = models.DecimalField(max_digits=20, decimal_places=2)
    last_update = models.DateTimeField(auto_now=True)

# tax rates History


class OreTax(models.Model):
    item = models.ForeignKey(EveItemType, on_delete=models.DO_NOTHING)
    price = models.DecimalField(max_digits=20, decimal_places=2)
    last_update = models.DateTimeField(auto_now=True)


class OreTaxRates(models.Model):
    tag = models.CharField(max_length=500, default="Mining Tax")
    refine_rate = models.DecimalField(
        max_digits=5, decimal_places=2, default=87.5)
    ore_rate = models.DecimalField(max_digits=5, decimal_places=2)  # normal
    ubiquitous_rate = models.DecimalField(
        max_digits=5, decimal_places=2)  # ubiq
    common_rate = models.DecimalField(max_digits=5, decimal_places=2)  # comon
    uncommon_rate = models.DecimalField(
        max_digits=5, decimal_places=2)  # uncom
    rare_rate = models.DecimalField(max_digits=5, decimal_places=2)  # rare
    excptional_rate = models.DecimalField(
        max_digits=5, decimal_places=2)  # best


class NotificationText(models.Model):
    notification_id = models.BigIntegerField(primary_key=True)
    notification_text = models.TextField(null=True, default=None)


class Notification(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    notification_id = models.BigIntegerField()
    sender_id = models.IntegerField()
    _type_enum = Choices('character', 'corporation',
                         'alliance', 'faction', 'other')
    sender_type = models.CharField(max_length=15, choices=_type_enum)
    timestamp = models.DateTimeField()
    notification_type = models.CharField(max_length=50)
    is_read = models.BooleanField(null=True, default=None)
    notification_text = models.ForeignKey(
        NotificationText, on_delete=models.CASCADE, blank=True, null=True, default=None)

    class Meta:
        indexes = (
            models.Index(fields=['timestamp']),
            models.Index(fields=['notification_type'])
        )


class MailLabel(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    label_id = models.IntegerField(default=None)
    label_name = models.CharField(max_length=255, null=True, default=None)
    label_color = models.CharField(max_length=7, null=True, default=None)
    unread_count = models.IntegerField(null=True, default=None)


class MailRecipient(models.Model):
    recipient_id = models.BigIntegerField(primary_key=True, unique=True)
    recipient_name = models.ForeignKey(
        EveName, on_delete=models.SET_NULL, null=True, default=None)
    _recipient_enum = Choices('alliance', 'character',
                              'corporation', 'mailing_list')
    recipient_type = models.CharField(max_length=15, choices=_recipient_enum)


class MailMessage(models.Model):
    id_key = models.BigIntegerField(primary_key=True, unique=True)
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    # headers
    mail_id = models.IntegerField(null=True, default=None)
    from_id = models.IntegerField(null=True, default=None)
    from_name = models.ForeignKey(
        EveName, on_delete=models.SET_NULL, null=True, default=None)

    recipients = models.ManyToManyField(MailRecipient)
    labels = models.ManyToManyField(MailLabel)
    is_read = models.BooleanField(null=True, default=False)
    timestamp = models.DateTimeField(null=True, default=None)

    # message
    subject = models.CharField(max_length=255, null=True, default=None)
    body = models.CharField(max_length=12000, null=True, default=None)


class CharacterTitle(models.Model):
    title_id = models.IntegerField()
    title = models.CharField(max_length=500)
    corporation_id = models.BigIntegerField()
    corporation_name = models.CharField(max_length=500)

    def __str__(self):
        return f"({self.corporation_name}) - {self.title}"


class CharacterRoles(models.Model):
    character = models.OneToOneField(CharacterAudit, on_delete=models.CASCADE)

    director = models.BooleanField(default=False)
    accountant = models.BooleanField(default=False)
    station_manager = models.BooleanField(default=False)
    personnel_manager = models.BooleanField(default=False)

    titles = models.ManyToManyField(CharacterTitle)


# Contacts Models
class Contact(models.Model):
    id = models.BigIntegerField(primary_key=True)
    contact_id = models.BigIntegerField()
    contact_type = models.CharField(max_length=255, null=False)
    contact_name = models.ForeignKey(EveName, on_delete=models.CASCADE)
    standing = models.DecimalField(max_digits=4, decimal_places=2)

    class Meta:
        abstract = True


class ContactLabel(models.Model):
    id = models.BigIntegerField(primary_key=True)
    label_id = models.BigIntegerField()
    label_name = models.CharField(max_length=255, null=False)

    class Meta:
        abstract = True


class CharacterContactLabel(ContactLabel):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    def build_id(self):
        self.id = int(str(self.character_id)+str(self.label_id))
        return self.id


class CorporationContactLabel(ContactLabel):
    corporation = models.ForeignKey(CorporationAudit, on_delete=models.CASCADE)


class CharacterContact(Contact):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    blocked = models.BooleanField(default=False)
    watched = models.BooleanField(default=False)
    labels = models.ManyToManyField(CharacterContactLabel)

    def build_id(self):
        self.id = int(str(self.character_id)+str(self.contact_id))
        return self.id


class CorporationContact(Contact):
    corporation = models.ForeignKey(CorporationAudit, on_delete=models.CASCADE)
    watched = models.BooleanField(default=False)
    labels = models.ManyToManyField(CorporationContactLabel)


# sec group classes


class FilterBase(models.Model):

    name = models.CharField(max_length=500)
    description = models.CharField(max_length=500)

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.name}: {self.description}"

    def process_filter(self, user: User):
        raise NotImplementedError("Please Create a filter!")


class FullyLoadedFilter(FilterBase):
    reversed_logic = models.BooleanField(
        default=False, help_text="If set all members WITHOUT audit fully loaded will pass the test.")

    class Meta:
        verbose_name = "Smart Filter: Audit Fully Loaded"
        verbose_name_plural = verbose_name

    def process_filter(self, user: User):
        logic = self.reversed_logic
        try:
            character_list = user.character_ownerships.all() \
                .select_related('character', 'character__characteraudit')

            character_count = character_list.filter(
                character__characteraudit__isnull=True).count()
            if character_count == 0:
                valid_audits = 0
                character_cnt = 0
                for c in character_list:
                    if c.character.characteraudit.is_active():
                        valid_audits += 1
                    character_cnt += 1
                if valid_audits == character_cnt:
                    return not logic
                else:
                    return logic
            else:
                return logic
        except Exception as e:
            logger.error(e, exc_info=1)
            return False

    def audit_filter(self, users):
        logic = self.reversed_logic
        co = CharacterOwnership.objects.filter(user__in=users).select_related(
            'user', 'character__characteraudit')
        chars = {}
        for c in co:
            if c.user.id not in chars:
                chars[c.user.id] = []
            try:
                if not c.character.characteraudit.is_active():
                    chars[c.user.id].append(c.character.character_name)
            except ObjectDoesNotExist:
                chars[c.user.id].append(c.character.character_name)

        output = defaultdict(lambda: {"message": "", "check": logic})
        for u in users:
            c = chars.get(u.id, False)
            if c is not False:
                if len(c) > 0:
                    output[u.id] = {"message": ", ".join(c), "check": logic}
                    continue
                else:
                    output[u.id] = {
                        "message": "All Characters Loaded", "check": not logic}
                    continue
            output[u.id] = {"message": "", "check": logic}
        return output


class TimeInCorpFilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: Main's Time in Corp"
        verbose_name_plural = verbose_name

    days_in_corp = models.IntegerField(default=30)

    def process_filter(self, user: User):
        try:
            main_character = user.profile.main_character.characteraudit
            histories = CorporationHistory.objects.filter(
                character=main_character).order_by('-start_date').first()

            days = timezone.now() - histories.start_date
            if days.days >= self.days_in_corp:
                return True
            else:
                return False
        except Exception as e:
            logger.error(e, exc_info=1)
            return False

    def audit_filter(self, users):
        co = users.annotate(
            max_timestamp=Max(
                'profile__main_character__characteraudit__corporationhistory__start_date')
        ).values("id", "max_timestamp")
        chars = defaultdict(lambda: None)
        for c in co:
            if c['max_timestamp']:
                days = timezone.now() - c['max_timestamp']
                days = days.days
            else:
                days = -1
            chars[c['id']] = days

        output = defaultdict(lambda: {"message": "", "check": False})
        for c, char_list in chars.items():
            if char_list >= self.days_in_corp:
                check = True
            else:
                check = False
            if char_list < 0:
                msg = "No Audit"
            else:
                msg = str(char_list) + " Days"
            output[c] = {"message": msg, "check": check}
        return output


class AssetsFilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: Assets in Locations"
        verbose_name_plural = verbose_name

    types = models.ManyToManyField(EveItemType, blank=True,
                                   help_text="Filter on Asset Types.")
    groups = models.ManyToManyField(EveItemGroup, blank=True,
                                    help_text="Filter on Asset Groups.")
    categories = models.ManyToManyField(EveItemCategory, blank=True,
                                        help_text="Filter on Asset Categories.")

    systems = models.ManyToManyField(MapSystem, blank=True,
                                     help_text="Limit filter to specific systems")
    constellations = models.ManyToManyField(MapConstellation, blank=True,
                                            help_text="Limit filter to specific constellations")
    regions = models.ManyToManyField(MapRegion, blank=True,
                                     help_text="Limit filter to specific regions")

    def filter_query(self, users):
        character_list = CharacterOwnership.objects.filter(user__in=users) \
            .select_related('character', 'character__characteraudit')
        cnt_types = self.types.all().count()
        cnt_groups = self.groups.all().count()
        cnt_cats = self.categories.all().count()

        character_count = CharacterAsset.objects.filter(
            character__character__in=character_list.values_list('character'))
        output = []

        if cnt_types > 0:
            output.append(models.Q(type_name__in=self.types.all()))

        if cnt_groups > 0:
            output.append(models.Q(type_name__group__in=self.groups.all()))

        if cnt_cats > 0:
            output.append(
                models.Q(type_name__group__category__in=self.categories.all()))

        if len(output) == 0:
            return False

        query = output.pop()
        for _q in output:
            query |= _q
        character_count = character_count.filter(query)

        output = []

        if self.systems.all().count() > 0:
            output.append(
                models.Q(location_name__system__in=self.systems.all()))
            output.append(models.Q(
                location_id__in=self.systems.all().values_list('system_id', flat=True)))
        if self.constellations.all().count() > 0:
            output.append(
                models.Q(location_name__system__constellation__in=self.constellations.all()))
            output.append(models.Q(location_id__in=MapSystem.objects.filter(
                constellation__in=self.constellations.all()).values_list('system_id', flat=True)))
        if self.regions.all().count() > 0:
            output.append(
                models.Q(location_name__system__constellation__region__in=self.regions.all()))
            output.append(models.Q(location_id__in=MapSystem.objects.filter(
                constellation__region__in=self.regions.all()).values_list('system_id', flat=True)))

        if len(output) > 0:
            query = output.pop()
            for _q in output:
                query |= _q
            character_count = character_count.filter(query)
        return character_count

    def process_filter(self, user: User):
        try:
            co = self.filter_query([user])
            # print(character_count.query)
            if co.count() > 0:
                return True
            else:
                return False
        except Exception as e:
            logger.error(e, exc_info=1)
            return False

    def audit_filter(self, users):
        co = self.filter_query(users).values("character__character__character_ownership__user",
                                             "type_name__name", "character__character__character_name")
        chars = defaultdict(dict)
        for c in co:
            uid = c["character__character__character_ownership__user"]
            char_name = c["character__character__character_name"]
            asset_type = c['type_name__name']
            if char_name not in chars[uid]:
                chars[uid][char_name] = []
            if asset_type not in chars[uid][char_name]:
                chars[uid][char_name].append(asset_type)

        output = defaultdict(lambda: {"message": "", "check": False})
        for u in users:

            if len(chars[u.id]) > 0:
                out_message = []
                for char, char_items in chars[u.id].items():
                    out_message.append(f"{char}: {', '.join(char_items)}")
                output[u.id] = {"message": "<br>".join(
                    out_message), "check": True}
            else:
                output[u.id] = {"message": "", "check": False}
        return output


class Skillfilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: Skill list checks"
        verbose_name_plural = verbose_name

    required_skill_lists = models.ManyToManyField(SkillList, blank=True)
    single_req_skill_lists = models.ManyToManyField(
        SkillList, blank=True, related_name="single_req")

    def process_filter(self, user: User):
        try:  # avatar 11567
            skills_list = providers.skills.get_and_cache_user(user.id)
            # print(skills_list)
            skill_lists = self.required_skill_lists.all()
            req_one = self.single_req_skill_lists.all()
            if skill_lists.count() == 0 and req_one.count() == 0:
                return False

            skill_list_base = {}
            for skl in skill_lists:
                skill_list_base[skl.name] = {}
                skill_list_base[skl.name]['pass'] = False

            if req_one.count() > 0:
                skill_list_single = {}
                for skl in req_one:
                    skill_list_single[skl.name] = {}
                    skill_list_single[skl.name]['pass'] = False

            skill_tables = skills_list.get("skills_list")

            for char in skill_tables:
                for d_name, d_list in skill_list_base.items():
                    if len(skill_tables[char]["doctrines"][d_name]) == 0:
                        skill_list_base[d_name]['pass'] = True
            if req_one.count() > 0:
                single_pass = False
                for char in skill_tables:
                    for d_name, d_list in skill_list_single.items():
                        if len(skill_tables[char]["doctrines"][d_name]) == 0:
                            single_pass = True
                            break

            result = True
            for skill_list, skills_result in skill_list_base.items():
                result = result and skills_result['pass']
            if req_one.count() > 0:
                return result and single_pass
            else:
                return result

        except Exception as e:
            print(e)
            logger.error(e, exc_info=1)
            return False

    def audit_filter(self, users):
        output = defaultdict(lambda: {"message": "No Data", "check": False})
        accounts = providers.skills.get_and_cache_users(users)
        for uid, u in accounts.items():
            message = []
            # print(skills_list)
            skill_lists = self.required_skill_lists.all()
            req_one = self.single_req_skill_lists.all()
            if skill_lists.count() == 0 and req_one.count() == 0:
                return False

            skill_list_base = {}
            for skl in skill_lists:
                skill_list_base[skl.name] = {}
                skill_list_base[skl.name]['pass'] = False

            if req_one.count() > 0:
                skill_list_single = {}
                for skl in req_one:
                    skill_list_single[skl.name] = {}
                    skill_list_single[skl.name]['pass'] = False

            try:
                skill_tables = u['data'].get("skills_list")

                for char in skill_tables:
                    for d_name, d_list in skill_list_base.items():
                        if len(skill_tables[char]["doctrines"][d_name]) == 0:
                            skill_list_base[d_name]['pass'] = True
                            message.append("{}:{}".format(char, d_name))

                if req_one.count() > 0:
                    single_pass = False
                    for char in skill_tables:
                        for d_name, d_list in skill_list_single.items():
                            if len(skill_tables[char]["doctrines"][d_name]) == 0:
                                single_pass = True
                                message.append("{}:{}".format(char, d_name))
                                break

                result = True
                for skill_list, skills_result in skill_list_base.items():
                    result = result and skills_result['pass']
                if req_one.count() > 0:
                    output[uid] = {'check': result and single_pass,
                                   'message': "<br>".join(message)}
                else:
                    output[uid] = {'check': result,
                                   'message': "<br>".join(message)}
            except KeyError:
                pass

        return output


class Rolefilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: Corporate Role checks"
        verbose_name_plural = verbose_name

    has_director = models.BooleanField(default=False)
    has_accountant = models.BooleanField(default=False)
    has_station_manager = models.BooleanField(default=False)
    has_personnel_manager = models.BooleanField(default=False)

    #main_only = models.BooleanField(default=False)

    corp_filter = models.ForeignKey(
        EveCorporationInfo, on_delete=models.CASCADE, related_name='audit_role_filter', null=True, blank=True, default=None)
    alliance_filter = models.ForeignKey(
        EveAllianceInfo, on_delete=models.CASCADE, related_name='audit_role_filter', null=True, blank=True, default=None)

    def process_filter(self, user: User):
        try:
            characters = user.character_ownerships.all()
            queries = []
            if self.corp_filter:
                characters = characters.filter(
                    character__corporation_id=self.corp_filter.corporation_id)
            if self.alliance_filter:
                characters = characters.filter(
                    character__alliance_id=self.alliance_filter.alliance_id)
            if self.has_director:
                _q = models.Q(
                    character__characteraudit__characterroles__director=True)
                queries.append(_q)
            if self.has_accountant:
                _q = models.Q(
                    character__characteraudit__characterroles__accountant=True)
                queries.append(_q)
            if self.has_station_manager:
                _q = models.Q(
                    character__characteraudit__characterroles__station_manager=True)
                queries.append(_q)
            if self.has_personnel_manager:
                _q = models.Q(
                    character__characteraudit__characterroles__personnel_manager=True)
                queries.append(_q)
            query = queries.pop()
            for q in queries:
                query |= q
            if characters.filter(query).exists():
                return True
            else:
                return False
        except Exception as e:
            logger.error(e, exc_info=1)
            return False

    def audit_filter(self, users):

        co = CharacterOwnership.objects.filter(user__in=users)
        queries = []
        if self.corp_filter:
            co = co.filter(
                character__corporation_id=self.corp_filter.corporation_id)
        if self.alliance_filter:
            co = co.filter(
                character__alliance_id=self.alliance_filter.alliance_id)
        if self.has_director:
            _q = models.Q(
                character__characteraudit__characterroles__director=True)
            queries.append(_q)
        if self.has_accountant:
            _q = models.Q(
                character__characteraudit__characterroles__accountant=True)
            queries.append(_q)
        if self.has_station_manager:
            _q = models.Q(
                character__characteraudit__characterroles__station_manager=True)
            queries.append(_q)
        if self.has_personnel_manager:
            _q = models.Q(
                character__characteraudit__characterroles__personnel_manager=True)
            queries.append(_q)
        query = queries.pop()
        for q in queries:
            query |= q

        co = co.filter(query)

        chars = {}
        for c in co:
            if c.user.id not in chars:
                chars[c.user.id] = []
            chars[c.user.id].append(c.character.character_name)

        output = defaultdict(lambda: {"message": "", "check": False})
        for u in users:
            c = chars.get(u.id, False)
            if c is not False:
                if len(c) > 0:
                    output[u.id] = {"message": ", ".join(c), "check": True}
                    continue
                else:
                    output[u.id] = {"message": "", "check": False}
                    continue
            output[u.id] = {"message": "", "check": False}
        return output


class Titlefilter(FilterBase):
    class Meta:
        verbose_name = "Smart Filter: Corporate Title checks"
        verbose_name_plural = verbose_name

    titles = models.ForeignKey(
        CharacterTitle, on_delete=models.CASCADE)

    def process_filter(self, user: User):
        try:
            characters = user.character_ownerships.all()

            if characters.filter(character__characteraudit__characterroles__titles__in=[self.titles]).exists():
                return True
            else:
                return False
        except Exception as e:
            logger.error(e, exc_info=1)
            return False

    def audit_filter(self, users):
        co = CharacterOwnership.objects.filter(user__in=users,
                                               character__characteraudit__characterroles__titles__in=[self.titles])

        chars = {}
        for c in co:
            if c.user.id not in chars:
                chars[c.user.id] = []
            chars[c.user.id].append(c.character.character_name)

        output = defaultdict(lambda: {"message": "", "check": False})
        for u in users:
            c = chars.get(u.id, False)
            if c is not False:
                if len(c) > 0:
                    output[u.id] = {"message": ", ".join(c), "check": True}
                    continue
                else:
                    output[u.id] = {"message": "", "check": False}
                    continue
            output[u.id] = {"message": "", "check": False}
        return output
