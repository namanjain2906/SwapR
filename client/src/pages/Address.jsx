import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Address = () => {
  const { axios } = useAppContext();
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [state, setState] = useState("");

  const handleSaveAddress = async () => {
    try {
      const addressData = {
        area: area,
        city: city,
        city_code: cityCode,
        state: state,
      };
      const response = await axios.post("/api/admin/address", addressData);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product.");
    }
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen">
      <p className="font-medium text-3xl flex">
        Enter your &nbsp; <span className="text-[#F84565]">Address</span>
      </p>
      <div className="bg-white/10 p-10 border-2 border-gray-300/20 rounded-xl">
        <div className="flex gap-10">
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
        <div className="flex gap-10">
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
  );
};

export default Address;
