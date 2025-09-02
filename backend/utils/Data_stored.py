import os
import chromadb #type: ignore
from chromadb.config import Settings #type: ignore
from pathlib import Path

def log_decorator(func):
  def wrapper(*args, **kwargs):
    print(f"running: {func.__name__}")
    return func(*args, **kwargs)
  return wrapper

#Data store in chroma db
class Data_stored:
  def __init__(self):
    
    db_dir = Path(__name__).resolve().parent.parent / 'database' / 'chroma_store'
    self.client = chromadb.PersistentClient(path=db_dir)
    self.collection = self.client.get_or_create_collection(name="chroma_store")

    self.display_collection()  
  
  @log_decorator
  def display_collection(self):
    
    data = self.collection.get()    
    for i in range(len(data['ids'])):
      print(i)
      print(f"ID: {data['ids'][i]}")
      print(f"Document: {data['documents'][i]}")
      print(f"Metadata: {data['metadatas'][i]}")
      print('-' * 40)

if __name__ == "__main__":
  
  data = Data_stored()
  