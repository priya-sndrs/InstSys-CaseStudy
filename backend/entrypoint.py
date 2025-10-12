import os
import json
from fastapi.middleware.cors import CORSMiddleware #type: ignore
from fastapi import FastAPI, Request, HTTPException, status#type: ignore
from fastapi.responses import JSONResponse #type: ignore
from utils.LLM_model import AIAnalyst
from utils.config import collect_data, check_network
from newRBAC import create_student_account, verify_password, load_students, decrypt_data
from pathlib import Path

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------configuration---------------------- 

data_dir = Path(__file__).resolve().parent / 'database' / 'chroma_store'
collections = collect_data(data_dir, role, assign)
api_mode = check_network()
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.state.UPLOAD_FOLDER = UPLOAD_FOLDER
UPLOAD_FOLDER_LIST = os.path.join(os.path.dirname(__file__), 'uploads')
ROLE_ASSIGN_FILE = os.path.join(os.path.dirname(__file__), "config/last_role_assign.json")
COURSES_FILE = os.path.join(os.path.dirname(__file__), "config/courses.json")

try:
    with open("config/config.json", "r", encoding="utf-8") as f:
        full_config = json.load(f)
except FileNotFoundError:
    print("❌ config.json not found! Cannot start AI Analyst.")

# ----------------------Route---------------------- 
@app.get("/files")
def list_files():
    base = os.path.join(os.getcwd(), "uploads")
    result = {"faculty": [], "students": [], "admin": []}
    for folder in result.keys():
        folder_path = os.path.join(base, folder)
        if os.path.exists(folder_path):
            result[folder] = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    return {"files": result}

@app.get("/student/<student_id>")
def get_student(student_id: str):
    try:
        students = load_students()
        student = students.get(student_id)

        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Decrypt the studentName field and split into components
        decrypted_name = decrypt_data(student.get("studentName", ""))
        name_parts = decrypted_name.split(" ")
        
        # Handle cases where middle name might be missing
        if len(name_parts) >= 3:
            firstName = name_parts[0]
            middleName = name_parts[1]
            lastName = " ".join(name_parts[2:])
        elif len(name_parts) == 2:
            firstName = name_parts[0]
            middleName = ""
            lastName = name_parts[1]
        else:
            firstName = decrypted_name
            middleName = ""
            lastName = ""

        decrypted_student = {
            "studentId": student_id,
            "firstName": firstName,
            "middleName": middleName,
            "lastName": lastName,
            "email": decrypt_data(student.get("email", "")),
            "year": decrypt_data(student.get("year", "")),
            "course": decrypt_data(student.get("course", "")),
            "role": student.get("role", ""),  # role is not encrypted
        }

        raise HTTPException(status_code= 200, detail=decrypted_student)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post('/upload')
async def upload_file(request: Request):
    if 'file' not in request.files:
        return JSONResponse({"message": "No file part"}, status_code=400)

    file = request.files['file']
    folder = request.form.get('folder', '').lower()

    if file.filename == '':
        return JSONResponse({"message": "No selected file"}, status_code=400)

    if folder not in ["faculty", "students", "admin"]:
        return JSONResponse({"message": "❌ Invalid folder. Must be faculty, students, or admin."}, status_code=400)

    target_folder = os.path.join(app.config['UPLOAD_FOLDER'], folder)
    os.makedirs(target_folder, exist_ok=True)

    filepath = os.path.join(target_folder, file.filename)

    # Check duplicate
    if os.path.exists(filepath) and request.form.get("overwrite") != "true":
        return JSONResponse({
            "message": f"⚠️ File '{file.filename}' already exists in {folder}/. Overwrite?",
            "duplicate": True
        }, status_code=409)

    file.save(filepath)
    
    global collections, ai
    collections = collect_data(data_dir, role, assign, True)
    ai = AIAnalyst(collections, llm_config=full_config, execution_mode=api_mode)
    
    return JSONResponse({"message": "File uploaded successfully!", "filename": file.filename}, status_code=200)
    
@app.route("/delete_upload/<category>/<filename>", methods=["DELETE"])
async def delete_upload(category: str, filename: str):
    if category not in ["faculty", "students", "admin"]:
        raise HTTPException(status_code= 400, detail="Invalid category")
    folder_path = os.path.join(app.config["UPLOAD_FOLDER"], category)
    file_path = os.path.join(folder_path, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail= "File not found")
    try:
        os.remove(file_path)
        return JSONResponse({"message": "File deleted"}, status_code=200)
    except Exception as e:
        return HTTPException(status_code=500, detail= str(e))

@app.post("/chatprompt")
async def ChatPrompt(request: Request):
    data = await request.json()
    
    if not data or 'query' not in data:
        return {"error": "Missing query"}
    
    user_query = data['query']
    final_answer = ai.web_start_ai_analyst(user_query=user_query)
    return {"response": final_answer}

# Store last logged-in role and assign in a file for main block to read


def map_student_role(student_role):
    # Map student role string to role and assign
    mapping = {
        "student CS": ("teaching_faculty", ["BSCS"]),
        "student IT": ("teaching_faculty", ["BSIT"]),
        "student HM": ("teaching_faculty", ["BSHM"]),
        "student TM": ("teaching_faculty", ["BSTM"]),
        "student OAd": ("teaching_faculty", ["BSOAd"]),
        "student ECED": ("teaching_faculty", ["BECEd"]),
        "student TLEd": ("teaching_faculty", ["BTLEd"]),
        "faculty": ("Faculty", ["Faculty"]),
        "Guest": ("Guest", ["Guest"]),
        "student": ("Student", []), # fallback
    }
    return mapping.get(student_role, ("Student", []))

