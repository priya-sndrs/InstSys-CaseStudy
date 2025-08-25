from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from utils.LLM_model import AIAnalyst, load_llm_config
from newRBAC import create_student_account

app = Flask(__name__)
CORS(app)  # allow frontend to talk to backend

# configure upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

collections = {}
api_mode = 'online'

llm_cfg = load_llm_config(mode=api_mode)
ai = AIAnalyst(collections, llm_cfg)

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
    
    if not is_allowed(file.filename):
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

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    student_id = data.get("studentId")
    student_name = data.get("studentName")
    password = data.get("password")

    import json
    from werkzeug.security import check_password_hash

    try:
        with open("students.json", "r") as f:
            students = json.load(f)
    except FileNotFoundError:
        return jsonify({"error": "No registered users yet."}), 404

    if student_id not in students:
        return jsonify({"error": "Invalid Student ID."}), 401

    student = students[student_id]

    # Decrypt studentName here if needed; for now, assume plain text
    # If encrypted, you'd need to decrypt it similarly to your register process
    # For this demo, just check hashed password
    if not check_password_hash(student["password"], password):
        return jsonify({"error": "Incorrect password."}), 401

    # Optional name validation (if stored as plain text or decrypted)
    # if student_name != student["studentName"]:
    #     return jsonify({"error": "Name does not match our records."}), 401

    return jsonify({"message": "Login successful", "student": student}), 200


@app.route("/register", methods=["POST"])
def register():
    data = request.json
    required_fields = [
        "studentId",
        "firstName",
        "middleName",
        "lastName",
        "email", 
        "year",
        "course",
        "password"
    ]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing fields"}), 400

    result = create_student_account(
        student_id=data["studentId"],
        first_name=data["firstName"],
        middle_name=data["middleName"],
        last_name=data["lastName"],
        year=data["year"],
        course=data["course"],
        password=data["password"],
        role="student"
    )

    if "error" in result:
        return jsonify(result), 409
    return jsonify(result)



if __name__ == "__main__":
    app.run(debug=True, port=5000)
