"""
Exact response bodies for API endpoints that have (or had) loose `dict` /
`List` response declarations.

Giving an endpoint a real response schema changes what it returns at
runtime - ninja validates and serializes the response through the schema,
so a missing field is silently dropped and a wrong type is a 500. These pin
the JSON each endpoint returned before it got a schema, so the schema can't
quietly change it.
"""
# Standard Library
from datetime import datetime, timezone

# AA Example App
from corptools.models.eve_models import EveName
from corptools.models.interactions import MailLabel, MailMessage, MailRecipient

from . import CorptoolsTestCase


class ApiShapeTestCase(CorptoolsTestCase):
    def setUp(self):
        super().setUp()
        self.user1.is_superuser = True
        self.user1.save()
        self.client.force_login(self.user1)
        self.cid = self.char1.character_id

    def get_json(self, url):
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200, resp.content)
        return resp.json()


class TestMailShapes(ApiShapeTestCase):
    def setUp(self):
        super().setUp()
        sender = EveName.objects.create(
            eve_id=5001, name="Sender", category="character")
        named = EveName.objects.create(
            eve_id=5002, name="Named Recipient", category="character")
        r_named = MailRecipient.objects.create(
            recipient_id=5002, recipient_name=named, recipient_type="character")
        r_unnamed = MailRecipient.objects.create(
            recipient_id=6001, recipient_type="mailing_list")
        l_named = MailLabel.objects.create(
            character=self.ca1, label_id=1, label_name="Inbox")
        l_unnamed = MailLabel.objects.create(character=self.ca1, label_id=8)

        full = MailMessage.objects.create(
            id_key=1, character=self.ca1, mail_id=101, from_id=5001, from_name=sender,
            subject="Hello", timestamp=datetime(2026, 3, 4, 5, 6, 7, tzinfo=timezone.utc),
            body='<font size="12" color="#ff0000">Hi</font>',
        )
        full.recipients.add(r_named, r_unnamed)
        full.labels.add(l_named, l_unnamed)
        # everything optional left empty, sender known only by id
        MailMessage.objects.create(
            id_key=2, character=self.ca1, mail_id=102, from_id=7001,
            timestamp=datetime(2026, 3, 1, tzinfo=timezone.utc),
        )

    def test_mail_list(self):
        self.assertEqual(self.get_json(f"/audit/api/account/{self.cid}/mail"), [
            {
                "character": self.char1.character_name,
                "character_id": self.cid,
                "mail_id": 101,
                "subject": "Hello",
                "from": "Sender",
                "recipients": ["Named Recipient", "6001 (mailing_list)"],
                "labels": ["Inbox", 8],
                "timestamp": "2026-03-04T05:06:07Z",
            },
            {
                "character": self.char1.character_name,
                "character_id": self.cid,
                "mail_id": 102,
                "subject": None,
                "from": "7001",
                "recipients": [],
                "labels": [],
                "timestamp": "2026-03-01T00:00:00Z",
            },
        ])

    def test_mail_body(self):
        self.assertEqual(
            self.get_json(f"/audit/api/account/{self.cid}/mail/101"),
            {"body": '<font _size_="12" _color_="#ff0000">Hi</font>'},
        )
