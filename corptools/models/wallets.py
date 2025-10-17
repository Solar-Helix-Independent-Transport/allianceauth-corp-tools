from model_utils import Choices

from django.db import models

from .audits import CharacterAudit, CorporationAudit, CorptoolsConfiguration
from .eve_models import EveItemType, EveName


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

    processed = models.BooleanField(default=False)

    class Meta:
        abstract = True
        indexes = (
            models.Index(fields=['date']),
            models.Index(fields=['entry_id']),
            models.Index(fields=['ref_type'])
        )


class CorporationWalletDivision(models.Model):
    corporation = models.ForeignKey(
        CorporationAudit, on_delete=models.CASCADE, related_name='corporation_division')
    name = models.CharField(max_length=100, null=True, default=None)
    balance = models.DecimalField(max_digits=20, decimal_places=2)
    division = models.IntegerField()

    @classmethod
    def get_visible(cls, user):
        corps_vis = CorporationAudit.objects.visible_to(user)
        if user.has_perm("corptools.holding_corp_wallets"):
            corps_holding = CorptoolsConfiguration.get_solo().holding_corp_qs()
            corps_vis = corps_vis | corps_holding

        return cls.objects.filter(corporation__in=corps_vis)


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
            corps_holding = CorptoolsConfiguration.get_solo().holding_corp_qs()
            corps_vis = corps_vis | corps_holding

        return cls.objects.filter(division__corporation__in=corps_vis)


class CharacterWalletJournalEntry(WalletJournalEntry):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    first_party_name = models.ForeignKey(
        EveName, on_delete=models.SET_NULL, null=True, default=None, related_name='char_first_party')
    second_party_name = models.ForeignKey(
        EveName, on_delete=models.SET_NULL, null=True, default=None, related_name='char_second_party')


class CharacterBountyEvent(models.Model):
    entry = models.OneToOneField(
        CharacterWalletJournalEntry,
        on_delete=models.CASCADE,
        related_name="msg"
    )
    message = models.TextField()


class CharacterBountyStat(models.Model):
    event = models.ForeignKey(
        CharacterBountyEvent,
        on_delete=models.CASCADE,
        related_name="stats"
    )
    type_name = models.ForeignKey(
        EveItemType,
        on_delete=models.CASCADE
    )
    qty = models.IntegerField()
