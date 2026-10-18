"""
update_character_notifications only skipped notifications already among the
character's newest 500 stored. Anything older that was still in ESI's window
was inserted again on every update (Notification has no unique constraint).
"""
# Standard Library
from datetime import timedelta
from unittest.mock import MagicMock, patch

# Django
from django.utils import timezone

# AA Example App
from corptools.models import Notification, NotificationText
from corptools.task_helpers.char_tasks import update_character_notifications

from . import CorptoolsTestCase

CHAR_TASKS = "corptools.task_helpers.char_tasks"


def _esi_note(notification_id, timestamp):
    return MagicMock(
        notification_id=notification_id, sender_id=1000125,
        sender_type="corporation", timestamp=timestamp,
        type="StructureUnderAttack", is_read=False, text="text",
    )


class TestNotificationDedup(CorptoolsTestCase):

    def _store(self, notification_id, timestamp):
        NotificationText.objects.get_or_create(
            notification_id=notification_id, defaults={"notification_text": "text"})
        Notification.objects.create(
            character=self.ca1, notification_id=notification_id, sender_id=1,
            sender_type="corporation", timestamp=timestamp,
            notification_type="StructureUnderAttack",
            notification_text_id=notification_id,
        )

    @patch(f"{CHAR_TASKS}.get_token")
    @patch(f"{CHAR_TASKS}.providers")
    def test_old_notification_outside_newest_500_is_not_duplicated(self, mock_providers, mock_get_token):
        now = timezone.now()
        old = now - timedelta(days=20)
        self._store(1, old)
        for n in range(500):
            self._store(1000 + n, now - timedelta(minutes=n))

        mock_get_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Character.GetCharactersCharacterIdNotifications.return_value.result.return_value = [
            # still in ESI's window, but not in the newest 500
            _esi_note(1, old),
            _esi_note(2, now),     # new
            _esi_note(2, now),     # repeated within the response
        ]

        update_character_notifications(self.char1.character_id)

        self.assertEqual(
            Notification.objects.filter(character=self.ca1, notification_id=1).count(), 1)
        self.assertEqual(
            Notification.objects.filter(character=self.ca1, notification_id=2).count(), 1)

    @patch(f"{CHAR_TASKS}.get_token")
    @patch(f"{CHAR_TASKS}.providers")
    def test_same_notification_for_another_character_is_still_stored(self, mock_providers, mock_get_token):
        # Corp notifications go to many characters with the same id - the
        # check must stay per character.
        now = timezone.now()
        NotificationText.objects.create(
            notification_id=7, notification_text="text")
        Notification.objects.create(
            character=self.ca2, notification_id=7, sender_id=1,
            sender_type="corporation", timestamp=now,
            notification_type="StructureUnderAttack", notification_text_id=7,
        )
        mock_get_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Character.GetCharactersCharacterIdNotifications.return_value.result.return_value = [
            _esi_note(7, now)]

        update_character_notifications(self.char1.character_id)

        self.assertTrue(
            Notification.objects.filter(character=self.ca1, notification_id=7).exists())
