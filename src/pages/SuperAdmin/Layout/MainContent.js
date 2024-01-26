// MainContent.js
import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import Combos from "../Screens/Combo/ComboList";
import Dishes from "../Screens/Dish/DishList";
import Menu from "../Screens/Menu/MenuList";
import CreateCombo from "../Screens/Combo/CreateCombo";
import CreateMenu from "../Screens/Menu/CreateMenu";
import DishDetail from "../Screens/Dish/DishDetail";
import ComboDetail from "../Screens/Combo/ComboDetail";
import SupplierUnitList from "../Screens/SupplierUnit/SupplierUnitList";
import DeliveryUnitList from "../Screens/DeliveryUnit/DeliveryUnitList";
import ManagementUnitList from "../Screens/ManagementUnit/ManagementUnitList";

const MainContent = () => {
  return (
    <Routes>
      <Route path="combo" element={<Combos />} />
      <Route path="foods" element={<Dishes />} />
      <Route path="menu" element={<Menu />} />
      <Route path="combo/create" element={<CreateCombo />} />
      <Route path="menu/create" element={<CreateMenu />} />
      <Route path="food/:id" element={<DishDetail />} />
      <Route path="combo/:id" element={<ComboDetail />} />
      <Route path="suppliers" element={<SupplierUnitList />} />
      <Route path="deliveries" element={<DeliveryUnitList />} />
      <Route path="partners" element={<ManagementUnitList />} />
    </Routes>
  );
};

export default MainContent;
