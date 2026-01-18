import datetime
from typing import TYPE_CHECKING, ClassVar

from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from allianceauth.eveonline.evelinks import eveimageserver

from corptools.utils import to_roman_numeral

from ..managers import (
    EveCategoryManager, EveGroupManager, EveItemTypeManager, EveMoonManager,
    EveNameManager, EvePlanetManager,
)
from .utils import JSONModel

if TYPE_CHECKING:
    from esi.stubs import (
        UniverseCategoriesCategoryIdGet, UniverseGroupsGroupIdGet,
        UniverseTypesTypeIdGet, UniverseTypesTypeIdGet_Dogma_attributesItem,
    )


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


class EveItemCategory(JSONModel):
    """
    categories.jsonl
    """
    _filename = "categories.jsonl"
    _update_fields = [
        "name",
    ]

    objects: ClassVar[EveCategoryManager] = EveCategoryManager()
    category_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)  # unknown max

    def __str__(self):
        return self.name

    @classmethod
    def from_esi_model(cls, esi_model: "UniverseCategoriesCategoryIdGet"):
        return cls(
            category_id=esi_model.category_id,
            name=esi_model.name
        )

    @classmethod
    def from_jsonl(cls, json_data, names=False):
        return cls(
            category_id=json_data.get("_key"),
            name=json_data.get("name", {}).get("en"),
        )


class EveItemGroup(JSONModel):
    """
    groups.jsonl
    """
    _filename = "groups.jsonl"
    _update_fields = [
        "name",
        "category"
    ]

    objects: ClassVar[EveGroupManager] = EveGroupManager()
    group_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)  # unknown max
    category = models.ForeignKey(
        EveItemCategory, on_delete=models.SET_NULL, null=True, default=None)

    def __str__(self):
        return self.name

    @classmethod
    def from_esi_model(cls, esi_model: "UniverseGroupsGroupIdGet"):
        return cls(
            group_id=esi_model.group_id,
            category_id=esi_model.category_id,
            name=esi_model.name
        )

    @classmethod
    def from_jsonl(cls, json_data, names=False):
        return cls(
            group_id=json_data.get("_key"),
            name=json_data.get("name", {}).get("en"),
            category_id=json_data.get("categoryID")
        )


class EveItemType(JSONModel):
    """
    types.jsonl
    """
    _filename = "types.jsonl"
    _update_fields = [
        "name",
        "description",
        "mass",
        "packaged_volume",
        "portion_size",
        "volume",
        "published",
        "radius",
        "group"
    ]

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

    @classmethod
    def from_esi_model(cls, esi_model: "UniverseTypesTypeIdGet"):
        return cls(
            type_id=esi_model.type_id,
            group_id=esi_model.group_id,
            name=esi_model.name,
            description=esi_model.description,
            mass=esi_model.mass,
            packaged_volume=esi_model.packaged_volume,
            portion_size=esi_model.portion_size,
            volume=esi_model.volume,
            published=esi_model.published,
            radius=esi_model.radius
        )

    @classmethod
    def from_jsonl(cls, json_data, names=False):
        return cls(
            type_id=json_data.get("_key"),
            name=json_data.get("name", {}).get("en", None),
            description=json_data.get("description", {}).get("en", None),
            group_id=json_data.get("groupID"),
            mass=json_data.get("mass", None),
            packaged_volume=json_data.get("packaged_volume", None),
            portion_size=json_data.get("portion_size", None),
            volume=json_data.get("volume", None),
            published=json_data.get("published", False),
            radius=json_data.get("radius", None)
        )


class EveItemDogmaAttribute(JSONModel):
    """
    typeDogma.jsonl
    """
    _filename = "typeDogma.jsonl"
    _update_fields = False

    eve_type = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None)
    attribute_id = models.BigIntegerField(null=True, default=None)
    value = models.FloatField(null=True, default=None)

    @classmethod
    def from_esi_model(cls, type_id, esi_model: "UniverseTypesTypeIdGet_Dogma_attributesItem"):
        return cls(
            eve_type_id=type_id,
            attribute_id=esi_model.attribute_id,
            value=esi_model.value
        )

    @classmethod
    def from_jsonl(cls, json_data, names=False):
        output = []
        for _attrib in json_data.get("dogmaAttributes", []):
            output.append(
                cls(
                    eve_type_id=json_data.get("_key"),
                    attribute_id=_attrib.get("attributeID"),
                    value=_attrib.get("value")
                )
            )
        return output

    @classmethod
    def load_from_sde(cls, folder_name):
        dogma_query = cls.objects.all()
        if dogma_query.exists():
            # speed and we are not caring about f-keys or signals on these models
            dogma_query._raw_delete(dogma_query.db)
        super().load_from_sde(folder_name)


class InvTypeMaterials(JSONModel):
    """
    typeDogma.jsonl
    """
    _filename = "typeDogma.jsonl"
    _update_fields = False

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

    @classmethod
    def from_jsonl(cls, json_data, names=False):
        output = []
        for _mats in json_data.get("materials", []):
            output.append(
                cls(
                    eve_type_id=json_data.get("_key"),
                    type_id=json_data.get("_key"),
                    material_type_id=_mats.get("materialTypeID"),
                    met_type_id=_mats.get("materialTypeID"),
                    qty=_mats.get("qty")
                )
            )
        return output

    @classmethod
    def load_from_sde(cls, folder_name):
        dogma_query = cls.objects.all()
        if dogma_query.exists():
            # speed and we are not caring about f-keys or signals on these models
            dogma_query._raw_delete(dogma_query.db)
        super().load_from_sde(folder_name)


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

    @classmethod
    def from_jsonl(cls, json_data, names=False):
        return cls(
            region_id=json_data.get("_key"),
            name=json_data.get("name", {}).get("en"),
            description=json_data.get("description", {}).get("en"),
        )


