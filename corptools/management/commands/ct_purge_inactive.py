from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from allianceauth.authentication.models import State

from corptools.app_settings import CT_CHAR_NOTIFICATIONS_MODULE
from corptools.models import CharacterAudit


class Command(BaseCommand):
    help = 'Tidy up'

    def add_arguments(self, parser):
        parser.add_argument(
            "--purge",
            action='store_true',
            help='Remove all detatched characters.'
        )

        parser.add_argument(
            "--purge_guest",
            type=str,
            help='Remove all guest state audits, regardless of if they are active or not.'
        )

        parser.add_argument(
            '--purge_inactive',
            action='store_true',
            help='Remove all audits 14 days or more out of date (Based on Character Notification)'
        )

    def handle(self, *args, **options):
        self.stdout.write("Cleaning up CT Audits, this may take a while.")
        if options["purge_inactive"]:
            _c = CharacterAudit.objects.filter(
                character__character_ownership__isnull=True
            )
            self.stdout.write(f"Purging {_c.count()} Unlinked Characters")
            for _d in _c:
                _d.delete()

        if "purge" in options:
            try:
                _s = State.objects.get(name=options["purge"])
            except State.DoesNotExist:
                self.stdout.write(f"`{options['purge']}` state not found!")
            _c = CharacterAudit.objects.filter(
                character__character_ownership__user__profile__state=_s
            )
            self.stdout.write(
                f"This will purge {_c.count()} Characters in the {options['purge']} State")
            _in = input(
                "Are you sure you want to continue? type `yes` to continue: ")
            if _in.lower() == "yes":
                for _d in _c:
                    _d.delete()
            else:
                self.stdout.write("Skipped delete!")

        if options["purge_inactive"]:
            if CT_CHAR_NOTIFICATIONS_MODULE:
                start_time = timezone.now() - timedelta(days=14)
                _c = CharacterAudit.objects.filter(
                    last_update_notif__lte=start_time
                )
                self.stdout.write(f"Purging {_c.count()} inactive Characters")
                for _d in _c:
                    _d.delete()
            else:
                self.stdout.write(
                    "Notification module not active need to use other")
