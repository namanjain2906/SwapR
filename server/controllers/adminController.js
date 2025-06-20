import Product from "../models/Product.js";
import User from "../models/User.js";

export const getProductsList = async (req, res) => {
  try {
    const { userId } = req.auth();
    const products = await Product.find({
      sellerId: userId,
    });
    res.json({ success: true, products: products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const saveAddress = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { area, city, city_code, state } = req.body;
    const addressData = {
      area: area,
      city: city,
      city_code: city_code,
      state: state,
    };
    await User.findByIdAndUpdate(userId, addressData);
    res.json({ success: true, message: "Address Saved" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
