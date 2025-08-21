import React from "react";
import "./login.css";

function Login({ goRegister, goChat }) {
  return (
    <>
      <div className="w-screen h-screen bg-[linear-gradient(to_top,rgba(121,44,26,0.9),rgba(63,23,13,0.7)),url('/images/PDM-Facade.png')] bg-cover bg-right flex flex-row justify-between items-center">
        <div className="w-full h-screen flex flex-col gap-5 justify-center items-center">
          <div className="bg-[url('/images/PDM-Logo.svg')] bg-contain w-[30vw] h-[30vw]"></div>

          <h1 className="text-[clamp(2rem,5vw,4rem)] font-sans font-medium text-yellow-500">
            Pambayang Dalubhasaan ng Marilao
          </h1>
        </div>
        <div className=" flex justify-center items-center w-[60%] h-full rounded-tl-3xl rounded-bl-3xl bg-gray-100">
          <div className="w-[60%] h-fit py-[10%] px-[3%] rounded-xl shadow-[5px_5px_8px_#bebebe,_-5px_-5px_8px_#ffffff] bg-[#e0e5ec]">
            <form
              action="submit"
              className="flex flex-col gap-8 justify-center items-center"
            >
              <input
                type="text" required
                className="login_input"
                placeholder="Enter Student ID"
              />

              <input
                type="text" required
                className="login_input"
                placeholder="Enter Student Name"
              />
              <input
                type="password" required
                className="login_input"
                placeholder="Enter Password"
              />
              <div className="w-full flex flex-col gap-4 items-center justify-center">
                <button
                  className=" w-[80%] py-[calc(0.5vw+0.5vh)] rounded-lg bg-yellow-500 text-[clamp(0.5rem,1.5vw,2rem)] font-sans font-medium cursor-pointer hover:scale-105 transition-all duration-300 "
                  onClick={goChat}
                >
                  Log In
                </button>{""}
                <button
                      className='font-sans font-medium underline text-[clamp(0.6rem,1.3vw,1.2rem)] cursor-pointer'
                      onClick={goRegister}
                    >
                      Create Account →
                    </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
