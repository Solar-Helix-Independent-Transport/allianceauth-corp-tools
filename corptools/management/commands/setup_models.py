from django.core.management.base import BaseCommand, CommandError

from corptools.tasks import update_or_create_map, process_ores_from_esi, update_ore_comp_table

class Command(BaseCommand):
    help = 'Update or Populate base EVE Models'

    def add_arguments(self, parser):
        parser.add_argument('--inline', action='store_true', help='Run update in this Console not via Celery')

    def handle(self, *args, **options):
        if options['inline']:
            self.stdout.write("Running Tasks inline this may take some time!")
            self.stdout.write("Starting Map Update")
            update_or_create_map()
            self.stdout.write("Starting Asteroid Data Update")
            process_ores_from_esi()
            self.stdout.write("Starting Ore Comp Update")
            update_ore_comp_table()
            self.stdout.write("Done!")
        else:
            self.stdout.write("Sending Tasks to celery for processing!")
            self.stdout.write("Starting Map Update Task")
            update_or_create_map.apply_async(priority=6)
            self.stdout.write("Starting Asteroid Data Task")
            process_ores_from_esi.apply_async(priority=6)
            self.stdout.write("Starting Ore Comp Task")
            update_ore_comp_table.apply_async(priority=6)
            self.stdout.write("Done!")

