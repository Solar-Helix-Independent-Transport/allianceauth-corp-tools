import datetime
import logging
from typing import ClassVar

from solo.models import SingletonModel

from django.db import models
from django.db.models import ExpressionWrapper, F, Func
from django.utils import timezone

from allianceauth.eveonline.models import EveCharacter, EveCorporationInfo

from .. import app_settings
from ..managers import AuditCharacterManager, AuditCorporationManager
from .eve_models import EveItemType, MapSystem

logger = logging.getLogger(__name__)


class EveLocation(models.Model):
    location_id = models.BigIntegerField(primary_key=True)
    location_name = models.CharField(max_length=255)
    system = models.ForeignKey(
        MapSystem, on_delete=models.SET_NULL, null=True, default=None)
    last_update = models.DateTimeField(auto_now=True)
    managed = models.BooleanField(default=False)
    managed_corp = models.ForeignKey(
        "CorporationAudit", default=None, blank=True, null=True, on_delete=models.CASCADE)
    managed_char = models.ForeignKey(
        "CharacterAudit", default=None, blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.location_name}"


class CorptoolsConfiguration(SingletonModel):
    holding_corps = models.ManyToManyField(EveCorporationInfo, blank=True)

    aggregate_lookback = models.IntegerField(
        default=90,
        help_text="Days to look back in aggregated views, like the mining ledger graphs."
    )

    disable_verification_assets = models.BooleanField(
        default=False,
        help_text="Allow ESI to provide data that does not match the ESI Assets Spec"
    )

    disable_verification_notifications = models.BooleanField(
        default=False,
        help_text="Allow ESI to provide data that does not match the ESI Notification Spec"
    )

    disable_update_pub_data = models.BooleanField(
        default=False,
        blank=True,
        help_text="Temporarily disable the ESI pulls for Character Pulic History Data"
    )

    disable_update_skills = models.BooleanField(
        default=False,
        blank=True,
        help_text="Temporarily disable the ESI pulls for Character SKill Data"
    )

    disable_update_clones = models.BooleanField(
        default=False,
        blank=True,
        help_text="Temporarily disable the ESI pulls for Character Clone Data"
    )

    disable_update_contacts = models.BooleanField(
        default=False,
        blank=True,
        help_text="Temporarily disable the ESI pulls for Character Contact Data"
    )

    disable_update_contracts = models.BooleanField(
        default=False,
        blank=True,
        help_text="Temporarily disable the ESI pulls for Character Contracts Data"
    )
    disable_update_assets = models.BooleanField(
        default=False,
        blank=True,
        help_text="Temporarily disable the ESI pulls for Character Asset Data"
    )

    disable_update_wallet = models.BooleanField(
        default=False,
        blank=True,
        help_text="Temporarily disable the ESI pulls for Character Wallet Data"
    )

    disable_update_notif = models.BooleanField(
        default=False,
        blank=True,
        help_text="Temporarily disable the ESI pulls for Character Notification Data"
    )

    disable_update_roles = models.BooleanField(
        default=False,
        blank=True,
        help_text="Temporarily disable the ESI pulls for Character Roles Data"
    )

    disable_update_mails = models.BooleanField(
        default=False,
        blank=True,
        help_text="Temporarily disable the ESI pulls for Character Mail Data"
    )

    disable_update_location = models.BooleanField(
        default=False,
        blank=True,
        help_text="Temporarily disable the ESI pulls for Character Location Data"
    )

    disable_update_loyaltypoints = models.BooleanField(
        default=False,
        blank=True,
        help_text="Temporarily disable the ESI pulls for Character Loyalty Point Data"
    )

    disable_update_mining = models.BooleanField(
        default=False,
        blank=True,
        help_text="Temporarily disable the ESI pulls for Character Mining Data"
    )

    disable_update_indy = models.BooleanField(
        default=False,
        blank=True,
        help_text="Temporarily disable the ESI pulls for Character industry Job Data"
    )

    class Meta:
        permissions = (
            ('holding_corp_structures',
             'Can access configured holding corp structure data.'),
            ('holding_corp_wallets', 'Can access configured holding corp wallet data.'),
            ('holding_corp_assets', 'Can access configured holding corp asset data.')
        )

        default_permissions = []

    def __str__(self) -> str:
        return "Corptools Configuration"

    def holding_corp_qs(self):
        return CorporationAudit.objects.filter(corporation__in=self.holding_corps.all())

    @classmethod
    def skip_verify_assets(cls):
        try:
            return cls.get_solo().disable_verification_assets
        except Exception as e:
            logger.error(e)
            return True

    @classmethod
    def skip_verify_notifications(cls):
        try:

            return cls.get_solo().disable_verification_notifications
        except Exception as e:
            logger.error(e)
            return True


def check_date(last_update, time_ref):
    date = last_update if last_update is not None else timezone.now() - \
        datetime.timedelta(days=99)
    return date > time_ref


