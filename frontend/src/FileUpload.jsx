import React, { useRef } from "react";

function FileUpload({ onFileUpload, onUploadStatus }) {
  const fileInputRef = useRef(null);

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
  if (e.target.files[0]) {
    const file = e.target.files[0];

  // ✅ Allowed file extensions
  const allowedExtensions = [".xlsx", ".json", ".pdf"];

  // Check if the file is one of the allowed types
  if (!allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
    onFileUpload(file, { success: false, message: "Only Excel (.xlsx), JSON (.json), and PDF (.pdf) files are allowed ❌" });
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
        return;
      }

      onFileUpload(file, { success: true, message: "Upload complete ✅" });
    } catch (error) {
      console.error("Upload failed:", error);
      onFileUpload(file, { success: false, message: "Upload failed ❌" });
    }
    e.target.value = null;
  }
};

  return (
    <>
      <button className="nav w-auto" onClick={handleFileClick}>
        <img src="./public/navIco/folder.png" alt="upload" />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}

export default FileUpload;
