import sqlite3
import sqlalchemy

class Database:
  def __init__(self):
    self.Database_dir = 'database/Database.db'
    self.conn = sqlite3.connect(self.Database_dir)
    self.cursor = self.conn.cursor()
    
    if not self.table_exists(self.Database_dir,'file_record'):
      self.cursor.execute('''CREATE TABLE IF NOT EXISTS file_record (
                    Id INTEGER PRIMARY KEY AUTOINCREMENT,
                    File BLOB
                    )
                    ''')
      self.conn.commit()
    
  def table_exists(self, db_path, table_name):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT name FROM sqlite_master
        WHERE type='table' AND name=?;
    """, (table_name,))
    
    return cursor.fetchone() is not None

  def CloseConn(self):
    self.conn.close()
