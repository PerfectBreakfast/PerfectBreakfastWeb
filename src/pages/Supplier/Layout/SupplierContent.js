// MainContent.js
import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import OrderFoodList from "../Screens/Order/OrderFoodList";
import AdminProfile from "../../../components/Profile/AdminProfile";
import AdminChangePassword from "../../../components/Profile/AdminChangePassword";
import OrderFoodDetail from "../Screens/Order/OrderFoodDetail";

const SupplierContent = () => {
  return (
    <Routes>
      <Route path="food" element={<OrderFoodList />} />
      <Route path="food/detail" element={<OrderFoodDetail />} />
      <Route path="profile" element={<AdminProfile />} />
      <Route path="profile/change-password" element={<AdminChangePassword />} />
    </Routes>
  );
};

export default SupplierContent;
