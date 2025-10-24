import express from "express";
import { addReview, getSellerRating } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", addReview);
reviewRouter.get("/seller/:sellerId", getSellerRating);

export default reviewRouter;
