import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";

const Address = () => {
  const { axios } = useAppContext();
  const { getToken, address } = useAppContext();
  const [area, setArea] = useState(address?.area || "");
  const [city, setCity] = useState(address?.city || "");
  const [cityCode, setCityCode] = useState(address?.cityCode || "");
  const [state, setState] = useState(address?.state || "");
  const navigate = useNavigate();

  const handleSaveAddress = async () => {
    try {
      const token = await getToken();
      const addressData = {
        area: area,
        city: city,
        city_code: cityCode,
        state: state,
      };
      const response = await axios.post("/api/admin/address", addressData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        navigate(`/`);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Issue in saving your address!");
    }
  };

  return (
    <>
      <BlurCircle top="50px" right="150px" />
      <BlurCircle top="600px" left="100px" />
      <div className="flex flex-col gap-8 mt-15 justify-center items-center h-screen">
        <p className="font-medium text-3xl flex">
          Enter your &nbsp; <span className="text-[#F84565]">Address</span>
        </p>
        <div className="bg-white/10 max-md:p-5 p-10 border-2 border-gray-300/20 rounded-xl">
          <div className="md:flex gap-10">
            <div>
              <label className="block font-medium mb-2 mt-5 text-[#F84565]">
                House No. / Road Name / Area
              </label>
              <input
                required
                value={area}
                onChange={(event) => setArea(event.target.value)}
                placeholder="House No. / Road Name / Area"
                className="border border-gray-600 rounded-md py-1 px-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-2 mt-5 text-[#F84565]">
                City
              </label>
              <input
                required
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="City"
                className="border border-gray-600 rounded-md py-1 px-2"
              />
            </div>
          </div>
          <div className="md:flex gap-10">
            <div>
              <label className="block font-medium mb-2 mt-5 text-[#F84565]">
                City Code
              </label>
              <input
                required
                value={cityCode}
                onChange={(event) => setCityCode(event.target.value)}
                placeholder="City Code"
                className="border border-gray-600 rounded-md py-1 px-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-2 mt-5 text-[#F84565]">
                State
              </label>
              <input
                required
                value={state}
                onChange={(event) => setState(event.target.value)}
                placeholder="State"
                className="border border-gray-600 rounded-md py-1 px-2"
              />
            </div>
          </div>
          <button
            onClick={handleSaveAddress}
            className="bg-[#F84565] block mt-5 py-2 px-6 font-medium rounded-md cursor-pointer hover:bg-[#D63854]"
          >
            Save Address
          </button>
        </div>
      </div>
    </>
  );
};

export default Address;
