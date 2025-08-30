import React from "react";
import "./dashboard.css";

function Dashboard({goChat,goLogin}) {
  const handleLogout = () => {
    localStorage.removeItem("studentId"); // clear saved session
    goLogin(); // go back to Login page
  };
  return (
    <>
    <div className="flex flex-col">
      <div className="w-full h-fit py-2 flex flex-col bg-white items-center fixed border-b-12 border-[#FFDB0D] z-10">
        <div className="w-full h-full flex justify-between px-4 items-center">
          <div className=" flex gap-8 text-[clamp(0.5rem,1.2vw,1.2rem)] font-medium">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById("home");
                if (target) {
                  const offset = 80; // adjust for navbar height
                  const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                  const offsetPosition = elementPosition - offset;

                  // Polyfill smooth scroll with animation
                  const start = window.scrollY;
                  const distance = offsetPosition - start;
                  const duration = 300; // ms
                  let startTime = null;

                  function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);

                    window.scrollTo(0, start + distance * progress);

                    if (timeElapsed < duration) requestAnimationFrame(animation);
                  }

                  requestAnimationFrame(animation);
                }
              }}
            >
              Try AI
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById("program");
                if (target) {
                  const offset = 80; // adjust for navbar height
                  const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                  const offsetPosition = elementPosition - offset;

                  // Polyfill smooth scroll with animation
                  const start = window.scrollY;
                  const distance = offsetPosition - start;
                  const duration = 300; // ms
                  let startTime = null;

                  function animation(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);

                    window.scrollTo(0, start + distance * progress);

                    if (timeElapsed < duration) requestAnimationFrame(animation);
                  }

                  requestAnimationFrame(animation);
                }
              }}
            >
              Programs
            </a>
            <a href="/about" className="">About PDM</a>
          </div>

          <div className="bg-[url('/images/PDM-Logo.svg')] bg-contain bg-center bg-no-repeat w-[4%] aspect-square"></div>

          <div className="flex flex-row gap-2 h-12">
            <div className="flex items-center gap-8 text-[clamp(0.5rem,1.2vw,1.2rem)] h-full font-medium">
               <button onClick={handleLogout} className="cursor-pointer hover:underline">
                  Log Out
                </button>
              <a href="/text" className="">Accounts</a>
            </div>
            <div className="bg-[url('/navIco/profile-circle.png')] bg-contain bg-center bg-no-repeat w-[20%] aspect-square"></div>
          </div>
        </div>
      </div>
      <div id="home" className="flex w-full h-[100vh] pt-[3%] bg-[linear-gradient(to_bottom,rgba(121,44,26,0.7),rgba(105,34,16,0.9)),url('/images/PDM-Facade.png')] bg-cover bg-center bg-no-repeat">
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

      <div id="program" className=" bg-white w-full h-fit flex flex-col p-10">
        <h1 className="text-gray-900 text-[clamp(1rem,4vw,5rem)] font-medium font-serif">PROGRAMS AND COURSES</h1>
        <div className=" flex flex-col gap-5 w-[100%] h-fit p-2">
          <div className="flex w-full h-fit gap-5">
            <div className="flex flex-col gap-2 w-[100%]  h-fit">
              <h1 className="text-5xl font-bold text-amber-950">COLLEGE OF COMPUTER STUDIES</h1>
              <h2 className="text-4xl font-bold text-gray-900">BACHELOR OF SCIENCE IN COMPUTER SCIENCE</h2>
              <p className="text-2xl italic font-medium mt-5">The study of concepts and theories, algorithmic foundations, implementation and application of information and computing solutions.
                The BSCS program prepares the students to be IT professionals and researchers, and to be proficient in designing and developing computing solutions.</p>
            </div>
          </div>
          <div className="flex w-full h-fit gap-5">

            <div className="flex flex-col gap-2 w-[100%]">
              <h1 className="text-5xl font-bold text-amber-950">COLLEGE OF COMPUTER STUDIES</h1>
              <h2 className="text-4xl font-bold text-gray-900">BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY</h2>
              <p className="text-2xl w- italic font-medium mt-5">The study of utilization of computers and computer software to plan, install, customize, operate, manage, administer and maintain information technology infrastructure.
                The BSIT program prepares the students to be IT professionals, be well versed on application installation, operation, development, maintenance, and administration, and familiar with hardware installation, operation, and maintenance.</p>
            </div>
          </div>
          <div className="flex w-full h-fit gap-5">
            <div className="flex flex-col gap-2 w-[100%]">
              <h1 className="text-5xl font-bold text-amber-950">COLLEGE OF HOSPITALITY AND TOURISM MANAGEMENT</h1>
              <h2 className="text-4xl font-bold text-gray-900">BACHELOR OF SCIENCE IN HOSPITALITY MANAGEMENT</h2>
              <p className="text-2xl w- italic font-medium mt-5">The BSHM program will prepare the students to utilize the full range of F&B service techniques, preparation of different cuisines, accommodation operations, and other functions in emerging sectors of the hospitality industry. The program also aims to enhance the skills of the students in developing a business plan for a restaurant, hotel, or allied ventures incorporating management, marketing, and financial principles and theories.</p>
            </div>
          </div>
          <div className="flex w-full h-fit gap-5">
            <div className="flex flex-col gap-2 w-[100%]">
              <h1 className="text-5xl font-bold text-amber-950">COLLEGE OF HOSPITALITY AND TOURISM MANAGEMENT</h1>
              <h2 className="text-4xl font-bold text-gray-900">BACHELOR OF SCIENCE IN TOURISM MANAGEMENT</h2>
              <p className="text-2xl w- italic font-medium mt-5">The BSTM program will equip the students with competencies in the operations of tour and travel, transportation services, preparation and selling of tour packages, develop and defend tourism plans, tourism research, feasibility study, and among others. The students will also be prepared to stage an actual event using management, marketing, and financial principles and theories. Aside from the English language, students will be taught to be converse in a foreign language.</p>
            </div>
          </div>
          <div className="flex w-full h-fit gap-5">
            <div className="flex flex-col gap-2 w-[100%]">
              <h1 className="text-5xl font-bold text-amber-950">OFFICE ADMINISTRATION DEPARTMENT</h1>
              <h2 className="text-4xl font-bold text-gray-900">BACHELOR OF SCIENCE IN OFFICE ADMINISTRATION</h2>
              <p className="text-2xl w- italic font-medium mt-5">The program aims to prepare the graduates for a career in office administration specifically in various general and specialized administrative support, supervisory and managerial positions. It also aims to equip graduates with the competencies, skills, knowledge, and work values necessary for self-employment.</p>
            </div>
          </div>
          <div className="flex w-full h-fit gap-5">
            <div className="flex flex-col gap-2 w-[100%]">
              <h1 className="text-5xl font-bold text-amber-950">EDUCATION DEPARTMENT</h1>
              <h2 className="text-4xl font-bold text-gray-900">BACHELOR OF EARLY CHILDHOOD EDUCATION</h2>
              <p className="text-2xl w- italic font-medium mt-5">The BECEd is a four-year program. Specifically, this program provides students with fundamental understanding and application of the principles of early childhood care and education, as well as experience in the application of these principles.
                The BECEd program is designed to prepare students for teaching and supporting young children's development. A broad range of employment opportunities are available by fulfilling the degree requirements.</p>
            </div>
          </div>
          <div className="flex w-full h-fit gap-5">
            <div className="flex flex-col gap-2 w-[100%]">
              <h1 className="text-5xl font-bold text-amber-950">EDUCATION DEPARTMENT</h1>
              <h2 className="text-4xl font-bold text-gray-900">BACHELOR OF TECHNOLOGY AND LIVELIHOOD EDUCATION</h2>
              <p className="text-2xl w- italic font-medium mt-5">The BTLEd program is an undergraduate teacher education program that equips learners with adequate and relevant competencies in the area of Technology and Livelihood Education, particularly for the TLE exploratory courses from Grades 4-8.
              The BTLEd program aims to develop highly competent and motivated teachers in Technology and Livelihood Education for Grades 4-8. The technology livelihood education curriculum shall impart a body of knowledge, skills, attitudes, values and experiences that will provide prospective Grade 4-8 EPP/TLE Teachers with the necessary competencies essential for effective teaching and at the same time are accredited TVET Trainor and</p>
            </div>
          </div>
          
        </div>

        <div></div>
      </div>
    </div>
    </>
  );
}

export default Dashboard;
