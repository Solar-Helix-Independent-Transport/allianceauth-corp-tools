from celery.schedules import crontab
from django_celery_beat.models import CrontabSchedule, PeriodicTask

from django.core.management.base import BaseCommand

from allianceauth.crontab.utils import offset_cron

from corptools.tasks import update_or_create_map


class Command(BaseCommand):
    help = 'Bootstrap the CorpTools Module'

    def add_arguments(self, parser):
        parser.add_argument('--inline', action='store_true',
                            help='Run update in this Console not via Celery')

    def handle(self, *args, **options):
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

        self.stdout.write("Populating DB models!")
        if options['inline']:
            self.stdout.write("Running Tasks inline this may take some time!")
            self.stdout.write("Starting Map Update")
            update_or_create_map()
            self.stdout.write("Done Tasks!")
        else:
            self.stdout.write("Sending Tasks to celery for processing!")
            self.stdout.write("Sending Map Update Task")
            update_or_create_map.apply_async(priority=6)
            self.stdout.write("Tasks Queued!")
