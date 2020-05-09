import logging
import os

from allianceauth.authentication.models import CharacterOwnership, UserProfile
from bravado.exception import HTTPForbidden
from django.db import models
from django.core.exceptions import ObjectDoesNotExist

from esi.errors import TokenError
from esi.models import Token
from allianceauth.eveonline.models import EveCorporationInfo, EveCharacter
from allianceauth.notifications import notify

from .managers import EveNameManager

from model_utils import Choices

logger = logging.getLogger(__name__)

class CharacterAudit(models.Model):
    character = models.OneToOneField(EveCharacter, on_delete=models.CASCADE)

    last_update_pub_data = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_pub_data = models.DateTimeField(null=True, default=None, blank=True)

    last_update_skills = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_skills = models.DateTimeField(null=True, default=None, blank=True)

    last_update_clones = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_clones = models.DateTimeField(null=True, default=None, blank=True)

    last_update_assets = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_assets = models.DateTimeField(null=True, default=None, blank=True)

    def __str__(self):
        return "{}'s Character Data".format(self.character.character_name)

    class Meta:
        permissions = (('corp_hr', 'Can access other character\'s data for own corp.'),
                       ('alliance_hr', 'Can access other character\'s data for own alliance.'),
                       ('state_hr', 'Can access other character\'s data for own state.'),
                       ('global_hr', 'Can access other character\'s data for characters in any corp/alliance/state.'))

class CorporationAudit(models.Model):
    corporation = models.OneToOneField(EveCorporationInfo, on_delete=models.CASCADE)

    last_update_pub_data = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_pub_data = models.DateTimeField(null=True, default=None, blank=True)

    last_update_assets = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_assets = models.DateTimeField(null=True, default=None, blank=True)

    last_update_structures = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_structures = models.DateTimeField(null=True, default=None, blank=True)

    last_update_moons = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_moons = models.DateTimeField(null=True, default=None, blank=True)

    last_update_observers = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_observers = models.DateTimeField(null=True, default=None, blank=True)

    class Meta:
        permissions = (
                       ('alliance_corp_manager', 'Can access other corporations\'s data for own alliance.'),
                       ('state_corp_manager', 'Can access other corporations\'s data for own state.'),
                       ('global_corp_manager', 'Can access all corporations\'s data.'))

# ************************ Helper Models
# Eve Item Type

class EveItemCategory(models.Model):
    category_id = models.BigIntegerField(primary_key=True) 
    name = models.CharField(max_length=255) # unknown max

class EveItemGroup(models.Model):
    group_id = models.BigIntegerField(primary_key=True) 
    name = models.CharField(max_length=255) # unknown max
    category = models.ForeignKey(EveItemCategory, on_delete=models.SET_NULL, null=True, default=None)    

class EveItemType(models.Model):
    type_id = models.BigIntegerField(primary_key=True) 
    name = models.CharField(max_length=255) # unknown max
    group = models.ForeignKey(EveItemGroup, on_delete=models.SET_NULL, null=True, default=None)    
    description = models.TextField(null=True, default=None)
    mass = models.FloatField(null=True, default=None)
    packaged_volume = models.FloatField(null=True, default=None)
    portion_size = models.FloatField(null=True, default=None)
    volume = models.FloatField(null=True, default=None)
    published = models.BooleanField()
    radius = models.FloatField(null=True, default=None)

class InvTypeMaterials(models.Model):
    qty = models.IntegerField()
    eve_type = models.ForeignKey(EveItemType, on_delete=models.SET_NULL, null=True, default=None)
    type_id = models.IntegerField()
    material_type_id = models.IntegerField()


# Name Class
class EveName(models.Model):
    objects = EveNameManager()
    
    eve_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50)

    #optionals for character/corp
    corporation = models.ForeignKey('EveName', on_delete=models.SET_NULL, null=True, default=None, related_name="corp")
    alliance = models.ForeignKey('EveName', on_delete=models.SET_NULL, null=True, default=None, related_name="alli")
    last_update = models.DateTimeField(auto_now=True)

    CHARACTER = "character"
    CORPORATION = "corporation"
    ALLIANCE = "alliance"

class MapRegion(models.Model):
    region_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, default=None, )

class MapConstellation(models.Model):
    constellation_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    region = models.ForeignKey(MapRegion, on_delete=models.SET_NULL, null=True, default=None)

class MapSystem(models.Model):
    system_id = models.BigIntegerField(primary_key=True)
    security_status = models.FloatField()
    name = models.CharField(max_length=255)
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
    security_class = models.CharField(max_length=255, null=True, default=None)
    star_id = models.IntegerField(null=True, default=None)
    constellation = models.ForeignKey(MapConstellation, on_delete=models.SET_NULL, null=True, default=None)

# ************************ Asset Models
class Asset(models.Model):
    blueprint_copy = models.NullBooleanField(default=None)
    singleton = models.BooleanField()
    item_id = models.BigIntegerField(unique=True)
    location_flag = models.CharField(max_length=50)
    location_id = models.BigIntegerField()
    location_type = models.CharField(max_length=25)
    quantity = models.IntegerField()
    type_id = models.IntegerField()

    #extra's
    name = models.CharField(max_length=255, null=True, default=None)

    class Meta:
        abstract = True

