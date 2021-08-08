import hashlib
import base64
import os
import boto3
import dynamo


def verify_password_for_pigeonhole(pigeon_hole_name: str, password: str) -> bool:
    pigeonhole = dynamo.get_pigeonhole_data(pigeon_hole_name)

    verification_password_bytes = get_hash_for_pigeonhole(pigeonhole)
    salt = get_salt_for_pigeonhole(pigeonhole)

    this_password_bytes = gen_hash_for_password(password, salt)

    return this_password_bytes == verification_password_bytes


def get_hash_for_pigeonhole(pigeonhole: dict) -> bytes:
    return base64.b64decode(conform((pigeonhole['hash'])))


def get_salt_for_pigeonhole(pigeonhole: dict) -> bytes:
    return base64.b64decode(conform(pigeonhole['salt']))


def conform(value) -> str:
    if type(value) == boto3.dynamodb.types.Binary:
        return value.value.decode("utf-8")
    else:
        return value


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

    new_salt_b64 = base64.b64encode(new_salt)
    new_hash_b64 = base64.b64encode(new_hash)

    return new_hash_b64, new_salt_b64


def get_bytes_from_password(password: str) -> bytes:
    return str.encode(password)
