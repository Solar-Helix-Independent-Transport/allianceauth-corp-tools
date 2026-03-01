# Standard Library
from typing import TYPE_CHECKING

# Third Party
from eve_sde.models import ItemType, SolarSystem

# Django
from django.db import models

from .audits import CharacterAudit

if TYPE_CHECKING:
    # Alliance Auth
    from esi.stubs import CharactersCharacterIdMiningGetItem


class CharacterMiningLedger(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    date = models.DateField()
    type_name = models.ForeignKey(ItemType, on_delete=models.CASCADE)
    system = models.ForeignKey(SolarSystem, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    @staticmethod
    def create_primary_key(character_id, mining_record: "CharactersCharacterIdMiningGetItem"):
        """
            TODO investigate something else...
        """
        return f"{mining_record.date.strftime('%Y%m%d')}-{mining_record.type_id}-{character_id}-{mining_record.solar_system_id}"
