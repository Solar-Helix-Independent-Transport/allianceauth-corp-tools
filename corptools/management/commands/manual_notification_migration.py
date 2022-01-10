from allianceauth import notifications
from django.core.management.base import BaseCommand, CommandError
from django.db.models import F
from corptools.models import Notification, NotificationText


class Command(BaseCommand):
    help = 'FIx a failed notification migration'

    def handle(self, *args, **options):
        self.stdout.write("Running Checks!")
        newids = NotificationText.objects.all().values('notification_id')
        cnt = Notification.objects.all().exclude(notification_id__in=newids).count()

        if cnt > 0:
            self.stdout.write(f"Found {cnt} unlinked notifications")
            note_ids = Notification.objects.all().exclude(
                notification_id__in=newids).values('notification_id').distinct().values('id')
            note_cnt = note_ids.count()
            start = 0
            step = 1000
            while start <= note_cnt:
                nids = list(Notification.objects.filter(id__in=note_ids).values(
                    'notification_id').distinct().order_by('id').values_list('id', flat=True)[start:start+step])
                n = Notification.objects.filter(id__in=nids).values('notification_id').distinct(
                ).values('notification_id', 'notification_text', 'notification_type')
                n.count()
                obs = []
                for i in n:
                    obs.append(NotificationText(notification_id=i['notification_id'],
                                                notification_text=i['notification_text']))
                NotificationText.objects.bulk_create(
                    obs, ignore_conflicts=True)
                start += step
                self.stdout.write(
                    f"Migrated {start} of {note_cnt} Starting database sync")
                Notification.objects.all().update(note_text=F("notification_id"))
        else:
            self.stdout.write(f"Found no unlinked notifications")
