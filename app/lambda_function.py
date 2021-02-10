# Oscar Russo, 2021.
# How good is kinda-strongly typed Python!

# Current state: event is already a dict.

import json
from crypto import *

PIGEON_HOLE_PASSWORD_KEY = "pigeonHolePass"
PIGEON_HOLE_NAME_KEY = "pigeonHoleName"
MESSAGES_KEY = "messages"


class HttpResponse:
    def __init__(self, body: str, status: int = 200):
        self.status = status
        self.body = body

    def json(self) -> object:
        return json.dumps(self.__dict__)


def main(event, context):

    try:
        input_password = event[PIGEON_HOLE_PASSWORD_KEY]
        input_pigeon_hole_name = event[PIGEON_HOLE_NAME_KEY]
        # input_messages = event[MESSAGES_KEY] # for POST only
    except KeyError:
        # Probably the body doesn't conform to the expected schema
        return HttpResponse("Invalid request body", 400).json()

    password_valid = verify_password_for_pigeonhole(input_pigeon_hole_name, input_password)

    if password_valid:
        return HttpResponse("Messages would go here...", 200).json()
    else:
        # invalid password
        return HttpResponse("Invalid password", 403).json()


if __name__ == "__main__":
    test_body = json.dumps(
        {
            "pigeonHolePass": "password1",
            "pigeonHoleName": "pigeon"
        }
    )
    print(main(test_body, ''))
