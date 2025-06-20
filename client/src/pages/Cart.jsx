import React from "react";
import CartCard from "../components/CartCard.jsx";
import BlurCircle from "../components/BlurCircle.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const Cart = () => {
  const { cart } = useAppContext();
  const { axios, getToken } = useAppContext();
  const handleCheckout = async () => {
    try {
      console.log("checkout");
      const token = await getToken();
      const response = await axios.get(
        "/api/orders/checkout",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error removing product:", error);
      alert("Error removing product.");
    }
  };
  return cart.length == 0 ? (
    <div className="h-screen flex justify-center items-center text-4xl">
      There are no products in your cart
    </div>
  ) : (
    <div className=" max-md:m-3 max-md:mt-20 md:m-30 max-md:p-5 md:px-10 flex flex-col justify-center items-center gap-5">
      <BlurCircle top="50px" left="80px" />
      <BlurCircle top="500px" right="80px" />
      {cart.map((item) => (
        <CartCard
          ProductId={item._id}
          Price={item.price}
          Image={item.image_path}
          Title={item.title}
          Description={item.description}
        />
      ))}
      <div className="flex gap-10">
        <button
          onClick={handleCheckout}
          className="bg-[#F84565] py-2 px-6 font-medium rounded-lg mt-5 cursor-pointer hover:bg-[#D63854]"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
