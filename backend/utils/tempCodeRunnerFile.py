import os
from pathlib import Path

def is_valid(file):
    return (file.endswith('.xlsx') or file.endswith('.pdf')) and not file.startswith('~$')

def list_available_files(folder_dir):
        """List available files with smart type detection"""
        for folder in os.listdir(folder_dir):
            print(folder)
            file_dir = os.path.join(folder_dir, folder)
            files = [f for f in os.listdir(file_dir) if is_valid(f)]
            print(f"files collection: {files}\n\n")


folder_dir = Path(__file__).resolve().parent.parent / 'uploads'


list_available_files(folder_dir)
