import unittest
from unittest.mock import patch, Mock

from crypto import create_new_hash_for_password


@patch('dynamo.get_pigeonhole_data')
class CryptoUnitTests(unittest.TestCase):
    dynamo_mock = Mock()

    def test_can_create_hash_for_password_string(self, dynamo_mock):
        saltb64, hashb64 = create_new_hash_for_password("password")
        self.assertEqual(type(saltb64), type(b''))
        self.assertEqual(type(hashb64), type(b''))
        self.assertNotEqual(saltb64, b'')
        self.assertNotEqual(hashb64, b'')

    def test_creates_different_hases_on_subsequent_runs(self, dynamo_mock):
        saltb64, hashb64 = create_new_hash_for_password("password")
        saltb64_1, hashb64_1 = create_new_hash_for_password("password")
        self.assertNotEqual(saltb64, saltb64_1)
        self.assertNotEqual(hashb64, hashb64_1)
