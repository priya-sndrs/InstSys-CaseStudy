from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from rbac import create_student_account
from pwhash import hash_password, verify_password
from rbac import create_student_account, Collect_data
from utils.LLM_model import AIAnalyst, load_llm_config

app = Flask(__name__)
CORS(app)  # allow frontend to talk to backend

# configure upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

collections = {}
api_mode = 'online'

llm_cfg = load_llm_config(mode=api_mode)
ai = AIanalyst(collections, llm_cfg)

# === Allowed extensions
ALLOWED_EXTENSIONS = {".xlsx", ".json", ".pdf"}
def is_allowed(filename):
    # function to store files that ends with allowed extensions
    return any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS)

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    if not is_allowed_file(file.filename):
        return jsonify({"error": "Only Excel (.xlsx), JSON (.json), and PDF (.pdf) files are allowed ❌"}), 400
    
    # save file in backend/uploads/
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    overwrite = request.form.get("overwrite", "false").lower() == "true"

    if os.path.exists(filepath) and not overwrite:
        return jsonify({"duplicate": True, "message": "File already exists. Overwrite?"}), 409

    file.save(filepath)

    return jsonify({"message": "File uploaded successfully!", "filename": file.filename})

@app.route("/chatprompt", methods=["POST"])
def ChatPrompt():
    data = request.json
    
    if not data or 'query' not in data:
        return jsonify({"error": "Missing query"})
    
    user_query = data['query']
    final_answer, _ = ai.execute_reasoning_plan(query=user_query)
    return jsonify({"response": final_answer})

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    required_fields = [
        "studentId",
        "firstName",
        "middleName",
        "lastName",
        "year",
        "course",
        "password"
    ]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing fields"}), 400

    # Hash the password before storing
    hashed_pw = hash_password(data["password"])

    result = create_student_account(
        data["studentId"],
        data["firstName"],
        data["middleName"],
        data["lastName"],
        data["year"],
        data["course"],
        hashed_pw
    )
    if "error" in result:
        return jsonify(result), 409
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
