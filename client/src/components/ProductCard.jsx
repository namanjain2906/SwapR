import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ ProductId, Image, Title, Price, Description }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        scrollTo(0, 0);
        navigate(`/product-details/${ProductId}`);
      }}
      className="group hover:-translate-y-1 flex justify-between items-center max-md:m-3 flex-col  md:w-80 md:h-100 max-md:w-60 max-md:h-90 bg-gray-800 rounded-2xl my-7 max-md:text-base md:text-xl overflow-hidden object-contain max-md:p-3 md:p-3 md:pb-5 cursor-pointer"
    >
      <img
        src={Image}
        alt="Product Image"
        className=" rounded-2xl object-center h-50 w-full object-cover"
      />
      <div className="font-medium w-full max-md:text-lg flex justify-between items-end">
        <p>{Title}</p>
        <p>&#8377;{Price}</p>
      </div>
      <p className="text-gray-300 text-sm md:text-base">{Description}</p>
      <button
        onClick={() => {
          scrollTo(0, 0);
          navigate(`/product-details/${ProductId}`);
        }}
        className="bg-[#F84565] py-2 px-6 text-sm md:text-base font-medium rounded-full cursor-pointer hover:bg-[#D63854]"
      >
        View Product
      </button>
    </div>
  );
};

export default ProductCard;
