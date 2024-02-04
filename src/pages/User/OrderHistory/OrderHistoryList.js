import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderAPI from "../../../services/orderAPI";
import { toast } from "react-toastify";
import { Card, CardContent, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import comboImg from "../../../assets/images/combo.png";

const OrderHistoryList = () => {
  const [historyData, setHistoryData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const data = await orderAPI.getOrderHistory();
        setHistoryData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchOrderHistory();
  }, []);
  const handleGoBack = () => {
    navigate(-1);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Đang xử lý":
        return "text-yellow-500";
      case "Paid":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };
  const handleOrderClick = (orderId) => {
    // Assuming your detail page route is '/detail/:orderId'
    const detailPageUrl = `detail/${orderId}`;
    navigate(detailPageUrl);
  };

  return (
    <div className="flex flex-col max-w-md mx-auto px-4 py-4">
      <div className="flex items-center">
        <button onClick={handleGoBack} className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold mb-4">Lịch sử đơn hàng</h1>
      </div>

      {historyData &&
        historyData.map((order) => (
          <div
            key={order.id}
            className="mb-4 p-4 bg-white rounded-lg shadow cursor-pointer"
            onClick={() => handleOrderClick(order.id)}
          >
            <div className="flex ">
              <img src={comboImg} alt="Combo" className="w-16 h-16 mr-4" />
              <div className="flex-1">
                <div className="flex">
                  <h2 className="font-medium text-lg mr-2">
                    {order.companyName}
                  </h2>
                  <div className=" text-right ">
                    <span className=" font-medium">
                      {order.totalPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                </div>

                <p
                  className={`${getStatusColor(
                    order.orderStatus
                  )} font-semibold`}
                >
                  {order.orderStatus}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <p>
                    {new Date(order.creationDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}{" "}
                    {new Date(order.creationDate).toLocaleDateString()}
                  </p>
                  <span className="mx-2">•</span>
                  <p>{order.comboCount} món</p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default OrderHistoryList;
