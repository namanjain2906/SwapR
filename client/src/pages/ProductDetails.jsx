import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle.jsx";
import toast from "react-hot-toast";
import Loading from "../components/Loading.jsx";
import { useAppContext } from "../context/AppContext.jsx";

const ProductDetails = () => {
  const { axios } = useAppContext();
  const { getToken, cart, setCart } = useAppContext();
  const { user } = useAppContext();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const getProductDetails = async () => {
    try {
      const { data } = await axios.get(`/api/products/product-details/${id}`);
      if (data.success) {
        setProduct(data.product);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    const token = await getToken();
    if (user) {
      try {
        const response = await axios.post(
          "/api/orders/cart/add",
          { productId: product._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setCart([...cart, product])
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error removing product:", error);
        alert("Error removing product.");
      }
    } else {
      toast.error("Login your account first");
    }
  };
  return product ? (
    <div className=" max-md:m-2 max-md:mt-20 md:m-30 ">
      <div className=" max-md:px-1 max-md:py-3 md:px-10 md:py-5 flex justify-center max-md:flex-col gap-10 items-center">
        <BlurCircle top="50px" right="150px" />
        <img
          className="rounded-xl md:h-100 md:w-auto max-md:w-full max-md:h-auto "
          src={product.image_path}
          alt="Product Image"
        />
        <div className="flex flex-col max-md:justify-center max-md:items-center">
          <p className="text-[#F84565] text-lg mt-3">{product.condition}</p>
          <p className=" max-md:text-3xl md:text-4xl mt-2">{product.title}</p>
          <p className="text-lg mt-2">&#8377;{product.price}</p>
          <p className="text-lg text-gray-300 w-full break-words whitespace-normal h-auto mt-2">
            {product.description}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={Array.isArray(cart) && cart.some(item => item._id === product._id)}
            className="bg-[#F84565] py-2 px-6 font-medium rounded-lg mt-5 cursor-pointer hover:bg-[#D63854]"
          >
            Add To Cart
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-center my-10  items-center">
        <BlurCircle top="650px" left="200px" />
        <p className="text-center text-4xl m-10 font-medium">Seller Details</p>
        <div className="text-center p-5 text-lg backdrop-blur border border-[#D63854]/20 bg-[#D63854]/10  rounded-lg mt-5 max-md:w-[80%] md:w-[50%]">
          <p>
            <span className="text-[#F84565]">Seller:</span> &nbsp;{" "}
            {product.sellerId.name}
          </p>
          <p>
            <span className="text-[#F84565]">Address:</span> &nbsp;{" "}
            {product.sellerId.area}, {product.sellerId.city},{" "}
            {product.sellerId.city_code}, {product.sellerId.state}
          </p>

          <button className="bg-[#F84565] py-2 px-4 font-medium rounded-lg mt-5 cursor-pointer hover:bg-[#D63854]">
            Contact
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default ProductDetails;
