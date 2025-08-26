import React, { useState, useEffect, useRef } from "react";
import "./chatPrompt.css";
import FileUpload from "./FileUpload";
import AiChat from "./aiChat";

function ChatPrompt({goDashboard}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [uploadingId, setUploadingId] = useState(null);
  const boxRef = useRef(null);
  const [activeView, setActiveView] = useState("chat"); 
// can be "chat" or "upload"


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
          {
            sender: "bot",
            text: data.response || "No Response From the AI",
            type: "defaultRes",
          },
        ]);
      })
      .catch((err) => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Sorry, there was an error connecting to the AI.",
            type: "defaultRes",
          },
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
        {
          sender: "bot",
          text: `Uploading ${file.name}...`,
          id,
          type: "uploading",
        },
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
      {
        sender: "user",
        text: (
          <div className="flex items-center w-fit">
            <img
              src="./public/images/PDM-Logo.svg"
              alt="Uploaded"
              className="w-[10%] aspect-square"
            />
            <span>{file.name}</span>
          </div>
        ),
        type: "userUpload",
      },
    ]);

    // Bot's message showing upload status
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: result.message, type: "uploaded" },
    ]);
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
        <div className="navBar w-full h-full flex flex-col bg-[#792C1A] justify-between z-10">
          
          <div className="flex flex-col gap-5 px-[8%]">
           
            <div className="flex gap-[2%] items-center">
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
            <div className="w-full rounded-2xl h-1 bg-gray-400" ></div>

            <button href="/chat" onClick={() => setActiveView("chat")}>
              <img src="/navIco/home-2.svg" alt="" className="w-[20%] aspect-square"/>
            </button>
            
            <button href="/files" onClick={() => setActiveView("upload")}>
              <img src="/navIco/document-upload.svg" alt="" className="w-[20%] aspect-square"/>
            </button>

          </div>
        </div>

        {/* CHAT BOX */}
        <div className="main flex flex-col gap-2 justify-center items-center w-full h-screen">
          {activeView === "chat" && (
            <div className="w-full h-full flex justify-center items-center">
              <AiChat
                messages={messages}
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                boxRef={boxRef}
              />
            </div>
          )}
          {activeView === "upload" && (
            <div className="w-full h-full flex justify-center items-center">
              <FileUpload onFileUpload={handleFileSelect} onUploadStatus={handleUploadStatus} />
            </div>
          )}
          

        
        </div>
      </div>
    </div>
  );
}
export default ChatPrompt;
