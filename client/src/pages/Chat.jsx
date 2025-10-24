import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import axios from "axios";

const Chat = ({ onSelectConversation, onCloseSidebar } = {}) => {
  const { user } = useAppContext();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

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
  console.log("Chats loaded:", chats);  

  return (
    <div className="flex flex-col w-full md:h-screen md:max-w-[22rem] pt-25 border-b md:border-b-0 md:border-r border-gray-800 bg-[#0b0b0c] text-sm">
      {/* top area / optional avatar */}
      <div className="px-4 py-3 xl:py-4 flex items-center justify-between">
        <div className="text-lg md:text-2xl font-semibold text-white">Chats</div>
        {onCloseSidebar && (
          <button
            type="button"
            onClick={onCloseSidebar}
            className="md:hidden text-xs font-medium text-gray-400 hover:text-white transition"
          >
            Close
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="px-4 py-2 text-gray-400">Loading chats…</div>
        ) : chats.length === 0 ? (
          <div className="px-4 py-2 text-gray-400">No conversations yet</div>
        ) : (
          chats.map((c) => {
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
                  `relative flex items-center gap-3 w-full py-3 px-4 md:px-5 text-gray-300 transition ${
                    isActive ? "bg-[#F84565]/10 text-[#F84565]" : ""
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
                  <div className="text-sm font-medium">{displayName}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[160px]">{lastPreview}</div>
                </div>
                <div className="text-xs text-gray-500">
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
