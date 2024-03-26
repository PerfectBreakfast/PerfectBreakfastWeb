// MainContent.js
import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import DeliveryOrderFoodList from "../Screens/Order/OrderFoodList";
import OrderFoodDetail from "../Screens/Order/OrderFoodDetail";
import DeliveryStaffList from "../Screens/Staff/DeliveryStaffList";
import CreateDeliveryStaff from "../Screens/Staff/CreateDeliveryStaff";
import CompanyList from "../Screens/Company/CompanyList";
import DailyOrderHistory from "../Screens/Order/DailyOrderHistory";
import OrderHistoryDetail from "../Screens/Order/OrderHistoryDetail";
import AdminProfile from "../../../components/Profile/AdminProfile";
import AdminChangePassword from "../../../components/Profile/AdminChangePassword";

const DeliveryContent = () => {
  return (
    <Routes>
      <Route path="order" element={<DeliveryOrderFoodList />} />
      <Route path="order/detail/:dailyOrderId" element={<OrderFoodDetail />} />
      <Route path="order-history" element={<DailyOrderHistory />} />
      <Route
        path="order-history/:dailyOrderId"
        element={<OrderHistoryDetail />}
      />
      <Route path="staff" element={<DeliveryStaffList />} />
      <Route path="staff/create" element={<CreateDeliveryStaff />} />
      <Route path="company" element={<CompanyList />} />
      <Route path="profile" element={<AdminProfile />} />
      <Route path="profile/change-password" element={<AdminChangePassword />} />
    </Routes>
  );
};

export default DeliveryContent;
