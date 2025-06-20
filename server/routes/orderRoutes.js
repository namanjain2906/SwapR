import express from "express";
import { createOrder, getCart, getOrders,addToCart } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);

orderRouter.get("/cart", getCart);

orderRouter.post("/cart/add", addToCart);

orderRouter.get("/orders", getOrders);

export default orderRouter;
