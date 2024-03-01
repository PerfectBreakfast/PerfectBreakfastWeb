import logo from "./logo.svg";
import "./App.css";
import MobileNavigation from "./pages/Footer/Footer";
import UserHeader from "./pages/Header/Header";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Login from "./pages/User/Signin/Signin";
import Signup from "./pages/User/Signup/Signup";
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

function App() {
  return (
    <div>
      <Router>
        <CartProvider>
          <Routes>
            {/* User */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/combo/:id" element={<ComboDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-history" element={<OrderHistoryList />} />
            <Route
              path="/order-history/detail/:orderId"
              element={<OrderDetail />}
            />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<CancelPayment />} />
            <Route path="/user" element={<UserInfo />} />

            {/* Super Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<PageLayout />} />
            {/* <Route path="/admin/foods" element={<Dishes />} />
            <Route path="/admin/combos" element={<Combos />} />
            <Route path="/admin/menu" element={<Menu />} /> */}
            <Route path="/partner/*" element={<PartnerPageLayout />} />
            <Route path="/supplier/*" element={<SupplierPageLayout />} />
            <Route path="/delivery/*" element={<DeliveryPageLayout />} />
            <Route path="/partner/login" element={<PartnerLogin />} />
            <Route path="/supplier/login" element={<SupplierLogin />} />
            <Route path="/delivery/login" element={<DeliveryLogin />} />
            <Route path="/loading" element={<Loading />} />
          </Routes>
        </CartProvider>
      </Router>
    </div>
  );
}

export default App;
