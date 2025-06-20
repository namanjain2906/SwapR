import Order from "../models/Order.js";
import User from "../models/User.js";
import orderRouter from "../routes/orderRoutes.js";

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
    await User.findByIdAndUpdate(userId,{ $push: { ordersid: newOrderId } })
    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export const getCart = async (req, res) => {
  try {
    const { userId } = req.auth();
    console.log("getcart");
    
    console.log(userId)
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
    console.log("getOrders");
    
    console.log(userId);
    
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

export const addToCart = async(req,res)=>{
  try {
    console.log("addtocart");
    const {userId} = req.auth();
    const {productId} = req.body
    console.log(userId);

    
    await User.findByIdAndUpdate(userId,{ $push: { cartitemid: productId } })
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}