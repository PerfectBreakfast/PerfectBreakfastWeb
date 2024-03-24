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
import CreateSupplier from "../Screens/SupplierUnit/CreateSupplier";
import CreateDelivery from "../Screens/DeliveryUnit/CreateDelivery";
import EditCompany from "../Screens/Company/EditCompany";
import CompanyDetail from "../Screens/Company/CompanyDetail";
import FoodRegistration from "../Screens/SupplierUnit/FoodRegistration";
import DailyOrderList from "../Screens/DailyOrder/DailyOrderList";
import AdminProfile from "../Screens/Profile/AdminProfile";
import AdminChangePassword from "../Screens/Profile/AdminChangePassword";

const MainContent = () => {
  return (
    <Routes>
      <Route path="combo" element={<Combos />} />
      <Route path="food" element={<Dishes />} />
      <Route path="menu" element={<Menu />} />
      <Route path="order" element={<DailyOrderList />} />
      <Route path="combo/create" element={<CreateCombo />} />
      <Route path="menu/create" element={<CreateMenu />} />
      <Route path="menu/:id" element={<MenuDetail />} />
      <Route path="menu/:id/edit" element={<EditMenu />} />
      <Route path="food/:id" element={<DishDetail />} />
      <Route path="food/create" element={<CreateFood />} />
      <Route path="food/:id/edit" element={<EditFood />} />
      <Route path="combo/:id" element={<ComboDetail />} />
      <Route path="combo/:id/edit" element={<EditCombo />} />
      <Route path="supplier" element={<SupplierUnitList />} />
      <Route path="supplier/:id" element={<SupplierDetail />} />
      <Route path="supplier/:id/registration" element={<FoodRegistration />} />
      <Route path="supplier/create" element={<CreateSupplier />} />
      <Route path="supplier/:id/edit" element={<EditSupplier />} />
      <Route path="delivery" element={<DeliveryUnitList />} />
      <Route path="delivery/:id" element={<DeliveryDetail />} />
      <Route path="delivery/create" element={<CreateDelivery />} />
      <Route path="delivery/:id/edit" element={<EditDelivery />} />
      <Route
        path="delivery/create-delivery-user"
        element={<CreateDeliveryUser />}
      />
      <Route path="partner" element={<ManagementUnitList />} />
      <Route path="partner/create" element={<CreatePartner />} />
      <Route path="partner/:id" element={<PartnerDetail />} />
      <Route path="partner/:id/edit" element={<EditPartner />} />
      <Route path="company" element={<CompanyList />} />
      <Route path="company/create" element={<CreateCompany />} />
      <Route path="company/:id/edit" element={<EditCompany />} />
      <Route path="company/:id" element={<CompanyDetail />} />
      <Route
        path="partner/create-management-user"
        element={<CreateManagementUser />}
      />
      <Route
        path="supplier/create-supplier-user"
        element={<CreateSupplierUser />}
      />
      <Route
        path="delivery/create-delivery-user"
        element={<CreateDeliveryUser />}
      />
      <Route path="profile" element={<AdminProfile />} />
      <Route path="profile/change-password" element={<AdminChangePassword />} />
    </Routes>
  );
};

export default MainContent;
