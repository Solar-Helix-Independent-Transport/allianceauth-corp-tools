from typing import TYPE_CHECKING, Union

from model_utils import Choices

from django.db import models

from .audits import CharacterAudit, EveLocation
from .eve_models import EveItemType, MapRegion
from .wallets import CorporationWalletDivision

if TYPE_CHECKING:
    from esi.stubs import (
        CharactersCharacterIdOrdersGetItem,
        CharactersCharacterIdOrdersHistoryGetItem,
    )


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

    @classmethod
    def from_esi_model(
        cls,
        character: CharacterAudit,
        esi_model: Union[
            "CharactersCharacterIdOrdersGetItem",
            "CharactersCharacterIdOrdersHistoryGetItem"
        ]
    ):
        return cls(
            character=character,
            order_id=esi_model.order_id,
            duration=esi_model.duration,
            escrow=esi_model.escrow,
            is_buy_order=esi_model.is_buy_order,
            issued=esi_model.issued,
            location_id=esi_model.location_id,
            min_volume=esi_model.min_volume,
            price=esi_model.price,
            order_range=esi_model.range,
            region_id=esi_model.region_id,
            region_name_id=esi_model.region_id,
            type_id=esi_model.type_id,
            type_name_id=esi_model.type_id,
            volume_remain=esi_model.volume_remain,
            volume_total=esi_model.volume_total,
            is_corporation=esi_model.is_corporation,
            state=getattr(esi_model, "state", "active")
        )
