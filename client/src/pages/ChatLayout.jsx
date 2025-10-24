import React from "react";
import { Outlet } from "react-router-dom";
import Chat from "./Chat";

const ChatLayout = () => {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64">
        <Chat />
      </aside>
      <main className="flex-1 min-h-screen pt-25 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default ChatLayout;
