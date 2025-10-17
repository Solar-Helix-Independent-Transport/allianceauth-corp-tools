from model_utils import Choices

from django.db import models

from .audits import CharacterAudit, EveLocation
from .eve_models import EveItemType


class Clone(models.Model):
    character = models.OneToOneField(CharacterAudit, on_delete=models.CASCADE)

    last_clone_jump_date = models.DateTimeField(null=True, default=None)
    last_station_change_date = models.DateTimeField(null=True, default=None)
    location_id = models.BigIntegerField()
    location_name = models.ForeignKey(
        EveLocation, on_delete=models.SET_NULL, null=True, default=None)
    _type_enum = Choices('station', 'structure')
    location_type = models.CharField(max_length=9, choices=_type_enum)

# Clone Models


class JumpClone(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    jump_clone_id = models.IntegerField(null=True, default=None)
    location_id = models.BigIntegerField(null=True, default=None)
    location_name = models.ForeignKey(
        EveLocation, on_delete=models.SET_NULL, null=True, default=None)
    _type_enum = Choices('station', 'structure')
    location_type = models.CharField(
        max_length=9, choices=_type_enum, null=True, default=None)
    name = models.CharField(max_length=255, null=True, default=None)

# Implant Model


class Implant(models.Model):
    clone = models.ForeignKey(JumpClone, on_delete=models.CASCADE)
    type_name = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None)
