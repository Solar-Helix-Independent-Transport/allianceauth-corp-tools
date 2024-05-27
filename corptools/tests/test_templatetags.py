from django import forms
from django.test import TestCase

from corptools.templatetags import colors, helpers


class test_form(forms.Form):
    dummy_field = forms.IntegerField()


class TestHelpers(TestCase):

    def test_add_class(self):
        f = test_form()
        test_class = 'class="this_test_class"'
        self.assertFalse(test_class in str(f["dummy_field"]))
        self.assertTrue(test_class in str(
            helpers.addclass(f["dummy_field"], "this_test_class")))

    def test_subtract(self):
        self.assertTrue(helpers.subtract(10, 5) == 5)
        self.assertTrue(helpers.subtract(5, 10) == -5)

    def test_app_settings(self):
        self.assertIsNotNone(helpers.app_setting().get_character_scopes())

    def test_deslug(self):
        self.assertEqual(helpers.deslug("abcd_efgh"), "abcd efgh")
        self.assertEqual(helpers.deslug(15), 15)
        self.assertEqual(helpers.deslug('abcdefgh'), "abcdefgh")

    def test_skill_circles(self):
        lvl5 = '<div role="text" aria-label="Level 5"><span class="fas fa-circle"></span> <span class="fas fa-circle"></span> <span class="fas fa-circle"></span> <span class="fas fa-circle"></span> <span class="fas fa-circle"></span> </div>'
        lvl4 = '<div role="text" aria-label="Level 4"><span class="fas fa-circle"></span> <span class="fas fa-circle"></span> <span class="fas fa-circle"></span> <span class="fas fa-circle"></span> <span class="far fa-circle"></span> </div>'
        lvl3 = '<div role="text" aria-label="Level 3"><span class="fas fa-circle"></span> <span class="fas fa-circle"></span> <span class="fas fa-circle"></span> <span class="far fa-circle"></span> <span class="far fa-circle"></span> </div>'
        lvl2 = '<div role="text" aria-label="Level 2"><span class="fas fa-circle"></span> <span class="fas fa-circle"></span> <span class="far fa-circle"></span> <span class="far fa-circle"></span> <span class="far fa-circle"></span> </div>'
        lvl1 = '<div role="text" aria-label="Level 1"><span class="fas fa-circle"></span> <span class="far fa-circle"></span> <span class="far fa-circle"></span> <span class="far fa-circle"></span> <span class="far fa-circle"></span> </div>'
        lvl0 = '<div role="text" aria-label="Level 0"><span class="far fa-circle"></span> <span class="far fa-circle"></span> <span class="far fa-circle"></span> <span class="far fa-circle"></span> <span class="far fa-circle"></span> </div>'

        lvl3and5 = '<div role="text" aria-label="Level 3"><span class="fas fa-circle"></span> <span class="fas fa-circle"></span> <span class="fas fa-circle"></span> <span class="fas fa-circle text-danger"></span> <span class="fas fa-circle text-danger"></span> </div>'

        self.assertEqual(helpers.skill_level(5, 5), lvl5)
        self.assertEqual(helpers.skill_level(4, 4), lvl4)
        self.assertEqual(helpers.skill_level(3, 3), lvl3)
        self.assertEqual(helpers.skill_level(2, 2), lvl2)
        self.assertEqual(helpers.skill_level(1, 1), lvl1)
        self.assertEqual(helpers.skill_level(0, 0), lvl0)

        self.assertEqual(helpers.skill_level(3, 5), lvl3and5)


class TestColours(TestCase):

    def test_rand_colour(self):
        self.assertEqual(len(colors.random_bright_colour()), 7)
        self.assertTrue(0 <= int(colors.random_bright_colour()[1:3], 16) < 256)
        self.assertTrue(0 <= int(colors.random_bright_colour()[3:5], 16) < 256)
        self.assertTrue(0 <= int(colors.random_bright_colour()[5:], 16) < 256)
