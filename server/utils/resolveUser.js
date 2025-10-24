import mongoose from "mongoose";
import User from "../models/User.js";

// Find a user safely by either a valid ObjectId or known external identifier fields.
// Returns the user document (lean) or null.
export async function resolveUserById(id) {
  if (!id) return null;

  // Try clerkId first (most common for Clerk auth)
  const byClerk = await User.findOne({ clerkId: String(id) }).lean();
  if (byClerk) return byClerk;

  // Try ObjectId if valid
  if (mongoose.isValidObjectId(id)) {
    const byId = await User.findById(id).lean();
    if (byId) return byId;
  }

  // Try other fields
  const byOther = await User.findOne({
    $or: [{ email: id }, { name: id }],
  }).lean();

  return byOther || null;
}

// Helper for other modules: return an identifier suitable for querying other collections:
// prefer resolved._id (ObjectId) else original external string id.
export async function userQueryIdentifier(id) {
  const resolved = await resolveUserById(id);
  return resolved && resolved._id ? resolved._id : id;
}
