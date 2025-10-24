import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";

const userRouter = express.Router();

// Get user by ID
userRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).lean();
    return res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: error.message });
  }
});

export default userRouter;
