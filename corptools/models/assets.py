
from django.db import models

from corptools.task_helpers import sanitize_location_flag

from .audits import (
    CharacterAudit, CorporationAudit, CorptoolsConfiguration, EveLocation,
)
from .eve_models import EveItemType


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
            corps_holding = CorptoolsConfiguration.get_solo().holding_corp_qs()
            corps_vis = corps_vis | corps_holding

        return cls.objects.filter(corporation__in=corps_vis)

    @classmethod
    def from_esi_model(cls, corporation: CorporationAudit, model):
        return cls(
            corporation=corporation,
            blueprint_copy=model.is_blueprint_copy,
            singleton=model.is_singleton,
            item_id=model.item_id,
            location_flag=sanitize_location_flag(
                model.location_flag
            ),
            location_id=model.location_id,
            location_type=model.location_type,
            quantity=model.quantity,
            type_id=model.type_id,
            type_name_id=model.type_id
        )


class CharacterAsset(Asset):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    def __str__(self):
        return '{2} {0}x{1} ({3} / {4})'.format(
            self.type_id,
            self.quantity,
            self.character,
            self.location_id,
            self.location_type
        )

    @classmethod
    def from_esi_model(cls, character: CharacterAudit, model):
        return cls(
            character=character,
            blueprint_copy=model.is_blueprint_copy,
            singleton=model.is_singleton,
            item_id=model.item_id,
            location_flag=sanitize_location_flag(
                model.location_flag
            ),
            location_id=model.location_id,
            location_type=model.location_type,
            quantity=model.quantity,
            type_id=model.type_id,
            type_name_id=model.type_id
        )

    @classmethod
    def from_esi_location(cls, character: CharacterAudit, ship, location):
        location_id = location.solar_system_id
        location_flag = "solar_system"
        location_type = "unlocked"
        if location.structure_id is not None:
            location_id = location.structure_id
            location_flag = "item"
            location_type = "hangar"
        elif location.station_id is not None:
            location_id = location.station_id
            location_flag = "station"
            location_type = "hangar"

        return cls(
            character=character,
            singleton=True,
            item_id=ship.ship_item_id,
            location_flag=sanitize_location_flag(
                location_flag
            ),
            location_id=location_id,
            location_type=location_type,
            quantity=1,
            type_id=ship.ship_type_id,
            type_name_id=ship.ship_type_id
        )


class AssetCoordiante(models.Model):
    item = models.OneToOneField(
        CorpAsset,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="coordinate"
    )
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()


class CharAssetCoordiante(models.Model):
    item = models.OneToOneField(
        CharacterAsset,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="coordinate"
    )
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()
