import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import orderAPI from "../../../services/orderAPI";
import UserHeader from "../../Header/Header";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const MomoReturn = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderCode = queryParams.get("orderCode");
  const resultCode = queryParams.get("resultCode");
  const isSuccess = resultCode === "0";
  useEffect(() => {
    const handleCancel = async () => {
      try {
        const result = await orderAPI.cancelOrder(orderCode);
        console.log("Order canceled:", result);
      } catch (error) {
        console.error("Error canceling order:", error);
      }
    };

    if (resultCode !== "0") {
      handleCancel();
    }
  }, [resultCode]);

  return (
    <>
      <UserHeader />
      {isSuccess ? (
        <div className="payment-success-container">
          <CheckCircleIcon color="success" id="iconSuccess" />
          <h2 className="text-green-500 font-bold text-lg">
            Thanh toán thành công
          </h2>
          <p>
            Đơn hàng đã thanh toán thành công, vui lòng kiểm tra lại trong giỏ
            hàng.
          </p>
          <Link to="/user/menu">
            <button className="bg-green-500 text-white py-2 px-2.5 rounded-xl hover:bg-green-700 transition-colors mt-2">
              Quay về trang chủ
            </button>
          </Link>
        </div>
      ) : (
        <div className="payment-cancel-container">
          <CancelIcon color="error" id="iconCancel" />
          <h2 className="text-red-500 font-bold text-lg">
            Thanh toán thất bại
          </h2>
          <p>Đơn hàng của quý khách không thể hoàn tất thanh toán.</p>
          <Link to="/user/menu">
            <button className="bg-red-500 text-white py-2 px-2.5 rounded-xl hover:bg-red-700 transition-colors mt-2">
              Quay về trang chủ
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default MomoReturn;
