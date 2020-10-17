import logging
import os
import json
import datetime

from allianceauth.authentication.models import CharacterOwnership, UserProfile
from bravado.exception import HTTPForbidden
from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

from esi.errors import TokenError
from esi.models import Token
from allianceauth.eveonline.models import EveCorporationInfo, EveCharacter
from allianceauth.notifications import notify

from .managers import EveNameManager, EveItemTypeManager, EveGroupManager, EveCategoryManager, AuditCharacterManager

from model_utils import Choices

logger = logging.getLogger(__name__)

MAX_INACTIVE_DAYS = 3

class CharacterAudit(models.Model):

    objects = AuditCharacterManager()
    
    active = models.BooleanField(default=False)

    character = models.OneToOneField(EveCharacter, on_delete=models.CASCADE)

    last_update_pub_data = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_pub_data = models.DateTimeField(null=True, default=None, blank=True)

    last_update_skills = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_skills = models.DateTimeField(null=True, default=None, blank=True)

    last_update_skill_que = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_skill_que = models.DateTimeField(null=True, default=None, blank=True)

    last_update_clones = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_clones = models.DateTimeField(null=True, default=None, blank=True)

    last_update_assets = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_assets = models.DateTimeField(null=True, default=None, blank=True)

    last_update_wallet = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_wallet = models.DateTimeField(null=True, default=None, blank=True)

    last_update_notif = models.DateTimeField(null=True, default=None, blank=True)
    cache_expire_notif = models.DateTimeField(null=True, default=None, blank=True)

    balance = models.DecimalField(max_digits=20, decimal_places=2, null=True, default=None)

    def __str__(self):
        return "{}'s Character Data".format(self.character.character_name)

    class Meta:
        permissions = (('corp_hr', 'Can access other character\'s data for own corp.'),
                       ('alliance_hr', 'Can access other character\'s data for own alliance.'),
                       ('state_hr', 'Can access other character\'s data for own state.'),
                       ('global_hr', 'Can access other character\'s data for characters in any corp/alliance/state.'))

    def is_active(self):
        time_ref = timezone.now() - datetime.timedelta(days=MAX_INACTIVE_DAYS)
        try:
            assets = self.last_update_assets > time_ref
            clones = self.last_update_clones > time_ref
            skills = self.last_update_skills > time_ref
            skillq = self.last_update_skill_que > time_ref
            pubdat = self.last_update_pub_data > time_ref
            wallet = self.last_update_wallet > time_ref

            is_active = ( assets and clones and skills and skillq and pubdat and wallet )
            
            if self.active != is_active:
                self.active = is_active
                self.save()

            return is_active
        except:
            return False

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

    def __str__(self):
        return "{}'s Corporation Data".format(self.corporation.corporation_name)

    class Meta:
        permissions = (
                       ('alliance_corp_manager', 'Can access other corporations\'s data for own alliance.'),
                       ('state_corp_manager', 'Can access other corporations\'s data for own state.'),
                       ('global_corp_manager', 'Can access all corporations\'s data.'))

# ************************ Helper Models
# Eve Item Type


class EveItemCategory(models.Model):
    objects = EveCategoryManager()
    category_id = models.BigIntegerField(primary_key=True) 
    name = models.CharField(max_length=255) # unknown max

class EveItemGroup(models.Model):
    objects = EveGroupManager()
    group_id = models.BigIntegerField(primary_key=True) 
    name = models.CharField(max_length=255) # unknown max
    category = models.ForeignKey(EveItemCategory, on_delete=models.SET_NULL, null=True, default=None)    

class EveItemType(models.Model):
    objects = EveItemTypeManager()
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

class EveItemDogmaAttribute(models.Model):
    eve_type = models.ForeignKey(EveItemType, on_delete=models.SET_NULL, null=True, default=None)
    attribute_id = models.BigIntegerField(null=True, default=None) 
    value = models.FloatField(null=True, default=None)

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

    def __str__(self):
        return self.name

class MapRegion(models.Model):
    region_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, default=None, )

    def __str__(self):
        return self.name

class MapConstellation(models.Model):
    constellation_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    region = models.ForeignKey(MapRegion, on_delete=models.SET_NULL, null=True, default=None)

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
    constellation = models.ForeignKey(MapConstellation, on_delete=models.SET_NULL, null=True, default=None)

    def __str__(self):
        return self.name

