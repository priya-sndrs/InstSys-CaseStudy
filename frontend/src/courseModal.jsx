import React, { useState, useEffect, useRef } from "react";
import './input.css';

export default function CourseModal({ isOpen, onClose, children }) {
  if (!isOpen) return null; // don’t render if not open

  return (
    <div className="fixed inset-0 2 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[35%] h-fit  p-6 relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute w-10 aspect-square top-3 right-3 text-gray-500 hover:text-black hover:bg-red-400 cursor-pointer"
        >
          ✕
        </button>

        {/* Modal content */}
        <div className="w-full h-full py-10 ">
            <form action="submit" className="flex flex-col gap-6">
                <div className="flex gap-2">
                    <button className="w-[10vw] rounded-2xl aspect-square bg-gray-300">UPLOAD IMAGE</button>
                    <div className="flex flex-col w-full gap-5">
                        <input type="text" name="" id="" className="input-des" placeholder="Enter Department"/>
                        <input type="text" name="" id="" className="input-des" placeholder="Enter Progran"/>
                    </div>

                </div>
                <textarea name="" id="" className="input-des !p-5 !h-[15vh]" placeholder="Enter Description"></textarea>
                <button className="!w-[50%] py-2 rounded-2xl bg-amber-400 self-center font-sans font-medium">ADD</button>
            </form>
        </div>

        {children}
      </div>
    </div>
  );
}
