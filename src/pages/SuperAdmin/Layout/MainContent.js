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
import CompanyList from "../Screens/Company/CompanyList";
import CreateCompany from "../Screens/Company/CreateCompany";
import CreateManagementUser from "../Screens/ManagementUnit/CreateManagementUser";
import CreateSupplierUser from "../Screens/SupplierUnit/CreateSupplierUser";
import CreateDeliveryUser from "../Screens/DeliveryUnit/CreateDeliveryUser";
import EditFood from "../Screens/Dish/EditFood";
import EditCombo from "../Screens/Combo/EditCombo";
import MenuDetail from "../Screens/Menu/MenuDetail";
import EditMenu from "../Screens/Menu/EditMenu";
import PartnerDetail from "../Screens/ManagementUnit/PartnerDetail";
import EditPartner from "../Screens/ManagementUnit/EditPartner";
import SupplierDetail from "../Screens/SupplierUnit/SupplierDetail";
import EditSupplier from "../Screens/SupplierUnit/EditSupplier";
import DeliveryDetail from "../Screens/DeliveryUnit/DeliveryDetail";
import EditDelivery from "../Screens/DeliveryUnit/EditDelivery";
import CreateFood from "../Screens/Dish/CreateFood";
import CreatePartner from "../Screens/ManagementUnit/CreatePartner";

const MainContent = () => {
  return (
    <Routes>
      <Route path="combo" element={<Combos />} />
      <Route path="foods" element={<Dishes />} />
      <Route path="menu" element={<Menu />} />
      <Route path="combo/create" element={<CreateCombo />} />
      <Route path="menu/create" element={<CreateMenu />} />
      <Route path="menu/:id" element={<MenuDetail />} />
      <Route path="menu/:id/edit" element={<EditMenu />} />
      <Route path="food/:id" element={<DishDetail />} />
      <Route path="food/create" element={<CreateFood />} />
      <Route path="food/:id/edit" element={<EditFood />} />
      <Route path="combo/:id" element={<ComboDetail />} />
      <Route path="combo/:id/edit" element={<EditCombo />} />
      <Route path="suppliers" element={<SupplierUnitList />} />
      <Route path="supplier/:id" element={<SupplierDetail />} />
      <Route path="supplier/:id/edit" element={<EditSupplier />} />
      <Route path="delivery" element={<DeliveryUnitList />} />
      <Route path="delivery/:id" element={<DeliveryDetail />} />
      <Route path="delivery/:id/edit" element={<EditDelivery />} />
      <Route path="partners" element={<ManagementUnitList />} />
      <Route path="partner/create" element={<CreatePartner />} />
      <Route path="partner/:id" element={<PartnerDetail />} />
      <Route path="partner/:id/edit" element={<EditPartner />} />
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
      />
    </Routes>
  );
};

export default MainContent;
