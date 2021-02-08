import bcrypt
import json

PIGEON_HOLE_PASSWORD = "pigeonHolePass"


def main(event, context):
    body = json.loads(event)

    input_password = body[PIGEON_HOLE_PASSWORD]

    password_status = verify_password_for_pigeonhole("TODO", input_password)

    print(f"Password Check {password_status}")
    return "Working!"


def verify_password_for_pigeonhole(pigeon_hole_name: str, pigeon_hole_password: str) -> bool:
    input_bytes = str.encode(pigeon_hole_password)
    hash_to_check_against = get_hash_for_pigeonhole(pigeon_hole_name)
    return bcrypt.checkpw(input_bytes, hash_to_check_against)


def get_hash_for_pigeonhole(pigeon_hole_name: str) -> bytes:
    # TODO: Fetch real hashes!
    pretend_salt = bcrypt.gensalt()
    return bcrypt.hashpw(b'password', pretend_salt)


if __name__ == "__main__":
    body = json.dumps(
        {
            "pigeonHolePass": "password"
        }
    )
    main(body, '')
