from flask import jsonify
from pymongo import MongoClient
from llmware.models import ModelCatalog
from llmware.agents import LLMfx
import sys
import json

def connect_db():
    client = MongoClient('mongodb://localhost:27017/')  # Adjust the connection string as needed
    return client['test']  # Replace with your database name

def sentiment(customer_transcript, question):
    # Your existing sentiment logic...
    agent = LLMfx()
    agent.load_work(customer_transcript)
    agent.load_tool_list(["sentiment", "emotions", "intent", "ner", "ratings", "answer"])
    agent.exec_multitool_function_call(["sentiment", "emotions", "intent", "ner", "ratings"])
    answer = agent.answer(question, key="answer")
    # Prepare the output list for multiple results if needed
    report = agent.show_report()
    
    output = {"sentiment": report[0]['sentiment'][0],
              "emotions": report[0]['emotions'][0],
              "intent": report[0]['intent'][0],
              "people": report[0]['people'],
              "organization": report[0]['organization'],
              "location": report[0]['misc'],
              "rating": report[0]['rating'][0],
              "question": question,
              "answer": report[0]['answer'][0],
              "source": report[0]['source']['text']} 

    # Save to database
    db = connect_db()
    db.values.insert_one(output)  # Use insert_many for multiple entries

    return output  # Return the list of outputs

if __name__ == '__main__':
    customer_transcript = sys.argv[1]
    question = sys.argv[2]
    output = sentiment(customer_transcript, question)
    print(json.dumps(output))
