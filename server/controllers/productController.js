import Product from "../models/Product.js";
import User from "../models/User.js";

export const addProduct = async (req, res) => {
  const { userId } = req.auth();
  try {
    const {
      title,
      sellerId,
      description,
      price,
      image_path,
      category,
      condition,
      inCart,
      available,
    } = req.body;
    const product = {
      title: title.toLowerCase(),
      sellerId: sellerId,
      description: description,
      price: price,
      image_path: image_path,
      category: category.toLowerCase(),
      condition: condition,
      inCart: inCart,
      available: available,
    };
    const response = await Product.create(product);
    await User.findByIdAndUpdate(userId, {
      $push: { productsid: response._id },
    });
    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const allProducts = async (req, res) => {
  try {
    const products = await Product.find({ available: true });
    res.json({ success: true, products: products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const categoryProducts = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category: category.toLowerCase(), available: true });
    res.json({ success: true, products: products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const productDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("sellerId");
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product: product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const searchProduct = async (req, res) => {
  try {
    const { title } = req.params;
    const productData = await Product.find({ title: title, available: true });
    return res.json({ success: false, message: "Product not found" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
