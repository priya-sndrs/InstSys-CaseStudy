import React from "react";

export default function Popup({ show, type, message, onClose }) {
  if (!show) return null;

  const popupTypes = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div className="fixed top-5 right-5 z-50">
      <div
        className={`rounded-lg shadow-lg px-6 py-4 min-w-[250px] ${popupTypes[type]} animate-slideIn`}
      >
        <div className="flex justify-between items-center gap-4">
          <p className="text-sm font-medium">{message}</p>
          <button onClick={onClose} className="text-white font-bold">
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