class CorpAsset(Asset):
    corporation = models.ForeignKey(CorporationAudit, on_delete=models.CASCADE)

    def __str__(self):
        return '{2} {0}x{1} ({3} / {4})'.format(self.type_id, self.quantity, self.corporation,
                                                self.location_id, self.location_type)

class CharacterAsset(Asset):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    def __str__(self):
        return '{2} {0}x{1} ({3} / {4})'.format(self.type_id, self.quantity, self.character,
                                                self.location_id, self.location_type)

# ************************ Character Models
# Character Skill
class Skill(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    skill_id = models.IntegerField()
    active_skill_level = models.IntegerField()
    skillpoints_in_skill = models.BigIntegerField()
    trained_skill_level = models.IntegerField()

    @property
    def alpha(self):
        if self.trained_skill_level == self.active_skill_level:
            return False
        return True  # is alpha clone 


# Skill Queue Model
class SkillQueue(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    # Required Fields / Fields Always Present
    finish_level = models.IntegerField()
    queue_position = models.IntegerField()
    skill_id = models.IntegerField()
    skill_name = models.ForeignKey(EveItemType, on_delete=models.CASCADE) 

    # Fields that may or may not be present
    finish_date = models.DateTimeField(null=True, default=None)
    level_end_sp = models.IntegerField(null=True, default=None)
    level_start_sp = models.IntegerField(null=True, default=None)
    start_date = models.DateTimeField(null=True, default=None)
    training_start_sp = models.IntegerField(null=True, default=None)

    @property
    def sp_hour(self):
        return 0 # do some math

# Corporation history
class CorporationHistory(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    corporation_id = models.IntegerField()
    corporation_name = models.ForeignKey(EveName, on_delete=models.CASCADE)
    is_deleted = models.NullBooleanField(null=True, default=None)
    record_id = models.IntegerField()
    start_date = models.DateTimeField()


# ************************ Corp Models
# Structure models 
class StructureCelestial(models.Model):
    structure_id = models.BigIntegerField()
    celestial_name = models.CharField(max_length=500, null=True, default=None)


class Structure(models.Model):
    corporation = models.ForeignKey(CorporationAudit, on_delete=models.CASCADE, related_name='ct_structure')

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

    #extra
    name = models.CharField(max_length=150)
    system_name = models.ForeignKey(MapSystem, on_delete=models.SET_NULL, null=True, default=None)
    type_name = models.ForeignKey(EveItemType, on_delete=models.SET_NULL, null=True, default=None)
    closest_celestial = models.ForeignKey(StructureCelestial, on_delete=models.SET_NULL, null=True, default=None)

    @property
    def services(self):
        return StructureService.objects.filter(structure=self)

    @property
    def ozone_level(self):
        try:
            last_ozone = BridgeOzoneLevel.objects.filter(station_id=self.structure_id).order_by('-date')[:1][0].quantity
            return last_ozone
        except:
            return False


class StructureService(models.Model):
    structure = models.ForeignKey(Structure, on_delete=models.CASCADE)

    name = models.CharField(max_length=100)
    _state_enum = Choices('online', 'offline', 'cleanup')
    state = models.CharField(max_length=8, choices=_state_enum)

# Moon Models

class MiningTaxPaymentCorp(models.Model):
    corp = models.ForeignKey(EveCorporationInfo, on_delete=models.CASCADE, related_name='payment_corp_mining_tax')

    def __str__(self):
        return "Moon Payments are sent to: {0}".format(self.corp.corporation_name)

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
    tag = models.CharField(max_length=500, default="")
    refine_rate = models.DecimalField(max_digits=5, decimal_places=2, default=87.5)
    r0 = models.DecimalField(max_digits=5, decimal_places=2)
    r4 = models.DecimalField(max_digits=5, decimal_places=2)
    r8 = models.DecimalField(max_digits=5, decimal_places=2)
    r16 = models.DecimalField(max_digits=5, decimal_places=2)
    r32 = models.DecimalField(max_digits=5, decimal_places=2)
    r64 = models.DecimalField(max_digits=5, decimal_places=2)


class MiningTax(models.Model):
    corp = models.ForeignKey(EveCorporationInfo, on_delete=models.CASCADE, related_name='corp_mining_tax')
    tax_rate = models.ForeignKey(OreTaxRates, on_delete=models.CASCADE)
    region = models.CharField(max_length=50, null=True, default=None, blank=True)
    constellation = models.CharField(max_length=50, null=True, default=None, blank=True)
    system = models.CharField(max_length=50, null=True, default=None, blank=True)
    moon = models.CharField(max_length=50, null=True, default=None, blank=True)
    rank = models.IntegerField(default=0, null=True, blank=True)
    use_variable_tax = models.BooleanField(default=False)

    def __str__(self):
        area = "Everywhere"
        if self.region:
            area = self.region
        elif self.constellation:
            area = self.constellation
        elif self.system:
            area = self.system
        elif self.moon:
            area = self.moon
        #return "#{3}: Mining Tax of {0}% for {1}: {2}".format(self.tax_rate*100, self.corp, area, self.rank)
        return "{2}".format(self.tax_rate*100, self.corp, area, self.rank)
