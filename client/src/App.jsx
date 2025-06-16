import React from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx';
import {Toaster} from 'react-hot-toast'
import {Routes,Route,useLocation} from 'react-router-dom';
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import MyOrders from './pages/MyOrders.jsx'
import Layout from './pages/admin/Layout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import AddProducts from './pages/admin/AddProducts.jsx'
import ChatBox from './pages/admin/ChatBox.jsx'
import ListProducts from './pages/admin/ListProducts.jsx'

const App = () => {
    const isAdminRoute = useLocation().pathname.startsWith("/admin");
  return (
    <div className='relative overflow-hidden'>
      <Toaster></Toaster>
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/products' element={<Products/>}></Route>
        <Route path='/product-details' element={<ProductDetails/>}></Route>
        <Route path='/cart' element={<Cart/>}></Route>
        <Route path='/my-orders' element={<MyOrders/>}></Route>
        <Route path='/admin/*' element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='add-products' element={<AddProducts/>}/>
          <Route path='chat-box' element={<ChatBox/>}/>
          <Route path='list-products' element={<ListProducts/>}/>
        </Route>
      </Routes>
      {!isAdminRoute && <Footer/>}
    </div>
  )
}

export default App