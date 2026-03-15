# Standard Library
from datetime import timedelta
from unittest.mock import Mock, patch

# Django
from django.test import TestCase
from django.utils import timezone

# AA Example App
from corptools.models import EveName
from corptools.tasks.updates import update_eve_name


class TestUpdateEveName(TestCase):

    def setUp(self):
        """
        Setup test data

        :return:
        :rtype:
        """
        self.character_id = 12345
        self.corporation_id = 67890
        self.alliance_id = 11111

        self.character = EveName.objects.create(
            eve_id=self.character_id,
            name="Test Character",
            category=EveName.CHARACTER,
        )

        self.corporation = EveName.objects.create(
            eve_id=self.corporation_id,
            name="Test Corporation",
            category=EveName.CORPORATION,
        )

        self.alliance = EveName.objects.create(
            eve_id=self.alliance_id,
            name="Test Alliance",
            category=EveName.ALLIANCE,
        )

        past = timezone.now() - timedelta(days=31)
        EveName.objects.filter(
            eve_id=self.character_id).update(last_update=past)
        EveName.objects.filter(
            eve_id=self.corporation_id).update(last_update=past)
        EveName.objects.filter(
            eve_id=self.alliance_id).update(last_update=past)

    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_retries_when_error_flag_is_set(self, mock_get_error_flag):
        """
        Test retries when error flag is set

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :return:
        :rtype:
        """
        mock_get_error_flag.return_value = True

        with patch.object(
            update_eve_name, "retry", side_effect=Exception("Retry called")
        ):
            with self.assertRaises(Exception) as context:
                update_eve_name(self.character_id)

            self.assertEqual(str(context.exception), "Retry called")

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_does_not_update_when_name_does_not_need_update(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test does not update when not needed

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        self.character.last_update = timezone.now()
        self.character.save()

        update_eve_name(self.character_id)

        mock_eve_names.get_character.assert_not_called()

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_updates_character_name_with_no_corporation_or_alliance(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test updates cvharacter information, but ignores alliance and corp info

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        mock_update = Mock()
        mock_update.name = "Updated Character Name"
        mock_update.alliance = None
        mock_update.corp = None
        mock_eve_names.get_character.return_value = mock_update

        update_eve_name(self.character_id)

        self.character.refresh_from_db()
        self.assertEqual(self.character.name, "Updated Character Name")
        self.assertIsNone(self.character.alliance)
        self.assertIsNone(self.character.corporation)

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_updates_character_with_alliance_and_corporation(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test updates character information with corp and alliance

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        mock_alliance = Mock()
        mock_alliance.id = 99999
        mock_alliance.name = "New Alliance"

        mock_corp = Mock()
        mock_corp.id = 88888
        mock_corp.name = "New Corporation"

        mock_update = Mock()
        mock_update.name = "Character With Corp And Alliance"
        mock_update.alliance = mock_alliance
        mock_update.corp = mock_corp
        mock_eve_names.get_character.return_value = mock_update

        update_eve_name(self.character_id)

        self.character.refresh_from_db()
        self.assertEqual(self.character.name,
                         "Character With Corp And Alliance")
        self.assertIsNotNone(self.character.alliance)
        self.assertEqual(self.character.alliance.eve_id, 99999)
        self.assertEqual(self.character.alliance.name, "New Alliance")
        self.assertIsNotNone(self.character.corporation)
        self.assertEqual(self.character.corporation.eve_id, 88888)
        self.assertEqual(self.character.corporation.name, "New Corporation")

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_sets_corporation_alliance_when_character_has_alliance(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test sets corp and alliance when character has alliance

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        mock_alliance = Mock()
        mock_alliance.id = 55555
        mock_alliance.name = "Corporation Alliance"

        mock_corp = Mock()
        mock_corp.id = 44444
        mock_corp.name = "Corporation With Alliance"

        mock_update = Mock()
        mock_update.name = "Character Name"
        mock_update.alliance = mock_alliance
        mock_update.corp = mock_corp
        mock_eve_names.get_character.return_value = mock_update

        update_eve_name(self.character_id)

        self.character.refresh_from_db()
        corporation = EveName.objects.get(eve_id=44444)
        self.assertEqual(corporation.alliance_id, 55555)

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_updates_corporation_info(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test updates corporation info

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        mock_update = Mock()
        mock_update.corporation_name = "Updated Corporation Name"
        mock_update.alliance = None
        mock_eve_names.get_corp.return_value = mock_update

        update_eve_name(self.corporation_id)

        self.corporation.refresh_from_db()
        self.assertEqual(self.corporation.name, "Updated Corporation Name")

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_updates_corporation_with_alliance(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test updates corporation with alliance

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        mock_alliance = Mock()
        mock_alliance.id = 77777
        mock_alliance.name = "Corporation's Alliance"

        mock_update = Mock()
        mock_update.corporation_name = "Corporation With Alliance Name"
        mock_update.alliance = mock_alliance
        mock_eve_names.get_corp.return_value = mock_update

        update_eve_name(self.corporation_id)

        self.corporation.refresh_from_db()
        self.assertEqual(self.corporation.name,
                         "Corporation With Alliance Name")
        self.assertIsNotNone(self.corporation.alliance)
        self.assertEqual(self.corporation.alliance.eve_id, 77777)
        self.assertEqual(self.corporation.alliance.name,
                         "Corporation's Alliance")

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_updates_alliance_info(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test updates alliance info

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        mock_update = Mock()
        mock_update.name = "Updated Alliance Name"
        mock_eve_names.get_alliance.return_value = mock_update

        update_eve_name(self.alliance_id)

        self.alliance.refresh_from_db()
        self.assertEqual(self.alliance.name, "Updated Alliance Name")

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_sets_error_flag_when_exception_has_low_error_limit(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test sets error flag when exception has low error limit

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        exception = Exception("ESI Error")
        exception.response = Mock()
        exception.response.headers = {"x-esi-error-limit-remain": "10"}
        mock_eve_names.get_character.side_effect = exception

        update_eve_name(self.character_id)

        mock_set_error.assert_called_once()

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_does_not_set_error_flag_when_error_limit_is_high(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test does not set error flag when error limit is high

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        exception = Exception("ESI Error")
        exception.response = Mock()
        exception.response.headers = {"x-esi-error-limit-remain": "100"}
        mock_eve_names.get_character.side_effect = exception

        update_eve_name(self.character_id)

        mock_set_error.assert_not_called()

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_updates_last_update_when_exception_occurs(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test updates last_update when exception occurs

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """
        mock_get_error_flag.return_value = False

        exception = Exception("ESI Error")
        mock_eve_names.get_character.side_effect = exception

        old_last_update = self.character.last_update

        update_eve_name(self.character_id)

        self.character.refresh_from_db()
        self.assertGreater(self.character.last_update, old_last_update)

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_handles_exception_without_response_attribute(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test handles exception without response attribute

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        exception = Exception("Generic Error")
        mock_eve_names.get_character.side_effect = exception

        update_eve_name(self.character_id)

        self.character.refresh_from_db()
        mock_set_error.assert_not_called()

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_handles_exception_with_response_but_missing_header(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test handles exception without response attribute

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        exception = Exception("Error without specific header")
        exception.response = object()
        mock_eve_names.get_character.side_effect = exception

        update_eve_name(self.character_id)

        self.character.refresh_from_db()
        mock_set_error.assert_not_called()

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_creates_new_alliance_when_updating_character(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test creates new alliance when updating character

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        new_alliance_id = 123456

        mock_alliance = Mock()
        mock_alliance.id = new_alliance_id
        mock_alliance.name = "Brand New Alliance"

        mock_update = Mock()
        mock_update.name = "Character Name"
        mock_update.alliance = mock_alliance
        mock_update.corp = None
        mock_eve_names.get_character.return_value = mock_update

        self.assertFalse(EveName.objects.filter(
            eve_id=new_alliance_id).exists())

        update_eve_name(self.character_id)

        self.assertTrue(EveName.objects.filter(
            eve_id=new_alliance_id).exists())
        alliance = EveName.objects.get(eve_id=new_alliance_id)
        self.assertEqual(alliance.name, "Brand New Alliance")
        self.assertEqual(alliance.category, EveName.ALLIANCE)

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_creates_new_corporation_when_updating_character(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test creates new corporation when updating character

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        new_corp_id = 654321

        mock_corp = Mock()
        mock_corp.id = new_corp_id
        mock_corp.name = "Brand New Corporation"

        mock_update = Mock()
        mock_update.name = "Character Name"
        mock_update.alliance = None
        mock_update.corp = mock_corp
        mock_eve_names.get_character.return_value = mock_update

        self.assertFalse(EveName.objects.filter(eve_id=new_corp_id).exists())

        update_eve_name(self.character_id)

        self.assertTrue(EveName.objects.filter(eve_id=new_corp_id).exists())
        corporation = EveName.objects.get(eve_id=new_corp_id)
        self.assertEqual(corporation.name, "Brand New Corporation")
        self.assertEqual(corporation.category, EveName.CORPORATION)

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_updates_existing_alliance(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test updates existing alliance

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        existing_alliance = EveName.objects.create(
            eve_id=999888, name="Old Alliance Name", category=EveName.ALLIANCE
        )

        mock_alliance = Mock()
        mock_alliance.id = 999888
        mock_alliance.name = "Updated Alliance Name"

        mock_update = Mock()
        mock_update.corporation_name = "Corp Name"
        mock_update.alliance = mock_alliance
        mock_eve_names.get_corp.return_value = mock_update

        update_eve_name(self.corporation_id)

        existing_alliance.refresh_from_db()
        self.assertEqual(existing_alliance.name, "Updated Alliance Name")

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_updates_existing_corporation_when(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test updates existing corporation

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        existing_corp = EveName.objects.create(
            eve_id=888999, name="Old Corp Name", category=EveName.CORPORATION
        )

        mock_corp = Mock()
        mock_corp.id = 888999
        mock_corp.name = "Updated Corp Name"

        mock_update = Mock()
        mock_update.name = "Character Name"
        mock_update.alliance = None
        mock_update.corp = mock_corp
        mock_eve_names.get_character.return_value = mock_update

        update_eve_name(self.character_id)

        existing_corp.refresh_from_db()
        self.assertEqual(existing_corp.name, "Updated Corp Name")

    @patch("corptools.tasks.updates.set_error_count_flag")
    @patch("corptools.tasks.updates.eve_names")
    @patch("corptools.tasks.updates.get_error_count_flag")
    def test_handles_character_with_corporation_but_no_alliance(
        self, mock_get_error_flag, mock_eve_names, mock_set_error
    ):
        """
        Test handles character with corporation but no alliance

        :param mock_get_error_flag:
        :type mock_get_error_flag:
        :param mock_eve_names:
        :type mock_eve_names:
        :param mock_set_error:
        :type mock_set_error:
        :return:
        :rtype:
        """

        mock_get_error_flag.return_value = False

        mock_corp = Mock()
        mock_corp.id = 111222
        mock_corp.name = "Corp Without Alliance"

        mock_update = Mock()
        mock_update.name = "Character Name"
        mock_update.alliance = None
        mock_update.corp = mock_corp
        mock_eve_names.get_character.return_value = mock_update

        update_eve_name(self.character_id)

        self.character.refresh_from_db()
        corporation = EveName.objects.get(eve_id=111222)
        self.assertIsNone(corporation.alliance_id)
