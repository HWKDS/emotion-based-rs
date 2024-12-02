from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import os
from pymongo import MongoClient
import json

app = Flask(__name__)
CORS(app)

def connect_db():
    client = MongoClient('mongodb://localhost:27017/')  # Adjust as needed
    return client['test']  # Replace with your database name


@app.route('/api/output', methods=['POST'])
def get_output():
    data = request.get_json()
    customer_transcript = data.get('customer_transcript')
    question = data.get('question')

    if not customer_transcript or not question:
        return jsonify({'message': 'Customer transcript and question are required.'}), 400

    try:
        script_path = os.path.join(os.path.dirname(__file__), 'sentiment.py')
        output = subprocess.check_output(['python3', script_path, customer_transcript, question])
        results = json.loads(output.decode('utf-8'))

        # If the sentiment.py script saves to the database, you don't need to save here.
        # If needed, you can uncomment the following lines:
        # db = connect_db()
        # db.sentiment_results.insert_many(results)  # Use insert_many for multiple results

        return jsonify({'output': results})
    except subprocess.CalledProcessError as e:
        return jsonify({'message': 'Error in sentiment processing: ' + str(e)}), 500
    except json.JSONDecodeError:
        return jsonify({'message': 'Failed to decode JSON output from the sentiment script.'}), 500
    except Exception as e:
        return jsonify({'message': 'An error occurred: ' + str(e)}), 500

@app.route('/api/results', methods=['GET'])
def get_results():
    db = connect_db()
    results = list(db.values.find())
    
    # Convert MongoDB documents to a more JSON-friendly format
    for result in results:
        result['_id'] = str(result['_id'])  # Convert ObjectId to string
    return jsonify(results)

@app.route('/api/items', methods=['GET'])
def get_items():
    db = connect_db()
    try:
        items = list(db.values.find({}, {"_id": 0}))  # Exclude the MongoDB ID from response
        return jsonify(items)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5175)
