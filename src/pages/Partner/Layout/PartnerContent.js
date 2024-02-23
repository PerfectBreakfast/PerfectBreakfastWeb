import React from "react";
import { Route, Routes } from "react-router-dom";
import OrderList from "../Screens/Order/OrderList";
import OrderDetailByCompany from "../Screens/Order/OrderDetailByCompany";
import TotalOrderFood from "../Screens/Order/TotalOrderFood";
import FoodByCompany from "../Screens/Order/FoodByCompany";

const PartnerContent = () => {
  return (
    <Routes>
      <Route path="order" element={<OrderList />} />
      <Route
        path="order/detail/:companyId"
        element={<OrderDetailByCompany />}
      />
      <Route path="order/total-food" element={<TotalOrderFood />} />
      <Route path="food" element={<FoodByCompany />} />
    </Routes>
  );
};

export default PartnerContent;
