from django.core.management.base import BaseCommand

from corptools.models import EveLocation, Structure


class Command(BaseCommand):
    help = 'Convert All Strucures to EveLocations'

    def handle(self, *args, **options):
        for s in Structure.objects.all():
            EveLocation.objects.update_or_create(
                location_id=s.structure_id,
                defaults={
                    "location_name": s.name,
                    "system_id": s.system_name.system_id
                }
            )
