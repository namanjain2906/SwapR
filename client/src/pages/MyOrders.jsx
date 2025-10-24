import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";

const MyOrders = () => {
  const { orders, user, axios, setOrders } = useAppContext();
  const { getToken } = useAppContext();
  const location = useLocation();
  const [confirmed, setConfirmed] = useState(true);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [rentOrders, setRentOrders] = useState([]);
  const [pendingRentOrders, setPendingRentOrders] = useState([]);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [ratingHover, setRatingHover] = useState(0);

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

  const getRentOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/orders/rent/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRentOrders(data.rentOrders ?? []);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getPendingRentOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/orders/rent/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRentOrders(data.pendingRents ?? []);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      getPendingOrder();
      getRentOrders();
      getPendingRentOrders();
    }
  }, [user, location.pathname]);

  const openReview = (sellerId, productId, orderType, title) => {
    if (!sellerId) {
      toast.error("Seller information not available.");
      return;
    }
    setReviewTarget({ sellerId, productId, orderType, title });
    setReviewForm({ rating: 5, comment: "" });
    setRatingHover(0);
  };

  const submitReview = async (event) => {
    event.preventDefault();
    if (!reviewTarget) return;
    try {
      const token = await getToken();
      const payload = {
        sellerId: reviewTarget.sellerId,
        productId: reviewTarget.productId,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
        orderType: reviewTarget.orderType,
      };
      const { data } = await axios.post("/api/reviews", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Review submitted");
        setReviewTarget(null);
        setReviewForm({ rating: 5, comment: "" });
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Review submit failed:", error);
      toast.error("Unable to submit review");
    }
  };

  const hasConfirmedOrders = Array.isArray(orders) && orders.length > 0;
  const hasConfirmedRents = Array.isArray(rentOrders) && rentOrders.length > 0;
  const hasPendingOrders = Array.isArray(pendingOrders) && pendingOrders.length > 0;
  const hasPendingRents = Array.isArray(pendingRentOrders) && pendingRentOrders.length > 0;

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
        !(hasConfirmedOrders || hasConfirmedRents) ? (
          <div className="h-screen flex justify-center items-center md:text-4xl max-md:text-2xl p-10 text-center">
            You have no previous order
          </div>
        ) : (
          <div className="md:m-10 max-md:m-6 max-md:mt-20 flex flex-wrap justify-evenly gap-10 items-center">
            <BlurCircle top="600px" left="70px" />
            <BlurCircle top="70px" right="0px" />
            {hasConfirmedOrders &&
              orders.map((order) => (
                <div key={order._id} className="flex flex-col items-center gap-2">
                  <ProductCard
                    ProductId={order.productId}
                    Price={order.price}
                    Image={order.productId.image_path}
                    Title={order.productId.title}
                    Description={order.productId.description}
                  />
                  <button
                    onClick={() =>
                      openReview(
                        order.productId?.sellerId ?? order.sellerId,
                        order.productId?._id ?? order.productId,
                        "buy",
                        order.productId?.title ?? "Purchased Item"
                      )
                    }
                    className="text-sm text-[#F84565] hover:underline"
                  >
                    Review Seller
                  </button>
                </div>
              ))}
            {hasConfirmedRents &&
              rentOrders.map((rent) => (
                <div key={rent._id} className="flex flex-col items-center gap-2">
                  <ProductCard
                    ProductId={rent.productId?._id ?? rent.productId}
                    Price={rent.productId?.price}
                    Image={rent.productId?.image_path}
                    Title={rent.productId?.title ?? "Rental Item"}
                    Description={rent.productId?.description}
                  />
                  {rent.startDate && rent.endDate && (
                    <p className="text-xs text-gray-300 text-center">
                      Rental: {new Date(rent.startDate).toLocaleDateString()} → {new Date(rent.endDate).toLocaleDateString()}
                    </p>
                  )}
                  <button
                    onClick={() =>
                      openReview(
                        rent.sellerId ?? rent.productId?.sellerId,
                        rent.productId?._id ?? rent.productId,
                        "rent",
                        rent.productId?.title ?? "Rental Item"
                      )
                    }
                    className="text-sm text-[#F84565] hover:underline"
                  >
                    Review Seller
                  </button>
                </div>
              ))}
          </div>
        )
      ) : !(hasPendingOrders || hasPendingRents) ? (
        <div className="h-screen flex justify-center items-center md:text-4xl max-md:text-2xl p-10 text-center">
          You have no order requests
        </div>
      ) : (
        <div className="md:m-10 max-md:m-6 max-md:mt-20 flex flex-wrap justify-evenly gap-10 items-center">
          <BlurCircle top="600px" left="70px" />
          <BlurCircle top="70px" right="0px" />
          {hasPendingOrders &&
            pendingOrders.map((pendingOrder) => (
              <ProductCard
                key={pendingOrder._id}
                ProductId={pendingOrder.productId}
                Price={pendingOrder.price}
                Image={pendingOrder.productId.image_path}
                Title={pendingOrder.productId.title}
                Description={pendingOrder.productId.description}
              />
            ))}
          {hasPendingRents &&
            pendingRentOrders.map((pendingRent) => (
              <div key={pendingRent._id} className="flex flex-col items-center gap-2">
                <ProductCard
                  ProductId={pendingRent.productId?._id ?? pendingRent.productId}
                  Price={pendingRent.productId?.price}
                  Image={pendingRent.productId?.image_path}
                  Title={pendingRent.productId?.title ?? "Rental Item"}
                  Description={pendingRent.productId?.description}
                />
                <p className="text-xs text-gray-300">
                  Rental: {pendingRent.startDate ? new Date(pendingRent.startDate).toLocaleDateString() : "—"} →{" "}
                  {pendingRent.endDate ? new Date(pendingRent.endDate).toLocaleDateString() : "—"}
                </p>
              </div>
            ))}
        </div>
      )}
      {reviewTarget ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4">
          <form
            onSubmit={submitReview}
            className="w-full max-w-md rounded-2xl bg-[#111112] border border-[#F84565]/40 p-6 shadow-xl space-y-5"
          >
            <h3 className="text-lg font-semibold text-white">
              Review seller for “{reviewTarget.title}”
            </h3>
            <label className="flex flex-col gap-2 text-sm text-gray-300">
              Rating
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => {
                  const active = value <= (ratingHover || reviewForm.rating);
                  return (
                    <button
                      type="button"
                      key={value}
                      onMouseEnter={() => setRatingHover(value)}
                      onMouseLeave={() => setRatingHover(0)}
                      onClick={() => setReviewForm((prev) => ({ ...prev, rating: value }))}
                      className={`h-10 w-10 rounded-full border transition ${
                        active
                          ? "border-[#F84565] bg-[#F84565]/80 text-white"
                          : "border-gray-700 bg-transparent text-gray-400 hover:border-[#F84565]"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </label>
            <label className="flex flex-col gap-2 text-sm text-gray-300">
              Comment (optional)
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                rows={3}
                className="bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F84565]"
              />
            </label>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewTarget(null)}
                className="px-4 py-2 rounded-lg border border-gray-600 text-sm text-gray-300 hover:bg-gray-800/70"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#F84565] text-sm font-semibold text-white hover:bg-[#D63854]"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default MyOrders;
