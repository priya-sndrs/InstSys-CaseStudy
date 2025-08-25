import React, { useState } from "react";
import Login from "./login.jsx";
import Dashboard from "./dashboard.jsx";
import Register from "./register.jsx";
import ChatPrompt from "./chatPrompt.jsx";

function Navigate() {
  const [page, setPage] = useState("login");

  if (page === "register")
    return <Register goLogin={() => setPage("login")} />;

  if (page === "dashboard")
    return <Dashboard goChat={() => setPage("chat")} />;   // 👈 here

  if (page === "chat")
    return <ChatPrompt goDashboard={() => setPage("dashboard")}/>;

  return (
    <Login
      goRegister={() => setPage("register")}
      goDashboard={() => setPage("dashboard")}
    />
  );
}

export default Navigate;
