import React from "react";
import "./dashboard.css";

function Dashboard({goChat}) {
  return (
    <>
    <div className="flex flex-col">
      <div className="w-full h-fit py-2 flex flex-col bg-white items-center fixed border-b-12 border-[#FFDB0D] z-10">
        <div className="w-full h-full flex justify-between px-4 items-center">
          <div className=" flex gap-8 text-[clamp(0.5rem,1.2vw,1.2rem)] font-medium">
            <a href="/home" className="">Home</a>
            <a href="/about" className="">About PDM</a>
            <a href="/programs" className="">Programs</a>
          </div>

          <div className="bg-[url('/images/PDM-Logo.svg')] bg-contain bg-center bg-no-repeat w-[4%] aspect-square"></div>

          <div className="flex flex-row gap-2 h-12">
            <div className="flex items-center gap-8 text-[clamp(0.5rem,1.2vw,1.2rem)] h-full font-medium">
              <a href="/text" className="">Settings</a>
              <a href="/text" className="">Accounts</a>
            </div>
            <div className="bg-[url('/navIco/profile-circle.png')] bg-contain bg-center bg-no-repeat w-[20%] aspect-square"></div>
          </div>
        </div>
      </div>
      <div className="flex w-full h-[100vh] pt-[3%] bg-[linear-gradient(to_bottom,rgba(121,44,26,0.7),rgba(105,34,16,0.9)),url('/images/PDM-Facade.png')] bg-cover bg-center bg-no-repeat">
        <div className="h-full w-[55%] pt-[5%] px-[3%]">
          <div className="text-white text-[clamp(1rem,1.5vw,2rem)] pl-[5px] font-medium PDM">
            Pambayang Dalubhasaan ng Marilao
          </div>

          <div className="text-yellow-400 text-[clamp(2rem,9vw,12rem)] font-medium font-serif leading-[100%] h-fit mb-[3%]">
            Learning<br /> Made<br /> Smarter
          </div>
          <button
            onClick={goChat}
            className="text-amber-950 cursor-pointer w-[25%] py-[2%] font-bold text-[clamp(1rem,2vw,2rem)] rounded-2xl bg-amber-400 shadow-md shadow-black hover:scale-105 transition-all duration-300">
              Try AI
          </button>
          
        </div>
        <div className="bg-[linear-gradient(to_bottom,rgba(121,44,26,0.3),rgba(105,34,16,0.6)),url('/images/graduation.jpg')] bg-cover bg-center bg-no-repeat blob h-full w-[50%]"></div>
      </div>

      <div className="bg-white w-full h-[100vh] flex flex-col p-10">
        <h1 className="text-gray-900 text-[clamp(1rem,4vw,5rem)] font-medium font-serif">PROGRAMS AND COURSES</h1>
        <div className="w-[50%] h-[50%] bg-black">
          <div></div>
        </div>

        <div></div>
      </div>
    </div>
    </>
  );
}

export default Dashboard;
