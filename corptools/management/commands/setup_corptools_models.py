from django.core.management.base import BaseCommand, CommandError

from corptools.models import OreTaxRates
from corptools.tasks import (process_ores_from_esi, update_or_create_map,
                             update_ore_comp_table)


class Command(BaseCommand):
    help = 'Update or Populate base EVE Models'

    def add_arguments(self, parser):
        parser.add_argument('--inline', action='store_true',
                            help='Run update in this Console not via Celery')

    def handle(self, *args, **options):
        self.stdout.write("Confirming DB models!")

        if options['inline']:
            self.stdout.write("Running Tasks inline this may take some time!")
            self.stdout.write("Starting Map Update")
            update_or_create_map()
            self.stdout.write("Done Tasks!")
        else:
            self.stdout.write("Sending Tasks to celery for processing!")
            self.stdout.write("Sending Map Update Task")
            update_or_create_map.apply_async(priority=6)
            self.stdout.write("Done Tasks!")
