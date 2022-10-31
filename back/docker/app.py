import pandas as pd
import json
import spacy
spacy_pipeline = spacy.load("en_core_web_sm", disable = ['parser','lemmatizer'])

def pos_tagging(name,description):
    processed_text = spacy_pipeline(description)
    tagged_text = " ".join([token.pos_ for token in processed_text])
    return name.upper() + " || " + tagged_text


def handler(event, context):
    body = event["body"]
    body = json.loads(body)
    df = pd.DataFrame(data=body, columns=["Name", "Description"])
    df["nlp_output"] = df.apply(lambda x: pos_tagging(x["Name"],x["Description"]),axis=1)
    res = df.to_dict(orient="records")

    return {
        "headers": {
            "Content-Type": "application/json",},
        'statusCode': 200,
        'body': json.dumps(res)
    }
