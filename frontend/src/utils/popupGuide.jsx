import React from 'react'

export default function PopupGuide({ onClose }) {
  const handleClick = () => {
    const guideSection = document.getElementById("guide");
    if (guideSection) {
      guideSection.scrollIntoView({ behavior: "smooth" });
    }

    onClose();
  };

  return (
    <div className='w-[50%] h-[30%] bg-white rounded-lg flex flex-row'>
      <div className="w-[50%] h-full bg-[#e75c4b] bg-[url('/images/userGuide.jpg')] bg-contain bg-center bg-no-repeat"></div>
      <div className='w-full h-full flex flex-col items-center p-5'>
        <h1 className='text-[clamp(1rem,3vw,5rem)] font-bold'>User Guide</h1>
        <p className='text-[clamp(1rem,1vw,1.2rem)] text-center mb-5'>
          Welcome to the system! Here’s a quick guide to help you get started. 
          Explore the menu, check out the new features, and try using the AI assistant 
          to make your work easier.
        </p>
        <button 
          onClick={handleClick}
          className='bg-[#e75c4b] px-6 py-2 rounded-2xl text-white font-semibold text-[clamp(1rem,1vw,1.2rem)] hover:scale-[1.05] transition-all duration-200 cursor-pointer'
        >
          Check out the guide
        </button>
      </div>
    </div>
  )
}