class MapConstellation(JSONModel):
    """
    mapConstellations.jsonl
    """
    _filename = "mapConstellations.jsonl"
    _update_fields = [
        "name",
        "region"
    ]

    constellation_id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    region = models.ForeignKey(
        MapRegion, on_delete=models.SET_NULL, null=True, default=None)

    def __str__(self):
        return self.name

    @classmethod
    def from_jsonl(cls, json_data, names=False):
        return cls(
            constellation_id=json_data.get("_key"),
            name=json_data.get("name", {}).get("en"),
            region_id=json_data.get("regionID")
        )


class MapSystem(JSONModel):
    """
    mapSolarSystems.jsonl
    """
    _filename = "mapSolarSystems.jsonl"
    _update_fields = [
        "name",
        "security_class",
        "security_status",
        "star_id",
        "constellation",
        "x",
        "y",
        "z",
    ]

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

    @classmethod
    def from_jsonl(cls, json_data, names=False):
        return cls(
            system_id=json_data.get("_key"),
            name=json_data.get("name", {}).get("en"),
            constellation_id=json_data.get("constellationID"),
            star_id=json_data.get("starID"),
            security_class=json_data.get("securityClass"),
            security_status=json_data.get("securityStatus"),
            x=json_data.get("position", {}).get("x"),
            y=json_data.get("position", {}).get("y"),
            z=json_data.get("position", {}).get("z"),
        )


class MapSystemGate(JSONModel):
    """
    mapStargates.jsonl
    """
    _filename = "mapStargates.jsonl"
    _update_fields = False

    from_solar_system = models.ForeignKey(
        MapSystem, on_delete=models.CASCADE, related_name="from_system")
    to_solar_system = models.ForeignKey(
        MapSystem, on_delete=models.CASCADE, related_name="to_system")

    def __str__(self):
        return (self.from_solar_system_id, self.to_solar_system_id)

    @classmethod
    def from_jsonl(cls, json_data, names=False):
        return cls(
            from_solar_system_id=json_data.get("solarSystemID"),
            to_solar_system_id=json_data.get(
                "destination", {}).get("solarSystemID"),
        )

    @classmethod
    def load_from_sde(cls, folder_name):
        gate_qry = cls.objects.all()
        if gate_qry.exists():
            # speed and we are not caring about f-keys or signals on these models
            gate_qry._raw_delete(gate_qry.db)
        super().load_from_sde(folder_name)


class MapSystemPlanet(JSONModel):
    """
    mapPlanets.jsonl
        "system_name planet_roman_numeral"
    """
    _filename = "mapPlanets.jsonl"
    _update_fields = [
        "name",
        "system",
        "x",
        "y",
        "z",
    ]

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

    @classmethod
    def from_jsonl(cls, json_data, system_names):
        name = f"{system_names[json_data.get('solarSystemID')]} {to_roman_numeral(json_data.get('celestialIndex'))}"
        return cls(
            planet_id=json_data.get("_key"),
            system_id=json_data.get("solarSystemID"),
            name=name,
            x=json_data.get("position", {}).get("x"),
            y=json_data.get("position", {}).get("y"),
            z=json_data.get("position", {}).get("z"),
        )


class MapSystemMoon(JSONModel):
    """
    mapMoons.jsonl
        "system_name planet_roman_numeral - Moon #"
    """
    _filename = "mapMoons.jsonl"
    _update_fields = [
        "name",
        "system",
        "x",
        "y",
        "z",
    ]

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

    @classmethod
    def from_jsonl(cls, json_data, planet_names):
        name = f"{planet_names[json_data.get('orbitID')]} - Moon {json_data.get('orbitIndex')}"
        return cls(
            moon_id=json_data.get("_key"),
            system_id=json_data.get("solarSystemID"),
            name=name,
            x=json_data.get("position", {}).get("x"),
            y=json_data.get("position", {}).get("y"),
            z=json_data.get("position", {}).get("z"),
        )


class MapJumpBridge(models.Model):
    structure_id = models.BigIntegerField(primary_key=True)
    from_solar_system = models.ForeignKey(
        MapSystem, on_delete=models.CASCADE, related_name="bridge_from_system")
    to_solar_system = models.ForeignKey(
        MapSystem, on_delete=models.CASCADE, related_name="bridge_to_system")
    owner = models.ForeignKey(
        EveName, on_delete=models.SET_NULL, null=True, default=None)
    updated = models.DateTimeField(auto_now=True)
    manually_input = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.from_solar_system.name} >> {self.to_solar_system.name} ({self.structure_id}) (Auto: {not self.manually_input})"


class TypePrice(models.Model):
    item = models.ForeignKey(EveItemType, on_delete=models.DO_NOTHING)
    price = models.DecimalField(max_digits=20, decimal_places=2)
    last_update = models.DateTimeField(auto_now=True)


# ************ is this needed any more?

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
