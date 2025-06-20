import express from "express";
import {
  createOrder,
  getCart,
  getOrders,
  addToCart,
  removeCart,
  orderCheckout
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);

orderRouter.get("/cart", getCart);

orderRouter.post("/cart/add", addToCart);

orderRouter.patch("/cart/remove/:productId", removeCart);

orderRouter.get("/orders", getOrders);

orderRouter.get("/checkout", orderCheckout);

export default orderRouter;
