import json
import boto3


DYNAMODB_TABLE_NAME = "tagged_data"

def update_table_data(username:str, index:int, nlp_output:str):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(DYNAMODB_TABLE_NAME)
    response = table.query(
        KeyConditionExpression=boto3.dynamodb.conditions.Key('username').eq(username),
        ScanIndexForward=False,
        Limit=1
    )
    last_session = response["Items"][0]["session"]

    response = table.update_item(
        Key={
            'username': username,
            'session': last_session
        },
        UpdateExpression="set #data.#index.nlp_output = :nlp_output",
        ExpressionAttributeNames={
            "#index": str(index),
            "#data": "data"
        },
        ExpressionAttributeValues={
            ":nlp_output": nlp_output
        },
        ReturnValues="UPDATED_NEW"
    )
    return response


def handler(event, context):
    try:
        body = event["body"]
        body = json.loads(body)

        index = body["index"]
        nlp_output = body["nlp_output"]

        username = event["requestContext"]["authorizer"]["jwt"]["claims"]["cognito:username"]
        update_table_data(username, index, nlp_output)

        return {
            "headers": {
                "Content-Type": "application/json",},
            'statusCode': 200,
            'body': "Updated"
        }
    except:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": "Internal Server Error",
            }),
        }


