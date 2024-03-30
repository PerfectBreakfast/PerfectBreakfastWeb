import React from "react";
import { useParams, Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import "../PaymentStatus/Payment.css"; // Tạo một file CSS riêng để tùy chỉnh giao diện
import UserHeader from "../../Header/Header";
import MobileNavigation from "../../Footer/Footer";

const PaymentSuccess = () => {
  // Lấy các tham số từ URL
  const { code, id, cancel, status, orderCode } = useParams();

  return (
    <>
      <UserHeader />
      <div className="payment-success-container">
        <CheckCircleIcon color="success" id="iconSuccess" />
        <h2 className="text-green-500 font-bold text-lg">
          Thanh toán thành công
        </h2>
        <p>
          Đơn hàng đã thanh toán thành công, vui lòng kiểm tra lại trong giỏ
          hàng.{" "}
        </p>
        <Link to="/user/menu">
          <button className="bg-green-500 text-white py-2 px-2.5 rounded-xl hover:bg-green-700 transition-colors mt-2">
            Quay về trang chủ
          </button>
        </Link>
      </div>
    </>
  );
};

export default PaymentSuccess;
