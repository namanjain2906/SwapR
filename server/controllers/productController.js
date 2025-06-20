import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const {
      title,
      sellerId,
      location,
      description,
      price,
      image_path,
      category,
      condition,
      inCart,
      ordered
    } = req.body;
    const product = {
      title: title.toLowerCase(),
      sellerId: sellerId,
      location: location.toLowerCase(),
      description: description.toLowerCase(),
      price: price,
      image_path: image_path,
      category: category.toLowerCase(),
      condition: condition.toLowerCase(),
      inCart: inCart,
      ordered: ordered
    };
    await Product.create(product);
    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const allProducts = async (req, res) => {
  try {    
    const products = await Product.find({});
    res.json({ success: true, products: products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const categoryProducts = async (req, res) => {
  try {
    console.log('req recieved')
    const { category } = req.params;
    console.log(category)
    const products = await Product.find({ category: category.toLowerCase() });
    console.log(products)
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
