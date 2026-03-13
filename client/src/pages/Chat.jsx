import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import axios from "axios";

const Chat = ({ onSelectConversation } = {}) => {
  const { user } = useAppContext();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      const aTime = new Date(a?.lastMessage?.createdAt || 0).getTime();
      const bTime = new Date(b?.lastMessage?.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [chats]);

  useEffect(() => {
    if (!user?._id && !user?.id) return;
    const userId = user._id ?? user.id;
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`/api/chats/${userId}`);
        if (!cancelled) setChats(res.data || []);
      } catch (err) {
        console.warn("Failed to load chats", err?.message || err);
        if (!cancelled) setChats([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => (cancelled = true);
  }, [user]);

  return (
    <div className="flex flex-col w-full h-[100svh] md:h-screen bg-[#0b0b0c] text-sm">
      <div className="px-4 py-5 border-b border-gray-800/80">
        <div className="text-lg md:text-2xl font-semibold text-white">Chats</div>
        <p className="text-xs text-gray-500 mt-1">Conversations</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="px-4 py-5 text-gray-400">Loading chats...</div>
        ) : sortedChats.length === 0 ? (
          <div className="px-4 py-5 text-gray-400">No conversations yet</div>
        ) : (
          sortedChats.map((c) => {
            const partner = c.partner || {};
            const displayName =
              partner.name ||
              `${partner.firstName ?? ""} ${partner.lastName ?? ""}`.trim() ||
              c.partnerId;
            const lastPreview =
              c.lastMessage?.text?.trim() ||
              (c.lastMessage?.attachments?.length ? "Sent an attachment" : "Tap to view chat");
            return (
              <NavLink
                key={c.conversationId || c.partnerId}
                to={`/chat/${c.partnerId}`}
                end
                onClick={() => onSelectConversation?.()}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 w-full py-4 px-4 md:px-5 text-gray-300 transition border-b border-gray-900 ${
                    isActive ? "bg-[#F84565]/12 text-[#ffd8df]" : "hover:bg-white/[0.02]"
                  }`
                }
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#6a5af9] to-[#f857a6] flex items-center justify-center text-sm text-white overflow-hidden">
                  {partner.avatarUrl ? (
                    <img src={partner.avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                  ) : (
                    <span>{(displayName || "U").charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-base md:text-sm font-medium truncate">{displayName}</div>
                  <div className="hidden md:block text-xs text-gray-500 truncate max-w-[160px]">{lastPreview}</div>
                </div>
                <div className="hidden md:block text-xs text-gray-500">
                  {c.lastMessage?.createdAt ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </div>
              </NavLink>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Chat;
