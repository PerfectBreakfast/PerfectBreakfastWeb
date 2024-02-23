// MainContent.js
import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import OrderFoodList from "../Screens/Order/OrderFoodList";

const SupplierContent = () => {
  return (
    <Routes>
      <Route path="foods" element={<OrderFoodList />} />
      {/* <Route path="foods" element={<Dishes />} />
      <Route path="menu" element={<Menu />} />
      <Route path="combo/create" element={<CreateCombo />} />
      <Route path="menu/create" element={<CreateMenu />} />
      <Route path="food/:id" element={<DishDetail />} />
      <Route path="combo/:id" element={<ComboDetail />} />
      <Route path="suppliers" element={<SupplierUnitList />} />
      <Route path="deliveries" element={<DeliveryUnitList />} />
      <Route path="partners" element={<ManagementUnitList />} />
      <Route path="companies" element={<CompanyList />} />
      <Route path="companies/create" element={<CreateCompany />} />
      <Route
        path="partners/create-management-user"
        element={<CreateManagementUser />}
      />
      <Route
        path="suppliers/create-supplier-user"
        element={<CreateSupplierUser />}
      />
      <Route
        path="deliveries/create-delivery-user"
        element={<CreateDeliveryUser />}
      /> */}
    </Routes>
  );
};

export default SupplierContent;
