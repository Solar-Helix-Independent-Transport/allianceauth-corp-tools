# Generated by Django 3.2.8 on 2022-01-09 10:41

from django.db import migrations


def migrate_notifications(apps, schema_editor):
    Notification = apps.get_model('corptools', 'Notification')
    NotificationText = apps.get_model('corptools', 'NotificationText')

    newids = NotificationText.objects.all().values('notification_id')
    cnt = Notification.objects.all().exclude(notification_id__in=newids).count()
    cnt += Notification.objects.filter(note_text__isnull=True).count()

    if cnt > 0:
        raise AssertionError(
            f"Notifications have not been migrated fully, {cnt} missing notifications, please retry migrations. If Problem persists please contact the developers")


class Migration(migrations.Migration):

    dependencies = [
        ('corptools', '0065_notification_sync'),
    ]

    operations = [
        migrations.RunPython(migrate_notifications)
    ]
