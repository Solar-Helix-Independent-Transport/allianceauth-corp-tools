"""
Contacts and contact labels used a pk of str(audit pk) + str(esi id), which
collides across characters (audit 7001 label 12 == audit 70011 label 2), and
were flushed and recreated on every update. They now have a real pk, a unique
(character, esi id) and are synced in place.
"""
# Standard Library
from decimal import Decimal
from unittest.mock import MagicMock, patch

# AA Example App
from corptools.models import (
    CharacterAudit,
    CharacterContact,
    CharacterContactLabel,
    EveName,
)
from corptools.task_helpers.char_tasks import update_character_contacts

from . import CorptoolsTestCase

CHAR_TASKS = "corptools.task_helpers.char_tasks"


def _label(label_id, name):
    label = MagicMock(label_id=label_id)
    label.label_name = name
    return label


def _contact(contact_id, standing=5.0, label_ids=None, blocked=None, watched=None):
    return MagicMock(
        contact_id=contact_id, contact_type="character", standing=standing,
        is_blocked=blocked, is_watched=watched, label_ids=label_ids)


@patch(f"{CHAR_TASKS}.get_token")
@patch(f"{CHAR_TASKS}.providers")
class TestContactSync(CorptoolsTestCase):

    def setUp(self):
        super().setUp()
        for i in (90000001, 90000002, 90000003, 90000004):
            EveName.objects.create(
                eve_id=i, name=f"pilot {i}", category="character")

    def _run(self, mock_providers, mock_token, char, labels, contacts):
        mock_token.return_value = MagicMock()
        api = mock_providers.esi_openapi.client.Contacts
        api.GetCharactersCharacterIdContactsLabels.return_value.result.return_value = labels
        api.GetCharactersCharacterIdContacts.return_value.results.return_value = contacts
        update_character_contacts(char.character_id)

    def _labels_of(self, audit):
        return {
            c.contact_id: sorted(lbl.label_id for lbl in c.labels.all())
            for c in CharacterContact.objects.filter(character=audit)
        }

    def test_ids_no_longer_collide_across_characters(self, mock_providers, mock_token):
        CharacterAudit.objects.filter(pk=self.ca10.pk).delete()
        a = CharacterAudit.objects.create(id=7001, character=self.char9)
        b = CharacterAudit.objects.create(id=70011, character=self.char10)

        self._run(mock_providers, mock_token, self.char9,
                  [_label(12, "Blues")], [_contact(90000001, label_ids=[12])])
        self._run(mock_providers, mock_token, self.char10,
                  [_label(2, "Reds")], [_contact(90000001, label_ids=[2])])

        self.assertEqual(
            sorted(CharacterContactLabel.objects.values_list(
                "character_id", "label_id", "label_name")),
            [(7001, 12, "Blues"), (70011, 2, "Reds")])
        self.assertEqual(self._labels_of(a), {90000001: [12]})
        self.assertEqual(self._labels_of(b), {90000001: [2]})

    def test_refresh_updates_in_place(self, mock_providers, mock_token):
        self._run(mock_providers, mock_token, self.char1,
                  [_label(1, "Blues"), _label(2, "Reds"), _label(3, "Gone")],
                  [_contact(90000001, standing=5, label_ids=[1]),
                   _contact(90000002, standing=-5, label_ids=[2, 3]),
                   _contact(90000003)])
        contact_pks = dict(
            CharacterContact.objects.values_list("contact_id", "pk"))
        label_pks = dict(
            CharacterContactLabel.objects.values_list("label_id", "pk"))

        self._run(mock_providers, mock_token, self.char1,
                  [_label(1, "Friends"), _label(2, "Reds")],
                  [_contact(90000001, standing=10, label_ids=[1, 2], watched=True),
                   _contact(90000002, standing=-5, label_ids=[2]),
                   _contact(90000004, label_ids=[1])])

        contacts = {c.contact_id: c for c in CharacterContact.objects.filter(
            character=self.ca1)}
        self.assertEqual(set(contacts), {90000001, 90000002, 90000004})
        self.assertEqual(contacts[90000001].pk, contact_pks[90000001])
        self.assertEqual(contacts[90000002].pk, contact_pks[90000002])
        self.assertEqual(contacts[90000001].standing, Decimal("10.00"))
        self.assertTrue(contacts[90000001].watched)

        labels = {lbl.label_id: lbl for lbl in CharacterContactLabel.objects.filter(
            character=self.ca1)}
        self.assertEqual(set(labels), {1, 2})
        self.assertEqual(labels[1].pk, label_pks[1])
        self.assertEqual(labels[1].label_name, "Friends")

        self.assertEqual(
            self._labels_of(self.ca1),
            {90000001: [1, 2], 90000002: [2], 90000004: [1]})

    def test_unknown_label_on_contact_is_skipped(self, mock_providers, mock_token):
        self._run(mock_providers, mock_token, self.char1,
                  [_label(1, "Blues")],
                  [_contact(90000001, label_ids=[1, 99])])

        self.assertEqual(self._labels_of(self.ca1), {90000001: [1]})
