import { useState, useEffect } from "react";

export default function CourseDisplay() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setCourses] = useState([]);

  // Fetch courses from backend on mount
  useEffect(() => {
    fetch("http://localhost:5000/courses")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched courses: ", data);
        setCourses(data);
      })
      .catch(() => setCourses([]));
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides]);

  return (
    <div className="flex gap-5 w-full h-full relative">
      <div className="w-[30%] bg-black h-full relative overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full bg-cover bg-no-repeat bg-center transition-opacity duration-700 ${
              index === activeSlide ? "opacity-100 z-1" : "opacity-0 z-0"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>
        ))}
      </div>

      <div className=" flex flex-col py-6 px-4 pr-10 justify-between w-[70%] h-full">
        <div className="w-full h-full flex flex-col gap-2 relative overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`flex flex-col gap-2 transition-opacity duration-700 absolute top-0 left-0 w-full ${
                index === activeSlide ? "opacity-100 z-1" : "opacity-0 z-0"
              }`}
            >
              <h1 className="text-[clamp(0.8rem,2vw,2rem)] leading-tight text-white font-medium overflow-hidden">
                {slide.department}
              </h1>
              <h1 className="text-[clamp(2rem,2.7vw,3rem)] line-clamp-3 leading-tight text-amber-400 font-bold">
                {slide.program}
              </h1>
              <h2 className="text-[clamp(0.8rem,2vw,2rem)] leading-tight font-medium whitespace-pre-line line-clamp-4 text-justify truncate text-white">
                {slide.description}
              </h2>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-4">
          {/* <button className="px-20 py-5 w-fit bg-amber-400 text-amber-900 font-bold rounded-md text-3xl shadow-lg hover:scale-105 transform duration-300 cursor-pointer">
            Register an Account
          </button> */}

          <div className="flex gap-4 mt-4">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`w-6 aspect-square rounded-full cursor-pointer hover:-translate-y-1 transform duration-300 ${
                  idx === activeSlide ? "bg-amber-400" : "bg-white"
                }`}
                onClick={() => setActiveSlide(idx)}
              ></div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
}
