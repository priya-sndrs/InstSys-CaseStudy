import React, { useRef, useState, useEffect } from "react";
import FileDisplayCard from "./FileDisplayCard";

function FileUpload({ onFileUpload, onUploadStatus }) {
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Fetch files from backend uploads folder
  const fetchFiles = () => {
    fetch("http://127.0.0.1:5000/list_uploads")
      .then((res) => res.json())
      .then((data) => setUploadedFiles(data))
      .catch(() => setUploadedFiles([]));
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Delete file handler
  const handleDeleteFile = (filename) => {
    if (!window.confirm(`Delete "${filename}"?`)) return;
    fetch(`http://127.0.0.1:5000/delete_upload/${encodeURIComponent(filename)}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) fetchFiles();
        else alert("Failed to delete file.");
      })
      .catch(() => alert("Failed to delete file."));
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];

      // ✅ Allowed file extensions
      const allowedExtensions = [".xlsx", ".json", ".pdf"];

      // Check if the file is one of the allowed types
      if (!allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))) {
        onFileUpload(file, {
          success: false,
          message: "Only Excel (.xlsx), JSON (.json), and PDF (.pdf) files are allowed ❌",
        });
        e.target.value = null; // reset input so user can reselect
        return;
      }

      // Notify parent that upload started
      if (onUploadStatus) onUploadStatus("start", file);

      // Create FormData for sending file
      const formData = new FormData();
      formData.append("file", file);

      try {
        // send to backend (adjust URL if needed)
        let response = await fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        });

        let result = await response.json();

        // If duplicate, ask user
        if (response.status === 409 && result.duplicate) {
          const confirm = window.confirm(result.message);
          if (confirm) {
            // Try again with overwrite flag
            const overwriteForm = new FormData();
            overwriteForm.append("file", file);
            overwriteForm.append("overwrite", "true");
            response = await fetch("http://127.0.0.1:5000/upload", {
              method: "POST",
              body: overwriteForm,
            });
            result = await response.json();
            onFileUpload(file, { success: true, message: "File overwritten ✅" });
          } else {
            onFileUpload(file, { success: false, message: "Upload cancelled ❌" });
          }
          e.target.value = null;
          if (onUploadStatus) onUploadStatus("end", file);
          fetchFiles(); // Refresh file list
          return;
        }

        onFileUpload(file, { success: true, message: "Upload complete ✅" });
        fetchFiles(); // Refresh file list
      } catch (error) {
        console.error("Upload failed:", error);
        onFileUpload(file, { success: false, message: "Upload failed ❌" });
      }
      if (onUploadStatus) onUploadStatus("end", file);
      e.target.value = null;
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col items-center py-5 mr-2">
        {/* Header */}
        <div className=" w-full h-[10%] flex flex-col gap-2 items-center">
          <div className="flex justify-between w-[90%]">
            <div className="flex items-center">
              <div className="bg-[url('/navIco/iconAI.svg')] bg-contain bg-no-repeat w-[3vw] aspect-square"></div>
              <h1 className="text-[clamp(1.3rem,1.2vw,1.8rem)] font-sans font-medium">
                Intelligent System
              </h1>
            </div>
            <div className="flex gap-2 items-center">
              <h1 className="text-[clamp(1.3rem,1.2vw,1.8rem)] font-sans font-medium">
                User Account
              </h1>
              <div className="bg-[url('/navIco/profile-circle.svg')] bg-contain bg-no-repeat w-[3vw] aspect-square"></div>
            </div>
          </div>
          <div className="w-[90%] h-1 rounded-2xl bg-gray-500"></div>
        </div>
        {/* Main Documents */}
        <h1 className="self-start ml-6 mb-2 text-[clamp(1.8rem,1.8vw,2.5rem)] font-sans font-medium">
          FILES UPLOADED
        </h1>
        <div className="flex flex-col justify-between gap-2 w-[80vw] h-[80%]">
          <div className="rounded-xl w-full h-[30%]">
            <h1 className="text-[clamp(0.6rem,1.3vw,2rem)] font-sans font-medium">
              Faculties and Curriculum
            </h1>
            <div className="flex 0 w-full h-full gap-10 flex-row overflow-x-scroll">
              {uploadedFiles.map((file) => (
                <FileDisplayCard key={file} filename={file} onDelete={handleDeleteFile}/>
              ))}
            </div>
          </div>
          <div className="rounded-xl w-full h-[30%]">
            <h1 className="text-[clamp(0.6rem,1.3vw,2rem)] font-sans font-medium">
              Class and Student Record
            </h1>
            <div className="flex w-full h-full gap-10 flex-row overflow-x-scroll"></div>
          </div>
          <div className="rounded-xl w-full h-[30%]">
            <h1 className="text-[clamp(0.6rem,1.3vw,2rem)] font-sans font-medium">
              Admin and Employees
            </h1>
            <div className="flex  w-full h-full gap-10 flex-row overflow-x-scroll"></div>
          </div>
        </div>
        {/* Add Button */}
        <div className="absolute right-10 bottom-10">
          <button className="nav w-auto" onClick={handleFileClick}>
            <img
              src="./public/navIco/add-circle.svg"
              alt="Upload"
              className="navBtn w-[10vw] aspect-square"
            />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </div>
    </>
  );
}

export default FileUpload;