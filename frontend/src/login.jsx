import React, { useState } from "react";
import "./login.css";

function Login({ goRegister, goDashboard }) {
  const [form, setForm] = useState({
    studentId: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        goDashboard();
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Server error");
    }
  };

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
              onSubmit={handleLogin}
              className="flex flex-col gap-8 justify-center items-center"
            >
              <input
                type="text"
                name="studentId"
                required
                className="login_input"
                placeholder="Enter Student ID"
                value={form.studentId}
                onChange={handleChange}
              />

              <input
                type="text"
                name="email"
                required
                className="login_input"
                placeholder="Enter Student Email"
                value={form.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                required
                className="login_input"
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
              />
              {error && <div className="text-red-600 font-medium">{error}</div>}
              <div className="w-full flex flex-col gap-4 items-center justify-center">
                <button
                  type="submit"
                  className=" w-[80%] py-[calc(0.5vw+0.5vh)] rounded-lg bg-yellow-500 text-[clamp(0.5rem,1.5vw,2rem)] font-sans font-medium cursor-pointer hover:scale-105 transition-all duration-300 "
                >
                  Log In
                </button>
                <button
                  type="button"
                  className="font-sans font-medium underline text-[clamp(0.6rem,1.3vw,1.2rem)] cursor-pointer"
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
