import React, { useState, useEffect } from "react";
import BlurCircle from "../../components/BlurCircle.jsx";
import Loading from "../../components/Loading.jsx";
import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";

const OrderRequest = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderRequests, setOrderRequests] = useState([]);
  const { axios, user, getToken } = useAppContext();

  const handleConfirm = async (productId, orderId, buyerId) => {
    try {
      const token = await getToken();
      const { data } = await axios.patch(
        `/api/orders/confirm/${productId}`,
        { orderId, buyerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setOrderRequests(
          orderRequests.filter((order) => order._id !== orderId)
        );
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      toast.error("Error confirming order.");
    }
  };

  const handleDecline = async (productId, orderId, buyerId) => {
    try {
      const token = await getToken();
      const { data } = await axios.patch(
        `/api/orders/decline/${productId}`,
        { orderId, buyerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setOrderRequests(
          orderRequests.filter((order) => order._id !== orderId)
        );
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error declining order:", error);
      toast.error("Error declining order.");
    }
  };

  const getRequestOrder = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/orders/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderRequests(data.orderRequests);
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getRequestOrder();
    }
  }, [user, location.pathname]);
  return !isLoading ? (
    <>
      <BlurCircle top="20px" left="160px" />
      <BlurCircle top="350px" right="-50px" />
      <p className="font-medium text-3xl flex">
        Order &nbsp; <span className="text-[#F84565]">Requests</span>
      </p>
      <div className="max-w-4x1 mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-[#F84565]/20 text-left text-white">
              <th className="p-2 font-medium pl-5"> Product Title </th>
              <th className="p-2 font-medium"> Price </th>
              <th className="p-2 font-medium"> Buyer </th>
              <th className="p-2 font-medium"> Confirm </th>
              <th className="p-2 font-medium"> Decline </th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {orderRequests.map((request) => (
              <tr
                key={request._id}
                className="border-b border-[#F84565]/10 bg-[#F84565]/5 even:bg-[#F84565]/10"
              >
                <td className="p-2 min-w-45 pl-5">{request.productId.title}</td>
                <td className="p-2 min-w-45 pl-5">
                  &#8377;{request.productId.price}
                </td>
                <td className="p-2 min-w-45 pl-5">{request.buyerId.name}</td>
                <td className="p-2 min-w-45 pl-5">
                  <button
                    onClick={() =>
                      handleConfirm(
                        request.productId._id,
                        request._id,
                        request.buyerId._id
                      )
                    }
                    className="text-green-400/90 cursor-pointer hover:underline"
                  >
                    Confirm
                  </button>
                </td>
                <td className="p-2 min-w-45 pl-5">
                  <button
                    onClick={() =>
                      handleDecline(
                        request.productId._id,
                        request._id,
                        request.buyerId._id
                      )
                    }
                    className="text-red-400/90 cursor-pointer hover:underline"
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default OrderRequest;
