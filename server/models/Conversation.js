const conversationSchema = new mongoose.Schema(
  {
    SenderId: { type: String, ref: "User", required: true },
    ReceiverId: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;