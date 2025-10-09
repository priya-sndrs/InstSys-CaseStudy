import React, { useState, useEffect } from "react";
import CoursesCard from '../components/coursesCard';
import CourseModal from '../components/courseModal';

export default function Courses({ studentData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);

  // Fetch courses from backend on mount
  useEffect(() => {
    fetch("http://localhost:5000/courses")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(() => setCourses([]));
  }, []);

  const handleAddCourse = (course) => {
    fetch("http://localhost:5000/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course)
    })
      .then(res => {
        if (res.ok) setCourses(prev => [...prev, course]);
      });
  };

  return (
    <>
      <div className='w-full h-full flex flex-col items-center py-5'>
        {/* Header */}
        <div className=" w-full h-[10%] flex flex-col gap-2 items-center">
          <div className='flex justify-between w-[90%]'> 
            <div className='flex items-center'>
              <div className="bg-[url('/navIco/iconAI.svg')] bg-contain bg-no-repeat w-[3vw] aspect-square"></div>
              <h1 className="text-[clamp(1.3rem,1.2vw,1.8rem)] font-sans font-medium">Intelligent System</h1>
            </div>
            <div className='flex  gap-2 items-center'>
              <h1 className="text-[clamp(1.3rem,1.2vw,1.8rem)] font-sans font-medium">
                {studentData ? `${studentData.firstName} ${studentData.lastName}` : "User Account"}
              </h1>
              <div className="bg-[url('/navIco/profile-circle.svg')] bg-contain bg-no-repeat w-[3vw] aspect-square"></div>
            </div>
          </div>
          <div className='w-[90%] h-1 rounded-2xl bg-gray-500'></div>
        </div>

        <CourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddCourse={handleAddCourse} />
        <h1 className='self-start ml-6 mb-2 text-[clamp(1.8rem,1.8vw,2.5rem)] font-sans font-medium'>Courses / Programs</h1>
        <div className=" flex flex-col gap-3 w-[95%] h-[100vh] overflow-y-scroll scrollbar-hide">
          {courses.map((course, idx) => (
            <CoursesCard key={idx} {...course} />
          ))}
          {/* Hide ADD COURSE for faculty */}
          {studentData?.role?.toLowerCase() !== "faculty" && (
            <div className='flex gap-3 shrink-0 w-full h-[30vh] p-5 rounded-xl shadow-md opacity-70 shadow-gray-400 bg-gray-300'>
              <button onClick={() => setIsModalOpen(true)} className='text-4xl hover:scale-101 transition-all duration-300 relative w-full rounded-md border-dotted border-5 bg-white cursor-pointer'>
                ADD COURSE
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
