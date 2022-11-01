import simplejson as json
import boto3


DYNAMODB_TABLE_NAME = "tagged_data"

def get_user_data(username:str):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(DYNAMODB_TABLE_NAME)
    # get user data from last session
    response = table.query(
        KeyConditionExpression=boto3.dynamodb.conditions.Key('username').eq(username),
        ScanIndexForward=False,
        Limit=1
    )
    return response["Items"]


def get_admin_data():
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(DYNAMODB_TABLE_NAME)
    response = table.scan()
    result = {}
    for item in response["Items"]:
        username, session, data = item["username"], item["session"], item["data"]
        if username not in result:
            result[username] = {}
        result[username][session] = data
    return result


def handler(event, context):
    try:
        admin = False
        claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
        if "cognito:groups" in claims:
            if "Admin" in claims["cognito:groups"]:
                admin = True
                admin_data = get_admin_data()
        username = event["requestContext"]["authorizer"]["jwt"]["claims"]["cognito:username"]
        res = get_user_data(username)

        response_body = {
                "prevSession": res
            }
        if admin:
            response_body["adminData"] = admin_data

        return {
            "headers": {
                "Content-Type": "application/json",},
            'statusCode': 200,
            'body': json.dumps(response_body)
        }
    except:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": "Internal Server Error",
            }),
        }


