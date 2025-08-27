import React, { useState, useRef } from "react";
import './input.css';

export default function FileModal({ isOpen, onClose, onSubmit }) {
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState("");
  const fileInputRef = useRef(null); // ✅ define fileInputRef here

  if (!isOpen) return null; // don’t render if not open

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    console.log(folder);
    e.preventDefault();
    if (file && folder) {
      await onSubmit(file, folder); // ✅ pass both values to parent
      onClose();
    } else {
      alert("Please choose a file and a folder ❌");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[35%] h-fit p-6 relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute w-10 aspect-square top-3 right-3 text-gray-500 hover:text-black hover:bg-red-400 cursor-pointer"
        >
          ✕
        </button>

        {/* Modal content */}
        <div className="w-full h-full py-2 flex flex-col gap-2">
          <h1 className="font-bold text-4xl">Upload and Attach Files</h1>
          <h2 className="font-light text-xl">Attach files to load in this System</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Custom attach button */}
            <div className="flex gap-2 w-full">
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
                className="w-full h-[20vh] border-dotted border-4 rounded-2xl bg-gray-300 hover:scale-103 transition-all duration-300"
              >
                ATTACH FILE
              </button>
            </div>

            {/* Folder selector */}
            <select 
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="py-2 rounded-2xl border px-2"
            >
              <option value="" disabled>Select Folder</option>
              <option>Faculty</option>
              <option>Students</option>
              <option>Admin</option>
            </select>

            {/* Preview */}
            {file && (
              <div className="mb-4 p-2 border rounded bg-gray-100">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-600">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            )}

            {/* Submit */}
            <button 
              type="submit"
              className="!w-[50%] py-6 rounded-2xl bg-gray-950 text-white self-end font-sans font-medium hover:scale-105 transition-all duration-300"
            >
              ADD
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
