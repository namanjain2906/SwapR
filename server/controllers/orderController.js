import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { productId, sellerId, price } = req.body;
    await Order.create({
      productId: productId,
      sellerId: sellerId,
      buyerId: userId,
      price: price,
    });
    await User.findByIdAndUpdate(userId, { $push: { ordersid: newOrderId } });
    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export const getCart = async (req, res) => {
  try {
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
    const { userId } = req.auth();
    const orders = await Order.find({
      buyerId: userId,
      inCart: false,
    })
      .populate("productId")
      .populate("sellerId");
    res.json({ success: true, orders: orders });
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
      await Order.create({
        productId: item._id,
        sellerId: item.sellerId,
        buyerId: userData._id,
        price: item.price,
      });
    }
    await User.findByIdAndUpdate(userId, {
      $set: { cartitemid: [] },
    });
    await User.findByIdAndUpdate(userId, {
      $push: { ordersid: userData.cartitemid },
    });
    res.json({ success: true, message: "Order Confirmed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
