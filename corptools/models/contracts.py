from typing import TYPE_CHECKING

from django.db import models

from .audits import CharacterAudit, CorporationAudit, EveLocation
from .eve_models import EveItemType, EveName

if TYPE_CHECKING:
    from esi.stubs import (
        CharactersCharacterIdContractsContractIdItemsGetItem,
        CharactersCharacterIdContractsGetItem,
    )


class Contract(models.Model):
    id = models.CharField(max_length=50, primary_key=True)

    contract_id = models.IntegerField()

    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    acceptor_id = models.IntegerField()
    acceptor_name = models.ForeignKey(
        EveName, on_delete=models.CASCADE, related_name="contractacceptor")
    assignee_id = models.IntegerField()
    assignee_name = models.ForeignKey(
        EveName, on_delete=models.CASCADE, related_name="contractassignee")
    issuer_id = models.IntegerField()
    issuer_name = models.ForeignKey(
        EveName, on_delete=models.CASCADE, related_name="contractissuer")
    issuer_corporation_id = models.IntegerField()
    issuer_corporation_name = models.ForeignKey(
        EveName, on_delete=models.CASCADE, related_name="contractissuercorporation")
    days_to_complete = models.IntegerField()

    collateral = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True)
    buyout = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True)
    price = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True)
    reward = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True)

    volume = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True)

    days_to_complete = models.IntegerField(null=True, blank=True)

    start_location_id = models.BigIntegerField(null=True, blank=True)
    start_location_name = models.ForeignKey(
        EveLocation, on_delete=models.SET_NULL, null=True, default=None, related_name="contractfrom")

    end_location_id = models.BigIntegerField(null=True, blank=True)
    end_location_name = models.ForeignKey(
        EveLocation, on_delete=models.SET_NULL, null=True, default=None, related_name="contractto")

    for_corporation = models.BooleanField()

    date_accepted = models.DateTimeField(null=True, blank=True)
    date_completed = models.DateTimeField(null=True, blank=True)

    date_expired = models.DateTimeField()
    date_issued = models.DateTimeField()

    status = models.CharField(max_length=25)
    contract_type = models.CharField(max_length=20)
    availability = models.CharField(max_length=15)

    title = models.CharField(max_length=256)

    @staticmethod
    def build_pk(char, cont):
        return f"{char}{cont}"

    class Meta:
        unique_together = (("character", "contract_id"),)

    @classmethod
    def from_esi_model(cls, character: CharacterAudit, esi_model: "CharactersCharacterIdContractsGetItem"):
        return cls(
            id=cls.build_pk(character.id, esi_model.contract_id),
            character=character,
            assignee_id=esi_model.assignee_id,
            assignee_name_id=esi_model.assignee_id,
            acceptor_id=esi_model.acceptor_id,
            acceptor_name_id=esi_model.acceptor_id,
            contract_id=esi_model.contract_id,
            availability=esi_model.availability,
            buyout=esi_model.buyout,
            collateral=esi_model.collateral,
            date_accepted=esi_model.date_accepted,
            date_completed=esi_model.date_completed,
            date_expired=esi_model.date_expired,
            date_issued=esi_model.date_issued,
            days_to_complete=esi_model.days_to_complete,
            end_location_id=esi_model.end_location_id,
            for_corporation=esi_model.for_corporation,
            issuer_corporation_name_id=esi_model.issuer_corporation_id,
            issuer_name_id=esi_model.issuer_id,
            price=esi_model.price,
            reward=esi_model.reward,
            start_location_id=esi_model.start_location_id,
            status=esi_model.status,
            title=esi_model.title,
            contract_type=esi_model.type,
            volume=esi_model.volume
        )


class ContractItem(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE)
    is_included = models.BooleanField()
    is_singleton = models.BooleanField()
    quantity = models.IntegerField()
    raw_quantity = models.IntegerField(null=True, blank=True)
    record_id = models.BigIntegerField()
    type_name = models.ForeignKey(EveItemType, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("record_id", "contract"),)

    @classmethod
    def from_esi_model(cls, contract: Contract, esi_model: "CharactersCharacterIdContractsContractIdItemsGetItem"):
        return cls(
            contract=contract,
            is_included=esi_model.is_included,
            is_singleton=esi_model.is_singleton,
            quantity=esi_model.quantity,
            raw_quantity=esi_model.raw_quantity,
            record_id=esi_model.record_id,
            type_name_id=esi_model.type_id,
        )


class CorporateContract(models.Model):
    id = models.CharField(max_length=50, primary_key=True)

    contract_id = models.BigIntegerField()

    corporation = models.ForeignKey(CorporationAudit, on_delete=models.CASCADE)
    acceptor_id = models.IntegerField()
    acceptor_name = models.ForeignKey(
        EveName, on_delete=models.CASCADE, related_name="corporationcontractacceptor")
    assignee_id = models.IntegerField()
    assignee_name = models.ForeignKey(
        EveName, on_delete=models.CASCADE, related_name="corporationcontractassignee")
    issuer_id = models.IntegerField()
    issuer_name = models.ForeignKey(
        EveName, on_delete=models.CASCADE, related_name="corporationcontractissuer")
    issuer_corporation_id = models.IntegerField()
    issuer_corporation_name = models.ForeignKey(
        EveName, on_delete=models.CASCADE, related_name="corporationcontractissuercorporation")
    days_to_complete = models.IntegerField()

    collateral = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True)
    buyout = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True)
    price = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True)
    reward = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True)

    volume = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, blank=True)

    days_to_complete = models.IntegerField(null=True, blank=True)

    start_location_id = models.BigIntegerField(null=True, blank=True)
    start_location_name = models.ForeignKey(
        EveLocation, on_delete=models.SET_NULL, null=True, default=None, related_name="corporationcontractfrom")

    end_location_id = models.BigIntegerField(null=True, blank=True)
    end_location_name = models.ForeignKey(
        EveLocation, on_delete=models.SET_NULL, null=True, default=None, related_name="corporationcontractto")

    for_corporation = models.BooleanField()

    date_accepted = models.DateTimeField(null=True, blank=True)
    date_completed = models.DateTimeField(null=True, blank=True)

    date_expired = models.DateTimeField()
    date_issued = models.DateTimeField()

    status = models.CharField(max_length=25)
    contract_type = models.CharField(max_length=20)
    availability = models.CharField(max_length=15)

    title = models.CharField(max_length=256)

    @staticmethod
    def build_pk(corp, cont):
        return f"{corp}{cont}"

    class Meta:
        unique_together = (("corporation", "contract_id"),)


class CorporateContractItem(models.Model):
    contract = models.ForeignKey(CorporateContract, on_delete=models.CASCADE)
    is_included = models.BooleanField()
    is_singleton = models.BooleanField()
    quantity = models.IntegerField()
    raw_quantity = models.IntegerField(null=True, blank=True)
    record_id = models.BigIntegerField()
    type_name = models.ForeignKey(EveItemType, on_delete=models.CASCADE)

    class Meta:
        unique_together = (("record_id", "contract"),)
