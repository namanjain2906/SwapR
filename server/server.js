import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";
import productRouter from "./routes/productRoutes.js";
import { protectAdmin } from "./middleware/auth.js";
import orderRouter from "./routes/orderRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const port = 3000;

await connectDB();

//Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
// API Routes
app.get("/", (req, res) => res.send("Server is live!"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/conversations", messageRouter);
app.use("/api/reviews", reviewRouter);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", ({ conversationId, userId }) => {
    socket.join(conversationId);
    console.log(`User ${userId} joined conversation ${conversationId}`);
  });

  socket.on("leave", ({ conversationId, userId }) => {
    socket.leave(conversationId);
    console.log(`User ${userId} left conversation ${conversationId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io available to routes
app.set("io", io);

httpServer.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
