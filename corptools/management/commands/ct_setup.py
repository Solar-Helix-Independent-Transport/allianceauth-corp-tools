# Third Party
from celery.schedules import crontab
from django_celery_beat.models import CrontabSchedule, PeriodicTask
from eve_sde.models import EveSDE

# Django
from django.core.management.base import BaseCommand
from django.utils.timezone import now
from datetime import timedelta

# Alliance Auth
from allianceauth.crontab.utils import offset_cron


class Command(BaseCommand):
    help = 'Bootstrap the CorpTools Module'

    def handle(self, *args, **options) -> None:

        sde_record = EveSDE.objects.all().first()
        last_sde_update = sde_record.last_check_date if sde_record is not None else None

        print(" Running a check for eve_sde data freshness...")
        if last_sde_update is None or last_sde_update < now() - timedelta(days=1):
            print(last_sde_update)
            raise Exception(
                "The eve_sde app has not been updated in the last 24h.\n"
                "Please run the `esde_load_sde` management command to sync the data before running this command.")
        print(" eve_sde data is up to date. Proceeding with command...")

        self.stdout.write("Configuring Tasks!")

        schedule_a = CrontabSchedule.from_schedule(
            offset_cron(crontab(minute='15,45')))
        schedule_char, created = CrontabSchedule.objects.get_or_create(
            minute=schedule_a.minute,
            hour=schedule_a.hour,
            day_of_month=schedule_a.day_of_month,
            month_of_year=schedule_a.month_of_year,
            day_of_week=schedule_a.day_of_week,
            timezone=schedule_a.timezone,
        )

        schedule_b = CrontabSchedule.from_schedule(
            offset_cron(crontab(minute='30', hour='*')))
        schedule_corp, schedule_corp_created = CrontabSchedule.objects.get_or_create(
            minute=schedule_b.minute,
            hour=schedule_b.hour,
            day_of_month=schedule_b.day_of_month,
            month_of_year=schedule_b.month_of_year,
            day_of_week=schedule_b.day_of_week,
            timezone=schedule_b.timezone,
        )

        PeriodicTask.objects.update_or_create(
            task='corptools.tasks.update_subset_of_characters',
            defaults={
                'crontab': schedule_char,
                'name': 'Character Audit Rolling Update',
                'enabled': True
            }
        )

        PeriodicTask.objects.update_or_create(
            task='corptools.tasks.update_all_corps',
            defaults={
                'crontab': schedule_corp,
                'name': 'Corporation Audit Update',
                'enabled': True
            }
        )
