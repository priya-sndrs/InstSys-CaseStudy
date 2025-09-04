import os
from pathlib import Path

class DataLoader:
    def __init__(self, folder_dir, silent=False):
        self.folder_dir = folder_dir
        self.silent = silent

    def load_data(self, role="guest"):

        role = role.lower()
        uploads_dir = self.folder_dir

        exclusions = {
            "admin": [],
            "faculty": ["admin", ""],
            "students": ["admin", "faculty"],
            "guest": ["admin", "faculty", "students"]
        }

        for folder in os.listdir(uploads_dir):
            if folder in exclusions.get(role, []):
                if not self.silent:
                    print(f"⛔ Skipping restricted folder: {folder}")
                continue

            folder_dir = os.path.join(uploads_dir, folder)
            if not os.path.isdir(folder_dir):
                continue

            if not self.silent:
                print(f"📂 Loading folder: {folder}\n\n")

            files = os.listdir(folder_dir)

            for filename in files:
                
                file_path = os.path.join(folder_dir, filename)
                print(f"Loading file: {filename}")




def main():
    folder_path = db_dir = Path(__name__).resolve().parent.parent / 'uploads'
    role = "faculty" # change the role base on user authority

    loader = DataLoader(folder_path, silent=False)
    loader.load_data(role=role)


if __name__ == "__main__":
    main()
