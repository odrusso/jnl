import hashlib
import base64
import hmac
import os
import boto3.dynamodb.types


def get_signing_secret():
    return os.environ.get('signingSecret', default=False)


def verify_password(raw_hash: str, raw_salt: str, password_attempt: str) -> bool:
    verification_password_bytes = decode_value(raw_hash)
    raw_salt = decode_value(raw_salt)

    this_password_bytes = gen_hash_for_password(password_attempt, raw_salt)

    return this_password_bytes == verification_password_bytes


def decode_value(raw_value: str) -> bytes:
    return base64.b64decode(raw_value)


def gen_hash_for_password(password: str, salt: bytes) -> bytes:
    return hashlib.pbkdf2_hmac(
            'sha256',
            get_bytes_from_password(password),
            salt,
            100000
    )


def create_new_hash_for_password(password: str) -> (str, str):
    new_salt = os.urandom(32)
    new_hash = gen_hash_for_password(password, new_salt)

    new_salt_b64 = base64.b64encode(new_salt).decode()
    new_hash_b64 = base64.b64encode(new_hash).decode()

    return new_hash_b64, new_salt_b64


def get_bytes_from_password(password: str) -> bytes:
    return str.encode(password)


def create_user_token(username: str) -> str:
    signature_bytes = hmac.digest(get_signing_secret().encode(), username.encode(), "SHA256")
    return base64.b64encode(signature_bytes).decode()


def validate_user_token(username: str, token: str) -> bool:
    new_signature_bytes = hmac.digest(get_signing_secret().encode(), username.encode(), "SHA256")
    return hmac.compare_digest(new_signature_bytes, base64.b64decode(token.encode()))
