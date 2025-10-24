import { createRequire } from "module";

let io = null;

export function initSocket(server) {
  if (io) return io;

  // Try to require socket.io synchronously. If it's not installed, do not throw — disable realtime.
  let Server;
  try {
    const require = createRequire(import.meta.url);
    ({ Server } = require("socket.io"));
  } catch (err) {
    // socket.io not installed — log and return null. Server will continue without realtime.
    // eslint-disable-next-line no-console
    console.warn("socket.io not installed. Realtime features are disabled. Install with: npm i socket.io");
    return null;
  }

  // Initialize socket.io server
  io = new Server(server, {
    cors: {
      origin: "*", // restrict in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", ({ conversationId }) => {
      if (conversationId) socket.join(conversationId);
    });

    socket.on("leave", ({ conversationId }) => {
      if (conversationId) socket.leave(conversationId);
    });

    // optional: receive client side sendMessage and broadcast (server also persists via REST)
    socket.on("sendMessage", (msg) => {
      if (msg?.conversationId) {
        io.to(msg.conversationId).emit("newMessage", msg);
      }
    });

    socket.on("join_user", ({ userId }) => {
      if (userId) socket.join(`user_${userId}`);
    });

    socket.on("leave_user", ({ userId }) => {
      if (userId) socket.leave(`user_${userId}`);
    });
  });

  return io;
}

export function getIO() {
  return io;
}
