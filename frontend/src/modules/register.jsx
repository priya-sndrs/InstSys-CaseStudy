import React, { useState } from "react";
import "../css/register.css";
import { motion } from "framer-motion";
import Popup from "../utils/popups";

function Register({ goLogin }) {
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });

    // Auto close after 2 seconds
    setTimeout(() => {
      setPopup({ show: false, type: "", message: "" });
    }, 2000);
  };
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    course: "",
    year: "",
    studentId: "",
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  // Password validation function
  function validatePassword(password) {
    const lengthValid = password.length >= 8 && password.length <= 16;
    const upper = /[A-Z]/.test(password);
    const lower = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const special = /[^A-Za-z0-9]/.test(password);
    return lengthValid && upper && lower && number && special;
  }

  // Strength: 0-5
  function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    if (password.length >= 12) strength++; // bonus for longer
    return Math.min(strength, 5);
  }

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for missing required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "password",
      "confirmPassword",
      "email",
      "course",
      "year",
      "studentId",
    ];
    for (const field of requiredFields) {
      if (!form[field] || form[field].trim() === "") {
        showPopup("error", "❌ Please fill out all required fields.");
        return;
      }
    }

    if (!validatePassword(form.password)) {
      showPopup("error", "❌ Password must be 8-16 characters long and include uppercase, lowercase, numbers, and special characters.")
      return;
    }

    if (form.password !== form.confirmPassword) {
      showPopup("error", "❌ Passwords do not match.")
      return;
    }

    const pattern = /^PDM-\d{4}-\d{6}$/; // Example format: PDM-0000-000000
    if (!pattern.test(form.studentId)) {
      showPopup("info", "⚠ Student ID must follow the format: PDM-0000-000000")
      return;
    }

    // Clear error
    setError("");

    const payload = {
      firstName: form.firstName,
      middleName: form.middleName,
      lastName: form.lastName,
      password: form.password,
      studentId: form.studentId,
      course: form.course,
      year: form.year,
      email: form.email,
    };

    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setShowSuccess(true);
        goLogin();
      } else {
        showPopup("error", data.error || "❌ Registration failed.")
      }
    } catch {
      showPopup("info", data.error || "⚠ Server error. Please try again later.")
    }
  };

  const handlePopupClose = () => {
    setShowSuccess(false);
    // redirect to login page
    window.location.href = "/login";
  };

  // Password strength bar colors
  const strengthColors = [
    "#e74c3c", // 1: red
    "#e67e22", // 2: orange
    "#f1c40f", // 3: yellow
    "#2ecc71", // 4: green
    "#3498db", // 5: blue (very strong)
  ];

  return (
    <>
      <div className="screen w-screen h-screen bg-[linear-gradient(to_right,rgba(121,44,26,1),rgba(240,177,0,0.6)),url('/images/PDM-Facade.png')] bg-cover bg-center flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}   // Start below, invisible
          animate={{ opacity: 1, y: 0 }}    // Slide up & fade in
          transition={{ duration: 0.5, ease: "easeOut" }} 
          className="card flex flex-col justify-center gap-10 items-center px-4 bg-white/90 shadow-[3px_3px_2px_#6a7282,_-2px_-2px_2px_#d1d5dc] border-white border-2 w-fit h-fit p-2 transition-all duration-300 rounded-xl">
          <h1 className="text-[clamp(0.8rem,1.3vw,2rem)]">
            REGISTER AN ACCOUNT
          </h1>

          {error && <p className="text-red-600 font-medium">{error}</p>}

          {showSuccess && (
            <div className="bg-green-200 text-green-800 p-3 rounded-lg">
              ✅ Registered successfully!
              <button onClick={handlePopupClose} className="ml-2 underline">
                Go to Login
              </button>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="form flex flex-col gap-3 justify-center items-center"
          >
            {<div className="name flex w-[100%] gap-2">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                type="text"
                className="login_input !rounded-md !h-[10%]"
                placeholder="Enter First Name"
              />
              <input
                name="middleName"
                value={form.middleName}
                onChange={handleChange}
                type="text"
                className="login_input !rounded-md !h-[10%]"
                placeholder="Enter Middle Name"
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                type="text"
                className="login_input !rounded-md !h-[10%]"
                placeholder="Enter Last Name"
              />
            </div>}
            <div className="pass flex flex-col gap-2 w-[100%] h-fit ">
              <div className="flex gap-2 ">
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  className="login_input !rounded-md !h-[10%]"
                  placeholder="Create Password"
                />
                <button
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className={`w-[1.5vw] aspect-square bg-center bg-contain bg-no-repeat hover:scale-102 transform-all duration-200 cursor-pointer  max-sm:w-[5vw]
                    ${showPassword ? "bg-[url(/password/passHide.svg)]" : "bg-[url(/password/passShow.svg)]" }`}
                ></button>
                <div className=" flex flex-row gap-2 items-center login_input !p-0 !py-2 !justify-around !rounded-md !h-[10%]">
                  <input
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    className="!w-[100%] !px-2 h-full"
                    placeholder="Confirm Password"
                  ></input>
                  <button
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={`w-[1.5vw] aspect-square bg-center bg-contain bg-no-repeat hover:scale-102 transform-all duration-200 cursor-pointer  max-sm:w-[5vw]
                      ${showPassword ? "bg-[url(/password/passHide.svg)]" : "bg-[url(/password/passShow.svg)]" }`}
                  ></button>
                </div>
              </div>
              <div className="password-strength-bar w-[100%] h-2 bg-gray-300 rounded">
                <div
                  className="password-strength-fill h-2 rounded"
                  style={{
                    width: `${(passwordStrength / 5) * 100}%`,
                    backgroundColor:
                      strengthColors[
                        passwordStrength > 0 ? passwordStrength - 1 : 0
                      ],
                  }}
                ></div>
              </div>
              <span className="password-strength-label text-sm">
                {passwordStrength === 0
                  ? "Too weak"
                  : passwordStrength === 1
                  ? "Very Weak"
                  : passwordStrength === 2
                  ? "Weak"
                  : passwordStrength === 3
                  ? "Medium"
                  : passwordStrength === 4
                  ? "Strong"
                  : "Very Strong"}
              </span>
            </div>

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="login_input !rounded-md !h-[10%]"
              placeholder="user.pdm@gmail.com"
            />

            <div className="h-[2px] w-[100%] bg-gray-500 my-5"></div>

            <div className="flex flex-row w-[100%] justify-around gap-2">
              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                className="login_input !text-sm !rounded-md !h-[10%]"
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
                className="login_input !text-sm !rounded-md !h-[10%]"
              >
                <option value="" disabled>
                  -- Select Year --
                </option>
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="Fourth Year">Fourth Year</option>
              </select>
            </div>
            

            <input
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              type="text"
              className="login_input !rounded-md !h-[10%]"
              placeholder="PDM-0000-000000"
            />

            <div className="h-[2px] w-[100%] bg-gray-500 my-5"></div>

            <div className="w-full flex flex-col gap-4 items-center justify-center">
              <button
                type="submit"
                className=" w-[80%] py-[calc(0.5vw+1vh)] rounded-lg bg-yellow-500 text-[clamp(0.5rem,1.5vw,2rem)] font-sans font-medium cursor-pointer hover:scale-105 transition-all duration-300 "
              >
                Register Account
              </button>
              <button
                type="button"
                onClick={() => (window.location.href = "/login")}
                className="font-sans font-medium underline text-[clamp(0.6rem,1.3vw,1.2rem)] cursor-pointer"
              >
                ← Already Have an Account?
              </button>
            </div>
          </form>
          <Popup
            show={popup.show}
            type={popup.type}
            message={popup.message}
            onClose={() => setPopup({ show: false, type: "", message: "" })}
          />
        </motion.div>
      </div>
    </>
  );
}

export default Register;
