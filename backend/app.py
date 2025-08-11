from Conn import Server, GetUserCollection
from flask import Flask, jsonify, request
from datetime import datetime

app = Flask(__name__)
chromadb_db_impl = "duckdb+parquet"
persist_directory = "./chroma_db"
Server(chromadb_db_impl, persist_directory)

@app.route('/')
def Login():
  return jsonify('login successful')  

@app.route('/register', methods=['POST'])
def RegisterUserAccount():
  data = request.get_json()
  
  username = data.get('Username')
  password = data.get('Password')
  user_id = data.get('School_id')
  email = data.get('Email')
  
  if not username or not password or not user_id or not email:
    return jsonify({"error": "Missing required field username, password, user_id, email"}), 400
@app.route('/Get_LLM_response')
def GetUserAndLLMResponse():
  data = request.get_json()
  if data is None:
    jsonify({'error': 'Missing Data'}), 400
  user_id = data.get('user_id')
  user_query = data.get('user_query')
  llm_response = data.get('llm_response')
  
  if not user_id or not user_query or not llm_response:
    return jsonify({'error': 'Mising required fields'}), 400
  
  collection = GetUserCollection(user_id)
  collection.add(
        documents=[llm_response],
        metadatas=[{
            "user_id": user_id,
            "query": user_query,
            "timestamp": datetime.now().isoformat()
        }],
        ids=[f"{user_id}_{datetime.now().timestamp()}"]
  )
  
  return jsonify({'status': 'stored'})

if __name__ == "__main__":
  app.run()