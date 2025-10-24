import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";

const Products = () => {
  const { products, axios } = useAppContext();
  const [rented, setRented] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/orders/rent/active");
        setRented(Array.isArray(data?.rentals) ? data.rentals : []);
      } catch (error) {
        console.error("Failed to load active rentals:", error?.message || error);
      }
    })();
  }, [axios]);

  return products.length === 0 ? (
    <>
      <BlurCircle top="600px" left="70px" />
      <BlurCircle top="70px" right="0px" />
      <div className="h-screen flex justify-center items-center text-center max-md:text-2xl md:text-4xl">
        No Products to display
      </div>
    </>
  ) : (
    <div className="relative md:mt-25 max-md:mt-25 px-6 md:px-12 py-8">
      <BlurCircle top="750px" left="70px" />
      <BlurCircle top="120px" right="10px" />
      <BlurCircle top="30px" left="300px" />
      <BlurCircle top="30px" left="300px" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-start">
        {products.map((product) => (
          <div key={product._id} className="flex flex-col gap-2">
            <ProductCard
              ProductId={product._id}
              Price={product.price}
              Image={product.image_path}
              Title={product.title}
              Description={product.description}
            />
            {!product.available && (
              <span className="inline-block rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-300">
                Currently rented
              </span>
            )}
          </div>
        ))}
      </div>

      {rented.length > 0 && (
        <section className="mt-12 w-full">
          <h2 className="mb-4 text-xl font-semibold text-white flex items-center gap-2">
            Currently rented products
            <span className="text-sm text-gray-400">({rented.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-start">
            {rented.map((rent) => {
              const item = rent.productId ?? {};
              return (
                <div key={rent._id} className="flex flex-col gap-2">
                  <ProductCard
                    ProductId={item._id ?? rent.productId}
                    Price={item.price}
                    Image={item.image_path}
                    Title={item.title ?? "Rental item"}
                    Description={item.description}
                  />
                  <span className="inline-block rounded-full bg-amber-400/20 px-3 py-1 text-xs font-medium text-amber-200">
                    Rental: {rent.startDate ? new Date(rent.startDate).toLocaleDateString() : "—"} →{" "}
                    {rent.endDate ? new Date(rent.endDate).toLocaleDateString() : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default Products;
