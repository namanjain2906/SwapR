import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import BlurCircle from "../../components/BlurCircle";
import Loading from "../../components/Loading";

const AddProducts = () => {
  const { axios, user } = useAppContext();
  const { getToken } = useAppContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(null);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleDataSubmit = async () => {
    try {
      setIsLoading(true);
      if (!image) {
        alert("Please select an image");
        return;
      }

      // 1. Upload image to Cloudinary
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", uploadPreset); // Set this in Cloudinary
      formData.append("cloud_name", cloudName);
      formData.append("folder", "swapr");

      const cloudinaryRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dtjcdcqkz/image/upload",
        formData
      );
      const imageUrl = await cloudinaryRes.data.secure_url;

      // 2. Send product data to backend

      const productData = {
        title: title,
        sellerId: user.id,
        description: description,
        price: price,
        image_path: imageUrl,
        category: category,
        condition: condition,
      };
      const token = await getToken();
      const response = await axios.post("/api/products/add", productData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setIsLoading(false);
        toast.success(response.data.message);
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product.");
    }
  };

  return !isLoading ? (
    <>
      <BlurCircle top="50px" left="120px" />
      <BlurCircle top="350px" right="0px" />
      <p className="font-medium text-3xl flex">
        Add a &nbsp; <span className="text-[#F84565]">Product</span>
      </p>
      <div className="mt-8">
        <div className="flex gap-20">
          <div>
            <label className="block font-medium mb-2 mt-5 text-[#F84565]">
              Product Title
            </label>
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Product Title"
              className="border border-gray-600 rounded-md py-1 px-2"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 mt-5 text-[#F84565]">
              Price
            </label>
            <input
              type="number"
              required
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Price"
              className="border border-gray-600 rounded-md py-1 px-2"
            />
          </div>
        </div>

        <label className="block font-medium mb-2 mt-5 text-[#F84565]">
          Describe Product
        </label>
        <textarea
          value={description}
          maxLength={120}
          onChange={(event) => setDescription(event.target.value)}
          className="border border-gray-600 rounded-md py-1 px-2 w-100"
          placeholder="Describe Product"
        ></textarea>

        {/* Image Upload Section */}
        <label className="block font-medium mb-2 mt-5 text-[#F84565]">
          Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border border-gray-600 rounded-md py-1 px-2"
        />

        <div className="flex gap-20">
          <div>
            <label className="block font-medium mb-2 mt-5 text-[#F84565]">
              Category
            </label>
            <select
              required
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="border border-gray-600 rounded-md py-1 px-2"
            >
              <option className="bg-[#09090B]" value="" disabled selected>
                Select Category
              </option>
              <option className="bg-[#09090B]" value="electronics">
                Electronics
              </option>
              <option className="bg-[#09090B]" value="fashion">
                Fashion
              </option>
              <option className="bg-[#09090B]" value="home appliances">
                Home Appliances
              </option>
              <option className="bg-[#09090B]" value="toys">
                Toys
              </option>
              <option className="bg-[#09090B]" value="books">
                Books
              </option>
              <option className="bg-[#09090B]" value="sports">
                Sports
              </option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-2 mt-5 text-[#F84565]">
              Condition
            </label>
            <select
              required
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
              className="border border-gray-600 rounded-md py-1 px-2"
            >
              <option className="bg-[#09090B]" value="" disabled selected>
                Select Condition
              </option>
              <option className="bg-[#09090B]" value="new">
                New
              </option>
              <option className="bg-[#09090B]" value="used">
                Used
              </option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          onClick={handleDataSubmit}
          className="bg-[#F84565] block mt-5 py-2 px-6 font-medium rounded-lg cursor-pointer hover:bg-[#D63854]"
        >
          Add Product
        </button>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default AddProducts;
