import React, { useState } from "react";
import Login from "./login.jsx";
import Register from "./register.jsx";
import ChatPrompt from "./chatPrompt.jsx";

function Navigate() {
  const [page, setPage] = useState("login");

  if (page === "register") return <Register goLogin={() => setPage("login")} />;
  if (page === "chat") return <ChatPrompt />;
  return <Login goRegister={() => setPage("register")} goChat={() => setPage("chat")} />;
  
}

export default Navigate;