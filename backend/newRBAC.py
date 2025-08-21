from werkzeug.security import generate_password_hash, check_password_hash
from cryptography.fernet import Fernet

# Generate a key (in production, store this securely!)
secret_key = Fernet.generate_key()
cipher = Fernet(secret_key)

# --- Encryption/Decryption Functions ---
def encrypt_data(data: str) -> str:
    """Encrypt plain text string and return as string."""
    return cipher.encrypt(data.encode()).decode()

def decrypt_data(token: str) -> str:
    """Decrypt encrypted string and return plain text."""
    return cipher.decrypt(token.encode()).decode()

# Mock database (replace with real DB later)
students_db = {}

def create_student_account(student_id, student_name, year, course, password):
    if student_id in students_db:
        return {"error": "Student ID already exists"}

    # Hash password
    hashed_password = generate_password_hash(password)

    # Encrypt personal info
    encrypted_name = encrypt_data(student_name)
    encrypted_year = encrypt_data(year)
    encrypted_course = encrypt_data(course)

    students_db[student_id] = {
        "studentName": encrypted_name,
        "year": encrypted_year,
        "course": encrypted_course,
        "password": hashed_password,  # password is hashed only
    }

    return {"message": "Student account created successfully", "studentId": student_id}

def verify_password(student_id, password):
    """Check password against stored hash."""
    if student_id not in students_db:
        return False
    return check_password_hash(students_db[student_id]["password"], password)

def get_student_info(student_id):
    """Retrieve student info (decrypt personal data)."""
    if student_id not in students_db:
        return {"error": "Student not found"}

    student = students_db[student_id]
    return {
        "studentId": student_id,
        "studentName": decrypt_data(student["studentName"]),
        "year": decrypt_data(student["year"]),
        "course": decrypt_data(student["course"]),
        # Do NOT return password
    }
