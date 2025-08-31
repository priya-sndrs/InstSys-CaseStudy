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
    <div className="flex gap-5 w-full h-full p-20 relative">
      {/* Left content */}
      <div className="flex flex-col justify-between w-[60%] h-full">
        <div className="w-full h-full flex flex-col gap-10 relative">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`flex flex-col gap-5 transition-opacity duration-700 absolute top-0 left-0 w-full ${
                index === activeSlide ? "opacity-100 z-1" : "opacity-0 z-0"
              }`}
            >
              <h1 className="text-[clamp(2rem,3vw,5rem)] text-amber-900 font-black">
                {slide.department}
              </h1>
              <h1 className="text-[clamp(2rem,3vw,5rem)] text-amber-700 font-medium">
                {slide.program}
              </h1>
              <h2 className="text-2xl font-medium whitespace-pre-line">
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
                  idx === activeSlide ? "bg-amber-400" : "bg-amber-800"
                }`}
                onClick={() => setActiveSlide(idx)}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right image */}
      <div className="w-[40%] h-full relative rounded-sm overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full bg-contain bg-no-repeat bg-center transition-opacity duration-700 ${
              index === activeSlide ? "opacity-100 z-1" : "opacity-0 z-0"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
