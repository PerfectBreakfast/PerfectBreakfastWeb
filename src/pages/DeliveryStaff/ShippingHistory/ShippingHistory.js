import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ShippingOrderAPI from "../../../services/ShippingOrderAPI";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const ShippingHistory = () => {
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchShippingOrder = async () => {
      try {
        const data =
          await ShippingOrderAPI.getShippingOrderHistoryForDeliveryStaff();

        setOrderData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchShippingOrder();
  }, []);
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto p-4">
      {" "}
      <div className="flex items-center mb-3">
        <button onClick={handleGoBack} className="">
          <ArrowBackIosIcon />
        </button>
        <h2 className="text-2xl font-bold  text-center">Lịch sử đơn hàng</h2>
      </div>
      {loading ? (
        <div className="space-y-4">
          {/* Skeleton cho tiêu đề ngày */}
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded-md w-3/4"></div>
          </div>

          {/* Lặp qua một số skeleton cho các đơn hàng */}
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="animate-pulse grid grid-cols-1 gap-2 mb-3 bg-gray-100 p-4 rounded-lg"
            >
              {/* Skeleton cho tên công ty */}
              <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
              {/* Skeleton cho địa chỉ */}
              <div className="h-4 bg-gray-300 rounded-md w-3/4"></div>
              {/* Skeleton cho số điện thoại */}
              <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
              {/* Skeleton cho thời gian giao hàng */}
              <div className="h-4 bg-gray-300 rounded-md w-1/4"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-xl text-center mt-4 font-bold">
          <p>Không có lịch sử đơn hàng</p>
        </div>
      ) : (
        orderData.length > 0 && (
          <div>
            {orderData.map((order, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-2 mb-3 bg-gray-100 p-4 rounded-lg shadow cursor-pointer"
              >
                <p>Thời gian giao hàng: {order.bookingDate}</p>
                <h2 className="font-bold">Tên công ty: {order.companyName}</h2>
                <p>Địa chỉ: {order.address}</p>
                <p>Bữa ăn: {order.meal}</p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default ShippingHistory;
