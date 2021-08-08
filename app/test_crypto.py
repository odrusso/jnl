import unittest
from unittest.mock import patch, Mock

import boto3.dynamodb.types

from crypto import create_new_hash_for_password, get_bytes_from_password, conform, verify_password_for_pigeonhole


@patch('dynamo.get_pigeonhole_data')
class CryptoUnitTests(unittest.TestCase):
    dynamo_mock = Mock()

    def test_can_create_hash_for_password_string(self, dynamo_mock):
        saltb64, hashb64 = create_new_hash_for_password("password")
        self.assertEqual(type(saltb64), type(b''))
        self.assertEqual(type(hashb64), type(b''))
        self.assertNotEqual(saltb64, b'')
        self.assertNotEqual(hashb64, b'')

    def test_creates_different_hahses_on_subsequent_runs(self, dynamo_mock):
        saltb64, hashb64 = create_new_hash_for_password("password")
        saltb64_1, hashb64_1 = create_new_hash_for_password("password")
        self.assertNotEqual(saltb64, saltb64_1)
        self.assertNotEqual(hashb64, hashb64_1)

    def test_can_transform_password_to_bytes(self, dynamo_mock):
        bytes = get_bytes_from_password("password")
        self.assertEqual(type(bytes), type(b""))

    def test_conforms_binary_to_string(self, dynamo_mock):
        result = conform(boto3.dynamodb.types.Binary(b"0000"))
        self.assertEqual(type(result), str)

    def test_conforms_string_to_string(self, dynamo_mock):
        result = conform("some value")
        self.assertEqual(type(result), str)

    def test_verifies_password_correctly(self, dynamo_mock: Mock):
        dynamo_mock.return_value = {
            "hash": b"pwNw0nTDGN/yIySi3uKkRfY0KfvoHNFH8rpaKPZ1A+Q=",
            "salt": b"/HIDr9LkFxRdNP836Htyx2WkZa7zdFGIH07SrGwY5Yk=",
            "messages": "{}"
        }
        result = verify_password_for_pigeonhole("name", "password")
        self.assertTrue(result)

    def test_verifies_incorrect_password_as_invalid(self, dynamo_mock: Mock):
        dynamo_mock.return_value = {
            "hash": b"pwNw0nTDGN/yIySi3uKkRfY0KfvoHNFH8rpaKPZ1A+Q=",
            "salt": b"/HIDr9LkFxRdNP836Htyx2WkZa7zdFGIH07SrGwY5Yk=",
            "messages": "{}"
        }
        result = verify_password_for_pigeonhole("name", "password1")
        self.assertFalse(result)
