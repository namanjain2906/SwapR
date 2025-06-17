import Order from "../models/Order.js";

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
    res.json({ success: true, message: "Order created in cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export const getCart = async (req, res) => {
  try {
    const { userId } = req.auth();
    const cartOrder = await Order.find({
      buyerId: userId,
      inCart: true,
    })
      .populate("productId")
      .populate("sellerId");
    res.json({ success: true, cart: cartOrder });
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
