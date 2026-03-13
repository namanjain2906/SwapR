import React, { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Chat from "./Chat";

const ChatLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isChatOpen = useMemo(() => {
    const path = location.pathname.replace(/\/+$/, "");
    return path.startsWith("/chat/") && path !== "/chat";
  }, [location.pathname]);

  const goBackToChats = () => {
    navigate("/chat");
  };

  return (
    <div className="h-[100svh] md:h-screen w-full flex bg-[#09090b]">
      <aside className={`${isChatOpen ? "hidden" : "flex"} md:flex w-full md:w-[22rem] md:flex-shrink-0 border-r border-gray-800/80`}>
        <Chat />
      </aside>
      <main className={`${isChatOpen ? "flex" : "hidden"} md:flex flex-1 h-full overflow-hidden`}>
        <Outlet context={{ onBackToChats: goBackToChats }} />
      </main>
    </div>
  );
};

export default ChatLayout;
