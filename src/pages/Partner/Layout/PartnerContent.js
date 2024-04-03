import React from "react";
import { Route, Routes } from "react-router-dom";
import OrderList from "../Screens/Order/OrderList";
import OrderDetailByCompany from "../Screens/Order/OrderDetailByCompany";

import SupplierFoodAssigment from "../Screens/Order/TotalOrderFood";
import CompanyList from "../Screens/Company/CompanyList";
import SupplierList from "../Screens/Supplier/SupplierList";
import DailyOrderHistory from "../Screens/Order/DailyOrderHistory";
import AdminProfile from "../../../components/Profile/AdminProfile";
import AdminChangePassword from "../../../components/Profile/AdminChangePassword";
import FoodByCompany from "../Screens/SupplierFoodAssigment/FoodByCompany";
import FoodAssigmentDetail from "../Screens/SupplierFoodAssigment/FoodAssigmentDetail";
import PackageList from "../Screens/Package/PackageList";

const PartnerContent = () => {
  return (
    <Routes>
      <Route path="order" element={<OrderList />} />
      <Route
        path="order/detail/:dailyOrderId"
        element={<OrderDetailByCompany />}
      />
      <Route
        path="order/detail/:dailyOrderId/assign"
        element={<SupplierFoodAssigment />}
      />
      <Route path="order-history" element={<DailyOrderHistory />} />
      <Route
        path="order-history/:dailyOrderId"
        element={<OrderDetailByCompany />}
      />

      <Route path="food" element={<FoodByCompany />} />

      <Route path="food/detail" element={<FoodAssigmentDetail />} />
      <Route path="package" element={<PackageList />} />
      <Route path="company" element={<CompanyList />} />
      <Route path="supplier" element={<SupplierList />} />
      <Route path="profile" element={<AdminProfile />} />
      <Route path="profile/change-password" element={<AdminChangePassword />} />
    </Routes>
  );
};

export default PartnerContent;
