import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Chat from "../components/Chat";

const ChatLayout = () => {
	const location = useLocation();
	const [showSidebar, setShowSidebar] = useState(() => {
		if (typeof window === "undefined") return true;
		return window.matchMedia("(min-width: 768px)").matches;
	});

	useEffect(() => {
		if (typeof window === "undefined") return;
		const media = window.matchMedia("(min-width: 768px)");
		const sync = () => setShowSidebar(media.matches);
		sync();
		media.addEventListener("change", sync);
		return () => media.removeEventListener("change", sync);
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const isDesktop = window.matchMedia("(min-width: 768px)").matches;
		if (!isDesktop && location.pathname.startsWith("/chat/")) {
			setShowSidebar(false);
		}
	}, [location.pathname]);

	const openSidebar = () => setShowSidebar(true);
	const closeSidebar = () => {
		if (typeof window === "undefined") return;
		if (window.innerWidth < 768) setShowSidebar(false);
	};

	return (
		<div className="flex flex-col md:flex-row w-full min-h-screen bg-[#0f0f10]">
			<section className={`${showSidebar ? "flex" : "hidden"} md:flex flex-col w-full md:w-[22rem] md:max-w-sm border-b md:border-b-0 md:border-r border-gray-800 bg-[#0b0b0c] z-30`}>
				<Chat onSelectConversation={closeSidebar} onCloseSidebar={closeSidebar} />
			</section>
			<main className="flex-1 w-full overflow-hidden">
				<Outlet context={{ onShowSidebar: openSidebar }} />
			</main>
		</div>
	);
};

export default ChatLayout;