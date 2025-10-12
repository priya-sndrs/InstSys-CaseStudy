import requests
from utils.System import SmartStudentDataSystem
from utils.Restrict import DataLoader

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


