import React, { useState, useEffect, useRef } from "react";
import './input.css';

export default function FileModal({ isOpen, onClose, children }) {
  if (!isOpen) return null; // don’t render if not open

  return (
    <div className="fixed inset-0 2 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[35%] h-fit p-6 relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute w-10 aspect-square top-3 right-3 text-gray-500 hover:text-black hover:bg-red-400 cursor-pointer"
        >
          ✕
        </button>

        {/* Modal content */}
        <div className="w-full h-full py-2 flex flex-col gap-2 ">
            <h1 className="font-bold text-4xl">Upload and Attach Files</h1>
            <h2 className="font-light text-xl">Attach files to load in this System</h2>
            <form action="submit" className="flex flex-col gap-6">
                <div className="flex gap-2 w-full ">
                    <button className="w-full h-[20vh] border-dotted border-4 rounded-2xl bg-gray-300">ATTACH FILE</button>
                </div>
                <select name="" id="" className="py-2 rounded-2xl border-1 px-2">
                    <option value="">Faculties And Curriculum</option>
                    <option value="">Class and Student Records</option>
                    <option value="">Admin and Employees</option>
                </select>
                <div className="flex flex-col h-[10vh] w-full overflow-y-scroll">
                    <div className="flex w-full h-[10vh] bg-gray-400 p-2 rounded-2xl shrink-0">
                        <div className="w-[15%] aspect-square g-[url('/navIco/file-json.svg')] bg-no-repeat bg-contain bg-center"></div>
                    </div>
                </div>
                <button className="!w-[50%] py-6 rounded-2xl bg-gray-950 text-white self-end font-sans font-medium">ADD</button>
            </form>
        </div>

        {children}
      </div>
    </div>
  );
}
