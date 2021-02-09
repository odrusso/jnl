import bcrypt


def verify_password_for_pigeonhole(pigeon_hole_name: str, pigeon_hole_password: str) -> bool:
    input_password_bytes = get_bytes_from_password(pigeon_hole_password)
    verification_password_bytes = get_hash_for_pigeonhole(pigeon_hole_name)

    return bcrypt.checkpw(input_password_bytes, verification_password_bytes)


def get_hash_for_pigeonhole(pigeon_hole_name: str) -> bytes:
    # TODO: Fetch real hashes from database!
    return gen_hash_for_password("password")  # Hard coded to 'password'


def gen_hash_for_password(password: str) -> bytes:
    this_salt = bcrypt.gensalt()  # Cryptographically random
    return bcrypt.hashpw(str.encode(password), this_salt)


def get_bytes_from_password(password: str) -> bytes:
    return str.encode(password)