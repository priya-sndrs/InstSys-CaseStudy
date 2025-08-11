import chromadb
from chromadb.config import Settings

client = chromadb.Client(Settings())

def Server(chroma_db_impl, persist_directory):
  client = chromadb.Client(Settings(
    chroma_db_impl=f"{chroma_db_impl}",
    persist_directory=f"{persist_directory}"
  ))
  
def GetUserCollection(user_id: str):
  return client.get_or_create_collection(name=f"user_{user_id}")
  