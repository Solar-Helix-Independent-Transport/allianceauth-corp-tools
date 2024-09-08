from django.core.management.base import BaseCommand

from corptools.tasks import update_all_raw_minerals


class Command(BaseCommand):
    help = 'Update or Populate EVE Item prices for cat_id 4'

    def handle(self, *args, **options):
        self.stdout.write("Getting Prices")
        return update_all_raw_minerals()
