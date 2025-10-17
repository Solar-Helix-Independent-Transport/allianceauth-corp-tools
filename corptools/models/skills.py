import json

from jsonschema import ValidationError

from django.db import models
from django.utils.translation import gettext_lazy as _

from .audits import CharacterAudit
from .eve_models import EveItemType


class SkillTotals(models.Model):
    character = models.OneToOneField(CharacterAudit, on_delete=models.CASCADE)

    total_sp = models.BigIntegerField()
    unallocated_sp = models.IntegerField(null=True, default=None)


class SkillTotalHistory(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now=True)
    total_sp = models.BigIntegerField()
    unallocated_sp = models.IntegerField(default=0)

    @property
    def sp(self):
        return self.total_sp + self.unallocated_sp


class Skill(models.Model):
    id = models.BigAutoField(primary_key=True)
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    skill_id = models.IntegerField()
    skill_name = models.ForeignKey(
        EveItemType, on_delete=models.CASCADE, null=True, default=None)
    active_skill_level = models.IntegerField()
    skillpoints_in_skill = models.BigIntegerField()
    trained_skill_level = models.IntegerField()

    @property
    def alpha(self):
        if self.trained_skill_level == self.active_skill_level:
            return False
        return True  # is alpha clone

    class Meta:
        unique_together = (("character", "skill_id"),)

# Skill Queue Model


class SkillQueue(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    # Required Fields / Fields Always Present
    finish_level = models.IntegerField()
    queue_position = models.IntegerField()
    skill_id = models.IntegerField()
    skill_name = models.ForeignKey(
        EveItemType, on_delete=models.CASCADE, null=True, default=None)

    # Fields that may or may not be present
    finish_date = models.DateTimeField(null=True, default=None)
    level_end_sp = models.IntegerField(null=True, default=None)
    level_start_sp = models.IntegerField(null=True, default=None)
    start_date = models.DateTimeField(null=True, default=None)
    training_start_sp = models.IntegerField(null=True, default=None)

    @property
    def sp_hour(self):
        return -1  # do some math


def valid_skills(value):
    try:
        data = json.loads(value)
        for skill, level in data.items():
            if not EveItemType.objects.filter(name=skill).exists():
                raise ValidationError(
                    _(f'Please enter a valid skill name for `{skill}`. Hint: a known character must have trained the skill for auth to know about it.')
                )
            lvl = -1
            try:
                lvl = int(level)
            except ValueError:
                pass
            if lvl > 5 or lvl < 0:
                raise ValidationError(
                    _(f'Please enter a valid skill level for `{skill}`. Hint: between 0 and 5.')
                )
    except ValueError:
        raise ValidationError(
            _('Please check format for valid JSON. Hint: ["skill name": 4, "skill name 2": 1]')
        )


class SkillList(models.Model):
    last_update = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=500, null=True, default=None)
    skill_list = models.TextField(
        null=True, default="", validators=[valid_skills])
    show_on_audit = models.BooleanField(default=True)
    order_weight = models.IntegerField(default=0)

    def get_skills(self):
        return json.loads(self.skill_list)

    def __str__(self):
        return "({}){} (Updated: {})".format(self.order_weight, self.name, self.last_update.strftime("%Y-%m-%d %H:%M:%S"))
