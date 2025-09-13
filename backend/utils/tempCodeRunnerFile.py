from pathlib import Path

print(Path(__file__).resolve().parent.parent / "database" / "chroma_store")
