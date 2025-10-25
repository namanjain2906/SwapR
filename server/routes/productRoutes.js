import express from "express";
import {
  addProduct,
  allProducts,
  categoryProducts,
  productDetails,
  searchProduct,
} from "../controllers/productController.js";
import ensureAddress from "../middleware/ensureAddress.js";

const productRouter = express.Router();

productRouter.use(async (req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    return ensureAddress(req, res, next);
  }
  return next();
});

productRouter.post("/add", addProduct);

productRouter.get("/", allProducts);

productRouter.get("/categories/:category", categoryProducts);

productRouter.get("/product-details/:id", productDetails);

productRouter.get("/search/:title", searchProduct);

export default productRouter;
