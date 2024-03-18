import React, { useEffect, useState } from "react";
import orderAPI from "../../../services/orderAPI";
import { useCart } from "../../../services/CartContext";
import "../Checkout/Checkout.css";
import userAPI from "../../../services/userAPI";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckoutSkeleton from "./CheckoutSkeleton";
import { ReactComponent as Banking } from "../../../assets/icons/banking.svg";
import { ReactComponent as Wallet } from "../../../assets/icons/wallet.svg";
import { ClipLoader } from "react-spinners";

function Checkout() {
  const location = useLocation();
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("banking");
  const { cart } = useCart();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { selectedMealId } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);

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

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const orderDetails = {
        note,
        payment: paymentMethod,
        mealId: selectedMealId,
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
        navigate("/cancel");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error placing order:", error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
      navigate("/cancel");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="fixed inset-0 bg-white flex justify-center items-center">
          <div className="loader">
            {" "}
            <ClipLoader
              color="#0CBF66"
              loading={isLoading}
              size={45}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        </div>
      )}
      <div className="flex items-center m-2.5">
        <button onClick={handleGoBack} className="flex items-center">
          <ArrowBackIosIcon />
        </button>
        <h6 className="text-lg font-bold">Thanh toán</h6>
      </div>
      <div className="container">
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
                      <Banking />
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
                      <Wallet />
                    </div>
                    <span className="text-lg">Ví điện tử</span>
                  </div>
                </label>
              </div>
            </fieldset>
          </form>
        </div>
        {!isLoading && (
          <div className="fixed bottom-0 left-0 right-0 w-full">
            <div className="flex flex-col mt-4 px-2 pt-4 pb-1 shadow-lg bg-white rounded-t-2xl">
              <button
                className="bg-green-500 font-bold text-white  py-2.5  mb-2 rounded-xl hover:bg-green-600 transition-colors"
                onClick={handleCheckout}
              >
                Thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
