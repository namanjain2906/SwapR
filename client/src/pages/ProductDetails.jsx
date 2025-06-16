import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle.jsx";
import toast from "react-hot-toast";
import Loading from "../components/Loading.jsx";

const ProductDetails = () => {
  const product = true;

  // const {id}=useParams()
  // const [product, setProduct] = useState(null);
  // const getProduct = async() =>{
  //   const product = db.find(product => product.id == id);
  //   setProduct({
  //     title: product,
  //   })
  // }
  // useEffect(()=>{
  //   getProduct()
  // },[id])
  return product ? (

      <div className=" max-md:m-6 max-md:mt-20 md:m-30 ">
        <div className=" max-md:px-3 max-md:py-3 md:px-10 md:py-5 flex justify-center max-md:flex-col gap-10 items-center">
          <BlurCircle top="50px" right="150px" />
          <img
            className="rounded-xl h-100 w-auto"
            src="https://plus.unsplash.com/premium_photo-1678074057896-eee996d4a23e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Product Image"
          />
          <div className="">
            <p className="text-[#F84565] text-lg mt-3">NEW</p>
            <p className="text-4xl mt-2">Chair</p>
            <p className="text-lg mt-2">&#8377;2500</p>
            <p className="text-lg text-gray-300 w-full break-words whitespace-normal h-auto mt-2">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta,
              ea! Soluta reprehenderit unde distinctio libero voluptate
              pariatur, porro, odit ut illum, fuga sint iusto natus molestiae
              eum maiores consequatur officia. Lorem ipsum dolor, sit amet
              consectetur adipisicing elit. Id, consequatur!
            </p>
            <button
              onClick={() => toast("Added to Cart")}
              className="bg-[#F84565] py-2 px-6 font-medium rounded-lg mt-5 cursor-pointer hover:bg-[#D63854]"
            >
              Add To Cart
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-center my-10  items-center">
          <BlurCircle top="650px" left="200px" />
          <p className="text-center text-4xl m-10 font-medium">
            Seller Details
          </p>
          <div className="text-center p-5 backdrop-blur border border-[#D63854]/20 bg-[#D63854]/10  rounded-lg mt-5 max-md:w-[80%] md:w-[50%]">
            <p>John Doe</p>
            <p>Address</p>
            <button className="bg-[#F84565] py-2 px-4 font-medium rounded-lg mt-5 cursor-pointer hover:bg-[#D63854]">
              Contact
            </button>
          </div>
        </div>
      </div>

  ) : (
    <Loading/>
  );
};

export default ProductDetails;
