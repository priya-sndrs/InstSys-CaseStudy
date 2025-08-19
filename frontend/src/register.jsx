import React, { useState } from "react";
import "./register.css";

function Register({ goLogin }) {
  const [form, setForm] = useState({
    studentName: "",
    password: "",
    confirmPassword: "",
    email: "",
    course: "",
    year: "",
    studentId: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add validation if needed
    const payload = {
      studentName: form.studentName,
      password: form.password,
      studentId: form.studentId,
      course: form.course,
      year: form.year,
    };
    const res = await fetch("http://127.0.0.1:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setShowSuccess(true); // Show popup
    } else {
      alert(data.error || "Registration failed.");
    }
  };

  const handlePopupClose = () => {
    setShowSuccess(false);
    goLogin();
  };

  return (
    <>
      <div className="w-screen h-screen bg-[linear-gradient(to_top,rgba(121,44,26,0.9),rgba(63,23,13,0.7)),url('/images/PDM-Facade.png')] bg-cover bg-center flex justify-center items-center">
        <div className="flex flex-col justify-center gap-10 items-center bg-white w-[35vw] h-fit pt-[2%] pb-[1%] transition-all duration-300 rounded-xl">
          <h1 className="text-[clamp(0.8rem,1.3vw,2rem)]">
            REGISTER AN ACCOUNT
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 justify-center items-center"
          >
            <input
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
              type="text"
              className="login_input"
              placeholder="Enter Student Name"
            />
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              className="login_input"
              placeholder="Create Password"
            />
            <input
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              type="password"
              className="login_input"
              placeholder="Confirm Password"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="login_input"
              placeholder="user.pdm@gmail.com"
            />
            <div className="h-[2px] w-[80%] bg-gray-500 my-5"></div>
            <div className="flex flex-row w-[81%] justify-around gap-2">
              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                className="login_input"
              >
                <option value="" disabled>
                  -- Select Course --
                </option>
                <option value="BSCS">
                  Bachelor of Science in Computer Science (BSCS)
                </option>
                <option value="BSIT">
                  Bachelor of Science in Information Technology (BSIT)
                </option>
                <option value="BSHM">
                  Bachelor of Science in Hospitality Management (BSHM)
                </option>
                <option value="BSTM">
                  Bachelor of Science in Tourism Management (BSTM)
                </option>
                <option value="BSOAd">
                  Bachelor of Science in Office Administration (BSOAd)
                </option>
                <option value="BECEd">
                  Bachelor of Early Childhood Education (BECEd)
                </option>
                <option value="BTLEd">
                  Bachelor of Technology in Livelihood Education (BTLEd)
                </option>
              </select>
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className="login_input"
              >
                <option value="" disabled>
                  -- Select Year --
                </option>
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="Fourth Year">Fourth Year</option>
              </select>
              <div className="border-b border-gray-400 my-4"></div>
            </div>
            <input
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              type="text"
              className="login_input"
              placeholder="PDM-0000-0000000"
            />
            <div className="h-[2px] w-[80%] bg-gray-500 my-5"></div>
            <div className="w-full flex flex-col gap-4 items-center justify-center">
              <button
                type="submit"
                className=" w-[80%] py-[calc(0.5vw+1vh)] rounded-lg bg-yellow-500 text-[clamp(0.5rem,1.5vw,2rem)] font-sans font-medium cursor-pointer hover:scale-105 transition-all duration-300 "
              >
                Register Account
              </button>
              <button
                className="font-sans font-medium underline text-[clamp(0.6rem,1.3vw,1.2rem)] cursor-pointer"
                onClick={goLogin}
                type="button"
              >
                ← Already Have an Account?
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Success Popup */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem 3rem",
              borderRadius: "1rem",
              boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
          >
            <h2 className="text-green-600 mb-4">
              Account Created Successfully!
            </h2>
            <button
              className="px-4 py-2 bg-yellow-500 rounded text-white font-bold mt-2"
              onClick={handlePopupClose}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Register;