class CharacterAudit(models.Model):

    objects: ClassVar[AuditCharacterManager] = AuditCharacterManager()

    active = models.BooleanField(default=False)

    character = models.OneToOneField(EveCharacter, on_delete=models.CASCADE)

    last_update_pub_data = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_skills = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_skill_que = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_clones = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_contacts = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_contracts = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_assets = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_wallet = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_orders = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_notif = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_roles = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_titles = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_mails = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_location = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_loyaltypoints = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_mining = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_indy = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_login = models.DateTimeField(
        null=True, default=None, blank=True)

    balance = models.DecimalField(
        max_digits=20, decimal_places=2, null=True, default=None)

    last_known_login = models.DateTimeField(
        null=True, default=None, blank=True)

    last_known_logoff = models.DateTimeField(
        null=True, default=None, blank=True)

    total_logins = models.IntegerField(
        null=True, default=None, blank=True)

    def __str__(self):
        return f"{self.character.character_name}'s Character Data"

    class Meta:
        permissions = (('corp_hr', 'Can access other character\'s data for own corp.'),
                       ('alliance_hr',
                        'Can access other character\'s data for own alliance.'),
                       ('state_hr', 'Can access other character\'s data for own state.'),
                       ('guest_hr', 'Can access guest users\'s data for HR purposes.'),
                       ('global_hr', 'Can access other character\'s data for characters in any corp/alliance/state.'))

    def is_active(self):
        time_ref = timezone.now() - datetime.timedelta(days=app_settings.CT_CHAR_MAX_INACTIVE_DAYS)
        ct_conf = CorptoolsConfiguration.get_solo()

        try:
            is_active = True
            if app_settings.CT_CHAR_ACTIVE_IGNORE_CORP_HISTORY and not ct_conf.disable_update_pub_data:
                is_active = is_active and check_date(
                    self.last_update_pub_data, time_ref)
            if app_settings.CT_CHAR_ASSETS_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_ASSETS_MODULE and not ct_conf.disable_update_assets:
                is_active = is_active and check_date(
                    self.last_update_assets, time_ref)
            if app_settings.CT_CHAR_CLONES_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_CLONES_MODULE and not ct_conf.disable_update_clones:
                is_active = is_active and check_date(
                    self.last_update_clones, time_ref)
            if app_settings.CT_CHAR_SKILLS_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_SKILLS_MODULE and not ct_conf.disable_update_skills:
                is_active = is_active and check_date(
                    self.last_update_skills, time_ref)
                is_active = is_active and check_date(
                    self.last_update_skill_que, time_ref)
            if app_settings.CT_CHAR_WALLET_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_WALLET_MODULE and not ct_conf.disable_update_wallet:
                is_active = is_active and check_date(
                    self.last_update_wallet, time_ref)
                is_active = is_active and check_date(
                    self.last_update_orders, time_ref)
            if app_settings.CT_CHAR_NOTIFICATIONS_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_NOTIFICATIONS_MODULE and not ct_conf.disable_update_notif:
                is_active = is_active and check_date(
                    self.last_update_notif, time_ref)
            if app_settings.CT_CHAR_ROLES_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_ROLES_MODULE and not ct_conf.disable_update_roles:
                is_active = is_active and check_date(
                    self.last_update_roles, time_ref)
            if app_settings.CT_CHAR_MAIL_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_MAIL_MODULE and not ct_conf.disable_update_mails:
                is_active = is_active and check_date(
                    self.last_update_mails, time_ref)
            if app_settings.CT_CHAR_LOYALTYPOINTS_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_LOYALTYPOINTS_MODULE and not ct_conf.disable_update_loyaltypoints:
                is_active = is_active and check_date(
                    self.last_update_loyaltypoints, time_ref)
            if app_settings.CT_CHAR_MINING_MODULE and not app_settings.CT_CHAR_ACTIVE_IGNORE_MINING_MODULE and not ct_conf.disable_update_mining:
                is_active = is_active and check_date(
                    self.last_update_mining, time_ref)

            if self.active != is_active:
                self.active = is_active
                self.save()

            return is_active
        except Exception as e:
            logger.error(e, exc_info=True)
            return False

    @classmethod
    def get_oldest_qs(cls):
        time_ref = timezone.now() - datetime.timedelta(
            days=app_settings.CT_CHAR_MAX_INACTIVE_DAYS * 3
        )

        ct_conf = CorptoolsConfiguration.get_solo()
        qs = []

        if app_settings.CT_CHAR_ASSETS_MODULE and not (
            app_settings.CT_CHAR_ACTIVE_IGNORE_ASSETS_MODULE or ct_conf.disable_update_assets
        ):
            qs.append(Func(F('last_update_assets'), function='UNIX_TIMESTAMP'))

        if app_settings.CT_CHAR_CLONES_MODULE and not (
            app_settings.CT_CHAR_ACTIVE_IGNORE_CLONES_MODULE or ct_conf.disable_update_clones
        ):
            qs.append(Func(F('last_update_clones'), function='UNIX_TIMESTAMP'))

        if app_settings.CT_CHAR_SKILLS_MODULE and not (
           app_settings.CT_CHAR_ACTIVE_IGNORE_SKILLS_MODULE or ct_conf.disable_update_skills
        ):  # NOQA E124
            qs.append(Func(F('last_update_skills'), function='UNIX_TIMESTAMP'))
            qs.append(Func(F('last_update_skill_que'),
                      function='UNIX_TIMESTAMP'))

        if app_settings.CT_CHAR_WALLET_MODULE and not (
           app_settings.CT_CHAR_ACTIVE_IGNORE_WALLET_MODULE or ct_conf.disable_update_wallet
        ):  # NOQA E124
            qs.append(Func(F('last_update_wallet'), function='UNIX_TIMESTAMP'))
            qs.append(Func(F('last_update_orders'), function='UNIX_TIMESTAMP'))

        if app_settings.CT_CHAR_NOTIFICATIONS_MODULE and not (
           app_settings.CT_CHAR_ACTIVE_IGNORE_NOTIFICATIONS_MODULE or ct_conf.disable_update_notif
        ):  # NOQA E124
            qs.append(Func(F('last_update_notif'), function='UNIX_TIMESTAMP'))

        if app_settings.CT_CHAR_ROLES_MODULE and not (
            app_settings.CT_CHAR_ACTIVE_IGNORE_ROLES_MODULE or ct_conf.disable_update_roles
        ):
            qs.append(Func(F('last_update_roles'), function='UNIX_TIMESTAMP'))

        if app_settings.CT_CHAR_MAIL_MODULE and not (
            app_settings.CT_CHAR_ACTIVE_IGNORE_MAIL_MODULE or ct_conf.disable_update_mails
        ):
            qs.append(Func(F('last_update_mails'), function='UNIX_TIMESTAMP'))

        if app_settings.CT_CHAR_LOYALTYPOINTS_MODULE and not (
            app_settings.CT_CHAR_ACTIVE_IGNORE_LOYALTYPOINTS_MODULE or ct_conf.disable_update_loyaltypoints
        ):
            qs.append(Func(F('last_update_loyaltypoints'),
                      function='UNIX_TIMESTAMP'))

        if app_settings.CT_CHAR_MINING_MODULE and not (
            app_settings.CT_CHAR_ACTIVE_IGNORE_MINING_MODULE or ct_conf.disable_update_mining
        ):
            qs.append(Func(F('last_update_mining'), function='UNIX_TIMESTAMP'))

        tot = len(qs)

        qout = qs.pop()

        for q in qs:
            qout = qout + q

        query = cls.objects.annotate(
            avg_date=Func(
                ExpressionWrapper(
                    qout / tot,
                    output_field=models.BigIntegerField()
                ),
                function='FROM_UNIXTIME',
                output_field=models.DateTimeField()
            )
        ).filter(
            character__character_ownership__isnull=False,
            avg_date__gte=time_ref
        ).order_by("avg_date")

        return query


