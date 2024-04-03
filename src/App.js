import logo from "./logo.svg";
import "./App.css";
import MobileNavigation from "./pages/Footer/Footer";
import UserHeader from "./pages/Header/Header";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Outlet,
} from "react-router-dom";
import Login from "./pages/User/Signin/Signin";
import Signup from "./pages/User/Signup/Signup";
import SignupExternal from "./pages/User/Signup/SignupExternal";
import Homepage from "./pages/User/Homepage/Homepage";
import ComboDetail from "./pages/User/ComboDetail/ComboDetail";
import { CartProvider } from "./services/CartContext";
import Cart from "./pages/User/Cart/Cart";
import Checkout from "./pages/User/Checkout/Checkout";
import PaymentSuccess from "./pages/User/PaymentStatus/PaymentSuccess";
import CancelPayment from "./pages/User/PaymentStatus/PaymentFail";
import UserInfo from "./pages/User/UserSettings/UserInfo";
import AdminLogin from "./pages/Login/Login";
import Sidebar from "./pages/SuperAdmin/Layout/Sidebar";
import PageLayout from "./pages/SuperAdmin/Layout/PageLayout";
import Dishes from "./pages/SuperAdmin/Screens/Dish/DishList";
import Combos from "./pages/SuperAdmin/Screens/Combo/ComboList";
import Menu from "./pages/SuperAdmin/Screens/Menu/MenuList";
import PartnerPageLayout from "./pages/Partner/Layout/PartnerPageLayout";
import OrderHistoryList from "./pages/User/OrderHistory/OrderHistoryList";
import OrderDetail from "./pages/User/OrderHistory/OrderDetail";
import SupplierPageLayout from "./pages/Supplier/Layout/SupplierPageLayout";
import DeliveryPageLayout from "./pages/Delivery/Layout/DeliveryPageLayout";
import PartnerLogin from "./pages/Partner/Screens/Login/Login";
import SupplierLogin from "./pages/Supplier/Screens/Login/Login";
import DeliveryLogin from "./pages/Delivery/Screens/Login/Login";
import Loading from "./pages/Loading/Loading";
import Notification from "./pages/User/Notification/Notification";
import ManagementLogin from "./pages/Login/ManagementLogin";

import ForgotPassword from "./pages/User/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/User/ForgotPassword/ResetPassword";
import DailyOrderList from "./pages/DeliveryStaff/DailyOrder/DailyOrderList";
import DailyOrderDetail from "./pages/DeliveryStaff/DailyOrder/DailyOrderDetail";
import ScanOR from "./pages/DeliveryStaff/ConfirmOrder/ScanOR";
import CustomerOrderDetail from "./pages/DeliveryStaff/ConfirmOrder/OrderDetail";
import ShippingHistory from "./pages/DeliveryStaff/ShippingHistory/ShippingHistory";
import StaffSetting from "./pages/DeliveryStaff/Setting/StaffSetting,";
import FoodDetail from "./pages/User/ComboDetail/FoodDetail";
import { ToastContainer } from "react-toastify";
import EditUser from "./pages/User/UserSettings/EditUser";
import ChangePassword from "./pages/User/UserSettings/ChangePassword";
import TermOfUse from "./pages/User/Rule/TermOfUse";
import CompanyInfo from "./pages/User/Rule/CompanyInfo";
import FaqPage from "./pages/User/Rule/FaqPage";
import ErrorPage from "./pages/Error/ErrorPage";
import StaffInfo from "./pages/DeliveryStaff/Setting/StaffInfo";
import StaffChangePassword from "./pages/DeliveryStaff/Setting/StaffChangePassword";
import { AuthProvider } from "./components/Context/AuthContext";
import PrivateRoute from "./components/Context/ProtectedRoute";

