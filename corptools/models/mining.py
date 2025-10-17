from django.db import models

from .audits import CharacterAudit
from .eve_models import EveItemType, MapSystem


class CharacterMiningLedger(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    date = models.DateField()
    type_name = models.ForeignKey(EveItemType, on_delete=models.CASCADE)
    system = models.ForeignKey(MapSystem, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    @staticmethod
    def create_primary_key(character_id, mining_record):
        """
            TODO investigate something else...
        """
        return f"{mining_record['date'].strftime('%Y%m%d')}-{mining_record['type_id']}-{character_id}-{mining_record['solar_system_id']}"
