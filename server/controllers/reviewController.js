import Order from "../models/Order.js";
import Rent from "../models/Rent.js";
import Review from "../models/Review.js";

export const addReview = async (req, res) => {
	try {
		const { userId } = req.auth();
		const { sellerId, productId, rating, comment, orderType } = req.body;

		if (!sellerId || !productId || !rating || !orderType) {
			return res.status(400).json({ success: false, message: "Missing review details" });
		}
		if (rating < 1 || rating > 5) {
			return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
		}

		let isEligible = false;
		if (orderType === "buy") {
			isEligible = await Order.exists({ buyerId: userId, productId, status: "Confirmed" });
		} else if (orderType === "rent") {
			isEligible = await Rent.exists({
				userId,
				productId,
				status: { $in: ["active", "completed"] },
			});
		} else {
			return res.status(400).json({ success: false, message: "Invalid order type" });
		}

		if (!isEligible) {
			return res.status(403).json({ success: false, message: "You can review only confirmed purchases or rentals" });
		}

		await Review.findOneAndUpdate(
			{ sellerId, userId, productId, orderType },
			{ rating, comment },
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

		res.json({ success: true, message: "Review submitted" });
	} catch (error) {
		console.error(error);
		res.json({ success: false, message: error.message });
	}
};

export const getSellerRating = async (req, res) => {
	try {
		const { sellerId } = req.params;
		if (!sellerId) {
			return res.status(400).json({ success: false, message: "Invalid seller id" });
		}

		const stats = await Review.aggregate([
			{ $match: { sellerId } },
			{
				$group: {
					_id: "$sellerId",
					average: { $avg: "$rating" },
					count: { $sum: 1 },
				},
			},
		]);

		const average = stats[0]?.average ?? 0;
		const count = stats[0]?.count ?? 0;

		res.json({ success: true, average, count });
	} catch (error) {
		console.error(error);
		res.json({ success: false, message: error.message });
	}
};