function App() {
  return (
    <div className="font-sans">
      <Router>
        <CartProvider>
          <Routes>
            {/* Public Route */}
            {/* -> Login Admin <-*/}
            <Route path="/management/login" element={<ManagementLogin />} />
            <Route path="/error" element={<ErrorPage />} />
            {/* -> Login user <- */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* ------------ */}

            {/* Private Admin Route */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute allowedRoles={["SUPER ADMIN"]}>
                  <PageLayout />
                </PrivateRoute>
              }
            />

            {/* <Route path="/partner/*" element={<PartnerPageLayout />} /> */}

            <Route
              path="/partner/*"
              element={
                <PrivateRoute allowedRoles={["PARTNER ADMIN"]}>
                  <PartnerPageLayout />
                </PrivateRoute>
              }
            />
            <Route
              path="/supplier/*"
              element={
                <PrivateRoute allowedRoles={["SUPPLIER ADMIN"]}>
                  <SupplierPageLayout />
                </PrivateRoute>
              }
            />
            <Route
              path="/delivery/*"
              element={
                <PrivateRoute allowedRoles={["DELIVERY ADMIN"]}>
                  <DeliveryPageLayout />
                </PrivateRoute>
              }
            />
            {/* ------------ */}

            {/* User */}

            <Route
              path="/user"
              element={
                <PrivateRoute allowedRoles={["CUSTOMER"]}>
                  <Outlet />
                </PrivateRoute>
              }
            >
              {/* Định nghĩa các Route con dành cho User sử dụng relative paths */}
              <Route path="menu" element={<Homepage />} />
              <Route path="menu/combo/:id" element={<ComboDetail />} />
              <Route path="menu/food/:id" element={<FoodDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-history" element={<OrderHistoryList />} />
              <Route path="notifications" element={<Notification />} />
              <Route
                path="order-history/detail/:orderId"
                element={<OrderDetail />}
              />
              <Route path="success" element={<PaymentSuccess />} />
              <Route path="cancel" element={<CancelPayment />} />
              <Route path="" element={<UserInfo />} />
              <Route path="edit" element={<EditUser />} />
              <Route path="edit/change-password" element={<ChangePassword />} />
              <Route path="rules" element={<TermOfUse />} />
              <Route path="company-info" element={<CompanyInfo />} />
              <Route path="FAQ" element={<FaqPage />} />
            </Route>

            {/* <Route path="/register-external/:id" element={<SignupExternal />} />
            <Route path="/menu" element={<Homepage />} />
            <Route path="/menu/combo/:id" element={<ComboDetail />} />
            <Route path="/menu/food/:id" element={<FoodDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-history" element={<OrderHistoryList />} />
            <Route path="/notifications" element={<Notification />} />
            <Route
              path="/order-history/detail/:orderId"
              element={<OrderDetail />}
            />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<CancelPayment />} />
            <Route path="/user" element={<UserInfo />} />
            <Route path="/user/edit" element={<EditUser />} />
            <Route
              path="/user/edit/change-password"
              element={<ChangePassword />}
            />
            <Route path="/rules" element={<TermOfUse />} />
            <Route path="/company-info" element={<CompanyInfo />} />
            <Route path="/FAQ" element={<FaqPage />} /> */}

            {/* Delivery Staff */}
            {/* <Route path="/staff/order" element={<DailyOrderList />} />
            <Route path="/staff/history" element={<ShippingHistory />} />
            <Route
              path="/staff/order/:dailyOrderId"
              element={<DailyOrderDetail />}
            />
            <Route path="/staff/scan" element={<ScanOR />} />
            <Route
              path="/staff/scan/order/:orderId"
              element={<CustomerOrderDetail />}
            />
            <Route path="/staff/setting" element={<StaffSetting />} />
            <Route path="/staff/setting/edit" element={<StaffInfo />} />
            <Route
              path="/staff/setting/edit/change-password"
              element={<StaffChangePassword />}
            /> */}

            <Route
              path="/staff"
              element={
                <PrivateRoute allowedRoles={["DELIVERY STAFF"]}>
                  <Outlet />
                </PrivateRoute>
              }
            >
              <Route path="order" element={<DailyOrderList />} />
              <Route path="/staff/history" element={<ShippingHistory />} />
              <Route
                path="order/:dailyOrderId"
                element={<DailyOrderDetail />}
              />
              <Route path="scan" element={<ScanOR />} />
              <Route
                path="scan/order/:orderId"
                element={<CustomerOrderDetail />}
              />
              <Route path="setting" element={<StaffSetting />} />
              <Route path="setting/edit" element={<StaffInfo />} />
              <Route
                path="setting/edit/change-password"
                element={<StaffChangePassword />}
              />
            </Route>
          </Routes>
        </CartProvider>
      </Router>
    </div>
  );
}

export default App;
