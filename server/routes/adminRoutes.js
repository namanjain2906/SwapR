import express from "express";
import { getProductsList } from "../controllers/adminController.js";


const adminRouter = express.Router();

adminRouter.get("/list-products", getProductsList);

export default adminRouter;
