import React, { useState, useEffect, useRef } from "react";
import CoursesCard from './coursesCard'
import CourseModal from './courseModal';

export default function Courses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
                <h1 className="text-[clamp(1.3rem,1.2vw,1.8rem)] font-sans font-medium">User Account</h1>
                <div className="bg-[url('/navIco/profile-circle.svg')] bg-contain bg-no-repeat w-[3vw] aspect-square"></div>
            </div>
        </div>
        <div className='w-[90%] h-1 rounded-2xl bg-gray-500'></div>
      </div>

       <CourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}></CourseModal>
      <h1 className='self-start ml-6 mb-2 text-[clamp(1.8rem,1.8vw,2.5rem)] font-sans font-medium'>Courses / Programs</h1>
      <div className=" flex flex-col gap-3 w-[95%] h-[100vh] overflow-y-scroll scrollbar-hide">
        <CoursesCard />
        <div className='flex gap-3 shrink-0 w-full h-[30vh] p-5 rounded-xl shadow-md opacity-70 shadow-gray-400 bg-gray-300'>
        <button onClick={() => setIsModalOpen(true)} className='text-4xl hover:scale-101 transition-all duration-300 relative w-full rounded-md border-dotted border-5 bg-white cursor-pointer'>
        ADD COURSE
        </button>
    </div>
      </div>

    </div>
    </>
  )
}
