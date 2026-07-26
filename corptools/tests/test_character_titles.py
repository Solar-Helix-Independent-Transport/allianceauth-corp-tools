# Standard Library
from unittest.mock import MagicMock, patch

# AA Example App
from corptools.models import CharacterAudit, CharacterRoles
from corptools.task_helpers.char_tasks import update_character_titles

from . import CorptoolsTestCase


def _title(title_id, name="Test Title"):
    t = MagicMock()
    t.title_id = title_id
    t.name = name
    return t


class TestUpdateCharacterTitles(CorptoolsTestCase):
    def setUp(self):
        super().setUp()
        self.audit, _ = CharacterAudit.objects.get_or_create(
            character=self.char1)

    @patch("corptools.task_helpers.char_tasks.get_token")
    @patch("corptools.task_helpers.char_tasks.providers")
    def test_creates_character_roles_row_when_missing(self, mock_providers, mock_get_token):
        # Regression test: titles previously assumed the roles task had
        # already created CharacterRoles for this character - if it hadn't
        # (e.g. the character lacks the roles scope but has the titles
        # scope), accessing audit_char.characterroles raised
        # RelatedObjectDoesNotExist.
        self.assertFalse(CharacterRoles.objects.filter(
            character=self.audit).exists())
        mock_get_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Character.GetCharactersCharacterIdTitles.return_value.result.return_value = [
            _title(1, "CEO")
        ]

        update_character_titles(self.char1.character_id)

        role_model = CharacterRoles.objects.get(character=self.audit)
        self.assertEqual([t.title for t in role_model.titles.all()], ["CEO"])

    @patch("corptools.task_helpers.char_tasks.get_token")
    @patch("corptools.task_helpers.char_tasks.providers")
    def test_clears_titles_when_none_returned(self, mock_providers, mock_get_token):
        role_model = CharacterRoles.objects.create(character=self.audit)
        mock_get_token.return_value = MagicMock()
        mock_providers.esi_openapi.client.Character.GetCharactersCharacterIdTitles.return_value.result.return_value = [
            _title(1, "CEO")
        ]
        update_character_titles(self.char1.character_id)
        self.assertEqual(role_model.titles.count(), 1)

        mock_providers.esi_openapi.client.Character.GetCharactersCharacterIdTitles.return_value.result.return_value = []
        update_character_titles(self.char1.character_id)
        self.assertEqual(role_model.titles.count(), 0)

    @patch("corptools.task_helpers.char_tasks.get_token")
    def test_no_token_returns_false(self, mock_get_token):
        mock_get_token.return_value = False
        result = update_character_titles(self.char1.character_id)
        self.assertFalse(result)
        self.assertFalse(CharacterRoles.objects.filter(
            character=self.audit).exists())