class MapSystemGate(models.Model):
    from_solar_system = models.ForeignKey(MapSystem, on_delete=models.CASCADE, related_name="from_system")
    to_solar_system = models.ForeignKey(MapSystem, on_delete=models.CASCADE, related_name="to_system")

    def __str__(self):
        return (self.from_solar_system_id, self.to_solar_system_id)

class MapSystemPlanet(models.Model):
    planet_id = models.IntegerField(primary_key=True)
    system = models.ForeignKey(MapSystem, on_delete=models.CASCADE, related_name="planet")
    name = models.CharField(max_length=255)

    x = models.FloatField() 
    y = models.FloatField()
    z = models.FloatField()

    eve_type = models.ForeignKey(EveItemType, on_delete=models.SET_NULL, null=True, default=None)

    def __str__(self):
        return (self.name)

class MapSystemMoon(models.Model):
    moon_id = models.IntegerField(primary_key=True)
    system = models.ForeignKey(MapSystem, on_delete=models.CASCADE, related_name="planet")
    name = models.CharField(max_length=255)

    x = models.FloatField() 
    y = models.FloatField()
    z = models.FloatField()

    def __str__(self):
        return (self.name)

class MapJumpBridge(models.Model):
    structure_id = models.BigIntegerField(primary_key=True)
    from_solar_system = models.ForeignKey(MapSystem, on_delete=models.CASCADE, related_name="bridge_from_system")
    to_solar_system = models.ForeignKey(MapSystem, on_delete=models.CASCADE, related_name="bridge_to_system")
    owner = models.ForeignKey(EveName, on_delete=models.SET_NULL, null=True, default=None)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.from_solar_system.name} >> {self.to_solar_system.name} ({self.structure_id})"
        
# ************************ Asset Models
class EveLocation(models.Model):
    location_id = models.BigIntegerField(primary_key=True)
    location_name = models.CharField(max_length=255)
    system = models.ForeignKey(MapSystem, on_delete=models.SET_NULL, null=True, default=None)
    last_update = models.DateTimeField(auto_now=True)

class Asset(models.Model):
    blueprint_copy = models.NullBooleanField(default=None)
    singleton = models.BooleanField()
    item_id = models.BigIntegerField()
    location_flag = models.CharField(max_length=50)
    location_id = models.BigIntegerField()
    location_type = models.CharField(max_length=25)
    quantity = models.IntegerField()
    type_id = models.IntegerField()
    type_name = models.ForeignKey(EveItemType, on_delete=models.SET_NULL, null=True, default=None) 
    location_name = models.ForeignKey(EveLocation, on_delete=models.SET_NULL, null=True, default=None) 

    #extra's
    name = models.CharField(max_length=255, null=True, default=None)

    class Meta:
        abstract = True
        indexes = [
            models.Index(fields=['location_id']),
            models.Index(fields=['type_id']),
            models.Index(fields=['item_id']),
        ]

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
class SkillTotals(models.Model):
    character = models.OneToOneField(CharacterAudit, on_delete=models.CASCADE)

    total_sp = models.BigIntegerField()
    unallocated_sp = models.IntegerField(null=True, default=None)

