import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import React,{useState, useEffect} from "react";
import BlurCircle from "../components/BlurCircle";
import ProductCard from "../components/ProductCard";

const Category = () => {
  const { axios } = useAppContext();
  console.log(axios)
  const { category } = useParams();
  console.log(category)
  const [products, setProducts] = useState([]);
  const getProducts = async () => {
    try {
      const { data } = await axios.get(`/api/products/categories/${category}`);
      console.log(data)
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getProducts();
  }, [category]);
  return (
    // <div>fashion</div>
    <div className="md:m-30 max-md:m-6 max-md:mt-20 flex flex-wrap justify-evenly items-center">
      <BlurCircle top="600px" left="70px" />
      <BlurCircle top="70px" right="0px" />
      

      {products.map((product) => (
        <ProductCard
          key={product._id} // Ensure unique key
          ProductId={product._id}
          Price={product.price}
          Image={product.image_path}
          Title={product.title}
          Description={product.description}
        />
      ))}
    </div>
  );
};

export default Category;
