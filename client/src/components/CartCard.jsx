import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const CartCard = ({ Image, Title, Description, Price, ProductId }) => {
  const { axios } = useAppContext();
  const { getToken } = useAppContext();

  const handleRemove = async (ProductId) => {
    const token = await getToken();
    try {
      const response = await axios.patch(
        `/api/orders/cart/remove/${ProductId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      console.log(response);
    } catch (error) {}
  };

  return (
    <div className=" p-5 backdrop-blur border border-[#D63854]/20 bg-[#D63854]/10  rounded-lg mt-5 flex max-md:flex-col w-full max-md:w-full items-center md:gap-15 max-md:gap-5">
      <img className="h-50 w-auto rounded-lg" src={Image} alt="Product Image" />
      <div>
        <p className="text-3xl p-5">{Title}</p>
        <p className="text-gray-300">{Description}</p>
        <p className="text-gray-300">&#8377;{Price}</p>
      </div>
      <button
        onClick={() => handleRemove(ProductId)}
        className="bg-[#F84565] py-2 px-6 font-medium rounded-lg mt-5 cursor-pointer hover:bg-[#D63854]"
      >
        Remove
      </button>
    </div>
  );
};

export default CartCard;
