import React from 'react'

function sideBar() {
  return (
    <>
    <div className="navBar w-full h-full flex flex-col bg-[#792C1A] justify-between z-10">
          
          <div className="flex flex-col gap-5 px-[8%]">
           
            <div className="flex mb-10 ml-[-3.4%] gap-[2%] items-center">
              <button onClick={goDashboard} className="nav w-auto !py-4">
                <img
                  src="./public/images/PDM-Logo.svg"
                  alt="PDM-LOGO"
                  className="navBtn w-[6vw] aspect-square"
                />
              </button>
              <h1 className="text-[#ffffff] font-sans text-[clamp(1rem,3vw,4rem)] font-bold">
                PDM
              </h1>
            </div>
            

            <FileUpload
              onFileUpload={handleFileSelect}
              onUploadStatus={handleUploadStatus}
            />

          </div>
    </div>
    </>
  )
}

export default sideBar
