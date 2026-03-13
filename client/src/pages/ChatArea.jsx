import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";

const ChatArea = () => {
	const { receiverId } = useParams();
	const { onBackToChats } = useOutletContext() ?? {};
	const { user } = useAppContext();
	const currentUserId = user?.id ?? user?._id ?? "local_me";

	const [messages, setMessages] = useState([]);
	const [receiver, setReceiver] = useState(null);
	const [draft, setDraft] = useState("");
	const [attachment, setAttachment] = useState(null);
	const listRef = useRef(null);
	const fileInputRef = useRef(null);

	const makeMessageKey = useCallback((msg) => {
		if (!msg) return "";
		return msg._id ?? msg.id ?? `${msg.senderId ?? "sender"}-${msg.createdAt ?? msg.time ?? ""}`;
	}, []);

	const pushMessage = useCallback(
		(incoming) => {
			if (!incoming) return;
			setMessages((prev) => {
				const key = makeMessageKey(incoming);
				if (!key) return [...prev, incoming];
				const idx = prev.findIndex((msg) => makeMessageKey(msg) === key);
				if (idx >= 0) {
					const next = [...prev];
					next[idx] = { ...next[idx], ...incoming };
					return next;
				}
				return [...prev, incoming];
			});
		},
		[makeMessageKey]
	);

	const conversationKey = useMemo(() => {
		if (!receiverId || !currentUserId) return null;
		return [String(currentUserId), String(receiverId)].sort().join("__");
	}, [currentUserId, receiverId]);

	// Load receiver profile
	useEffect(() => {
		if (!receiverId) return;
		let mounted = true;
		(async () => {
			try {
				const res = await axios.get(`/api/users/${receiverId}`);
				if (mounted && res?.data) {
					const profile = res.data.user ?? res.data;
					setReceiver(profile);
				}
			} catch (err) {
				console.warn("Failed to load receiver profile", err.message);
			}
		})();
		return () => (mounted = false);
	}, [receiverId]);

	// Load existing messages for this conversation
	useEffect(() => {
		if (!conversationKey || !receiverId || !currentUserId) return;
		let mounted = true;
		(async () => {
			try {
				const res = await axios.get(`/api/conversations/${receiverId}/messages`, {
					params: { senderId: currentUserId, limit: 200 },
				});
				if (mounted) setMessages(res.data || []);
			} catch (err) {
				console.warn("Failed to load messages", err.message);
				setMessages([]);
			}
		})();
		return () => (mounted = false);
	}, [conversationKey, receiverId, currentUserId]);

	// Connect to Socket.IO for realtime updates
	useEffect(() => {
		if (!conversationKey || !receiverId || !currentUserId) return;
		let socket;
		let onNew;
		(async () => {
			try {
				const mod = await import("socket.io-client");
				const create = mod.io || mod.default || mod;
				socket = create("http://localhost:3000", {
					transports: ["websocket", "polling"],
					withCredentials: true,
				});
				socket.emit("join", { conversationId: conversationKey, userId: currentUserId });

				onNew = (msg) => {
					if (!msg || String(msg.conversationId) !== String(conversationKey)) return;
					pushMessage(msg);
				};
				socket.on("newMessage", onNew);
			} catch (err) {
				console.warn("socket.io-client not available — realtime disabled.", err?.message || err);
			}
		})();

		return () => {
			if (socket && onNew) socket.off("newMessage", onNew);
			if (socket) socket.emit("leave", { conversationId: conversationKey, userId: currentUserId });
			if (socket) socket.disconnect();
		};
	}, [conversationKey, receiverId, currentUserId, pushMessage]);

	// Auto-scroll to bottom when messages change
	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTop = listRef.current.scrollHeight;
		}
	}, [messages]);

	// Convert attachment to data URL
	useEffect(() => {
		if (!attachment?.file) return;
		const reader = new FileReader();
		reader.onload = () => {
			setAttachment((prev) => ({ ...prev, preview: reader.result }));
		};
		reader.readAsDataURL(attachment.file);
	}, [attachment?.file]);

	const handleSend = async (e) => {
		e?.preventDefault?.();
		if (!conversationKey || !receiverId || !currentUserId) return;
		if (!draft.trim() && !attachment?.preview) return;

		const payload = {
			senderId: currentUserId,
			receiverId,
			text: draft.trim() || undefined,
			attachments: attachment?.preview ? [{ url: attachment.preview, name: attachment.file?.name, mime: attachment.file?.type }] : [],
			senderName: user?.firstName || user?.name || "Unknown User",
		};

		try {
			const res = await axios.post(`/api/conversations/${receiverId}/messages`, payload, {
				params: { senderId: currentUserId },
			});
			pushMessage(res.data);
			setDraft("");
			clearAttachment();
		} catch (err) {
			console.error("Send failed", err.message);
			toast.error("Failed to send message");
		}
	};

	const handleAttachClick = () => fileInputRef.current?.click();

	const handleFileChange = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setAttachment({ file, preview: null });
	};

	const clearAttachment = () => {
		setAttachment(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const headerName = receiver ? `${receiver.firstName ?? receiver.name ?? ""} ${receiver.lastName ?? ""}`.trim() || receiverId : receiverId;
	const headerStatus = "Online";

	return (
		<div className="flex flex-col h-[100svh] md:h-screen w-full bg-[#101114] text-white">
			<header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-800 px-3 py-3 sm:px-6 bg-[#0b0b0c]/95 backdrop-blur">
				<div className="flex items-center gap-2 sm:gap-3 min-w-0">
					{onBackToChats && (
						<button
							type="button"
							onClick={onBackToChats}
							className="md:hidden mr-1 shrink-0 flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-800/60 transition"
						>
							<span aria-hidden="true">←</span>
							<span>All chats</span>
						</button>
					)}
					<div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#6a5af9] to-[#f857a6] flex items-center justify-center text-sm font-semibold">
						{headerName?.charAt(0) ?? "U"}
					</div>
					<div className="min-w-0">
						<div className="text-lg font-semibold truncate">{headerName}</div>
						<div className="text-xs text-gray-400">{headerStatus}</div>
					</div>
				</div>
			</header>

			<div ref={listRef} className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 space-y-3 sm:space-y-4 pb-24 sm:pb-6 bg-gradient-to-b from-[#111319] to-[#0e1015]">
				{messages.length === 0 && (
					<div className="h-full min-h-[40vh] flex items-center justify-center text-sm text-gray-500 text-center px-4">
						No messages yet. Start the conversation.
					</div>
				)}
				{messages.map((message, index) => {
					const isMe = String(message.senderId) === String(currentUserId);
					return (
						<div key={makeMessageKey(message) || index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
							<div className={`max-w-[92%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-[0.95rem] shadow-sm ${isMe ? "bg-[#F84565] text-white rounded-tr-sm" : "bg-[#1b2233] text-gray-100 rounded-tl-sm"}`}>
								{message.text && <div className="whitespace-pre-wrap">{message.text}</div>}
								{(message.attachments || []).map((att, i) => (
									<div key={`${makeMessageKey(message)}-att-${i}`} className="mt-2">
										<img src={att.url} alt={att.name || "attachment"} className="max-h-64 rounded-xl object-cover" />
									</div>
								))}
								<div className="text-xs text-gray-200/70 mt-2 text-right">
									{new Date(message.createdAt || message.time || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<form
				onSubmit={handleSend}
				className="sticky bottom-0 z-20 border-t border-gray-800 bg-[#0b0b0c]/95 backdrop-blur px-3 py-3 sm:px-6"
				style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}
			>
				{attachment?.preview && (
					<div className="mb-3 flex flex-col sm:flex-row items-center gap-3 bg-gray-900/60 px-3 py-2 rounded-lg border border-gray-800">
						<img src={attachment.preview} alt="preview" className="h-12 w-12 object-cover rounded-md" />
						<div className="flex-1 text-xs text-gray-300">{attachment.file?.name}</div>
						<button type="button" onClick={clearAttachment} className="text-xs text-red-400 hover:text-red-300">
							Remove
						</button>
					</div>
				)}

				<div className="flex flex-col sm:flex-row gap-3">
					<textarea
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						rows={1}
						placeholder="Type a message..."
						className="flex-1 min-h-[52px] sm:min-h-[44px] max-h-40 resize-y bg-transparent border border-gray-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F84565]"
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSend(e);
							}
						}}
					/>
					<div className="flex flex-row sm:flex-col gap-2">
						<input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
						<button type="button" onClick={handleAttachClick} className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gray-800 text-sm text-gray-200 hover:bg-gray-700 transition">
							Attach
						</button>
						<button type="submit" className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#F84565] text-sm font-semibold text-white hover:bg-[#d83855] transition">
							Send
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default ChatArea;