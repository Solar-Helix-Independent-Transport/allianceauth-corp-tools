from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from corptools.app_settings import CT_CHAR_NOTIFICATIONS_MODULE
from corptools.models import CharacterAudit


class Command(BaseCommand):
    help = 'Tidy up'

    def add_arguments(self, parser):
        parser.add_argument(
            "--purge_guest",
            action='store_true',
            help='Remove all guest state audits, regardless of if they are active or not.'
        )
        parser.add_argument(
            '--purge_inactive',
            action='store_true',
            help='Remove all audits 14 days or more out of date (Based on Character Notification)'
        )

    def handle(self, *args, **options):
        self.stdout.write("Cleaning up CT Audits, this may take a while.")
        # self.stdout.write(f"{options}")

        if options["purge_guest"]:
            _c = CharacterAudit.objects.filter(
                character__character_ownership__isnull=True
            )
            self.stdout.write(f"Purging {_c.count()} Unlinked Characters")
            for _d in _c:
                pass
                _d.delete()
            _c = CharacterAudit.objects.filter(
                character__character_ownership__user__profile__state__name="Guest"
            )
            self.stdout.write(f"Purging {_c.count()} Guest Characters")
            for _d in _c:
                pass
                _d.delete()

        if options["purge_inactive"]:
            if CT_CHAR_NOTIFICATIONS_MODULE:
                start_time = timezone.now() - timedelta(days=14)
                _c = CharacterAudit.objects.filter(
                    last_update_notif__lte=start_time
                )
                self.stdout.write(f"Purging {_c.count()} inactive Characters")
                for _d in _c:
                    pass
                    _d.delete()
            else:
                self.stdout.write("Notification module not active need to use other")
