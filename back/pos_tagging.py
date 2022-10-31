import spacy
spacy_pipeline = spacy.load("en_core_web_sm", disable = ['parser','lemmatizer'])

def pos_tagging(name,description):
    processed_text = spacy_pipeline(description)
    tagged_text = " ".join([token.pos_ for token in processed_text])
    return name.upper() + " || " + tagged_text
