import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext.jsx";
import Loading from "../../components/Loading.jsx";

const ListProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { axios } = useAppContext();
  const { user } = useAppContext();
  const { getToken } = useAppContext();

  const getProducts = async () => {
    try {
      console.log(user);
      
      console.log("get data");
      const token = await getToken();

      
      const { data } = await axios.get("/api/admin/list-products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", data); // Debug the API response
      if (data.success) {
        setProducts(data.products || []);
        setIsLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    getProducts();
  }, [user]);
  return !isLoading ? (
    <>
      <p>List Products</p>
      <div className="max-w-4x1 mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-[#F84565]/20 text-left text-white">
              <th className="p-2 font-medium pl-5"> Product Title </th>
              <th className="p-2 font-medium"> Price </th>
              <th className="p-2 font-medium">Sold</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {products.map((product) => (
              <tr className="border-b border-[#F84565]/10 bg-[#F84565]/5 even:bg-[#F84565]/10">
                <td className="p-2 min-w-45 pl-5">{product.title}</td>
                <td className="p-2 min-w-45 pl-5">{product.price}</td>
                <td className="p-2 min-w-45 pl-5">{product.ordered}</td>
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

export default ListProducts;
