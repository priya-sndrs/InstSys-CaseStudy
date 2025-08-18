from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from rbac import create_student_account

app = Flask(__name__)
CORS(app)  # allow frontend to talk to backend

# configure upload folder
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    # save file in backend/uploads/
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    overwrite = request.form.get("overwrite", "false").lower() == "true"

    if os.path.exists(filepath) and not overwrite:
        return jsonify({"duplicate": True, "message": "File already exists. Overwrite?"}), 409

    file.save(filepath)

    return jsonify({"message": "File uploaded successfully!", "filename": file.filename})

@app.route("/register", methods=["POST"])
def register():
    data = request.json
    required_fields = ["studentId", "studentName", "year", "course", "password"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing fields"}), 400
    result = create_student_account(
        data["studentId"], data["studentName"], data["year"], data["course"], data["password"]
    )
    if "error" in result:
        return jsonify(result), 409
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
