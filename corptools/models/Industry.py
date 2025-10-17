from django.db import models

from .audits import CharacterAudit, CorporationAudit
from .eve_models import EveItemType


class CharacterIndustryJob(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    activity_id = models.IntegerField()
    blueprint_id = models.BigIntegerField()
    blueprint_location_id = models.BigIntegerField()
    blueprint_type_id = models.BigIntegerField()
    blueprint_type_name = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None, related_name="blueprint_type")
    completed_character_id = models.BigIntegerField(
        default=None, null=True, blank=True)
    completed_date = models.DateTimeField(default=None, null=True, blank=True)
    cost = models.DecimalField(
        max_digits=20, decimal_places=2, default=None, null=True, blank=True)
    duration = models.IntegerField()
    end_date = models.DateTimeField()
    facility_id = models.BigIntegerField()
    installer_id = models.IntegerField()
    job_id = models.IntegerField()
    licensed_runs = models.IntegerField(default=None, null=True, blank=True)
    output_location_id = models.BigIntegerField()
    pause_date = models.DateTimeField(default=None, null=True, blank=True)
    probability = models.FloatField(default=None, null=True, blank=True)
    product_type_id = models.IntegerField()
    product_type_name = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None, related_name="product_type")

    runs = models.IntegerField()
    start_date = models.DateTimeField()
    station_id = models.BigIntegerField()
    status = models.CharField(max_length=15)
    successful_runs = models.IntegerField(default=None, null=True, blank=True)


class CorporationIndustryJob(models.Model):
    """
    https://developers.eveonline.com/api-explorer#/schemas/CorporationsCorporationIdIndustryJobsGet
    """
    corporation = models.ForeignKey(CorporationAudit, on_delete=models.CASCADE)

    activity_id = models.IntegerField()
    blueprint_id = models.BigIntegerField()
    blueprint_location_id = models.BigIntegerField()
    blueprint_type_id = models.BigIntegerField()
    blueprint_type_name = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None, related_name="corp_blueprint_type")
    completed_character_id = models.BigIntegerField(
        default=None, null=True, blank=True)
    completed_date = models.DateTimeField(default=None, null=True, blank=True)
    cost = models.DecimalField(
        max_digits=20, decimal_places=2, default=None, null=True, blank=True)
    duration = models.IntegerField()
    end_date = models.DateTimeField()
    facility_id = models.BigIntegerField()
    installer_id = models.IntegerField()
    job_id = models.IntegerField()
    licensed_runs = models.IntegerField(default=None, null=True, blank=True)
    location_id = models.BigIntegerField()
    output_location_id = models.BigIntegerField()
    pause_date = models.DateTimeField(default=None, null=True, blank=True)
    probability = models.FloatField(default=None, null=True, blank=True)
    product_type_id = models.IntegerField()
    product_type_name = models.ForeignKey(
        EveItemType, on_delete=models.SET_NULL, null=True, default=None, related_name="corp_product_type")

    runs = models.IntegerField()
    start_date = models.DateTimeField()
    status = models.CharField(max_length=15)
    successful_runs = models.IntegerField(default=None, null=True, blank=True)
