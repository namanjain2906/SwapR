import express from "express";
import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

const chatRouter = express.Router();
const getConversationKeyParts = (conversationId = "") => conversationId.split("__").filter(Boolean);

// Get all chats for a user
chatRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const threads = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$$ROOT" },
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);

    const partnerIds = threads
      .map((thread) => {
        const [a, b] = getConversationKeyParts(thread._id);
        return a === String(userId) ? b : a;
      })
      .filter(Boolean);

    const mongoPartnerIds = partnerIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    const clerkPartnerIds = partnerIds.filter((id) => id && !mongoose.Types.ObjectId.isValid(id));

    const [mongoUsers, clerkUsers] = await Promise.all([
      mongoPartnerIds.length ? User.find({ _id: { $in: mongoPartnerIds } }).lean() : [],
      clerkPartnerIds.length ? User.find({ clerkId: { $in: clerkPartnerIds } }).lean() : [],
    ]);

    const userLookup = new Map();
    mongoUsers.forEach((u) => userLookup.set(String(u._id), u));
    clerkUsers.forEach((u) => {
      if (u.clerkId) userLookup.set(String(u.clerkId), u);
    });

    const missingClerkIds = clerkPartnerIds.filter((id) => !userLookup.has(id));
    if (missingClerkIds.length) {
      const fetched = await Promise.all(
        missingClerkIds.map(async (clerkId) => {
          try {
            const clerkUser = await clerkClient.users.getUser(clerkId);
            return {
              clerkId,
              firstName: clerkUser.firstName ?? "",
              lastName: clerkUser.lastName ?? "",
              name:
                `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
                clerkUser.username ||
                clerkUser.primaryEmailAddress?.emailAddress ||
                clerkId,
              avatarUrl: clerkUser.imageUrl ?? "",
            };
          } catch (err) {
            console.warn("Failed to load Clerk user", clerkId, err?.message || err);
            return null;
          }
        })
      );
      fetched
        .filter(Boolean)
        .forEach((u) => userLookup.set(String(u.clerkId), { ...u, _id: u.clerkId }));
    }

    const conversations = threads.map((thread) => {
      const [a, b] = getConversationKeyParts(thread._id);
      const partnerId = a === String(userId) ? b : a;
      const partner =
        userLookup.get(partnerId) ??
        (() => {
          const fallbackName = partnerId.replace(/[_-]/g, " ").trim() || partnerId;
          return {
            _id: partnerId,
            clerkId: partnerId,
            name: fallbackName,
            firstName: fallbackName,
            lastName: "",
            avatarUrl: "",
          };
        })();
      return {
        conversationId: thread._id,
        partnerId,
        partner,
        lastMessage: thread.lastMessage,
      };
    });

    return res.json(conversations);
  } catch (error) {
    console.error("Error fetching chat list:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Get specific chat
chatRouter.get("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    res.json({ id: chatId, messages: [] });
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ error: error.message });
  }
});

export default chatRouter;
