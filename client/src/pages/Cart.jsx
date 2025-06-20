import React from "react";
import CartCard from "../components/CartCard.jsx";
import BlurCircle from "../components/BlurCircle.jsx"
import { useAppContext } from "../context/AppContext.jsx";

const Cart = () => {
  const {cart} = useAppContext()
  console.log(cart)
  return (
    <div className=" max-md:m-3 max-md:mt-20 md:m-30 max-md:p-5 md:px-10 flex flex-col justify-center items-center gap-5">
      <BlurCircle top="50px" left="80px"/>
      <BlurCircle top="500px" right="80px"/> 
      <CartCard
        ProductId={1}
        Price={800}
        Image="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        Title="Table lamp"
        Description="Table lamp for study table with 3 light modes."
      />
      <CartCard
        ProductId={2}
        Price={2500}
        Image="https://plus.unsplash.com/premium_photo-1678074057896-eee996d4a23e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        Title="Chair"
        Description="A simple classy comfortable chair."
      />
      <button className="bg-[#F84565] py-2 px-6 font-medium rounded-lg mt-5 cursor-pointer hover:bg-[#D63854]">Checkout</button>
    </div>
  );
};

export default Cart;
