import express from "express";
import {
  getCart,
  getOrders,
  addToCart,
  removeCart,
  orderCheckout,
  getPending,
  getOrderRequests,
  confirmOrder,
  declineOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/cart", getCart);

orderRouter.post("/cart/add", addToCart);

orderRouter.patch("/cart/remove/:productId", removeCart);

orderRouter.get("/confirmed", getOrders);

orderRouter.get("/pending", getPending);

orderRouter.get("/requests",getOrderRequests)

orderRouter.get("/checkout", orderCheckout);

orderRouter.patch("/confirm/:productId", confirmOrder)

orderRouter.patch("/decline/:productId", declineOrder)

export default orderRouter;
