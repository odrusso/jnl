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
    body = json.loads(event['body'])
    method = event['httpMethod']
    if method == 'POST':
        return get_pigeonhole(body).json()


def get_pigeonhole(body) -> HttpResponse:
    try:
        input_password = body[PIGEON_HOLE_PASSWORD_KEY]
        input_pigeon_hole_name = body[PIGEON_HOLE_NAME_KEY]
        # input_messages = event[MESSAGES_KEY] # for POST only
    except KeyError:
        # Probably the body doesn't conform to the expected schema
        return HttpResponse("Invalid request body", 400)

    pigeonhole = get_pigeonhole_data(input_pigeon_hole_name)

    if pigeonhole is None:
        print(f"Invalid pigeon hole name: {input_pigeon_hole_name}")
        return HttpResponse("Invalid request body", 403)

    password_valid = verify_password_for_pigeonhole(input_pigeon_hole_name, input_password)

    if password_valid:
        return HttpResponse(pigeonhole['data'], 200)
    else:
        # invalid password
        print(f"Invalid password for pigeonhole {input_pigeon_hole_name}")
        return HttpResponse("Invalid request body", 403)


if __name__ == "__main__":
    test_body = {
        "body": {
            "pigeonHolePass": "password",
            "pigeonHoleName": "test"
        }
    }

    print(main(test_body, ''))
