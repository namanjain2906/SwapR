let socket = null;

export async function createSocket() {
	// return existing
	if (socket) return socket;

	try {
		const mod = await import("socket.io-client");
		const io = mod.io || mod.default || mod;
		socket = io(); // connects to same origin by default
		return socket;
	} catch (err) {
		// socket.io-client not installed or failed to load — realtime disabled
		// console.warn("socket.io-client not available:", err.message);
		return null;
	}
}

export function getSocket() {
	return socket;
}
