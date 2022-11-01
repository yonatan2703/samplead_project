import time
import pandas as pd
import json
import boto3
import spacy
spacy_pipeline = spacy.load("en_core_web_sm", disable = ['parser','lemmatizer'])

def pos_tagging(name, description):
    processed_text = spacy_pipeline(description)
    tagged_text = " ".join([token.pos_ for token in processed_text])
    return name.upper() + " || " + tagged_text


DYNAMODB_TABLE_NAME = "tagged_data"

def add_to_db(username:str, data:dict):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(DYNAMODB_TABLE_NAME)
    table.put_item(
        Item={
            "username": username,
            "session": time.time().__floor__(),
            "data": data
        }
    )


def handler(event, context):
    try:
        body = event["body"]
        body = json.loads(body)
        df = pd.DataFrame(data=body, columns=["Name", "Description"])
        df["nlp_output"] = df.apply(lambda x: pos_tagging(x["Name"],x["Description"]),axis=1)
        df["index"] = df.index
        df_dict = df.to_dict(orient="records")
        res = {}
        for row in df_dict:
            index, nlp_output, name, description = row["index"], row["nlp_output"], row["Name"], row["Description"]
            res[str(index)] = {
                "Name": name,
                "Description": description,
                "nlp_output": nlp_output
            }

        username = event["requestContext"]["authorizer"]["jwt"]["claims"]["cognito:username"]
        add_to_db(username, res)

        return {
            "headers": {
                "Content-Type": "application/json",},
            'statusCode': 200,
            'body': json.dumps(res)
        }
    except:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "message": "Internal Server Error",
            }),
        }
