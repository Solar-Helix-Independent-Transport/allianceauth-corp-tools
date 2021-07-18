from django.core.management.base import BaseCommand, CommandError

from corptools.tasks import update_or_create_map, process_ores_from_esi, update_ore_comp_table
from corptools.models import OreTaxRates


class Command(BaseCommand):
    help = 'Update or Populate base EVE Models'

    def add_arguments(self, parser):
        parser.add_argument('--inline', action='store_true',
                            help='Run update in this Console not via Celery')

    def handle(self, *args, **options):
        self.stdout.write("Confirming DB models!")
        if OreTaxRates.objects.all().count() == 0:
            OreTaxRates.objects.create(
                tag="Ore Tax",
                ore_rate=0.2,
                ubiquitous_rate=0.2,
                common_rate=0.2,
                uncommon_rate=0.2,
                rare_rate=0.2,
                excptional_rate=0.2
            )

        if options['inline']:
            self.stdout.write("Running Tasks inline this may take some time!")
            self.stdout.write("Starting Map Update")
            update_or_create_map()
            self.stdout.write("Starting Asteroid Data Update")
            process_ores_from_esi()
            self.stdout.write("Starting Ore Comp Update")
            update_ore_comp_table()
            self.stdout.write("Done Tasks!")
        else:
            self.stdout.write("Sending Tasks to celery for processing!")
            self.stdout.write("Sending Map Update Task")
            update_or_create_map.apply_async(priority=6)
            self.stdout.write("Sending Asteroid Data Task")
            process_ores_from_esi.apply_async(priority=6)
            self.stdout.write("Sending Ore Tasks")
            update_ore_comp_table.apply_async(priority=6)
            self.stdout.write("Done Tasks!")
