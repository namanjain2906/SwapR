import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { CircleDollarSign, Radio, RadioIcon, Truck } from "lucide-react";
import BlurCircle from "../../components/BlurCircle";

const Dashboard = () => {
  const [liveProducts, setLiveProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const { axios, getToken } = useAppContext();
  const getLiveProducts = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/list-products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setLiveProducts(
          data.products.filter((product) => {
            return product.available === true;
          })
        );
        setSoldProducts(
          data.products.filter((product) => {
            return product.available === false;
          })
        );
      } else {
        toast.error("Failed to get data");
      }
    } catch (error) {
      console.error("Error getting live product:", error);
      toast.error("Error getting live product.");
    }
  };
  const getTotalRevenue = () => {
    const total = soldProducts.reduce(
      (sum, product) => sum + (product.price || 0),
      0
    );
    setTotalRevenue(total);
  };

  useEffect(() => {
    getLiveProducts();
  }, []);
  useEffect(() => {
    if (soldProducts.length > 0) {
      getTotalRevenue();
    }
  }, [soldProducts]);

  return (
    <div className="flex flex-wrap">
      <BlurCircle top="100px"/>
      <div className="text-center px-10 py-7 m-5 text-lg backdrop-blur border border-[#D63854]/20 bg-[#D63854]/10  rounded-lg mt-5 max-md:w-[80%] flex justify-evenly gap-5">
        <div>
          <p className="text-[#F84565]">
            Products Live <span></span>
          </p>
          <p>{liveProducts.length}</p>
        </div>
        <RadioIcon className="text-[#F84565] w-auto h-8" />
      </div>
      <div className="text-center px-15 py-7 m-5 text-lg backdrop-blur border border-[#D63854]/20 bg-[#D63854]/10  rounded-lg mt-5 max-md:w-[80%] flex justify-evenly gap-5">
        <div>
          <p className="text-[#F84565]">Products Sold</p>
          <p>{soldProducts.length}</p>
        </div>
          <Truck className="text-[#F84565] w-auto h-8" />
      </div>
      <div className="text-center px-15 py-7 m-5 text-lg backdrop-blur border border-[#D63854]/20 bg-[#D63854]/10  rounded-lg mt-5 max-md:w-[80%] flex justify-evenly gap-5">
        <div>
          <p className="text-[#F84565]">Total Revenue</p>
          <p>{totalRevenue}</p>
        </div>
        <CircleDollarSign className="text-[#F84565] w-auto h-8" />
      </div>
    </div>
  );
};

export default Dashboard;
