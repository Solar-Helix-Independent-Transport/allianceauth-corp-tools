from model_utils import Choices

from django.db import models
from django.utils.translation import gettext_lazy as _

from .audits import CharacterAudit, CorporationAudit
from .eve_models import EveName


class NotificationText(models.Model):
    notification_id = models.BigIntegerField(primary_key=True)
    notification_text = models.TextField(null=True, default=None)


class Notification(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    notification_id = models.BigIntegerField()
    sender_id = models.IntegerField()
    _type_enum = Choices('character', 'corporation',
                         'alliance', 'faction', 'other')
    sender_type = models.CharField(max_length=15, choices=_type_enum)
    timestamp = models.DateTimeField()
    notification_type = models.CharField(max_length=50)
    is_read = models.BooleanField(null=True, default=None)
    notification_text = models.ForeignKey(
        NotificationText, on_delete=models.CASCADE, blank=True, null=True, default=None)

    class Meta:
        indexes = (
            models.Index(fields=['timestamp']),
            models.Index(fields=['notification_type'])
        )


class MailLabel(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    label_id = models.IntegerField(default=None)
    label_name = models.CharField(max_length=255, null=True, default=None)
    label_color = models.CharField(max_length=7, null=True, default=None)
    unread_count = models.IntegerField(null=True, default=None)


class MailRecipient(models.Model):
    recipient_id = models.BigIntegerField(primary_key=True, unique=True)
    recipient_name = models.ForeignKey(
        EveName, on_delete=models.SET_NULL, null=True, default=None)
    _recipient_enum = Choices('alliance', 'character',
                              'corporation', 'mailing_list')
    recipient_type = models.CharField(max_length=15, choices=_recipient_enum)


class MailMessage(models.Model):
    id_key = models.BigIntegerField(primary_key=True, unique=True)
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    # headers
    mail_id = models.IntegerField(null=True, default=None)
    from_id = models.IntegerField(null=True, default=None)
    from_name = models.ForeignKey(
        EveName, on_delete=models.SET_NULL, null=True, default=None)

    recipients = models.ManyToManyField(MailRecipient)
    labels = models.ManyToManyField(MailLabel)
    is_read = models.BooleanField(null=True, default=False)
    timestamp = models.DateTimeField(null=True, default=None)

    # message
    subject = models.CharField(max_length=255, null=True, default=None)

    # not in bulk data
    body = models.CharField(max_length=12000, null=True, default=None)


class Contact(models.Model):
    id = models.BigIntegerField(primary_key=True)
    contact_id = models.BigIntegerField()
    contact_type = models.CharField(max_length=255, null=False)
    contact_name = models.ForeignKey(EveName, on_delete=models.CASCADE)
    standing = models.DecimalField(max_digits=4, decimal_places=2)

    class Meta:
        abstract = True


class ContactLabel(models.Model):
    id = models.BigIntegerField(primary_key=True)
    label_id = models.BigIntegerField()
    label_name = models.CharField(max_length=255, null=False)

    class Meta:
        abstract = True


class CharacterContactLabel(ContactLabel):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    def build_id(self):
        self.id = int(str(self.character_id) + str(self.label_id))
        return self.id


class CorporationContactLabel(ContactLabel):
    corporation = models.ForeignKey(CorporationAudit, on_delete=models.CASCADE)


class CharacterContact(Contact):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)
    blocked = models.BooleanField(default=False)
    watched = models.BooleanField(default=False)
    labels = models.ManyToManyField(CharacterContactLabel)

    def build_id(self):
        self.id = int(str(self.character_id) + str(self.contact_id))
        return self.id


class CorporationContact(Contact):
    corporation = models.ForeignKey(CorporationAudit, on_delete=models.CASCADE)
    watched = models.BooleanField(default=False)
    labels = models.ManyToManyField(CorporationContactLabel)


class LoyaltyPoint(models.Model):
    character = models.ForeignKey(
        CharacterAudit, verbose_name=_("Character"), on_delete=models.CASCADE)
    corporation = models.ForeignKey(
        EveName, verbose_name=_("NPC Corporation"), on_delete=models.CASCADE)
    amount = models.IntegerField(_("LP"))

    class Meta:
        verbose_name = _("Loyalty Point")
        unique_together = ('character', 'corporation',)

    def __str__(self):
        return f"{self.character} - {self.corporation}"


class CorporationHistory(models.Model):
    character = models.ForeignKey(CharacterAudit, on_delete=models.CASCADE)

    corporation_id = models.IntegerField()
    corporation_name = models.ForeignKey(EveName, on_delete=models.CASCADE)
    is_deleted = models.BooleanField(null=True, default=None)
    record_id = models.IntegerField()
    start_date = models.DateTimeField()


class CharacterTitle(models.Model):
    title_id = models.IntegerField()
    title = models.CharField(max_length=500)
    corporation_id = models.BigIntegerField()
    corporation_name = models.CharField(max_length=500)

    def __str__(self):
        return f"({self.corporation_name}) - {self.title}"


class CharacterRoles(models.Model):
    character = models.OneToOneField(CharacterAudit, on_delete=models.CASCADE)

    director = models.BooleanField(default=False)
    accountant = models.BooleanField(default=False)
    station_manager = models.BooleanField(default=False)
    personnel_manager = models.BooleanField(default=False)

    titles = models.ManyToManyField(CharacterTitle)
