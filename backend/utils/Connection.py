import sqlite3
import sqlalchemy

class Database:
  def __init__(self):
    self.conn = sqlite3.connect('database/Database.db')
    self.cursor = self.conn.cursor()
    self.cursor.execute('''CREATE TABLE IF NOT EXISTS file_record (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    File BLOB
                    )
                    ''')
    if self.table_exists():
      self.conn.commit()
    
  def table_exists(db_path, table_name):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT name FROM sqlite_master
        WHERE type='table' AND name=?;
    """, (table_name,))
    
    exists = cursor.fetchone() is not None

    conn.close()
    return exists

  def CloseConn(self):
    self.Database.close()
