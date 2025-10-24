import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    sellerId: { type: String, ref: "User", required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image_path: { type: String, required: true },
    category: { type: String, required: true },
    condition: {type: String, required: true},
    available: {type: Boolean, default: true, required: true}
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;