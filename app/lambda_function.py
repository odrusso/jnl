# Oscar Russo, 2021.
# How good is kinda-strongly typed Python!

# Current state: event is already a dict.

import json
import crypto
import dynamo

PIGEON_HOLE_PASSWORD_KEY = "pigeonHolePass"
PIGEON_HOLE_NAME_KEY = "pigeonHoleName"
PIGEON_HOLE_MESSAGES_KEY = "messages"


class HttpResponse:
    def __init__(self, body: str = "", status: int = 200):
        self.statusCode = status
        self.body = body
        self.headers = {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,PUT'
        }

    def json(self) -> dict:
        return self.__dict__


def main(event, context):
    body = json.loads(event['body'])
    method = event['httpMethod']
    if method == 'POST':
        return get_pigeonhole(body).json()
    elif method == 'PUT':
        return put_pigeonhole(body).json()
    else:
        return HttpResponse(status=405).json()


def get_pigeonhole(body) -> HttpResponse:
    try:
        input_password = body[PIGEON_HOLE_PASSWORD_KEY]
        input_pigeon_hole_name = body[PIGEON_HOLE_NAME_KEY]
    except KeyError:
        # Probably the body doesn't conform to the expected schema
        return HttpResponse("Invalid request body", 400)

    pigeonhole = dynamo.get_pigeonhole_data(input_pigeon_hole_name)

    if pigeonhole is None:
        print(f"Invalid pigeon hole name: {input_pigeon_hole_name}")
        return HttpResponse("Invalid request body", 403)

    password_valid = crypto.verify_password_for_pigeonhole(input_pigeon_hole_name, input_password)

    if password_valid:
        return HttpResponse(pigeonhole['data'], 200)
    else:
        # invalid password
        print(f"Invalid password for pigeonhole {input_pigeon_hole_name}")
        return HttpResponse("Invalid request body", 403)


def put_pigeonhole(body) -> HttpResponse:
    try:
        input_password = body[PIGEON_HOLE_PASSWORD_KEY]
        input_pigeon_hole_name = body[PIGEON_HOLE_NAME_KEY]
        messages = body[PIGEON_HOLE_MESSAGES_KEY]
    except KeyError:
        # Probably the body doesn't conform to the expected schema
        return HttpResponse("Invalid request body", 400)

    pigeonhole = dynamo.get_pigeonhole_data(input_pigeon_hole_name)

    if pigeonhole is not None:
        password_valid = crypto.verify_password_for_pigeonhole(input_pigeon_hole_name, input_password)
        if not password_valid:
            print(f"Invalid password for pigeonhole {input_pigeon_hole_name}")
            return HttpResponse("Invalid request body", 403)

    print(f"Pigeon hole doesn't exist: {input_pigeon_hole_name}")

    new_hash, new_salt = crypto.create_new_hash_for_password(input_password)
    dynamo.new_pigeonhole(input_pigeon_hole_name, new_hash, new_salt, messages)
    return HttpResponse(status=201)


if __name__ == "__main__":
    test_body = {
        "httpMethod": "POST",
        "body": '''{
            "pigeonHoleName": "test2",
            "pigeonHolePass": "password2",
            "messages": "{[test-2]}"
        }'''
    }

    print(main(test_body, ''))
