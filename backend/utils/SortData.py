import os
from utils.System import SmartStudentDataSystem

class Sort_Data(SmartStudentDataSystem):
  def __init__(self, collections):
    
    self.collection = collections
    self.log = False
    self.file_dir = os.path.join(os.getcwd(), 'uploads')
    self.data = {}
  
  def is_valid(self, file):
    return (file.endswith('.xlsx') or file.endswith('.pdf')) and not file.startswith('~$')
  
  def list_available_files(self):
        """List available files with smart type detection"""
        files = [f for f in os.listdir(self.file_dir) if self.is_valid(f)]
        
        if not files:
          if self.log:
            print("❌ No Excel or PDF files found.")
          return []
        
        if self.log:
          print("\n📁 Available Files:")
        for i, file in enumerate(files, 1):
            file_type = self.detect_file_type(file)
            if self.log:
              print(f"  {i}. {file} - {file_type}")
        return files
      
  def students_record(self):
    return 
  
  def admin_employee(self):
    return
  
  def Sort(self):
    filename = self.list_available_files()
    
    for idx, (filename) in enumerate(filename):
      RecordType = self.detect_file_type(filename)
    
    if RecordType:
      pass
    elif RecordType:
      pass
  
  def __call__(self):
    self.Sort()
  