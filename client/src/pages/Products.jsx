import React from "react";
import ProductCard from "../components/ProductCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";

const Products = () => {
  const { products } = useAppContext();
  return (
    <div className="md:m-30 max-md:m-6 max-md:mt-20 flex flex-wrap justify-evenly items-center">
      <BlurCircle top="600px" left="70px" />
      <BlurCircle top="70px" right="0px" />

      {products.map((product) => (
        <ProductCard
          key={product._id} // Ensure unique key
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
