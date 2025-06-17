import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([])

  const navigate = useNavigate()
  const { user } = useUser();
  
  const { getToken } = useAuth();

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
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
    fetchProducts();
  }, []);

  const fetchCart = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/orders/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setCart(data.cart);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/orders/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchOrders()
    }
  }, [user]);

  const value = { axios, user, products, cart, orders, getToken, navigate  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
