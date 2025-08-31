import React from "react";

export default function CoursesCard({ department, program, description, image }) {
  return (
    <div className='flex gap-3 shrink-0 w-full h-fit p-3 rounded-xl shadow-md shadow-gray-400 bg-gray-300'>
      <div className='relative w-[20%] shrink-0 aspect-square rounded-md bg-white'>
        {image && <img src={image} alt={program} className="object-cover w-full h-full rounded-md" />}
      </div>
      <div className='flex flex-col justify-center gap-5 w-[80%] h-full'>
        <h1 className='text-4xl font-sans font-medium'>{department}</h1>
        <h2 className='text-3xl font-sans '>{program}</h2>
        <p className='text-2xl font-sans font-light wrap-break-word '>{description}</p>
      </div>
    </div>
  );
}
