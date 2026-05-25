# Standard Library
import datetime

# Django
from django.test import TestCase
from django.utils import timezone

from ..models.audits import CharacterAudit, CorptoolsConfiguration, check_date
from . import CorptoolsTestCase


class TestCheckDate(TestCase):
    def test_recent_date_returns_true(self):
        last_update = timezone.now() - datetime.timedelta(hours=1)
        time_ref = timezone.now() - datetime.timedelta(hours=2)
        self.assertTrue(check_date(last_update, time_ref))

    def test_old_date_returns_false(self):
        last_update = timezone.now() - datetime.timedelta(days=5)
        time_ref = timezone.now() - datetime.timedelta(days=1)
        self.assertFalse(check_date(last_update, time_ref))

    def test_none_last_update_treated_as_99_days_ago(self):
        # None means no update ever — treated as 99 days ago, so always stale
        time_ref = timezone.now() - datetime.timedelta(days=1)
        self.assertFalse(check_date(None, time_ref))


class TestCharacterAuditTimestamps(CorptoolsTestCase):
    def test_get_update_time_missing_key_returns_none(self):
        self.assertIsNone(self.ca1.get_update_time('nonexistent'))

    def test_set_and_get_update_time_roundtrip(self):
        before = timezone.now()
        self.ca1.set_update_time('skills')
        result = self.ca1.get_update_time('skills')
        after = timezone.now()
        self.assertIsNotNone(result)
        self.assertIsInstance(result, datetime.datetime)
        self.assertGreaterEqual(result, before.replace(microsecond=0))
        self.assertLessEqual(result, after)

    def test_set_update_time_overwrites_existing(self):
        self.ca1.set_update_time('skills')
        first = self.ca1.get_update_time('skills')
        self.ca1.set_update_time('skills')
        second = self.ca1.get_update_time('skills')
        self.assertGreaterEqual(second, first)

    def test_is_active_with_fresh_timestamps(self):
        now_iso = timezone.now().isoformat()
        self.ca1.update_timestamps = {
            'pub_data': now_iso,
            'assets': now_iso,
            'clones': now_iso,
            'skills': now_iso,
            'skill_que': now_iso,
            'wallet': now_iso,
            'orders': now_iso,
            'notif': now_iso,
            'roles': now_iso,
            'mails': now_iso,
            'loyaltypoints': now_iso,
            'mining': now_iso,
        }
        self.ca1.save()
        result = self.ca1.is_active()
        self.assertTrue(result)

    def test_is_active_with_stale_timestamps_returns_false(self):
        stale_iso = (timezone.now() - datetime.timedelta(days=200)).isoformat()
        self.ca1.update_timestamps = {'pub_data': stale_iso}
        self.ca1.save()
        result = self.ca1.is_active()
        self.assertFalse(result)

    def test_is_active_updates_active_field(self):
        self.ca1.active = True
        self.ca1.update_timestamps = {}
        self.ca1.save()
        self.ca1.is_active()
        self.ca1.refresh_from_db()
        self.assertFalse(self.ca1.active)


class TestCorptoolsConfigurationClassMethods(TestCase):
    def test_skip_verify_assets_default_false(self):
        CorptoolsConfiguration.objects.all().delete()
        config = CorptoolsConfiguration.objects.create()
        self.assertFalse(CorptoolsConfiguration.skip_verify_assets())

    def test_skip_verify_assets_when_enabled(self):
        CorptoolsConfiguration.objects.all().delete()
        CorptoolsConfiguration.objects.create(disable_verification_assets=True)
        self.assertTrue(CorptoolsConfiguration.skip_verify_assets())

    def test_skip_verify_notifications_default_false(self):
        CorptoolsConfiguration.objects.all().delete()
        CorptoolsConfiguration.objects.create()
        self.assertFalse(CorptoolsConfiguration.skip_verify_notifications())

    def test_skip_verify_notifications_when_enabled(self):
        CorptoolsConfiguration.objects.all().delete()
        CorptoolsConfiguration.objects.create(
            disable_verification_notifications=True)
        self.assertTrue(CorptoolsConfiguration.skip_verify_notifications())