class Skill(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    skill_id = models.IntegerField()
    skill_name = models.ForeignKey(EveItemType, on_delete=models.CASCADE, null=True, default=None) 
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
    skill_name = models.ForeignKey(EveItemType, on_delete=models.CASCADE, null=True, default=None) 

    # Fields that may or may not be present
    finish_date = models.DateTimeField(null=True, default=None)
    level_end_sp = models.IntegerField(null=True, default=None)
    level_start_sp = models.IntegerField(null=True, default=None)
    start_date = models.DateTimeField(null=True, default=None)
    training_start_sp = models.IntegerField(null=True, default=None)

    @property
    def sp_hour(self):
        return -1 # do some math

# Corporation history
class CorporationHistory(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    corporation_id = models.IntegerField()
    corporation_name = models.ForeignKey(EveName, on_delete=models.CASCADE)
    is_deleted = models.NullBooleanField(null=True, default=None)
    record_id = models.IntegerField()
    start_date = models.DateTimeField()

# Clone Models
class Clone(models.Model):
    character = models.OneToOneField(CharacterAudit, on_delete=models.CASCADE)

    last_clone_jump_date = models.DateTimeField(null=True, default=None)
    last_station_change_date = models.DateTimeField(null=True, default=None)
    location_id = models.BigIntegerField()
    location_name = models.ForeignKey(EveLocation, on_delete=models.SET_NULL, null=True, default=None) 
    _type_enum = Choices('station', 'structure')
    location_type = models.CharField(max_length=9, choices=_type_enum)

# Clone Models
class JumpClone(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    jump_clone_id = models.IntegerField(null=True, default=None)
    location_id = models.BigIntegerField(null=True, default=None)
    location_name = models.ForeignKey(EveLocation, on_delete=models.SET_NULL, null=True, default=None) 
    _type_enum = Choices('station', 'structure')
    location_type = models.CharField(max_length=9, choices=_type_enum, null=True, default=None)
    name = models.CharField(max_length=255, null=True, default=None)

# Implant Model
class Implant(models.Model):
    clone = models.ForeignKey(JumpClone, on_delete=models.CASCADE)
    type_name = models.ForeignKey(EveItemType, on_delete=models.SET_NULL, null=True, default=None) 

# ************************ Wallet Models 
class WalletJournalEntry(models.Model):
    amount = models.DecimalField(max_digits=20, decimal_places=2, null=True, default=None)
    balance = models.DecimalField(max_digits=20, decimal_places=2, null=True, default=None)
    context_id = models.BigIntegerField(null=True, default=None)
    _context_type_enum = Choices('structure_id', 'station_id', 'market_transaction_id', 'character_id',
                                 'corporation_id', 'alliance_id', 'eve_system', 'industry_job_id',
                                 'contract_id', 'planet_id', 'system_id', 'type_id')
    context_id_type = models.CharField(max_length=30, choices=_context_type_enum, null=True, default=None)
    date = models.DateTimeField()
    description = models.CharField(max_length=500)
    first_party_id = models.IntegerField(null=True, default=None)
    entry_id = models.BigIntegerField()
    reason = models.CharField(max_length=500, null=True, default=None)
    ref_type = models.CharField(max_length=72)
    second_party_id = models.IntegerField(null=True, default=None)
    tax = models.DecimalField(max_digits=20, decimal_places=2, null=True, default=None)
    tax_receiver_id = models.IntegerField(null=True, default=None)

    class Meta:
        abstract = True

class CorporationWalletDivision(models.Model):
    corporation = models.ForeignKey(CorporationAudit, on_delete=models.CASCADE, related_name='corporation_division')
    name = models.CharField(max_length=100, null=True, default=None)
    balance = models.DecimalField(max_digits=20, decimal_places=2)
    division = models.IntegerField()

class CorporationWalletJournalEntry(WalletJournalEntry):
    division = models.ForeignKey(CorporationWalletDivision, on_delete=models.CASCADE)
    first_party_name = models.ForeignKey(EveName, on_delete=models.SET_NULL, null=True, default=None, related_name='corp_first_party')
    second_party_name = models.ForeignKey(EveName, on_delete=models.SET_NULL, null=True, default=None, related_name='corp_second_party')

    def __str__(self):
        return "{} '{}' {}: {}isk".format(
                                        self.first_party_name.name,
                                        self.ref_type,
                                        self.second_party_name.name,
                                        self.amount
                                    )
class CharacterWalletJournalEntry(WalletJournalEntry):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    first_party_name = models.ForeignKey(EveName, on_delete=models.SET_NULL, null=True, default=None, related_name='char_first_party')
    second_party_name = models.ForeignKey(EveName, on_delete=models.SET_NULL, null=True, default=None, related_name='char_second_party')

# Market Models
class MarketOrder(models.Model):
    order_id = models.BigIntegerField(primary_key=True)

    duration = models.IntegerField()
    escrow = models.DecimalField(max_digits=20, decimal_places=2, null=True, default=None)
    is_buy_order = models.NullBooleanField(null=True, default=None)
    issued = models.DateTimeField()
    location_id = models.BigIntegerField()
    location_name = models.ForeignKey(EveLocation, on_delete=models.SET_NULL, null=True, default=None) 

    min_volume = models.IntegerField(null=True, default=None)
    price = models.DecimalField(max_digits=20, decimal_places=2, null=True, default=None)
    _range_enum = Choices('1', '10', '2', '20', '3', '30', '4', '40', '5', 'region', 'solarsystem', 'station')
    order_range = models.CharField(max_length=30, choices=_range_enum)
    region_id = models.IntegerField()
    region_name = models.ForeignKey(MapRegion, on_delete=models.SET_NULL, null=True, default=None)
    type_id = models.IntegerField()
    type_name = models.ForeignKey(EveItemType, on_delete=models.SET_NULL, null=True, default=None)
    volume_remain = models.IntegerField()
    volume_total = models.IntegerField()

    _state_enum = Choices('cancelled', 'expired', 'active')
    state = models.CharField(max_length=30, choices=_state_enum)

    class Meta:
        abstract = True

class CorporationMarketOrder(MarketOrder):
    wallet_division = models.ForeignKey(CorporationWalletDivision, on_delete=models.CASCADE)
    issued_by = models.IntegerField()

class CharacterMarketOrder(MarketOrder):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    is_corporation = models.BooleanField()

# ************************ Fit Models
class SkillList(models.Model):
    last_update = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=500, null=True, default=None)
    skill_list = models.TextField(null=True, default="")
    eft = models.TextField(null=True, default="")
    show_on_audit = models.BooleanField(default=True)
    order_weight = models.IntegerField(default=0)

    def get_skills(self):
        return json.loads(self.skill_list)

    def __str__(self):
        return "({}){} (Updated: {})".format(self.order_weight, self.name, self.last_update.strftime("%Y-%m-%d %H:%M:%S"))

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
    last_online_time = models.DateTimeField(null=True, default=None)

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

    @property
    def abandoned(self):
        if self.last_online_time:
            abandonded = self.last_online_time + datetime.timedelta(days=7)
            if timezone.now() > abandonded:
                return True
            else:
                return False
        return True # Fallback to abandonded. wosrt case its 7 days early
        
class StructureService(models.Model):
    structure = models.ForeignKey(Structure, on_delete=models.CASCADE)

    name = models.CharField(max_length=100)
    _state_enum = Choices('online', 'offline', 'cleanup')
    state = models.CharField(max_length=8, choices=_state_enum)

# Moon Models

class MiningTaxPaymentCorp(models.Model):
    corp = models.ForeignKey(EveCorporationInfo, on_delete=models.CASCADE, related_name='payment_corp_mining_tax')

    def __str__(self):
        return "Moon Payments Processed From: {0}".format(self.corp.corporation_name)

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
    refine_rate = models.DecimalField(max_digits=5, decimal_places=2, default=87.5)
    ore_rate = models.DecimalField(max_digits=5, decimal_places=2)  # normal
    ubiquitous_rate = models.DecimalField(max_digits=5, decimal_places=2)  # ubiq
    common_rate = models.DecimalField(max_digits=5, decimal_places=2)  # comon
    uncommon_rate = models.DecimalField(max_digits=5, decimal_places=2) # uncom
    rare_rate = models.DecimalField(max_digits=5, decimal_places=2) # rare  
    excptional_rate = models.DecimalField(max_digits=5, decimal_places=2) # best

class MiningTax(models.Model):
    corp = models.ForeignKey(EveCorporationInfo, on_delete=models.CASCADE, related_name='corp_mining_tax')
    tax_rate = models.ForeignKey(OreTaxRates, on_delete=models.CASCADE, null=True, default=None, blank=True)
    use_variable_tax = models.BooleanField(default=False)
    flat_tax_rate = models.DecimalField(max_digits=5, decimal_places=2, null=True, default=None, blank=True) # best
    region = models.CharField(max_length=50, null=True, default=None, blank=True)
    constellation = models.CharField(max_length=50, null=True, default=None, blank=True)
    system = models.CharField(max_length=50, null=True, default=None, blank=True)
    moon = models.CharField(max_length=50, null=True, default=None, blank=True)
    rank = models.IntegerField(default=0, null=True, blank=True)

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
        #return 
        rate = ""
        if self.use_variable_tax:
            rate = " Variable ({})".format(self.tax_rate.tag)
        else:
            rate = "{}%".format(self.tax_rate*100)
        return "#{3}: Mining Tax {0} for {1}: {2}".format(rate, self.corp, area, self.rank)

class Notification(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    notification_id = models.BigIntegerField()
    sender_id = models.IntegerField()
    _type_enum = Choices('character', 'corporation', 'alliance', 'faction', 'other')
    sender_type = models.CharField(max_length=15, choices=_type_enum)
    notification_text = models.TextField(null=True, default=None)
    timestamp = models.DateTimeField()
    notification_type = models.CharField(max_length=50)
    is_read = models.NullBooleanField(null=True, default=None)

    class Meta:
        indexes = (
            models.Index(fields=['notification_id']),
            models.Index(fields=['timestamp']),
            models.Index(fields=['notification_type'])
        )

