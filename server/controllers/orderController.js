import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const { userId } = req.auth();
    const userData = await User.findById(userId).populate("cartitemid");
    const cartData = userData.cartitemid;
    res.json({ success: true, cart: cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { userId } = req.auth();
    const userData = await User.findById(userId).populate({
      path: "ordersid",
      populate: {
        path: "productId",
      },
    });
    const ordersData = userData.ordersid;
    res.json({ success: true, orders: ordersData });
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
    await User.findByIdAndUpdate(userId, {
      $pull: { cartitemid: productId },
    });
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
      await User.findByIdAndUpdate(userId, {
        $push: { buy_requests: orderDetail._id },
      });
      await User.findByIdAndUpdate(item.sellerId, {
        $push: { sell_requests: orderDetail._id },
      });
    }
    await User.findByIdAndUpdate(userId, {
      $set: { cartitemid: [] },
    });
    res.json({
      success: true,
      message: "Buy Request Sent\n Wait for Seller to confirm",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getPending = async (req, res) => {
  try {
    const { userId } = req.auth();
    const userData = await User.findById(userId).populate({
      path: "buy_requests",
      populate: {
        path: "productId",
      },
    });
    res.json({ success: true, pendingOrders: userData.buy_requests });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getOrderRequests = async (req, res) => {
  try {
    const { userId } = req.auth();
    const userData = await User.findById(userId)
      .populate({
        path: "sell_requests",
        populate: {
          path: "productId",
        },
      })
      .populate({
        path: "sell_requests",
        populate: {
          path: "buyerId",
        },
      });
    res.json({ success: true, orderRequests: userData.sell_requests });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { productId } = req.params;
    const { orderId, buyerId } = req.body;
    await User.findByIdAndUpdate(userId, { $pull: { sell_requests: orderId } });
    await User.findByIdAndUpdate(buyerId, {
      $push: { ordersid: orderId },
      $pull: { buy_requests: orderId },
    });
    await Order.findByIdAndUpdate(orderId, { status: "Confirmed" });
    await Product.findByIdAndUpdate(productId, { ordered: true });
    res.json({ success: true, message: "Order Confirmed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const declineOrder = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { productId } = req.params;
    const { orderId, buyerId } = req.body;
    await User.findByIdAndUpdate(userId, { $pull: { sell_requests: orderId } });
    await User.findByIdAndUpdate(buyerId, {
      $pull: { buy_requests: orderId },
    });
    await Order.findByIdAndDelete(orderId)
    await Product.findByIdAndUpdate(productId, { ordered: false });
    res.json({ success: true, message: "Order Declined" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
