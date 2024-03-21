import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderAPI from "../../../services/orderAPI";
import { toast } from "react-toastify";

import comboImg from "../../../assets/images/combo.png";
import OrderHistoryListSkeleton from "./OrderHistoryListSkeleton";

const OrderHistoryList = () => {
  const [historyData, setHistoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Initialize isLoading as true
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const data = await orderAPI.getOrderHistory();
        if (data && data.length > 0) {
          setHistoryData(data);
        } else {
          setHistoryData([]); // Set historyData as an empty array if data is empty
        }
        setIsLoading(false); // Set isLoading to false after fetching data
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusColorAndText = (status) => {
    switch (status) {
      case "Pending":
        return { color: "text-gray-500", text: "Chờ thanh toán" };
      case "Paid":
        return { color: "text-yellow-500", text: "Đã thanh toán" };
      case "Completed":
        return { color: "text-green-500", text: "Đã giao thành công" };
      case "Cancel":
        return { color: "text-red-500", text: "Đã hủy" };
      default:
        return { color: "text-gray-500", text: "Chưa xác định" };
    }
  };

  const handleOrderClick = (orderId) => {
    const detailPageUrl = `detail/${orderId}`;
    navigate(detailPageUrl);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col">
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
        {isLoading ? (
          // Show skeleton when loading
          <OrderHistoryListSkeleton />
        ) : historyData && historyData.length > 0 ? (
          // Show order history if data exists

          historyData.map((order) => (
            <div
              key={order.id}
              className="mb-4 p-4 bg-white rounded-xl shadow cursor-pointer"
              onClick={() => handleOrderClick(order.id)}
            >
              <div className="flex">
                <img src={comboImg} alt="Combo" className="w-16 h-16 mr-4" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h2 className="font-medium text-lg mr-2">
                        {order.companyName}
                      </h2>
                    </div>

                    <div className="text-right mt-1">
                      <h2 className="font-medium">
                        {order.totalPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </h2>
                    </div>
                  </div>

                  <p
                    className={`${
                      getStatusColorAndText(order.orderStatus).color
                    } font-semibold`}
                  >
                    {getStatusColorAndText(order.orderStatus).text}
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
          ))
        ) : (
          // Show message when there is no data
          <div className="text-center mt-2 font-bold">
            <p>Bạn chưa đặt món ăn nào!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryList;
