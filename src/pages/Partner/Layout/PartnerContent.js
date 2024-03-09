import React from "react";
import { Route, Routes } from "react-router-dom";
import OrderList from "../Screens/Order/OrderList";
import OrderDetailByCompany from "../Screens/Order/OrderDetailByCompany";

import FoodByCompany from "../Screens/Order/FoodByCompany";
import SupplierFoodAssigment from "../Screens/Order/TotalOrderFood";
import CompanyList from "../Screens/Company/CompanyList";
import SupplierList from "../Screens/Supplier/SupplierList";

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
      <Route path="food" element={<FoodByCompany />} />
      <Route path="company" element={<CompanyList />} />
      <Route path="supplier" element={<SupplierList />} />
    </Routes>
  );
};

export default PartnerContent;
