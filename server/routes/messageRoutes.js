import express from "express";
import Message from "../models/Message.js";

const messageRouter = express.Router();

const getConversationKey = (senderId, receiverId) =>
  [String(senderId), String(receiverId)].sort().join("__");

// GET /api/conversations/:conversationId/messages
messageRouter.get("/:receiverId/messages", async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { senderId, limit = 200 } = req.query;
    if (!senderId) return res.status(400).json({ error: "senderId is required" });

    const conversationId = getConversationKey(senderId, receiverId);
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(Math.min(Number(limit) || 200, 500))
      .lean();

    return res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/conversations/:conversationId/messages
messageRouter.post("/:receiverId/messages", async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { senderId, text, attachments = [], senderName } = req.body;
    if (!senderId) return res.status(400).json({ error: "senderId is required" });
    if (!text && attachments.length === 0) {
      return res.status(400).json({ error: "Message must have text or attachments" });
    }

    const conversationId = getConversationKey(senderId, receiverId);
    const created = await Message.create({
      conversationId,
      senderId,
      receiverId,
      text: text || "",
      attachments,
      senderName,
    });
    const saved = created.toObject();

    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("newMessage", saved);
    }

    return res.status(201).json(saved);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: error.message });
  }
});

export default messageRouter;
