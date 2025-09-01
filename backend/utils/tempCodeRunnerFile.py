import os
from pathlib import Path

class DataLoader:
    def __init__(self, folder_dir, silent=False):
        self.folder_dir = folder_dir
        self.silent = silent

    def load_data(self, role="guest"):
        """
        Scan folders and load files, but replace function calls with prints.
        """
        role = role.lower()
        uploads_dir = self.folder_dir

        exclusions = {
            "admin": [],
            "manager": ["admin"],
            "staff": ["admin", "manager"],
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
                print(f"📂 Loading folder: {folder}")

            # Keep real file iteration
            files = os.listdir(folder_dir)

            for filename in files:
                # Instead of self.is_valid(file)
                print(f"🔎 Would call self.is_valid('{filename}')")

                file_path = os.path.join(folder_dir, filename)
                if not self.silent:
                    print(f"📂 Loading file: {filename}")

                # Instead of self.process_file(file_path)
                print(f"⚙️ Would call self.process_file('{file_path}')")

                # Simulate success message
                print(f"✅ (Simulated) Data loaded successfully from {filename}!")


def main():
    # Example: point this to your test directory
    folder_path = db_dir = Path(__name__).resolve().parent.parent / 'database' / 'chroma_store'  # replace with your real folder path
    role = "staff"             # try: "admin", "manager", "staff"

    loader = DataLoader(folder_path, silent=False)
    loader.load_data(role=role)


if __name__ == "__main__":
    main()
