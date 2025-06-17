import express from "express";
import { createOrder, getCart, getOrders } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", createOrder);

orderRouter.get("/cart", getCart);

orderRouter.get("/orders", getOrders);

export default orderRouter;
