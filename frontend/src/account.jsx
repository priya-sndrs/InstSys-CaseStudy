import React from 'react'

export default function Account() {
  return (
    <>
    <div className='w-[100%] h-full gap-5 p-4 flex flex-col'>
      <div className="flex gap-4 p-3 shadow-md bg-gray-100/70 rounded-lg w-full h-[20%] items-center">
        <div className="h-full aspect-square bg-white shadow-lg rounded-full flex-shrink-0"></div>
        <div className='flex flex-col gap-3'>
          <h1 className='text-5xl font-medium'>USERNAME</h1>
          <h2 className='text-3xl'>Student</h2>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5 shadow-md bg-gray-100/70 rounded-lg w-full h-[20%]">
        <h1 className='text-3xl font-bold'>FULL NAME</h1>
        <div className='flex justify-between'>
          <div className='flex flex-col gap-1'>
            <h1 className='text-3xl font-medium'>USERNAME</h1>
            <h2 className='text-2xl'>First Name</h2>
          </div>
          <div className='flex flex-col gap-1'>
            <h1 className='text-3xl font-medium'>USERNAME</h1>
            <h2 className='text-2xl'>Middle Name</h2>
          </div>
          <div className='flex flex-col gap-1'>
            <h1 className='text-3xl font-medium'>USERNAME</h1>
            <h2 className='text-2xl'>Last Name</h2>
          </div>
        </div>
      </div>
      <div className="flex gap-4 p-5 shadow-md bg-gray-100/70 rounded-lg w-full h-[35%]">
          <div className='flex flex-col gap-3 justify-between'>
          <h1 className='text-3xl font-medium'>INFORMATION</h1>
          <div className='flex flex-col p-2'>
            <div className='flex flex-col my-1.5'>
              <h1 className='text-3xl'>Student Number</h1>
              <p className='text-2xl font-medium'>PDX-XXXX-XXXXXX</p>
            </div>
            <div className='flex flex-col my-1.5'>
              <h1 className='text-3xl'>Course</h1>
              <p className='text-2xl font-medium'>Bachelor of Science in Computer Science</p>
            </div>
            <div className='flex flex-col my-1.5'>
              <h1 className='text-3xl'>Email Address</h1>
              <p className='text-2xl font-medium'>usermail.pdm@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 p-3 shadow-md bg-gray-100/70 rounded-lg w-full h-[20%]">
        <div className='flex flex-col gap-3'>
          <h1 className='text-3xl font-medium'>Additional Student Information</h1>
        </div>
      </div>

    </div>
    </>
  )
}
