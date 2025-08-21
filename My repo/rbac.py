import os
import json
from collections import deque

STUDENTS_FILE = os.path.join(os.path.dirname(__file__), "accounts", "students.json")
ROLES_FILE = os.path.join(os.path.dirname(__file__), "accounts", "roles.json")

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

def load_roles():
    if not os.path.exists(ROLES_FILE):
        # Example structure: { "student": {"inherits": [], "permissions": ["read"]}, ... }
        return {}
    with open(ROLES_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}

def save_roles(roles):
    with open(ROLES_FILE, "w", encoding="utf-8") as f:
        json.dump(roles, f, indent=2)

def create_student_account(student_id, first_name, middle_name, last_name, year, course, password):
    students = load_students()
    unique_id = student_id
    role = "student"
    labels = {
        "year": year,
        "course": course
    }
    if unique_id in students:
        return {"error": "Account already exists"}
    students[unique_id] = {
        "id": unique_id,
        "first_name": first_name,
        "middle_name": middle_name,
        "last_name": last_name,
        "role": role,
        "labels": labels,
        "password": password
    }
    save_students(students)
    return {"success": True, "id": unique_id}

# --- Graph Theory: Role Hierarchy Traversal ---
def can_access_role(user_role, target_role):
    """Check if user_role can reach target_role via role inheritance graph."""
    roles = load_roles()
    visited = set()
    queue = deque([user_role])
    while queue:
        current = queue.popleft()
        if current == target_role:
            return True
        visited.add(current)
        for inherited in roles.get(current, {}).get("inherits", []):
            if inherited not in visited:
                queue.append(inherited)
    return False

# --- Set Theory: Permission Operations ---
def get_role_permissions(role):
    roles = load_roles()
    return set(roles.get(role, {}).get("permissions", []))

def union_permissions(*roles):
    """Combine permissions from multiple roles (set union)."""
    perms = set()
    for role in roles:
        perms |= get_role_permissions(role)
    return perms

def intersection_permissions(*roles):
    """Find common permissions (set intersection)."""
    perms = None
    for role in roles:
        role_perms = get_role_permissions(role)
        perms = role_perms if perms is None else perms & role_perms
    return perms if perms is not None else set()

def difference_permissions(role, except_roles):
    """Exclude permissions from except_roles (set difference)."""
    perms = get_role_permissions(role)
    for ex_role in except_roles:
        perms -= get_role_permissions(ex_role)
    return perms

# --- Example: Check if user can access resource ---
def user_can_access_resource(student_id, resource_permission):
    students = load_students()
    user = students.get(student_id)
    if not user:
        return False
    user_role = user["role"]
    # Traverse role hierarchy to collect all permissions
    roles = load_roles()
    visited = set()
    queue = deque([user_role])
    all_permissions = set()
    while queue:
        current = queue.popleft()
        if current in visited:
            continue
        visited.add(current)
        all_permissions |= set(roles.get(current, {}).get("permissions", []))
        for inherited in roles.get(current, {}).get("inherits", []):
            queue.append(inherited)
    return resource_permission in all_permissions