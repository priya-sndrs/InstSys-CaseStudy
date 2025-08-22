def load_new_data(self):
        """Load new data from files"""
        files = self.list_available_files()
        if not files:
            return False
            
        try:
            choice = int(input("\n🔢 Enter file number to load: ").strip())
            if 1 <= choice <= len(files):
                filename = files[choice - 1]
                success = self.process_file(filename)
                if success:
                    self.data_loaded = True
                    print("✅ Data loaded successfully!")
                return success
        except ValueError:
            print("❌ Invalid input.")
        return False