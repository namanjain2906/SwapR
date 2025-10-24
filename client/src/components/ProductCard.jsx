import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ ProductId, Image, Title, Price, Description }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        scrollTo(0, 0);
        navigate(`/products/product-details/${ProductId}`);
      }}
      className="group hover:-translate-y-0.5 flex justify-between max-md:m-1 max-md:mb-3 flex-col  md:w-90 md:h-100 max-md:w-50 max-md:h-90  rounded-2xl my-7 max-md:text-base md:text-xl overflow-hidden object-contain max-md:p-3 md:p-3 md:pb-5 cursor-pointer"
    >
      <img
        src={Image}
        alt="Product Image"
        className=" rounded-2xl object-center h-70 w-90 object-cover"
      />
      <div className="font-medium w-full max-md:text-lg flex justify-between">
        <p>{Title.charAt(0).toUpperCase() + Title.slice(1)}</p>
      </div>
      <p className="text-gray-300 text-sm md:text-base">{Description.slice(0, 70)}...</p>
      <p>&#8377;{Price}</p>
    </div>
  );
};

export default ProductCard;
