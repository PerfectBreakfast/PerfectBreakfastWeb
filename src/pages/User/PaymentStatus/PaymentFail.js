import React from "react";
import { useParams, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "../PaymentStatus/Payment.css"; // Tạo một file CSS riêng để tùy chỉnh giao diện
import UserHeader from "../../Header/Header";
import MobileNavigation from "../../Footer/Footer";
import CancelIcon from "@mui/icons-material/Cancel";

const CancelPayment = () => {
  // Lấy các tham số từ URL
  const { code, id, cancel, status, orderCode } = useParams();

  return (
    <>
      <UserHeader />
      <div className="payment-cancel-container">
        <CancelIcon color="error" id="iconCancel" />
        <h2>Thanh toán thất bại</h2>
        <p>Đơn hàng của quý khách không thể hoàn tất thanh toán. </p>
        <Link to="/home">
          <button className="bg-red-500 text-white p-2 rounded-3xl hover:bg-red-600 transition-colors mt-2">
            Quay về trang chủ
          </button>
        </Link>
      </div>
    </>
  );
};

export default CancelPayment;
