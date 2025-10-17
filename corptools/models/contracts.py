from django.db import models

from .audits import CharacterAudit, CorporationAudit, EveLocation
from .eve_models import EveItemType, EveName


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
