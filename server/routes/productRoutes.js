import express from "express";
import {
  addProduct,
  allProducts,
  categoryProducts,
  productDetails,
  searchProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", addProduct);

productRouter.get("/", allProducts);

productRouter.get("/categories/:category", categoryProducts);

productRouter.get("/product-details/:id", productDetails);

productRouter.get("/search/:title", searchProduct);


export default productRouter;
