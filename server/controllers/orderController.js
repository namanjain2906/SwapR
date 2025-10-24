import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Rent from "../models/Rent.js";
import mongoose from "mongoose";

const completeRent = async (rentId) => {
	const rent = await Rent.findById(rentId);
	if (!rent || rent.status !== "active") return;
	await Product.findByIdAndUpdate(rent.productId, { available: true });
	rent.status = "completed";
	await rent.save();
	await User.updateMany({ rent_orders: rentId }, { $pull: { rent_orders: rentId } });
};

const releaseExpiredRentals = async () => {
	const now = new Date();
	const expired = await Rent.find({ status: "active", endDate: { $lte: now } });
	for (const rent of expired) await completeRent(rent._id);
};

const scheduleRentalReturn = (rent) => {
	if (rent.status !== "active") return;
	const end = new Date(rent.endDate).getTime();
	const delay = end - Date.now();
	if (delay <= 0) {
		void completeRent(rent._id);
		return;
	}
	setTimeout(() => void completeRent(rent._id), delay + 1000);
};

releaseExpiredRentals().catch((err) => console.error("Rental cleanup error:", err));

export const getCart = async (req, res) => {
	try {
		await releaseExpiredRentals();
		const { userId } = req.auth();
		const userData = await User.findById(userId).populate("cartitemid");
		res.json({ success: true, cart: userData.cartitemid });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const getOrders = async (req, res) => {
	try {
		await releaseExpiredRentals();
		const { userId } = req.auth();
		const userData = await User.findById(userId).populate({
			path: "ordersid",
			populate: { path: "productId" },
		});
		res.json({ success: true, orders: userData.ordersid });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { userId } = req.auth();
		const { productId } = req.body;
		await User.findByIdAndUpdate(userId, { $push: { cartitemid: productId } });
		res.json({ success: true, message: "Added to Cart" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const removeCart = async (req, res) => {
	try {
		const { userId } = req.auth();
		const { productId } = req.params;
		await User.findByIdAndUpdate(userId, { $pull: { cartitemid: productId } });
		res.json({ success: true, message: "Removed From Cart" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const orderCheckout = async (req, res) => {
	try {
		const { userId } = req.auth();
		const userData = await User.findById(userId).populate("cartitemid");
		for (const item of userData.cartitemid) {
			const orderDetail = await Order.create({
				productId: item._id,
				sellerId: item.sellerId,
				buyerId: userData._id,
				price: item.price,
				status: "pending",
			});
			await User.findByIdAndUpdate(userId, { $push: { buy_requests: orderDetail._id } });
			await User.findByIdAndUpdate(item.sellerId, { $push: { sell_requests: orderDetail._id } });
		}
		await User.findByIdAndUpdate(userId, { $set: { cartitemid: [] } });
		res.json({ success: true, message: "Buy Request Sent\n Wait for Seller to confirm" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const getPending = async (req, res) => {
	try {
		await releaseExpiredRentals();
		const { userId } = req.auth();
		const userData = await User.findById(userId).populate({
			path: "buy_requests",
			populate: { path: "productId" },
		});
		res.json({ success: true, pendingOrders: userData.buy_requests });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const getOrderRequests = async (req, res) => {
	try {
		await releaseExpiredRentals();
		const { userId } = req.auth();
		const userData = await User.findById(userId)
			.populate({
				path: "sell_requests",
				populate: [{ path: "productId" }, { path: "buyerId" }],
			})
			.populate({
				path: "rent_sell_requests",
				populate: [
					{ path: "productId" },
					{ path: "userId", select: "firstName lastName name email" },
				],
			});

		const saleRequests = (userData.sell_requests || []).map((order) => ({
			...order.toObject(),
			requestType: "buy",
		}));

		const rentRequests = (userData.rent_sell_requests || []).map((rent) => ({
			_id: rent._id,
			productId: rent.productId,
			buyerId: rent.userId,
			status: rent.status,
			startDate: rent.startDate,
			endDate: rent.endDate,
			createdAt: rent.createdAt,
			updatedAt: rent.updatedAt,
			requestType: "rent",
		}));

		res.json({
			success: true,
			orderRequests: [...saleRequests, ...rentRequests],
		});
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const confirmOrder = async (req, res) => {
	try {
		await releaseExpiredRentals();
		const { userId } = req.auth();
		const { productId } = req.params;
		const { orderId, buyerId } = req.body;
		await User.findByIdAndUpdate(userId, { $pull: { sell_requests: orderId } });
		await User.findByIdAndUpdate(buyerId, {
			$push: { ordersid: orderId },
			$pull: { buy_requests: orderId },
		});
		await Order.findByIdAndUpdate(orderId, { status: "Confirmed" });
		await Product.findByIdAndUpdate(productId, { available: false });
		res.json({ success: true, message: "Order Confirmed" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const declineOrder = async (req, res) => {
	try {
		await releaseExpiredRentals();
		const { userId } = req.auth();
		const { productId } = req.params;
		const { orderId, buyerId } = req.body;
		await User.findByIdAndUpdate(userId, { $pull: { sell_requests: orderId } });
		await User.findByIdAndUpdate(buyerId, { $pull: { buy_requests: orderId } });
		await Order.findByIdAndDelete(orderId);
		await Product.findByIdAndUpdate(productId, { available: true });
		res.json({ success: true, message: "Order Declined" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const rentOrder = async (req, res) => {
	try {
		await releaseExpiredRentals();
		const { userId } = req.auth();
		const { productId, rentalRange } = req.body;
		if (!rentalRange?.start || !rentalRange?.end) {
			return res.status(400).json({ success: false, message: "Rental start and end dates are required" });
		}
		const startDate = new Date(rentalRange.start);
		const endDate = new Date(rentalRange.end);
		if (Number.isNaN(startDate) || Number.isNaN(endDate) || endDate < startDate) {
			return res.status(400).json({ success: false, message: "Invalid rental dates" });
		}

		const productData = await Product.findById(productId);
		if (!productData) {
			return res.status(404).json({ success: false, message: "Product not found" });
		}

		const rentDoc = await Rent.create({
			productId,
			userId,
			sellerId: productData.sellerId,
			startDate,
			endDate,
			status: "pending",
		});

		await User.findByIdAndUpdate(userId, { $addToSet: { rent_requests: rentDoc._id } });
		await User.findByIdAndUpdate(productData.sellerId, { $addToSet: { rent_sell_requests: rentDoc._id } });

		res.json({ success: true, message: "Rent request sent. Awaiting seller confirmation." });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const getRentPending = async (req, res) => {
	try {
		await releaseExpiredRentals();
		const { userId } = req.auth();
		const userData = await User.findById(userId).populate({
			path: "rent_requests",
			populate: [{ path: "productId" }, { path: "sellerId", select: "firstName lastName name email" }],
		});
		res.json({ success: true, pendingRents: userData.rent_requests });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const getRentRequests = async (req, res) => {
	try {
		await releaseExpiredRentals();
		const { userId } = req.auth();
		const userData = await User.findById(userId).populate({
			path: "rent_sell_requests",
			populate: [{ path: "productId" }, { path: "userId", select: "firstName lastName name email" }],
		});
		res.json({ success: true, rentRequests: userData.rent_sell_requests });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const confirmRent = async (req, res) => {
	try {
		await releaseExpiredRentals();
		const { userId } = req.auth();
		const { productId } = req.params;
		const { rentId } = req.body;

		const rentDoc = await Rent.findById(rentId);
		if (!rentDoc || rentDoc.sellerId.toString() !== userId) {
			return res.status(404).json({ success: false, message: "Rent request not found" });
		}

		await User.findByIdAndUpdate(userId, {
			$pull: { rent_sell_requests: rentId },
			$addToSet: { rent_orders: rentId },
		});
		await User.findByIdAndUpdate(rentDoc.userId, {
			$pull: { rent_requests: rentId },
			$addToSet: { rent_orders: rentId },
		});

		await Product.findByIdAndUpdate(productId, { available: false });

		rentDoc.status = "active";
		await rentDoc.save();
		scheduleRentalReturn(rentDoc);

		res.json({ success: true, message: "Rent request confirmed" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const declineRent = async (req, res) => {
	try {
		await releaseExpiredRentals();
		const { userId } = req.auth();
		const { productId } = req.params;
		const { rentId } = req.body;

		const rentDoc = await Rent.findById(rentId);
		if (!rentDoc || rentDoc.sellerId.toString() !== userId) {
			return res.status(404).json({ success: false, message: "Rent request not found" });
		}

		await User.findByIdAndUpdate(userId, { $pull: { rent_sell_requests: rentId, rent_orders: rentId } });
		await User.findByIdAndUpdate(rentDoc.userId, {
			$pull: { rent_requests: rentId, rent_orders: rentId },
		});

		rentDoc.status = "declined";
		await rentDoc.save();
		await Rent.findByIdAndDelete(rentId);
		await Product.findByIdAndUpdate(productId, { available: true });

		res.json({ success: true, message: "Rent request declined" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const getRentOrders = async (req, res) => {
	try {
		await releaseExpiredRentals();
		const { userId } = req.auth();
		const userData = await User.findById(userId).populate({
			path: "rent_orders",
			populate: { path: "productId" },
		});
		res.json({ success: true, rentOrders: userData.rent_orders ?? [] });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

export const getActiveRentals = async (req, res) => {
	try {
		await releaseExpiredRentals();
		const { productId } = req.query;
		const filter = { status: "active" };
		if (productId) {
			filter.productId = mongoose.Types.ObjectId.isValid(productId)
				? new mongoose.Types.ObjectId(productId)
				: productId;
		}
		const rentals = await Rent.find(filter).populate("productId");
		res.json({ success: true, rentals });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};
