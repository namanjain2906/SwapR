import express from "express";
import {
  addProduct,
  allProducts,
  categoryProducts,
  productDetails,
} from "../controllers/productController.js";
import { protectAdmin } from "../middleware/auth.js";

const productRouter = express.Router();

productRouter.post("/add", addProduct);

productRouter.get("/", allProducts);

productRouter.get("/product-details/:id", productDetails);

productRouter.get("/category/:category", categoryProducts);

export default productRouter;