class CorporationAudit(models.Model):

    objects: ClassVar[AuditCorporationManager] = AuditCorporationManager()

    corporation = models.OneToOneField(
        EveCorporationInfo, on_delete=models.CASCADE)

    last_update_pub_data = models.DateTimeField(
        null=True, default=None, blank=True)
    last_change_pub_data = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_assets = models.DateTimeField(
        null=True, default=None, blank=True)
    last_change_assets = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_structures = models.DateTimeField(
        null=True, default=None, blank=True)
    last_change_structures = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_moons = models.DateTimeField(
        null=True, default=None, blank=True)
    last_change_moons = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_observers = models.DateTimeField(
        null=True, default=None, blank=True)
    last_change_observers = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_wallet = models.DateTimeField(
        null=True, default=None, blank=True)
    last_change_wallet = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_contracts = models.DateTimeField(
        null=True, default=None, blank=True)
    last_change_contracts = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_industry_jobs = models.DateTimeField(
        null=True, default=None, blank=True)
    last_change_industry_jobs = models.DateTimeField(
        null=True, default=None, blank=True)

    last_update_known_login = models.DateTimeField(
        null=True, default=None, blank=True)

    def __str__(self):
        return f"{self.corporation.corporation_name}'s Corporation Data"

    class Meta:
        permissions = (
            ('own_corp_manager',
             'Can access own corporations\'s data.'),
            ('alliance_corp_manager',
             'Can access other corporations\'s data for own alliance.'),
            ('state_corp_manager',
             'Can access other corporations\'s data for own state.'),
            ('global_corp_manager', 'Can access all corporations\'s data.'),
            ('show_if_director',
             'Can access all corporations\'s where character is a director.'),
        )


class CharacterLocation(models.Model):
    character = models.OneToOneField(
        CharacterAudit, on_delete=models.CASCADE, related_name="location")

    current_location = models.ForeignKey(
        EveLocation, on_delete=models.CASCADE, null=True, blank=True, default=None)
    current_ship = models.ForeignKey(
        EveItemType, on_delete=models.CASCADE, null=True, blank=True, default=None)
    current_ship_unique = models.BigIntegerField(
        null=True, blank=True, default=None)
    current_ship_name = models.TextField(
        max_length=150, null=True, blank=True, default=None)
