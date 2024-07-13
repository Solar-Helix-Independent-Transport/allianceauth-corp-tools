from django.core.management.base import BaseCommand

from corptools.models import Notification
from corptools.task_helpers import sanitize_notification_type


class Command(BaseCommand):
    help = 'Update any known notifications that have "unknown type (####)"'

    def handle(self, *args, **options):
        knowns = Notification.objects.filter(
            notification_type__icontains="unknown notification type"
        )
        self.stdout.write(f"Found {knowns.count()} notifications that need updating")

        bad_types = []
        fixed_types = {}

        for note in knowns:
            new_type = sanitize_notification_type(note.notification_type)
            if new_type != note.notification_type:
                if new_type not in fixed_types:
                    fixed_types[new_type] = 0
                note.notification_type = new_type
                note.save()
                fixed_types[new_type] += 1
            else:
                if new_type not in bad_types:
                    self.stdout.write(
                        f"New Unknown Type '{new_type}'. Unable to update"
                    )
                    bad_types.append(new_type)

        self.stdout.write(
            f"Complete: {fixed_types}"
        )
