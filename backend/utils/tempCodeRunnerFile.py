import os
from pathlib import Path
from System import SmartStudentDataSystem

ai = SmartStudentDataSystem()

folder_dir = Path(__file__).resolve().parent.parent / 'uploads'
debug = True

def is_valid(file):
    return (file.endswith('.xlsx') or file.endswith('.pdf')) and not file.startswith('~$')

for folder in os.listdir(folder_dir):
    print(f"\n{folder}\n")
    file_dir = os.path.join(folder_dir, folder)
    files = [f for f in os.listdir(file_dir) if is_valid(f)]
    if not files:
        if debug:
            print("❌ No Excel or PDF files found.")
        
    
    if debug:
        print("\n📁 Available Files:")
    for i, file in enumerate(files, 1):
        file = os.path.join(folder, file)
        print(f'\n\n{file}\n\n')
        file_type = ai.detect_file_type(file)
        if debug:
            print(f"  {i}. {file} - {file_type}")
