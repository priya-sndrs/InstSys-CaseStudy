import React from 'react'

export default function Courses() {
  return (
    <>
    <div className='w-full h-full flex flex-col items-center'>
      {/* Header */}
      <div className=" w-full h-[10%] flex flex-col gap-2 items-center">
        <div className='flex justify-between w-[90%]'> 
            <div className='flex items-center'>
            <div className="bg-[url('/navIco/iconAI.svg')] bg-contain bg-no-repeat w-[3vw] aspect-square"></div>
                <h1>Intelligent System</h1>
            </div>
            <div className='flex items-center'>
                <h1>User Account</h1>
                <div className="bg-[url('/navIco/profile-circle.svg')] bg-contain bg-no-repeat w-[3vw] aspect-square"></div>
            </div>
        </div>
        <div className='w-[90%] h-1 rounded-2xl bg-gray-500'></div>
      </div>

      <h1 className='self-start ml-6 mb-2 text-[clamp(1.8rem,1.8vw,2.5rem)] font-sans font-medium'>Courses / Programs</h1>
      <div className='bg-gray-400 flex flex-col gap-3 w-[95%] h-[100%] overflow-y-scroll'>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
        <div className='w-full h-[20%] bg-amber-400 rounded-lg'></div>
      </div>

    </div>
    </>
  )
}
