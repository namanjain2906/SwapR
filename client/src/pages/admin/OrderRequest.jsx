import React, { useState, useEffect } from "react";
import BlurCircle from "../../components/BlurCircle.jsx";
import Loading from "../../components/Loading.jsx";
import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const OrderRequest = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderRequests, setOrderRequests] = useState([]);
  const { axios, user, getToken } = useAppContext();
  const location = useLocation();

  const handleConfirm = async (productId, requestId, buyerId, requestType) => {
    try {
      const token = await getToken();
      const url =
        requestType === "rent"
          ? `/api/orders/rent/confirm/${productId}`
          : `/api/orders/confirm/${productId}`;
      const payload =
        requestType === "rent" ? { rentId: requestId } : { orderId: requestId, buyerId };
      const { data } = await axios.patch(url, payload, { headers: { Authorization: `Bearer ${token}` } });

      if (data.success) {
        setOrderRequests((prev) => prev.filter((order) => order._id !== requestId));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error confirming request:", error);
      toast.error("Error confirming request.");
    }
  };

  const handleDecline = async (productId, requestId, buyerId, requestType) => {
    try {
      const token = await getToken();
      const url =
        requestType === "rent"
          ? `/api/orders/rent/decline/${productId}`
          : `/api/orders/decline/${productId}`;
      const payload =
        requestType === "rent" ? { rentId: requestId } : { orderId: requestId, buyerId };
      const { data } = await axios.patch(url, payload, { headers: { Authorization: `Bearer ${token}` } });

      if (data.success) {
        setOrderRequests((prev) => prev.filter((order) => order._id !== requestId));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error declining request:", error);
      toast.error("Error declining request.");
    }
  };

  const getRequestOrder = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/orders/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderRequests(Array.isArray(data.orderRequests) ? data.orderRequests : []);
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
              <th className="p-2 font-medium pl-5">Product Title</th>
              <th className="p-2 font-medium">Price</th>
              <th className="p-2 font-medium">Type</th>
              <th className="p-2 font-medium">Buyer</th>
              <th className="p-2 font-medium">Rental Dates</th>
              <th className="p-2 font-medium">Confirm</th>
              <th className="p-2 font-medium">Decline</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {orderRequests.map((request) => {
              const isRent = request.requestType === "rent";
              const buyer = request.buyerId?.name || request.buyerId?.firstName
                ? `${request.buyerId.firstName ?? ""} ${request.buyerId.lastName ?? ""}`.trim() ||
                  request.buyerId.name
                : request.buyerId?.email || "Unknown user";
              const rentalPeriod =
                isRent && request.startDate && request.endDate
                  ? `${new Date(request.startDate).toLocaleDateString()} → ${new Date(request.endDate).toLocaleDateString()}`
                  : "—";
              return (
                <tr key={request._id} className="border-b border-[#F84565]/10 bg-[#F84565]/5 even:bg-[#F84565]/10">
                  <td className="p-2 min-w-45 pl-5">{request.productId?.title ?? "N/A"}</td>
                  <td className="p-2 min-w-45 pl-5">
                    {request.productId?.price ? `₹${request.productId.price}` : "—"}
                  </td>
                  <td className="p-2 min-w-30 pl-5 capitalize">{isRent ? "Rent" : "Buy"}</td>
                  <td className="p-2 min-w-45 pl-5">{buyer}</td>
                  <td className="p-2 min-w-45 pl-5">{rentalPeriod}</td>
                  <td className="p-2 min-w-30 pl-5">
                    <button
                      onClick={() =>
                        handleConfirm(
                          request.productId?._id,
                          request._id,
                          request.buyerId?._id,
                          request.requestType
                        )
                      }
                      className="text-green-400/90 cursor-pointer hover:underline"
                    >
                      Confirm
                    </button>
                  </td>
                  <td className="p-2 min-w-30 pl-5">
                    <button
                      onClick={() =>
                        handleDecline(
                          request.productId?._id,
                          request._id,
                          request.buyerId?._id,
                          request.requestType
                        )
                      }
                      className="text-red-400/90 cursor-pointer hover:underline"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default OrderRequest;
