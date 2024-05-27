from django.core.management.base import BaseCommand

from corptools.tasks import update_category


class Command(BaseCommand):
    help = 'Update or Populate EVE Item Categories'

    def add_arguments(self, parser):
        parser.add_argument('category_ids', nargs='+', type=int)
        parser.add_argument('--inline', action='store_true',
                            help='Run update in this Console not via Celery')

    def handle(self, *args, **options):
        self.stdout.write(f"{options}")

        if len(options["category_ids"]) == 0:
            return self.stdout.write("No Categories!")

        for c in options["category_ids"]:

            if options['inline']:
                self.stdout.write(
                    "Running Tasks inline this may take some time!")
                update_category(c)
            else:
                self.stdout.write("Sending Tasks to celery for processing!")
                update_category.delay(c)
