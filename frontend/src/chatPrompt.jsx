import React, { useState, useEffect, useRef } from "react";
import "./chatPrompt.css";
import FileUpload from "./FileUpload";

function ChatPrompt() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [uploadingId, setUploadingId] = useState(null); 
  const boxRef = useRef(null);

  const sendMessage = (text) => {
  // Add user's message
  setMessages((prev) => [...prev, { sender: "user", text }]);

  // Call Flask backend
  fetch("http://localhost:5000/chatprompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: text }),
  })
    .then((res) => res.json())
    .then((data) => {
      setMessages((prev) => [
        ...prev,

        { sender: "bot", text: "Lorem lorem lorem Lorem lorem loremLorem lorem loremLorem lorem loremLorem lorem loremLorem lorem lorem", type: "defaultRes"},
      ]);
    })
    .catch((err) => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, there was an error connecting to the AI.", type: "defaultRes" },
      ]);
    });
};

  // Handle form submission
  const handleSubmit = (e) => {
    // Prevents the page from reloading everytime na mag susubmit ng new message
    e.preventDefault();
    if (input.trim() === "") return;

    sendMessage(input);
    setInput("");
  };

  // Handle upload status for loading message
  const handleUploadStatus = (status, file) => {
  if (status === "start") {
    // create a unique id for this upload
    const id = Date.now();
    setUploadingId(id);

    // attach id to the file object
    file.id = id;

    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: `Uploading ${file.name}...`, id, type: "uploading" },
    ]);
    return id;
  } else if (status === "end" && file?.id) {
    // Remove the loading message using file.id
    setMessages((prev) => prev.filter((msg) => msg.id !== file.id));
    setUploadingId(null);
  }
};

  // when a file is selected in FileUpload
  const handleFileSelect = (file, result) => {
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: `📂 Uploaded: ${file.name}` },
    ]);

    // Bot's message showing upload status
    setMessages((prev) => [...prev, { sender: "bot", text: result.message, type: "uploaded"}]);
  };

  // Scroll to the bottom of the chat box when messages change
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-prompt w-full h-full p-0 m-0">
      <div className="mainContent flex h-full justify-center items-center">
        {/* NavBar */}
        <div className="navBar w-full h-full flex flex-col justify-between z-10">
            <div className="flex flex-col gap-5 pl-[6%]">
                <div className="flex mb-10 ml-[-3.4%] gap-[2%] items-center">
                  <button className="nav w-auto !py-4">
                    <img src="./public/images/PDM-Logo.svg" alt="PDM-LOGO" className="navBtn w-[10vw] aspect-square"/>
                  </button>
                  <h1 className="text-[#9A3A24] font-sans text-[clamp(1rem,5vw,5rem)] font-bold">PDM</h1>
                </div>
                <button className="nav w-auto">
                  <img src="./public/navIco/menu.png" alt="Dashboard" className="navBtn w-[3vw] aspect-square"/>
                </button>
                <FileUpload onFileUpload={handleFileSelect} onUploadStatus={handleUploadStatus} />
                <button className="nav w-auto">
                  <img src="./public/navIco/calendar-2.png" alt="Schedule" className="navBtn w-[3vw] aspect-square"/>
                </button>
                <button className="nav w-auto">
                  <img src="./public/navIco/setting.png" alt="Settings" className="navBtn w-[3vw] aspect-square"/>
                </button>
                <button className="nav w-auto">
                  <img src="./public/navIco/profile-circle-1.png" alt="Profile" className="navBtn w-[3vw] aspect-square"/>
                </button>
          </div>
        </div>
        <div className="dash_one absolute w-[25%] h-full bg-[#9A3A24] z-1 left-0"></div>
        <div className="dash_three absolute w-[40%] h-full bg-[#9A3A24] left-0"></div>
        <div className="dash_two absolute w-[60%] h-full bg-[#FFDB0D] left-0"></div>

        {/* CHAT BOX */}
        <div className="main flex flex-col gap-2 justify-center items-center w-full h-screen">
          {/* Header for Chat Box */}
           <div className=" w-full h-[8%]">

            </div>
          <div className="chatBox flex flex-col justify-between items-center w-[95%] h-[85%] rounded-lg !p-4">
           
            {/* Displays the message and response  */}
            <div
              ref={boxRef}
              className="box relative flex flex-col w-[90%] h-[90%] overflow-y-scroll p-4 rounded-lg"
            >
              {messages.map((msg, i) => (
                <div
                  // ito kasi iniistore nya yung message as array storing previous promptsw, kaya naka by index ang display nya ng message
                  key={i}
                  className={`content p-2 rounded-lg max-w-[90%] ${
                    // this checks if the message is from the user or bot
                    msg.type === "uploading"
                      ? "uploading botRespo"
                      : msg.type === "uploaded" || msg.type === "message"
                      ? "botRespo bg-green-200 self-start"
                      : msg.sender === "user"
                      ? "bg-blue-200 userRespo self-end break-words whitespace-normal !rounded-sm"
                      : "bg-green-200 botRespo self-start break-words whitespace-normal !rounded-sm"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="searchBox component w-[90%] h-[8%] !mt-4 pr-5 bg-gray-50 flex justify-center items-center">
              <form
                onSubmit={handleSubmit}
                className="w-full h-full flex justify-center items-center"
              >
                <input
                  type="text"
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-full !p-4 font-sans text-2xl focus:outline-none focus:ring-0"
                />
                <button className="send w-auto !py-4"/>
                 <img src = "./navIco/send.svg" alt="Send" className="send w-[5%] aspect-square cursor-pointer hover:scale-110 transition-transform"
                 onClick={handleSubmit}/>
                <button/>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ChatPrompt;
