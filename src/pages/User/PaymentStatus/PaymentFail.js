import React, { useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import "../PaymentStatus/Payment.css"; // Tạo một file CSS riêng để tùy chỉnh giao diện
import UserHeader from "../../Header/Header";
import MobileNavigation from "../../Footer/Footer";
import CancelIcon from "@mui/icons-material/Cancel";
import orderAPI from "../../../services/orderAPI";

const CancelPayment = () => {
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderCode = queryParams.get("orderCode");
    const handleCancel = async () => {
      try {
        const result = await orderAPI.cancelOrder(orderCode);
      } catch (error) {
        console.error("Error placing order:", error);
      }
    };

    handleCancel();
  }, []);
  return (
    <>
      <UserHeader />
      <div className="payment-cancel-container">
        <CancelIcon color="error" id="iconCancel" />
        <h2 className="text-red-500 font-bold text-lg">Thanh toán thất bại</h2>
        <p>Đơn hàng của quý khách không thể hoàn tất thanh toán.</p>
        <Link to="/menu">
          <button className="bg-red-500 text-white py-2 px-2.5 rounded-xl hover:bg-red-700 transition-colors mt-2">
            Quay về trang chủ
          </button>
        </Link>
      </div>
    </>
  );
};

export default CancelPayment;
