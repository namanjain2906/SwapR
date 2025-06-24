import express from "express";
import {
  getProductsList,
  saveAddress,
  getAddress,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/list-products", getProductsList);
adminRouter.post("/address", saveAddress);
adminRouter.get("/address", getAddress);

export default adminRouter;
