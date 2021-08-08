import unittest
import app.crypto


class CryptoUnitTests(unittest.TestCase):
    def test_can_create_hash_for_password_string(self):
        saltb64, hashb64 = app.crypto.create_new_hash_for_password("password")
        self.assertEqual(type(saltb64), type(b''))
        self.assertEqual(type(hashb64), type(b''))
        self.assertNotEqual(saltb64, b'')
        self.assertNotEqual(hashb64, b'')

    def test_creates_different_hases_on_subsequent_runs(self):
        saltb64, hashb64 = app.crypto.create_new_hash_for_password("password")
        saltb64_1, hashb64_1 = app.crypto.create_new_hash_for_password("password")
        self.assertNotEqual(saltb64, saltb64_1)
        self.assertNotEqual(hashb64, hashb64_1)

