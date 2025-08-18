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

    // Simulate bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Basta Respone dito gn AI", type: "defaultRes"},
      ]);
    }, 500);
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
    <div className="chat-prompt w-[100%] h-[100dvh]">
      <div className="mainContent flex h-full justify-center items-center">
        {/* NAVIGATION BAR */}
        <div className="navBar component w-full h-full !py-5 bg-white flex flex-col items-center justify-between">
          <div className="flex flex-col items-center gap-5">
            <button className="nav w-auto !py-4">
              <img src="./public/navIco/image 10.png" alt="" />
            </button>
            <button className="nav w-auto">
              <img src="./public/navIco/menu.png" alt="" />
            </button>

            {/* File Upload Component */}
            <FileUpload onFileUpload={handleFileSelect} onUploadStatus={handleUploadStatus} />

            <button className="nav w-auto">
              <img src="./public/navIco/calendar-2.png" alt="" />
            </button>
            <button className="nav w-auto">
              <img src="./public/navIco/setting.png" alt="" />
            </button>
          </div>
          <button className="nav w-auto">
            <img src="./public/navIco/profile-circle-1.png" alt="" />
          </button>
        </div>

        {/* CHAT BOX */}
        <div className="main component flex justify-center items-center w-full h-full bg-white">
          <div className="chatBox component flex flex-col items-center w-[95%] h-[90%] bg-gray-50 rounded-lg !p-4">
            {/* Displays the message and response  */}
            <div
              ref={boxRef}
              className="box flex flex-col w-[80%] !h-[750px] justify-end overflow-y-auto p-4 rounded-lg"
            >
              {messages.map((msg, i) => (
                <div
                  // ito kasi iniistore nya yung message as array storing previous promptsw, kaya naka by index ang display nya ng message
                  key={i}
                  className={`content p-2 rounded-lg max-w-xs break-words whitespace-normal ${
                    // this checks if the message is from the user or bot
                    msg.type === "uploading"
                      ? "uploading"
                      : msg.type === "uploaded" || msg.type === "message"
                      ? "bg-green-200 self-start"
                      : msg.sender === "user"
                      ? "bg-blue-200 self-end break-words whitespace-normal !p-2 !text-[1.2rem] !rounded-2xl"
                      : "bg-green-200 self-start break-words whitespace-normal !p-2 !text-[1.2rem] !rounded-2xl"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="searchBox component w-[80%] h-[8%] !mt-4 bg-gray-300 flex justify-center items-center">
              <form
                onSubmit={handleSubmit}
                className="w-full h-full flex justify-center items-center"
              >
                <input
                  type="text"
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-full component !p-4 font-sans text-2xl"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ChatPrompt;
