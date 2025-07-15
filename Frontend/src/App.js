import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import About from "./pages/users/about";
import Services from "./pages/services";
import Cart from "./pages/Cart.js";
import Index from "./pages/index";
import Dashboard from "./pages/users/dashboard";

import CustomNavbar from "./Components/CustomNavbar";
import { toast, ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/users/home";
import UserProvider from "./context/userProvider";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import AddProduct from "./pages/admin/AddProduct";
import AdminProfile from "./pages/admin/AdminProfile";
import UserProfile from "./pages/users/UserProfile";
import AddCategories from "../src/Components/Admin/AddCategories";
import ViewCatgories from "../src/Components/Admin/ViewCatgoeries";
import ViewProducts from "../src/Components/Admin/ViewProducts";
import AdminUsers from "../src/Components/Admin/AdminUsers";
import AdminOrders from "../src/Components/Admin/AdminOrders";
import "./App.css";
import PrivateRoute from "./Components/PrivateRoute";
import StorePage from "./pages/users/StorePage";
import ProductView from "./pages/users/ProductView";
import CartProvider from "./context/cartProvider";
import UserOrder from "./pages/users/UserOrder.jsx";
import Loader from "./Components/Loader.jsx";
import { useEffect, useState } from "react";
import { privateAxios, publicAxios } from "./Services/axiosService.js";
import NotFound from "./Components/NotFound404.jsx";
import useLoader from "./CustomHooks/useLoader.js";
function App() {
  const loading = useLoader();
  return (
    <UserProvider>
      {/* //setting Up Routes */}
      <CartProvider>
        <BrowserRouter>
          <CustomNavbar />
          <Loader show={loading} />
          <Routes>
            {/* This All From 34 to 40 are Public Url */}
            <Route path="/notfound" element={<NotFound />} />
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/product/:productId" element={<ProductView />} />
            {/* From 43 to 60 are Private Url */}
            <Route element={<PrivateRoute />}>
              <Route path="user" element={<Dashboard />}>
                <Route path="cart" element={<Cart />} />
                {/* <Route path="profile" element={<Profile />} /> */}
                {/* <Route path="profile" element={<UserProfile />} /> */}
                <Route path="profile/:userId" element={<UserProfile />} />
                <Route path="home" element={<Home />} />
                {/* This is Use When Want to fetch user data from userId Coming from url*/}
                <Route path="orders" element={<UserOrder />} />
              </Route>
              <Route path="admin/profile/:userId" element={<AdminProfile />} />
              <Route path="/admin" element={<AdminDashboard />}>
                <Route path="home" element={<AdminHome />} />
                <Route path="addProduct" element={<AddProduct />} />

                <Route path="add-category" element={<AddCategories />} />
                <Route path="categories" element={<ViewCatgories />} />
                <Route path="products" element={<ViewProducts />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>
            </Route>
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </BrowserRouter>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
