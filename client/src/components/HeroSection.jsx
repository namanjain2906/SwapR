import React from "react";
import BlurCircle from "./BlurCircle";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate=useNavigate()
  return (
    <div className=" h-screen flex justify-center items-center text-center flex-col gap-25 ">

      <div>
        <h1 className="font-semibold text-6xl max-md:text-4xl">
          Give your Items a <br />{" "}
          <span className=" text-[#F84565]">Second Life</span>
        </h1>
      </div>
      <div>
        <button onClick={()=>navigate('/Products')} className=" bg-[#F84565] py-2 px-6 font-medium rounded-full cursor-pointer hover:bg-[#D63854]">
          Browse Products
        </button>

      </div>
    </div>
  );
};

export default HeroSection;
