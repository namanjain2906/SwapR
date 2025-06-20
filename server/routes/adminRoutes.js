import express from "express";
import { getProductsList, saveAddress } from "../controllers/adminController.js";



const adminRouter = express.Router();

adminRouter.get("/list-products", getProductsList);
adminRouter.post("/address",saveAddress)

export default adminRouter;
