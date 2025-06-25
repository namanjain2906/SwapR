import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoaded } = useUser();
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

  const fetchCart = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/orders/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(data.cart);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/orders/confirmed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.orders);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getAddress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddress(data.address || {});
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchProducts();
      fetchOrders();
      fetchCart();
      getAddress();
    }
  }, [isLoaded, user, location.pathname]);

  const value = {
    axios,
    user,
    address,
    products,
    cart,
    orders,
    setProducts,
    setCart,
    setOrders,
    getToken,
    navigate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
