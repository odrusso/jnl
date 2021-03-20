import hashlib
import os
import base64

EXAMPLE_HASH_B64 = b'yJCEK1PTBohXhYp0hYDxZ/4dlmbDyEP4Jm+SjuoK/e0='


def verify_password_for_pigeonhole(pigeon_hole_name: str, password: str) -> bool:
    verification_password_bytes = get_hash_for_pigeonhole(pigeon_hole_name)
    salt = get_salt_for_pigeonhole(pigeon_hole_name)
    this_password_bytes = gen_hash_for_password(password, salt)

    return this_password_bytes == verification_password_bytes


def get_hash_for_pigeonhole(pigeon_hole_name: str) -> bytes:
    # TODO: Fetch real hashes from database!
    salt = get_salt_for_pigeonhole(pigeon_hole_name)
    fake_hash = gen_hash_for_password("password", salt)  # Hard coded to 'password'
    return fake_hash


def get_salt_for_pigeonhole(pigeon_hole_name: str) -> bytes:
    # TODO: Fetch real salts from database!
    return base64.b64decode(EXAMPLE_HASH_B64)


def gen_hash_for_password(password: str, salt: bytes) -> bytes:
    return hashlib.pbkdf2_hmac(
        'sha256',
        get_bytes_from_password(password),
        salt,
        100000
    )


def get_bytes_from_password(password: str) -> bytes:
    return str.encode(password)
