# Django
from django.test import TestCase

# AA Example App
from corptools.utils import to_roman_numeral


class TestToRomanNumeral(TestCase):
    def test_single_values(self):
        self.assertEqual(to_roman_numeral(1), 'I')
        self.assertEqual(to_roman_numeral(4), 'IV')
        self.assertEqual(to_roman_numeral(5), 'V')
        self.assertEqual(to_roman_numeral(9), 'IX')
        self.assertEqual(to_roman_numeral(10), 'X')
        self.assertEqual(to_roman_numeral(40), 'XL')
        self.assertEqual(to_roman_numeral(50), 'L')

    def test_compound_values(self):
        self.assertEqual(to_roman_numeral(14), 'XIV')
        self.assertEqual(to_roman_numeral(42), 'XLII')
        self.assertEqual(to_roman_numeral(49), 'XLIX')

    def test_zero(self):
        self.assertEqual(to_roman_numeral(0), '')
