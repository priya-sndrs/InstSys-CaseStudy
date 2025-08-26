import React from 'react'
import CoursesCard from './coursesCard'

export default function Courses() {
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

      <h1 className='self-start ml-6 mb-2 text-[clamp(1.8rem,1.8vw,2.5rem)] font-sans font-medium'>Courses / Programs</h1>
      <div className=" flex flex-col gap-3 w-[95%] h-[100vh] overflow-y-scroll scrollbar-hide">
        <CoursesCard />
      </div>

    </div>
    </>
  )
}
