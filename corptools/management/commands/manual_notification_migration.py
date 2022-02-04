from allianceauth import notifications
from django.core.management.base import BaseCommand, CommandError
from django.db.models import F
from corptools.models import Notification, NotificationText
from django.db.migrations.recorder import MigrationRecorder


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
                nids = list(Notification.objects.filter(
                    id__in=note_ids).values(
                        'notification_id').distinct().order_by('id').values_list(
                            'id', flat=True)[start:start+step])
                n = Notification.objects.filter(
                    id__in=nids).values('notification_id').distinct().values(
                    'notification_id', 'notification_text')
                n.count()
                obs = []
                for i in n:
                    obs.append(NotificationText(notification_id=i['notification_id'],
                                                notification_text=i['notification_text']))
                NotificationText.objects.bulk_create(
                    obs, ignore_conflicts=True)
                start += step
                migration_68 = MigrationRecorder.Migration.objects.filter(
                    app="corptools", name="0068_rename_note_text_notification_notification_text"
                ).exists()
                if migration_68:
                    self.stdout.write(
                        f"Migrated, Starting database sync")
                    Notification.objects.all().update(notification_text=F("notification_id"))
                else:
                    self.stdout.write(
                        f"Completed Tidy up, Please continue with the migrations.")
        else:
            self.stdout.write(f"Found no unlinked notifications")
