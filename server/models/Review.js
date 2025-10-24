import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
	{
		sellerId: { type: String, ref: "User", required: true, index: true },
		userId: { type: String, ref: "User", required: true, index: true },
		productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
		orderType: { type: String, enum: ["buy", "rent"], required: true },
		rating: { type: Number, min: 1, max: 5, required: true },
		comment: { type: String, trim: true },
	},
	{ timestamps: true }
);

reviewSchema.index({ sellerId: 1, userId: 1, productId: 1, orderType: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
