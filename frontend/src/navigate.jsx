import React, { useState } from "react";
import Login from "./login.jsx";
import Dashboard from "./dashboard.jsx";
import Register from "./register.jsx";
import ChatPrompt from "./chatPrompt.jsx";
import Account from "./account.jsx";

function Navigate() {
  const [page, setPage] = useState("login");
  const [chatInitialView, setChatInitialView] = useState("chat");

  if (page === "register") return <Register goLogin={() => setPage("login")} />;

  if (page === "dashboard")
    return (
      <Dashboard
        goChat={() => {
          setChatInitialView("chat");
          setPage("chat");
        }}
        goAccounts={() => {
          setChatInitialView("account");
          setPage("chat");
        }}
      />
    );

  if (page === "chat")
    return (
      <ChatPrompt
        goDashboard={() => setPage("dashboard")}
        initialView={chatInitialView}
      />
    );

  if (page === "account")
    return <Account goDashboard={() => setPage("dashboard")} />;

  return (
    <Login
      goRegister={() => setPage("register")}
      goDashboard={() => setPage("dashboard")}
    />
  );
}

export default Navigate;
