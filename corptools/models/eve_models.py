# Standard Library
import datetime
from typing import ClassVar

# Third Party
# Map Shims
# Item Shims
from eve_sde.models import ItemType, SolarSystem

# Django
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

# Alliance Auth
from allianceauth.eveonline.evelinks import eveimageserver

# AA Example App
from corptools.models.utils import JSONModel

from ..managers import (
    EveCategoryManager,
    EveGroupManager,
    EveItemTypeManager,
    EveMoonManager,
    EveNameManager,
    EvePlanetManager,
)

# EVE SDE Migration Start


class EveName(models.Model):
    objects: ClassVar[EveNameManager] = EveNameManager()

    eve_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50)

    # optionals for character/corp
    corporation = models.ForeignKey(
        'EveName',
        on_delete=models.SET_NULL,
        null=True,
        default=None,
        related_name="corp"
    )
    alliance = models.ForeignKey(
        'EveName',
        on_delete=models.SET_NULL,
        null=True,
        default=None,
        related_name="alli"
    )
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
        return self.last_update + datetime.timedelta(days=30) < timezone.now()


class MapJumpBridge(models.Model):
    structure_id = models.BigIntegerField(primary_key=True)
    from_solar_system = models.ForeignKey(
        SolarSystem,
        on_delete=models.CASCADE,
        related_name="bridge_from_system"
    )
    to_solar_system = models.ForeignKey(
        SolarSystem,
        on_delete=models.CASCADE,
        related_name="bridge_to_system"
    )
    owner = models.ForeignKey(
        EveName, on_delete=models.SET_NULL, null=True, default=None)
    updated = models.DateTimeField(auto_now=True)
    manually_input = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.from_solar_system.name} >> {self.to_solar_system.name} ({self.structure_id}) (Auto: {not self.manually_input})"


class TypePrice(models.Model):
    item = models.ForeignKey(ItemType, on_delete=models.DO_NOTHING)
    price = models.DecimalField(max_digits=20, decimal_places=2)
    last_update = models.DateTimeField(auto_now=True)


# ************ is this needed any more?

class OreTax(models.Model):
    item = models.ForeignKey(ItemType, on_delete=models.DO_NOTHING)
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

# DEPRECATED MODELS BELOW - NOT USED ANYMORE
# These will be removed in a future release expected 4.0.0
# Use eve_sde instead https://github.com/Solar-Helix-Independent-Transport/django-eveonline-sde/tree/main


class EveItemCategory(JSONModel):
    """
    categories.jsonl
    """
    objects: ClassVar[EveCategoryManager] = EveCategoryManager()
    category_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)  # unknown max

    def __str__(self):
        return self.name


class EveItemGroup(JSONModel):
    """
    groups.jsonl
    """
    objects: ClassVar[EveGroupManager] = EveGroupManager()
    group_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)  # unknown max
    category = models.ForeignKey(
        EveItemCategory, on_delete=models.SET_NULL, null=True, default=None)

    def __str__(self):
        return self.name


class EveItemType(JSONModel):
    """
    types.jsonl
    """
    objects: ClassVar[EveItemTypeManager] = EveItemTypeManager()
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


class EveItemDogmaAttribute(JSONModel):
    """
    typeDogma.jsonl
    """
    eve_type = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None)
    attribute_id = models.BigIntegerField(null=True, default=None)
    value = models.FloatField(null=True, default=None)


class InvTypeMaterials(JSONModel):
    """
    typeDogma.jsonl
    """
    eve_type = models.ForeignKey(
        EveItemType,
        on_delete=models.SET_NULL,
        null=True,
        default=None
    )
    qty = models.IntegerField()
    type_id = models.IntegerField()
    material_type_id = models.IntegerField()
    met_type = models.ForeignKey(
        EveItemType,
        on_delete=models.SET_NULL,
        null=True,
        default=None,
        related_name="met_type"
    )


class MapRegion(JSONModel):
    """
    mapRegions.jsonl
    """
    _filename = "mapRegions.jsonl"
    _update_fields = [
        "name",
        "description"
    ]

    region_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, default=None, )

    def __str__(self):
        return self.name


class MapConstellation(JSONModel):
    """
    mapConstellations.jsonl
    """
    constellation_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    region = models.ForeignKey(
        MapRegion, on_delete=models.SET_NULL, null=True, default=None)

    def __str__(self):
        return self.name


class MapSystem(JSONModel):
    """
    mapSolarSystems.jsonl
    """
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


class MapSystemGate(JSONModel):
    """
    mapStargates.jsonl
    """
    from_solar_system = models.ForeignKey(
        MapSystem, on_delete=models.CASCADE, related_name="from_system")
    to_solar_system = models.ForeignKey(
        MapSystem, on_delete=models.CASCADE, related_name="to_system")

    def __str__(self):
        return (self.from_solar_system_id, self.to_solar_system_id)


class MapSystemPlanet(JSONModel):
    """
    mapPlanets.jsonl
        "system_name planet_roman_numeral"
    """

    objects: ClassVar[EvePlanetManager] = EvePlanetManager()

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

    @classmethod
    def name_lookup(cls):
        return {
            s.get("system_id"): s.get("name") for s in
            MapSystem.objects.all().values("system_id", "name")
        }


class MapSystemMoon(JSONModel):
    """
    mapMoons.jsonl
        "system_name planet_roman_numeral - Moon #"
    """
    objects: ClassVar[EveMoonManager] = EveMoonManager()

    moon_id = models.IntegerField(primary_key=True)
    system = models.ForeignKey(
        MapSystem, on_delete=models.CASCADE, related_name="moon")
    name = models.CharField(max_length=255)

    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()

    def __str__(self):
        return (self.name)

    @classmethod
    def name_lookup(cls):
        return {
            p.get("planet_id"): p.get("name") for p in
            MapSystemPlanet.objects.all().values("planet_id", "name")
        }
