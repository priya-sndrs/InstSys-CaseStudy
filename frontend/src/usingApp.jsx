import { useState, useEffect, useRef } from "react";


export default function UsingApp({goChat}) {
    const [activeSlide, setActiveSlide] = useState(0);

    const slides = [
    {
        title: "Using the System",
        content: "Once the user Log in, they will go to the Homepage. The Homepage displays a brief summary of PDM and the courses they offer for upcoming students. To access the Ai in the app, the user will see “Try AI” button which they can communicate or inquire information that is only related to the school.",
        image: "/guideTwo/image1.png",
    },
    {
        title: "Using Ai",
        content: 
        `• To use the AI, there’s a message box on the bottom that has text “Ask anything” where can the user type to communicate or inquire to AI.
        • For the AI to receive your input, just click the Plane-shaped button on the right side.
        • Also if the user wants to go back to the Homepage, they can click the Logo of the PDM on the upper left on which is on the sidebar.`,
        image: "/guideTwo/image2.png",
    },
    {
        title: "Accessing Sidebar",
        content: "There’s an icon which the user can see on the left side. Each icons have specific name and purposes (Dashboard, Programs, and Account Info Pages).",
        video: "/guideTwo/video3.mp4",
    },
    {
        title: "Loaded Files (Admin)",
        content: "This is where the user can upload files per roles so that the AI can provided specific level of information to the user, it also helps the user specially if they are having a hard time typing just to have a specific information they needed from the AI.",
        image: "/guideTwo/image4.png",
    },
    {
        title: "Progrmas (Admin)",
        content: "This is where the user can see the Courses the PDM offers, the interface of it changes depending on the role of the user, if the user are student or gust they can only see the Courses available. If the user was an admin, they can edit it, like adding another program/courses.",
        image: "/guideTwo/image5.png",
    },
    ];


    useEffect(() => {
    if (!slides[activeSlide].video) {
        const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(interval);
    }
    }, [activeSlide]);
    
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
              <h1 className="text-[clamp(2rem,3vw,5rem)] text-amber-900 font-medium">{slide.title}</h1>
              <h2 className="text-[clamp(0.8rem,1.3vw,1.4rem)] font-medium whitespace-pre-line">{slide.content}</h2>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-4">
          <button onClick={goChat} className="px-20 py-5 w-fit shadow-gray-500 bg-amber-400 text-amber-900 font-bold rounded-md text-[clamp(0.8rem,1.3vw,1.4rem)]  shadow-lg hover:scale-105 transform duration-300 cursor-pointer">
            Try Using AI
          </button>

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
      <div className="w-[40%] h-full relative rounded-sm overflow-hidden z-1 shadow-gray-500 shadow-lg">
        {slides.map((slide, index) => (
            <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${
                index === activeSlide ? "opacity-100 z-1" : "opacity-0 z-0"
            }`}
            >
            {slide.image && (
                <div
                className="w-full h-full bg-contain bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
                />
            )}
            {slide.video && (
                <video
                className="w-full h-full object-contain"
                src={slides[activeSlide].video}
                autoPlay
                muted
                onEnded={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
                />
            )}
            </div>
        ))}
      </div>
    </div>
  );
}