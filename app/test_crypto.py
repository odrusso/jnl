import hmac
import os
import re
import unittest
from unittest.mock import patch, Mock

from crypto import create_new_hash_for_password, get_bytes_from_password, create_user_token, \
    validate_user_token, verify_password, decode_value


@patch('dynamo.get_pigeonhole_data')
class CryptoUnitTests(unittest.TestCase):
    dynamo_mock = Mock()

    def test_can_create_hash_for_password_string(self, dynamo_mock):
        saltb64, hashb64 = create_new_hash_for_password("password")
        self.assertEqual(type(saltb64), type(''))
        self.assertEqual(type(hashb64), type(''))
        self.assertNotEqual(saltb64, '')
        self.assertNotEqual(hashb64, '')

    def test_creates_different_hahses_on_subsequent_runs(self, dynamo_mock):
        saltb64, hashb64 = create_new_hash_for_password("password")
        saltb64_1, hashb64_1 = create_new_hash_for_password("password")
        self.assertNotEqual(saltb64, saltb64_1)
        self.assertNotEqual(hashb64, hashb64_1)

    def test_can_transform_password_to_bytes(self, dynamo_mock):
        bytes = get_bytes_from_password("password")
        self.assertEqual(type(bytes), type(b""))

    def test_token_stuff(self, dynamo_mock):
        os.environ['signingSecret'] = "0"

        message = "username"

        digest1 = create_user_token(message)
        digest2 = create_user_token(message)

        self.assertEqual(digest1, digest2)
        self.assertTrue(hmac.compare_digest(digest1, digest2))

        self.assertTrue(validate_user_token(message, digest1))
        self.assertTrue(validate_user_token(message, digest2))

    def test_regex_stuff(self, dynamo_mock):
        exampleCookie = "username=someguy123ThisUsername; Expiry=whatever; someOther=12319025':LA''''SCrap;,..,,token=ASDkjlasjd98123bjkzIAUSD==;"
        username = re.search("username=([a-zA-Z0-9]+);", exampleCookie).group(1)
        token = re.search("token=([a-zA-Z0-9=\+/]+);", exampleCookie).group(1)

        self.assertEqual(username, "someguy123ThisUsername")
        self.assertEqual(token, "ASDkjlasjd98123bjkzIAUSD==")

    def test_list_splicing_lol(self, dynamo_mock):
        og_username = "123somebody=with=equals=sights1;'23==''"
        cookie = f"user={og_username}"
        key = "user"
        username = cookie[len(key) + 1:]
        self.assertEqual(username, og_username)

    def test_verifies_password_correctly(self, dynamo_mock: Mock):
        hash = "pwNw0nTDGN/yIySi3uKkRfY0KfvoHNFH8rpaKPZ1A+Q="
        salt = "/HIDr9LkFxRdNP836Htyx2WkZa7zdFGIH07SrGwY5Yk="

        result = verify_password(hash, salt, "password")
        self.assertTrue(result)

    def test_fullstack(self, dynamo_mock):
        hash, salt = create_new_hash_for_password("password")

        self.assertEqual(type(hash), type(''))
        self.assertEqual(type(salt), type(''))

        result = verify_password(hash, salt, "password")
        self.assertTrue(result)