import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";

const MyOrders = () => {
  const { orders, user, axios, setOrders } = useAppContext();
  const { getToken } = useAppContext();
  const [confirmed, setConfirmed] = useState(true);
  const [pendingOrders, setPendingOrders] = useState([]);

  const getPendingOrder = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/orders/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingOrders(data.pendingOrders);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getPendingOrder();
    }
  }, [user, location.pathname]);

  return (
    <div className="md:m-30 max-md:m-6 max-md:mt-20 flex flex-wrap justify-evenly items-center">
      <div className="border-b border-gray-500 w-full flex justify-center items-center gap-5 text-2xl">
        <button
          onClick={() => setConfirmed(true)}
          className={
            confirmed
              ? "px-10 border-b-4 border-[#F84565] cursor-pointer"
              : "px-10 cursor-pointer"
          }
        >
          Confirmed
        </button>
        <button
          onClick={() => setConfirmed(false)}
          className={
            confirmed
              ? "px-10 cursor-pointer"
              : "px-10 border-b-4 border-[#F84565] cursor-pointer"
          }
        >
          Pending
        </button>
      </div>
      {confirmed ? (
        <div className="md:m-10 max-md:m-6 max-md:mt-20 flex flex-wrap justify-evenly gap-10 items-center">
          <BlurCircle top="600px" left="70px" />
          <BlurCircle top="70px" right="0px" />

          {Array.isArray(orders) &&
            orders.map((order) => (
              <ProductCard
                key={order._id} // Ensure unique key
                ProductId={order.productId}
                Price={order.price}
                Image={order.productId.image_path}
                Title={order.productId.title}
                Description={order.productId.description}
              />
            ))}
        </div>
      ) : (
        <div className="md:m-10 max-md:m-6 max-md:mt-20 flex flex-wrap justify-evenly gap-10 items-center">
          <BlurCircle top="600px" left="70px" />
          <BlurCircle top="70px" right="0px" />

          {Array.isArray(pendingOrders) &&
            pendingOrders.map((pendingOrder) => (
              <ProductCard
                key={pendingOrder._id} // Ensure unique key
                ProductId={pendingOrder.productId}
                Price={pendingOrder.price}
                Image={pendingOrder.productId.image_path}
                Title={pendingOrder.productId.title}
                Description={pendingOrder.productId.description}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
