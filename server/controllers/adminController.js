import Product from "../models/Product.js";

export const getProductsList = async (req, res) => {
  try {

    const { userId } = req.auth();
    
    const products = await Product.find({
      sellerId: userId,
    });
    console.log("Auth Object:", req.auth().getToken()); // Debugging
    console.log(userId)
    console.log(products)
    res.json({ success: true, cart: products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
