import React, { useState, useEffect, useRef } from "react";

export default function CoursesCard() {
  return (
    <>
    <div className='flex gap-3 shrink-0 w-full h-fit p-3 rounded-xl shadow-md shadow-gray-400 bg-gray-300'>
        <div className='relative w-[20%] shrink-0 aspect-square rounded-md bg-white'>
        </div>
        <div className='flex flex-col justify-center gap-5 w-[80%] h-full'>
            <h1 className='text-4xl font-sans font-medium'>COLLEGE OF COMPUTER STUDIES</h1>
            <h2 className='text-3xl font-sans '>Bachelor of Science in Computer Science</h2>
            <p className='text-2xl font-sans font-light wrap-break-word '>The study of concepts and theories, algorithmic foundations, implementation and application of information and computing solutions.The BSCS program prepares the students to be IT professionals and researchers, and to be proficient in designing and developing computing solutions.</p>
        </div>
    </div>
    </>
  )
}
