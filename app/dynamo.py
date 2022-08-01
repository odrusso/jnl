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

def get_tableName():
    return os.environ.get('dynamoTableName', default=False) or "jnl-data"


def get_pigeonhole_data(pigeonhole_name: str) -> Optional[dict]:
    db = boto3.resource("dynamodb")
    table = db.Table(get_tableName())

    try:
        return table.get_item(Key={'pigeonhole_name': pigeonhole_name})['Item']
    except Exception as e:
        print(e)
        return None


def new_pigeonhole(pigeonhole_name: str, hash: str, salt: str, data: str):
    db = boto3.resource("dynamodb")
    tableName = os.environ.get('dynamoTableName', default=False) or "jnl-data"
    table = db.Table(get_tableName())

    table.put_item(
        Item={
            "pigeonhole_name": pigeonhole_name,
            "hash": hash,
            "salt": salt,
            "data": data
        }
    )
