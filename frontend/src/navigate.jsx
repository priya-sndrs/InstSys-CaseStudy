import React, { useState,useEffect } from "react";
import Login from "./login.jsx";
import Dashboard from "./dashboard.jsx";
import Register from "./register.jsx";
import ChatPrompt from "./chatPrompt.jsx";
import Account from "./account.jsx";

function Navigate() {
  const [page, setPage] = useState("login");
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const savedStudentId = localStorage.getItem("studentId");
    if (savedStudentId) {
      setStudentId(savedStudentId);
      setPage("dashboard");
    }
  }, []);

   const handleLogin = (id) => {
    localStorage.setItem("studentId", id);
    setStudentId(id);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("studentId");
    setStudentId(null);
    setPage("login");
  };
  const [chatInitialView, setChatInitialView] = useState("chat");

  if (page === "register") return <Register goLogin={() => setPage("login")} />;

  if (page === "dashboard")
    return (
      <Dashboard
        goChat={() => setPage("chat")}
        goLogin={() => setPage("login")}
        onLogout={handleLogout} // ✅ Pass logout handler
        studentId={studentId}   // ✅ Pass studentId if needed
      />
    );   // 👈 here

  if (page === "chat")
    return (
      <ChatPrompt
        goDashboard={() => setPage("dashboard")}
        studentId={studentId} // ✅ Pass studentId
        initialView={chatInitialView}
      />
    );

  return (
    <Login
      goRegister={() => setPage("register")}
      goDashboard={() => setPage("dashboard")}
      onLogin={handleLogin}
    />
  );
}

export default Navigate;
