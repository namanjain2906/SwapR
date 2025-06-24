import mongoose, { Schema } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    sellerId: { type: String, ref: "User", required: true },
    buyerId: { type: String, ref: "User", required: true },
    price: { type: Number, required: true },
    status: {type: String},
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
