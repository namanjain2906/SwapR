import mongoose from "mongoose";

const rentSchema = new mongoose.Schema(
	{
		productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
		userId: { type: String, ref: "User", required: true }, // renter (buyer)
		sellerId: { type: String, ref: "User", required: true, index: true },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		status: { type: String, enum: ["pending", "active", "completed", "declined"], default: "pending", index: true },
	},
	{ timestamps: true }
);

const Rent = mongoose.model("Rent", rentSchema);

export default Rent;
