import React from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { Toaster } from "react-hot-toast";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Layout from "./pages/admin/Layout.jsx";
import ChatLayout from "./pages/ChatLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AddProducts from "./pages/admin/AddProducts.jsx";
import ListProducts from "./pages/admin/ListProducts.jsx";
import { useAppContext } from "./context/AppContext.jsx";
import { SignIn } from "@clerk/clerk-react";
import Address from "./pages/Address.jsx";
import Category from "./pages/Category.jsx";
import OrderRequest from "./pages/admin/OrderRequest.jsx";
import Search from "./pages/Search.jsx";
import ChatArea from "./pages/ChatArea.jsx";

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isChatRoute = location.pathname.startsWith("/chat");
  const showGlobalShell = !isAdminRoute && !isChatRoute;
  const { user } = useAppContext();
  return (
    <div className="relative overflow-hidden">
      <Toaster></Toaster>
      {showGlobalShell && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/products" element={<Products />}></Route>
        <Route path="/products/categories/:category" element={<Category />} />
        <Route
          path="/products/product-details/:id"
          element={<ProductDetails />}
        />
        <Route path="/products/search/:title" element={<Search />} />
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/my-orders" element={<MyOrders />}></Route>
        <Route path="/address" element={<Address />}></Route>
        <Route
          path="/chat/*"
          element={
            user ? (
              <ChatLayout />
            ) : (
              <div className="min-h-screen flex justify-center items-center">
                <SignIn fallbackRedirectUrl={"/chat"} />
              </div>
            )
          }
        >
          <Route path=":receiverId" element={<ChatArea />} />
        </Route>
        <Route
          path="/admin/*"
          element={
            user ? (
              <Layout />
            ) : (
              <div className="min-h-screen flex justify-center items-center">
                <SignIn fallbackRedirectUrl={"/admin"} />
              </div>
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-products" element={<AddProducts />} />
          <Route path="order-request" element={<OrderRequest />} />
          <Route path="list-products" element={<ListProducts />} />
        </Route>
      </Routes>
      {showGlobalShell && <Footer />}
    </div>
  );
};

export default App;
