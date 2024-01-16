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

function App() {
  return (
    <div>
      <Router>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/combo/:id" element={<ComboDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<CancelPayment />} />
            <Route path="/user" element={<UserInfo />} />
          </Routes>
        </CartProvider>
      </Router>
    </div>
  );
}

export default App;
