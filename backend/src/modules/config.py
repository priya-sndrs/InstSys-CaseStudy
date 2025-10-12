import requests
import os
import json
from pathlib import Path
from src.component.System import SmartStudentDataSystem
from src.component.Restrict import DataLoader

def check_network():
    try:
        requests.get("https://www.google.com", timeout=3)
        return 'online'
    except requests.RequestException:
        return 'offline'
    
def collect_data(path, role, assign, load = False):
    ai = SmartStudentDataSystem()
    if load:
        ai.Autoload_new_data()
    loader = DataLoader(path, silent=False)
    file_path = loader.load_data(role=role, assign=assign)
    ai.retrieve_metadata(file_path)
    return ai.restricted_collections


class Config:
    def __init__(self):
        
        self.data_dir = Path(__name__).resolve().parent / 'database' / 'chroma_store'
        self.api_mode = check_network()
        self.UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
        os.makedirs(self.UPLOAD_FOLDER, exist_ok=True)
        self.UPLOAD_FOLDER_LIST = os.path.join(os.path.dirname(__file__), 'uploads')
        self.ROLE_ASSIGN_FILE = os.path.join(os.path.dirname(__name__), "config/last_role_assign.json")
        self.COURSES_FILE = os.path.join(os.path.dirname(__file__), "config/courses.json")

        try:
            with open("config/config.json", "r", encoding="utf-8") as f:
                full_config = json.load(f)
        except FileNotFoundError:
            print("❌ config.json not found! Cannot start AI Analyst.")


