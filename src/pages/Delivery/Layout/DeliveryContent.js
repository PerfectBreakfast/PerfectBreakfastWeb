// MainContent.js
import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import DeliveryOrderFoodList from "../Screens/Order/OrderFoodList";
import OrderFoodDetail from "../Screens/Order/OrderFoodDetail";
import DeliveryStaffList from "../Screens/Staff/DeliveryStaffList";
import CreateDeliveryStaff from "../Screens/Staff/CreateDeliveryStaff";
import CompanyList from "../Screens/Company/CompanyList";

const DeliveryContent = () => {
  return (
    <Routes>
      <Route path="order" element={<DeliveryOrderFoodList />} />
      <Route path="order/detail/:dailyOrderId" element={<OrderFoodDetail />} />
      <Route path="staff" element={<DeliveryStaffList />} />
      <Route path="staff/create" element={<CreateDeliveryStaff />} />
      <Route path="company" element={<CompanyList />} />
    </Routes>
  );
};

export default DeliveryContent;
