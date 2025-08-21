import os
import json
from utils.System import SmartStudentDataSystem 

STUDENTS_FILE = os.path.join(os.path.dirname(__file__), "accounts", "students.json")

system = SmartStudentDataSystem()

def load_students():
    if not os.path.exists(STUDENTS_FILE):
        return {}
    with open(STUDENTS_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}

def save_students(students):
    with open(STUDENTS_FILE, "w", encoding="utf-8") as f:
        json.dump(students, f, indent=2)

def create_student_account(student_id, name, year, course, password):
    students = load_students()
    unique_id = student_id  # Use student_id as unique identifier
    role = "student"
    labels = {
        "year": year,
        "course": course
    }
    if unique_id in students:
        return {"error": "Account already exists"}
    students[unique_id] = {
        "id": unique_id,
        "name": name,
        "role": role,
        "labels": labels,
        "password": password  # In production, hash this!
    }
    save_students(students)
    return {"success": True, "id": unique_id}

def Collect_data():
    
    collection = system.load_new_data()
    print
