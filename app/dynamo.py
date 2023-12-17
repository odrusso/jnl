# db type: dynamodb
# table-name: jnl-data

# schema
# pigeonhole_name: string PK
# hash: string (base 64 encoded)
# salt: string (base 64 encoded)
# data: string (serialised json)

from typing import Optional
import boto3
import os


def get_table_name():
    return os.environ.get('dynamoTableName', default=False) or "jnl-data"


def get_pigeonhole_data(pigeonhole_name: str) -> Optional[dict]:
    # type of get_item  is {pigeonhole_name: string, hash: binary, salt: binary, data: string}
    # type of data is a string of list<{date: string, message: string}>
    db = boto3.resource("dynamodb")
    table = db.Table(get_table_name())

    try:
        return table.get_item(Key={'pigeonhole_name': pigeonhole_name})['Item']
    except Exception as e:
        print(e)
        return None


def new_pigeonhole(pigeonhole_name: str, hash: str, salt: str, data: str):
    db = boto3.resource("dynamodb")
    table = db.Table(get_table_name())

    table.put_item(
        Item={
            "pigeonhole_name": pigeonhole_name,
            "hash": hash,
            "salt": salt,
            "data": data
        }
    )
