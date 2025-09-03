import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";

const Products = () => {
  const { products } = useAppContext();

  return products.length === 0 ? (
    <>
      <BlurCircle top="600px" left="70px" />
      <BlurCircle top="70px" right="0px" />
      <div className="h-screen flex justify-center items-center text-center max-md:text-2xl md:text-4xl">
        No Products to display
      </div>
    </>
  ) : (
    <div className="md:m-12 max-md:m-6 flex flex-wrap justify-evenly items-center">
      <BlurCircle top="600px" left="70px" />
      <BlurCircle top="70px" right="0px" />

      {products.map((product) => (
        <ProductCard
          key={product._id}
          ProductId={product._id}
          Price={product.price}
          Image={product.image_path}
          Title={product.title}
          Description={product.description}
        />
      ))}
    </div>
  );
};

export default Products;
