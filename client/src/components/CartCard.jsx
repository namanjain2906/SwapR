import React from "react";

const CartCard = ({Image, Title, Description, Price, ProductId}) => {
  return (
    <div className=" p-5 backdrop-blur border border-[#D63854]/20 bg-[#D63854]/10  rounded-lg mt-5 flex max-md:flex-col w-full max-md:w-full items-center md:gap-15 max-md:gap-5">
      <img
        className="h-50 w-auto rounded-lg"
        src={Image}
        alt="Product Image"
      />
      <div>
        <p className="text-3xl p-5">{Title}</p>
        <p className="text-gray-300">{Description}</p>
        <p className="text-gray-300">&#8377;{Price}</p>
        
      </div>
    </div>
  );
};

export default CartCard;
