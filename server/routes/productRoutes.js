import express from "express";
import {
  addProduct,
  allProducts,
  categoryProducts,
  productDetails,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", addProduct);

productRouter.get("/", allProducts);

productRouter.get("/categories/:category", categoryProducts);

productRouter.get("/product-details/:id", productDetails);


export default productRouter;
