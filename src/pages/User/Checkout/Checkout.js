// Checkout.js
import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  IconButton,
} from "@mui/material";
import orderAPI from "../../../services/orderAPI";
import { useCart } from "../../../services/CartContext";
import "../Checkout/Checkout.css";
import userAPI from "../../../services/userAPI";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Divider from "@mui/material/Divider";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import WalletIcon from "@mui/icons-material/Wallet";
import CheckoutSkeleton from "./CheckoutSkeleton";

function Checkout() {
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("banking");
  const { cart } = useCart();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi hàm getUser từ userAPI khi component được mount
    const fetchUserData = async () => {
      try {
        const user = await userAPI.getUser();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
        alert("Error fetching user data. Please try again later.");
      }
    };

    fetchUserData();
  }, []);

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // const handleCheckout = async () => {
  //   console.log("test", cart);
  //   try {
  //     const orderDetails = {
  //       note,
  //       payment: paymentMethod,
  //       orderDetails: cart.map((item) => ({
  //         quantity: item.quantity,
  //         comboId: item.id,
  //       })),
  //     };

  //     // Gọi hàm orderFood từ orderAPI
  //     const result = await orderAPI.orderFood(orderDetails);

  //     // Xử lý kết quả đặt hàng, ví dụ: hiển thị thông báo, chuyển hướng, làm sạch giỏ hàng, vv.
  //     console.log("Order placed successfully:", result);

  //     // Đoạn mã sau đây là ví dụ, bạn có thể thay đổi nó tùy thuộc vào logic của bạn
  //     alert("Order placed successfully! Thank you for your purchase.");
  //     // Có thể thêm chuyển hướng hoặc các hành động khác tại đây
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
  //     alert("Error placing order. Please try again later.");
  //   }
  // };
  const handleCheckout = async () => {
    console.log("test", cart);
    try {
      const orderDetails = {
        note,
        payment: paymentMethod,
        orderDetails: cart.map((item) => ({
          quantity: item.quantity,
          comboId: item.id,
        })),
      };
      console.log("orderDetails", orderDetails);
      // Gọi hàm orderFood từ orderAPI
      const result = await orderAPI.orderFood(orderDetails);

      // Kiểm tra xem có paymentUrl trong kết quả không
      if (result.paymentUrl) {
        // Chuyển hướng tới trang thanh toán
        window.location.href = result.paymentUrl;
      } else {
        // Xử lý khi không có paymentUrl
        console.error("No paymentUrl found in the result:", result);
        alert("Error: No paymentUrl found. Please try again later.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
      alert("Error placing order. Please try again later.");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative">
      <div className="flex items-center m-2.5">
        <button onClick={handleGoBack} className="flex items-center">
          <ArrowBackIosIcon />
        </button>
        <h6 className="text-lg font-bold">Thanh toán</h6>
      </div>
      <div className="container">
        {/* ... */}
        <p className="contents align-middle text-lg mb-2 font-bold">
          Thông tin người dùng
        </p>
        <div className="container">
          {/* User information will be displayed here */}
          {userData ? (
            <div>
              <p className="text-lg mb-2">Tên người dùng: {userData.name}</p>
              <p className="text-lg mb-2">Địa chỉ: {userData.companyName}</p>
              <div className="bg-gray-400"> {/* Custom Divider */}</div>
              <p className="text-lg mb-2">
                Số điện thoại: {userData.phoneNumber}
              </p>
              <div className="bg-gray-400"> {/* Custom Divider */}</div>
            </div>
          ) : (
            <CheckoutSkeleton />
          )}
          <textarea
            className="placeholder-gray-500 multiline rows-4 border-0 rounded-none w-full p-4 mt-2 bg-green-100"
            placeholder="Ghi chú"
            value={note}
            onChange={handleNoteChange}
          />
        </div>

        <div className="mt-4">
          <form className="space-y-4">
            <fieldset>
              <legend className="text-lg font-bold mb-3">
                Phương thức thanh toán
              </legend>
              <div className="flex flex-col space-y-4">
                {/* Radio option for banking */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="banking"
                    name="paymentMethod"
                    className="form-radio h-5 w-5 text-green-500"
                    checked={paymentMethod === "banking"}
                    onChange={handlePaymentMethodChange}
                  />
                  <div className="ml-3 flex items-center">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full mr-2">
                      {/* AccountBalanceIcon here with classes */}

                      {/* <svg className="w-full h-full text-white" /> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                        />
                      </svg>
                    </div>
                    <span className="text-lg">Ngân hàng</span>
                  </div>
                </label>

                {/* Radio option for e-wallet */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="wallet"
                    name="paymentMethod"
                    className="form-radio h-5 w-5 text-green-500"
                    checked={paymentMethod === "wallet"}
                    onChange={handlePaymentMethodChange}
                  />
                  <div className="ml-3 flex items-center">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full mr-2">
                      {/* WalletIcon here with classes */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                        />
                      </svg>
                    </div>
                    <span className="text-lg">Ví điện tử</span>
                  </div>
                </label>
              </div>
            </fieldset>
          </form>
        </div>
        <div className="fixed bottom-0 left-0 right-0 w-full">
          <div className="flex flex-col mt-4 px-2 pt-4 pb-1 shadow-lg bg-white rounded-t-2xl">
            <button
              className="bg-green-500 text-white p-2 mb-2 rounded-3xl hover:bg-green-600 transition-colors"
              onClick={handleCheckout}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
