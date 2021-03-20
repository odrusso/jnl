# db type: dynamodb
# table-name: jnl-data

# schema
# pigeonhole_name: string PK
# hash: string (base 64 encoded)
# salt: string (base 64 encoded)
# data: string (serialised json)

from typing import Optional
import boto3


def get_pigeonhole_data(pigeonhole_name: str) -> Optional[dict]:
    db = boto3.resource("dynamodb")
    table = db.Table("jnl-data")

    try:
        return table.get_item(Key={'pigeonhole_name': pigeonhole_name})['Item']
    except Exception as e:
        print(e)
        return None
