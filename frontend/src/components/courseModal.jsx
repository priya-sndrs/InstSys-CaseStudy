import React, { useState } from "react";
import '../css/input.css';

export default function CourseModal({ isOpen, onClose, onAddCourse, children }) {
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCourse({ department, program, description, image });
    setDepartment("");
    setProgram("");
    setDescription("");
    setImage(null);
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[35%] h-fit  p-6 relative">
        <button 
          onClick={onClose}
          className="absolute w-10 aspect-square top-3 right-3 text-gray-500 hover:text-black hover:bg-red-400 cursor-pointer"
        >
          ✕
        </button>
        <div className="w-full h-full py-10 ">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex gap-2">
              <label className="w-[10vw] rounded-lg outline-dashed aspect-square bg-gray-300 flex items-center justify-center cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                UPLOAD IMAGE
              </label>
              <div className="flex flex-col w-full gap-5">
                <input type="text" className="input-des" placeholder="Enter Department" value={department} onChange={e => setDepartment(e.target.value)} required />
                <input type="text" className="input-des" placeholder="Enter Program" value={program} onChange={e => setProgram(e.target.value)} required />
              </div>
            </div>
            <textarea className="input-des !p-5 !h-[15vh]" placeholder="Enter Description" value={description} onChange={e => setDescription(e.target.value)} required />
            <button type="submit" className="!w-[50%] py-2 rounded-2xl bg-amber-400 self-center font-sans font-medium">ADD</button>
          </form>
        </div>
        {children}
      </div>
    </div>
  );
}
