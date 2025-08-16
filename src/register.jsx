import React from 'react'
import './register.css'

function Register() {
  return (
    <>
    <div className="w-screen h-screen bg-[linear-gradient(to_top,rgba(121,44,26,0.9),rgba(63,23,13,0.7)),url('/images/PDM-Facade.png')] bg-cover bg-center flex justify-center items-center">
        <div className='flex flex-col justify-center gap-10 items-center bg-white w-[35vw] h-fit pt-[2%] pb-[1%] transition-all duration-300 rounded-xl'>
            <h1 className='text-[clamp(0.8rem,1.3vw,2rem)]'>REGISTER AN ACCOUNT</h1>
            <form action="submit" className='flex flex-col gap-3 justify-center items-center'>
                <input type="text" className='login_input' placeholder='Enter Student Name' />
                <input type="password" className='login_input' placeholder='Create Password'/>
                <input type="password" className='login_input' placeholder='Confirm Password'/>
                <input type="email" className='login_input' placeholder='user.pdm@gmail.com'/>
                <div className="h-[2px] w-[80%] bg-gray-500 my-5"></div>
                <div className='flex flex-row w-[81%] justify-around gap-2'>
                    <select name="" id="" className='login_input'>
                    <option value="" disabled>-- Select Course --</option>
                    <option value="">Bachelor of Science in Computer Science(BSCS)</option>
                    <option value="">Bachelor of Science in Information Technology(BSIT)</option>
                    <option value="">Bachelor of Science in Hospitality Management(BSHM)</option>
                    <option value="">Bachelor of Science in Tourism Management(BSTM)</option>
                    <option value="">Bachelor of Science in Office Administration(BSOAd)</option>
                    <option value="">Bachelor of Early Childhood Education(BECEd)</option>
                    <option value="">Bachelor of Technology in Livelihood Education(BTLEd)</option>
                </select>
                <select name="" id="" className='login_input'>
                    <option value="" disabled>-- Select Year --</option>
                    <option value="">First Year</option>
                    <option value="">Second Year</option>
                    <option value="">Third Year</option>
                    <option value="">Fourth Year</option>
                </select>
                <div className="border-b border-gray-400 my-4"></div>
                </div>
                <input type="email" className='login_input' placeholder='PDM-0000-0000000'/>
                <div className="h-[2px] w-[80%] bg-gray-500 my-5"></div>
                <div className='w-full flex flex-col gap-4 items-center justify-center'>
                    <button className=' w-[80%] py-[calc(0.5vw+1vh)] rounded-lg bg-yellow-500 text-[clamp(0.5rem,1.5vw,2rem)] font-sans font-medium cursor-pointer hover:scale-105 transition-all duration-300 '>Register Account</button>
                    <button className='font-sans font-medium underline text-[clamp(0.6rem,1.3vw,1.2rem)] cursor-pointer'>← Already Have an Account?</button>
                </div>
            </form>
        </div>
    </div>
    </>
  )
}

export default Register
