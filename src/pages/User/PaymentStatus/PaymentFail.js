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
          <Button id="confirmBtn" variant="contained" color="primary">
            Quay về trang chủ
          </Button>
        </Link>
      </div>
    </>
  );
};

export default CancelPayment;
