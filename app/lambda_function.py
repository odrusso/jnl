import base64
import json
import datetime
import os
import re

import crypto
import dynamo
import logger

PIGEON_HOLE_PASSWORD_KEY = "pigeonHolePass"
PIGEON_HOLE_NAME_KEY = "pigeonHoleName"
PIGEON_HOLE_MESSAGES_KEY = "messages"


def get_base_domain():
    api_domain = os.environ.get('apiDomain', default=False)
    return api_domain.replace("api.", "")


class HttpResponse:
    def __init__(self, body: str = "", status: int = 200, extra_headers={}, cookies=[]):
        self.statusCode = status
        self.body = body
        self.cookies = cookies
        self.headers = {**{
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': f'https://{get_base_domain()}',  # Needs to be dynamic
            'Access-Control-Allow-Methods': 'POST,PUT',
            'Access-Control-Allow-Credentials': 'true'
        }, **extra_headers}

    def json(self) -> dict:
        logger.info(f"Responding with code: {self.statusCode}")
        object_dict = self.__dict__

        if not self.body:
            del object_dict['body']

        if not self.cookies:
            del object_dict['cookies']

        logger.info(f"Responding with body: {json.dumps(object_dict)}")

        return object_dict


def main(event, context):
    path = event['requestContext']['http']['path']
    method = event['requestContext']['http']['method']

    logger.info(f"Path: {path}")
    logger.info(f"Method: {method}")
    logger.info(f"Full event:")
    logger.info(json.dumps(event))

    return router(path, method, event)


def route_matcher(actualPath, baseRoutingPath):
    return actualPath in (baseRoutingPath, "/" + baseRoutingPath, baseRoutingPath + "/", "/" + baseRoutingPath + "/")


def router(path, method, event):
    # shortcut routing for any preflight requests
    if method == "OPTIONS":
        return HttpResponse().json()

    if route_matcher(path, "login"):
        return login_controller(event, method)

    if route_matcher(path, "logout"):
        return logout_controller(event, method)

    if route_matcher(path, "messages"):
        return messages_controller(event, method)

    if route_matcher(path, "register"):
        return register_controller(event, method)

    return HttpResponse(status=404).json()


def build_cookie(key, value, expiry=None, http_only=False) -> str:
    if not expiry:
        gmt_in_14_days = datetime.datetime.utcnow() + datetime.timedelta(days=14)
        expiry = gmt_in_14_days.strftime("%a, %d %b %Y %H:%M:%S GMT")

    cookie_string = f'{key}={value};'
    cookie_string += 'SameSite=None;'
    cookie_string += 'Secure;'
    cookie_string += f'Domain=.{get_base_domain()};'
    cookie_string += 'Path=/;'
    cookie_string += f'Expires={expiry};'

    if http_only:
        cookie_string += 'HttpOnly;'

    return cookie_string


def delete_cookie(key, http_only=False):
    return build_cookie(key, "", "Thu, 01 Jan 1970 00:00:00 GMT", http_only=http_only)


def get_cookie(key, cookies):
    logger.info(f"Trying to find <{key}> in cookies <{cookies}>")
    full_cookie = list(filter(lambda cookie: cookie.startswith(key + "="), cookies))[0]
    return full_cookie[len(key) + 1:]


def messages_controller(event, method):
    if method not in ("GET", "POST"):
        logger.warning(f"Request to messages controller with method type {method}")
        return HttpResponse(status=400).json()

    cookies = event['cookies']
    username = get_cookie("user", cookies)
    token = get_cookie("token", cookies)
    token_valid_for_user = crypto.validate_user_token(username, token)

    if not token_valid_for_user:
        return HttpResponse(status=401).json()

    if method == "GET":
        messages = dynamo.get_pigeonhole_data(username)['data']

        if not messages:
            logger.warning(f"Messages are nullish for username {username}, raw data is {messages}")
            messages = "[]"

        return HttpResponse(status=200, body=messages).json()

    elif method == "POST":
        # TODO: Validate event body schema is actually Message[]
        update_messages(username, event['body'])

        return HttpResponse(status=200).json()

    return HttpResponse().json()


def login_controller(event, method):
    if method != "POST":
        logger.warning(f"Request to login controller with method type {method}")
        return HttpResponse(status=400).json()

    body = json.loads(event['body'])
    username = body['username']
    password = body['password']

    is_login_valid = validate_new_login(username, password)

    if is_login_valid:
        cookie_set_user = [
            build_cookie("user", username),
            build_cookie("token", crypto.create_user_token(username), http_only=True),
        ]

        return HttpResponse(status=200, cookies=cookie_set_user).json()

    logger.info(f"Password attempt invalid for {username}")
    return HttpResponse(status=401).json()


def validate_new_login(username, password):
    username_data = dynamo.get_pigeonhole_data(username)

    if username_data is None:
        return False

    hash = username_data.get("hash", None)
    salt = username_data.get("salt", None)

    logger.info(f"Hash type is {type(hash)}")
    logger.info(f"Hash is {hash}")

    logger.info(f"Salt type is {type(salt)}")
    logger.info(f"Salt is {salt}")

    if hash is None or salt is None:
        logger.warning(f"No dynamo data found for user {username}")
        return False

    return crypto.verify_password(hash, salt, password)


def logout_controller(event, method):
    delete_cookies = [
        delete_cookie("user"),
        delete_cookie("token", http_only=True)
    ]
    return HttpResponse(status=200, cookies=delete_cookies).json()


def register_controller(event, method):
    if method != "POST":
        logger.warning(f"Request to register controller with method type {method}")
        return HttpResponse(status=400).json()

    body = json.loads(event['body'])
    username = body['username']
    password = body['password']

    create_success = create_user(username, password)

    if not create_success:
        logger.error(f"Could not create new user {username}")
        return HttpResponse(status=500).json()

    cookie_set_user = [
        build_cookie("user", username),
        build_cookie("token", crypto.create_user_token(username), http_only=True),
    ]

    return HttpResponse(status=200, cookies=cookie_set_user).json()


def create_user(username, password):
    existing_username_data = dynamo.get_pigeonhole_data(username)

    if existing_username_data is not None:
        return False

    new_hash, new_salt = crypto.create_new_hash_for_password(password)

    logger.info(f"Hash for new user {username} is {new_hash}")
    logger.info(f"Salt for new user {username} is {new_salt}")

    dynamo.new_pigeonhole(username, new_hash, new_salt, "")

    return True


def update_messages(username, messages):
    logger.info(f"Updating messages for {username} with messages {messages}")
    existing_data = dynamo.get_pigeonhole_data(username)
    logger.info(f"TO REMOVE LOGGING: Existing data for {username} is {existing_data}")

    dynamo.new_pigeonhole(username, existing_data['hash'], existing_data['salt'], messages)


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
