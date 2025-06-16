import React from "react";
import ProductCard from "../components/ProductCard";
import BlurCircle from "../components/BlurCircle";

const Products = () => {
  return (
    <div className="md:m-30 max-md:m-6 max-md:mt-20 flex flex-wrap justify-evenly items-center">
      <BlurCircle top="600px" left="70px" />
      <BlurCircle top="70px" right="0px" />
      <ProductCard
        ProductId={1}
        Price={800}
        Image="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        Title="Table lamp"
        Description="Table lamp for study table with 3 light modes."
      />
      <ProductCard
        ProductId={2}
        Price={2500}
        Image="https://plus.unsplash.com/premium_photo-1678074057896-eee996d4a23e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        Title="Chair"
        Description="A simple classy comfortable chair."
      />
      <ProductCard
        ProductId={3}
        Price={4000}
        Image="https://plus.unsplash.com/premium_photo-1675744019321-f90d6d719da7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        Title="Wooden Table"
        Description="A wooden table for you work and food cravings."
      />
      <ProductCard
        ProductId={4}
        Price={1500}
        Image="https://images.unsplash.com/photo-1559309106-ed14040fd35d?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        Title="Badminton Set"
        Description="A pair of badminton rackets for your enjoyment."
      />
      <ProductCard
        ProductId={5}
        Price={7500}
        Image="https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        Title="Wooden Cupboard"
        Description="A wooden cupboard with 4 shelves to store all your items."
      />
    </div>
  );
};

export default Products;
