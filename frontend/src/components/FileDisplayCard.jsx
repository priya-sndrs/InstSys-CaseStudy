import React, { useState, useEffect, useRef } from "react";

function FileDisplayCard({ filename, onDelete }) {
  // Choose icon based on file extension
  let icon = "/navIco/file-generic.svg";
  if (filename.endsWith(".xlsx")) icon = "/navIco/file-excel.svg";
  if (filename.endsWith(".pdf")) icon = "/navIco/file-pdf.svg";
  if (filename.endsWith(".json")) icon = "/navIco/file-json.svg";

  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-3 max-w-fit h-fit relative">
      <button
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        onClick={() => onDelete(filename)}
        title="Delete file"
      >
        &#10006;
      </button>
      <div
        className="bg-contain bg-no-repeat w-[5vw] aspect-square mb-2"
        style={{ backgroundImage: `url('${icon}')` }}
      ></div>
      <span className="text-xs text-center wrap-break-word w-[60%] break-all">{filename}</span>
    </div>
  );
}

export default FileDisplayCard;