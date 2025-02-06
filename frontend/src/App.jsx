import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login&signup/Login";
import SignUp from "./components/login&signup/SignUp";
import AdminPage from "./components/admin/AdminPage";
import { Toaster } from "react-hot-toast";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import WineHome from "./components/WineHome";
import Shop from "./components/Shop";
import Navbar from "./components/navbar/Navbar";
import UserPage from "./components/userPage/userPage";
import AdminProducts from "./components/admin/AdminProduct";
import AdminOrders from "./components/admin/AdminOrders";
import AdminLayout from "./components/admin/AdminLayout";

const App = () => {
  return (
    <UserProvider>
      <Toaster />
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<WineHome />} />
          <Route path="user" element={<UserPage />} />
          <Route path="shop" element={<Shop />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Routes with Sidebar Layout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminPage />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>
    </UserProvider>
  );
};

export default App;
