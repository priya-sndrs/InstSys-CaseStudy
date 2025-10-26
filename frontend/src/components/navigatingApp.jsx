import { useState, useEffect, useRef } from "react";
import "../css/navigatingApp.css";

export default function NavigatingApp() {
    const [activeSlide, setActiveSlide] = useState(0);
    const videoRef = useRef(null);

    const slides = [
    {
        title: "Logging In",
        content: "Accessing the site, you will be greeted by the Login Page where you can login usig your account, create your own account, or use the AI without needing an account by signing in as a Guest",
        image: "/guideThree/image1.png",
    },
    {
        title: "Register Account",
        content: "Here youi can create your own account using your student credential to access school related information to help you of your need regarding informations.",
        image: "/guideOne/image1.png",
    },
    {
        title: "Welcome to Dashboard",
        content: "Once entering, you'll be redirected here on Dashboard where you can see public informations about PDM such as Program Offerings, History, Vision and Mission. You can also see here a user guide that will show you on how to use the app from creating account to using the system itself.",
        image: "/guideThree/image2.png",
    },
    {
        title: "Intelligent System",
        content: "Like many other Intelligent System, the PDM system has the ability to answer all your question regarding PDM's public informations like events and announcements, even public details for facilities and students. You can access it by pressing the button 'Try Using Ai'. After navigating to the chat box, you can start asking questions using the message box below.",
        video: "/guideTwo/video3.mp4",
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
    <div className="navigating flex gap-5 w-full h-full p-20 relative">
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
              <h1 className="title text-[clamp(2rem,3vw,5rem)] text-amber-900 font-medium">{slide.title}</h1>
              <h2 className="desc text-[clamp(0.8rem,1.3vw,1.4rem)] font-medium whitespace-pre-line">{slide.content}</h2>
            </div>
          ))}
        </div>

        <div className="trybtn flex flex-col gap-4 mt-4">
          <button className="btntry px-20 py-5 w-fit shadow-gray-500 bg-amber-400 text-amber-900 font-bold rounded-md text-[clamp(0.8rem,1.3vw,1.4rem)]  shadow-lg hover:scale-105 transform duration-300 cursor-pointer">
            Try Using AI
          </button>

          <div className="slide flex gap-4 mt-4">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 aspect-square rounded-full cursor-pointer hover:-translate-y-1 transform duration-300 ${
                  idx === activeSlide ? "bg-amber-400" : "bg-amber-800"
                }`}
                onClick={() => setActiveSlide(idx)}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right image */}
      <div className="vid w-[40%] h-full relative rounded-sm overflow-hidden shadow-gray-500 shadow-lg">
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