@app.post("/login")
async def login(request: Request):
    data = await request.json()
    student_id = data.get("studentId")
    email = data.get("email")
    password = data.get("password")

    # Guest login special case
    if student_id == "PDM-0000-000000":
        guest_file = os.path.join(os.path.dirname(__file__), "accounts", "guest.json")
        try:
            with open(guest_file, "r", encoding="utf-8") as f:
                guest_data = json.load(f)
            guest = guest_data.get(student_id)
            if not guest:
                raise HTTPException(status_code= 404, detail="Guest account not found")
            # Save role and assign for main block to use
            with open(ROLE_ASSIGN_FILE, "w", encoding="utf-8") as f:
                json.dump({"role": "Guest", "assign": ["Guest"]}, f)
            return {"message": "Login successful", "studentId": student_id, "role": "Guest"}
        except Exception as e:
            raise HTTPException(status_code= 500, detail=f"Guest login error: {str(e)}")
        
    students = load_students()
    if student_id not in students:
        raise HTTPException(status_code= 404, detail="Student ID not found")

    # Decrypt and compare email
    stored_email = decrypt_data(students[student_id].get("email", ""))
    if email != stored_email:
        raise HTTPException(status_code= 401, detail="Email does not match")

    # Verify password
    if not verify_password(student_id, password):
        raise HTTPException(status_code= 401, detail="Incorrect password")

    # Check for admin role
    student_role = students[student_id].get("role", "student")
    if student_role.lower() == "admin":
        with open(ROLE_ASSIGN_FILE, "w", encoding="utf-8") as f:
            json.dump({"role": "admin", "assign": [""]}, f)
        return {"message": "Login successful", "studentId": student_id, "role": "admin"}

    # Get role and assign mapping
    role, assign = map_student_role(student_role)

    # Save role and assign for main block to use
    with open(ROLE_ASSIGN_FILE, "w", encoding="utf-8") as f:
        json.dump({"role": role, "assign": assign}, f)

    return {"message": "Login successful", "studentId": student_id, "role": student_role}

@app.get("/register")
async def register(request: Request):
    data = await request.json()()
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
        raise HTTPException(status_code= 400, detail="Missing fields")
    # Map short course code to full course name for role assignment
    course_map = {
        "BSCS": "Bachelor of Science in Computer Science (BSCS)",
        "BSIT": "Bachelor of Science in Information Technology (BSIT)",
        "BSHM": "Bachelor of Science in Hospitality Management (BSHM)",
        "BSTM": "Bachelor of Science in Tourism Management (BSTM)",
        "BSOAd": "Bachelor of Science in Office Administration (BSOAd)",
        "BECEd": "Bachelor of Early Childhood Education (BECEd)",
        "BTLEd": "Bachelor of Technology in Livelihood Education (BTLEd)",
    }
    course_full = course_map.get(data["course"], data["course"])

    result = create_student_account(
        student_id=data["studentId"],
        first_name=data["firstName"],
        middle_name=data["middleName"],
        last_name=data["lastName"],
        year=data["year"],
        course=course_full,
        password=data["password"],
        email=data["email"]
    )

    if "error" in result:
        raise HTTPException(status_code= 409, detail= result)
    return {result}

# === Health check
@app.get("/health")
def health_check():
    return {"status": "ok"}, 200

# === Course management 

def load_courses():
    if not os.path.exists(COURSES_FILE):
        return []
    with open(COURSES_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except Exception:
            return []

def save_courses(courses):
    with open(COURSES_FILE, "w", encoding="utf-8") as f:
        json.dump(courses, f, indent=2, ensure_ascii=False)

@app.get("/courses")
def get_courses():
    return load_courses()

@app.post("/courses")
async def add_course(request: Request):
    data = await request.json()
    required = ["department", "program", "description"]
    if not all(k in data for k in required):
        return HTTPException(status_code= 400, detail="Missing fields")
    courses = load_courses()
    courses.append(data)
    save_courses(courses)
    return JSONResponse({"message": "Course added"}, status_code=201)

@app.post("/refresh_collections")
def refresh_collections():
    global collections, ai, role, assign
    # Clear previous collections
    try:
        with open(ROLE_ASSIGN_FILE, "r", encoding="utf-8") as f:
            last_role_assign = json.load(f)
            role = last_role_assign.get("role", "Admin")
            assign = last_role_assign.get("assign", [])
    except Exception:
        role = "Admin"
        assign = []

    # If last login was guest, set role and assign to Guest
    if role == "Guest":
        assign = ["Guest"]

    collections = collect_data(data_dir, role, assign)
    api_mode = 'online'

    try:
        with open("config/config.json", "r", encoding="utf-8") as f:
            full_config = json.load(f)
    except FileNotFoundError:
        return HTTPException(status_code=500, detail="config.json not found")

    ai = AIAnalyst(collections=collections, llm_config=full_config, execution_mode=api_mode)
    return JSONResponse({"message": "Collections refreshed", "role": role, "assign": assign}, status_code=200) 

# ----------------------Route----------------------

if __name__ == "__main__":
    # Configuration
        
    app.run(debug=True, port=5000)