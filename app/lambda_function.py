# Oscar Russo, 2021.
# How good is kinda-strongly typed Python!

# Current state: event is already a dict.

import json
from crypto import *
from dynamo import *

PIGEON_HOLE_PASSWORD_KEY = "pigeonHolePass"
PIGEON_HOLE_NAME_KEY = "pigeonHoleName"


class HttpResponse:
    def __init__(self, body: str, status: int = 200):
        self.statusCode = status
        self.body = body

    def json(self) -> dict:
        return self.__dict__


def main(event, context):
    try:
        input_password = event[PIGEON_HOLE_PASSWORD_KEY]
        input_pigeon_hole_name = event[PIGEON_HOLE_NAME_KEY]
        # input_messages = event[MESSAGES_KEY] # for POST only
    except KeyError:
        # Probably the body doesn't conform to the expected schema
        return HttpResponse("Invalid request body", 400).json()

    pigeonhole = get_pigeonhole_data(input_pigeon_hole_name)

    if pigeonhole is None:
        print(f"Invalid pigeon hole name: {input_pigeon_hole_name}")
        return HttpResponse("Invalid request body", 403).json()

    password_valid = verify_password_for_pigeonhole(input_pigeon_hole_name, input_password)

    if password_valid:
        return HttpResponse(pigeonhole['data'], 200).json()
    else:
        # invalid password
        print(f"Invalid password for pigeonhole {input_pigeon_hole_name}")
        return HttpResponse("Invalid request body", 403).json()


if __name__ == "__main__":
    test_body = {
        "pigeonHolePass": "password",
        "pigeonHoleName": "test"
    }

    print(main(test_body, ''))
