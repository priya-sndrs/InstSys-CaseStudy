import React from "react";
import "./dashboard.css";

function Dashboard() {
  return (
    <>
      <div className="w-full h-[10%] bg-white flex items-center fixed top-0 left-0 pr-[5%] border-b-12 border-[#FFDB0D] z-50">
        
        <div className="flex gap-8 text-lg font-medium pl-[1%] ml-[1%]">
          <a href="/home" className="">
            Home
          </a>
          <a href="/about" className="">
            About PDM
          </a>
          <a href="/programs" className="">
            Programs
          </a>
        </div>

        <div className="flex gap-8 text-lg font-medium ml-auto">
          <a href="/text" className="">
            Text
          </a>
          <a href="/text" className="">
            Text
          </a>
          <div className="bg-[url('/images/profile-circle.png')] bg-contain bg-left bg-no-repeat w-[5%] h-[50%] absolute top-[25%] left-[98.5%] -translate-x-1/2">
          </div>
        </div>

        <div className="bg-[url('/images/PDM-Logo.svg')] bg-contain bg-center bg-no-repeat w-[5%] h-[70%] absolute left-[50%] -translate-x-1/2">
        </div>
      </div>

      <div className="absolute top-[20%] left-[12%] -translate-x-[50%] text-white">
        Pambayang Dalubhasaan ng Marilao
      </div>

      <div className="absolute top-[42%] left-[12%] -translate-x-[50%] text-gray-700 italic">
        Schooling Made Smarter
      </div>

      <button className="absolute top-[50%] left-[12%] -translate-x-[50%] bg-[#f5c542] px-6 py-3 rounded-lg font-semibold">
        Try AI
      </button>
    </>
  );
}

export default Dashboard;
