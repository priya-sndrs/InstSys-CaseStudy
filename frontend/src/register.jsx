import React, { useState } from 'react'
import './register.css'

function Register() {
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    email: '',
    course: '',
    year: '',
    studentId: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

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

  // Strength: 0-4
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(form.password)) {
      alert("Password must be 8-16 characters long and include uppercase, lowercase, numbers, and special characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    // Add other validation if needed
    const payload = {
      firstName: form.firstName,
      middleName: form.middleName,
      lastName: form.lastName,
      password: form.password,
      studentId: form.studentId,
      course: form.course,
      year: form.year
    };
    const res = await fetch('http://127.0.0.1:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    // Handle response (success/error)
  };

  // Password strength bar colors
  const strengthColors = [
    "#e74c3c", // 0-1: red
    "#e67e22", // 2: orange
    "#f1c40f", // 3: yellow
    "#2ecc71", // 4: green
    "#3498db"  // 5: blue (very strong)
  ];

  return (
    <>
    <div className="w-screen h-screen bg-[linear-gradient(to_top,rgba(121,44,26,0.9),rgba(63,23,13,0.7)),url('/images/PDM-Facade.png')] bg-cover bg-center flex justify-center items-center">
        <div className='flex flex-col justify-center gap-10 items-center bg-white w-[35vw] h-fit pt-[2%] pb-[1%] transition-all duration-300 rounded-xl'>
            <h1 className='text-[clamp(0.8rem,1.3vw,2rem)]'>REGISTER AN ACCOUNT</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-3 justify-center items-center'>
                <input name="firstName" value={form.firstName} onChange={handleChange} type="text" className='login_input' placeholder='Enter First Name' />
                <input name="middleName" value={form.middleName} onChange={handleChange} type="text" className='login_input' placeholder='Enter Middle Name' />
                <input name="lastName" value={form.lastName} onChange={handleChange} type="text" className='login_input' placeholder='Enter Last Name' />
                <input name="password" value={form.password} onChange={handleChange} type="password" className='login_input' placeholder='Create Password'/>
                {/* Password strength bar */}
                <div className="password-strength-bar">
                  <div
                    className="password-strength-fill"
                    style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: strengthColors[passwordStrength > 0 ? passwordStrength - 1 : 0]
                    }}
                  ></div>
                </div>
                <span className="password-strength-label">
                  {passwordStrength === 0 ? "Too weak" :
                   passwordStrength === 1 ? "Very Weak" :
                   passwordStrength === 2 ? "Weak" :
                   passwordStrength === 3 ? "Medium" :
                   passwordStrength === 4 ? "Strong" :
                   "Very Strong"}
                </span>
                <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type="password" className='login_input' placeholder='Confirm Password'/>
                <input name="email" value={form.email} onChange={handleChange} type="email" className='login_input' placeholder='user.pdm@gmail.com'/>
                <div className="h-[2px] w-[80%] bg-gray-500 my-5"></div>
                <div className='flex flex-row w-[81%] justify-around gap-2'>
                    <select name="course" value={form.course} onChange={handleChange} className='login_input'>
                      <option value="" disabled>-- Select Course --</option>
                      <option value="BSCS">Bachelor of Science in Computer Science (BSCS)</option>
                      <option value="BSIT">Bachelor of Science in Information Technology (BSIT)</option>
                      <option value="BSHM">Bachelor of Science in Hospitality Management (BSHM)</option>
                      <option value="BSTM">Bachelor of Science in Tourism Management (BSTM)</option>
                      <option value="BSOAd">Bachelor of Science in Office Administration (BSOAd)</option>
                      <option value="BECEd">Bachelor of Early Childhood Education (BECEd)</option>
                      <option value="BTLEd">Bachelor of Technology in Livelihood Education (BTLEd)</option>
                    </select>
                    <select name="year" value={form.year} onChange={handleChange} className='login_input'>
                      <option value="" disabled>-- Select Year --</option>
                      <option value="First Year">First Year</option>
                      <option value="Second Year">Second Year</option>
                      <option value="Third Year">Third Year</option>
                      <option value="Fourth Year">Fourth Year</option>
                    </select>
                <div className="border-b border-gray-400 my-4"></div>
                </div>
                <input name="studentId" value={form.studentId} onChange={handleChange} type="text" className='login_input' placeholder='PDM-0000-0000000'/>
                <div className="h-[2px] w-[80%] bg-gray-500 my-5"></div>
                <div className='w-full flex flex-col gap-4 items-center justify-center'>
                    <button type="submit" className=' w-[80%] py-[calc(0.5vw+1vh)] rounded-lg bg-yellow-500 text-[clamp(0.5rem,1.5vw,2rem)] font-sans font-medium cursor-pointer hover:scale-105 transition-all duration-300 '>Register Account</button>
                    <button className='font-sans font-medium underline text-[clamp(0.6rem,1.3vw,1.2rem)] cursor-pointer'>← Already Have an Account?</button>
                </div>
            </form>
        </div>
    </div>
    </>
  )
}

export default Register
