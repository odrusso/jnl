import hashlib
import base64
from dynamo import *


def verify_password_for_pigeonhole(pigeon_hole_name: str, password: str) -> bool:
    pigeonhole = get_pigeonhole_data(pigeon_hole_name)

    verification_password_bytes = get_hash_for_pigeonhole(pigeonhole)
    salt = get_salt_for_pigeonhole(pigeonhole)

    this_password_bytes = gen_hash_for_password(password, salt)

    return this_password_bytes == verification_password_bytes


def get_hash_for_pigeonhole(pigeonhole: dict) -> bytes:
    return base64.b64decode(pigeonhole['hash'])


def get_salt_for_pigeonhole(pigeonhole: dict) -> bytes:
    return base64.b64decode(pigeonhole['salt'])


def gen_hash_for_password(password: str, salt: bytes) -> bytes:
    return hashlib.pbkdf2_hmac(
        'sha256',
        get_bytes_from_password(password),
        salt,
        100000
    )


def get_bytes_from_password(password: str) -> bytes:
    return str.encode(password)
