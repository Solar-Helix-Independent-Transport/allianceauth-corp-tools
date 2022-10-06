from django.core.management.base import BaseCommand
from django_celery_beat.models import CrontabSchedule, PeriodicTask

from corptools.models import OreTaxRates
from corptools.tasks import (process_ores_from_esi, update_or_create_map,
                             update_ore_comp_table)


class Command(BaseCommand):
    help = 'Bootstrap the CorpTools Module'

    def add_arguments(self, parser):
        parser.add_argument('--inline', action='store_true',
                            help='Run update in this Console not via Celery')

    def handle(self, *args, **options):
        self.stdout.write("Configuring Tasks!")
        schedule_char, _ = CrontabSchedule.objects.get_or_create(minute='15,45',
                                                                 hour='*',
                                                                 day_of_week='*',
                                                                 day_of_month='*',
                                                                 month_of_year='*',
                                                                 timezone='UTC'
                                                                 )

        schedule_corp, _ = CrontabSchedule.objects.get_or_create(minute='30',
                                                                 hour='*',
                                                                 day_of_week='*',
                                                                 day_of_month='*',
                                                                 month_of_year='*',
                                                                 timezone='UTC'
                                                                 )

        task_char = PeriodicTask.objects.update_or_create(
            task='corptools.tasks.update_subset_of_characters',
            defaults={
                'crontab': schedule_char,
                'name': 'Character Audit Rolling Update',
                'enabled': True
            }
        )

        task_corp = PeriodicTask.objects.update_or_create(
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
