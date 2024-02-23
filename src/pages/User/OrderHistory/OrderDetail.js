import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import orderAPI from "../../../services/orderAPI";
import QRCode from "qrcode.react";
import OrderDetailSkeleton from "./OrderDetailSkeleton";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchComboData = async () => {
      try {
        const data = await orderAPI.getOrderDetail(orderId);
        setOrderData(data);
      } catch (error) {
        console.error("Error fetching combo data:", error);
      }
    };

    fetchComboData();
  }, [orderId]);
  const handleGoBack = () => {
    navigate(-1);
  };
  if (!orderData) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 1 }, (_, index) => (
          <OrderDetailSkeleton key={index} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col max-w-md mx-auto px-4 py-4">
      {orderData && (
        <>
          <div className="flex justify-between">
            <div className="flex items-center">
              <button onClick={handleGoBack} className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
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
              <h1 className="text-xl font-semibold mb-4">Chi tiết đơn hàng</h1>
            </div>

            <span className="text-sm font-medium text-gray-500 py-1 px-3">
              #{orderData.orderCode}
            </span>
          </div>

          <div className=" rounded-lg mb-1">
            <h2 className="text-lg font-semibold mb-2">Tóm tắt đơn hàng</h2>
            {orderData.orderDetails.map((detail, index) => (
              <div
                key={index}
                className="bg-white shadow rounded-2xl p-3 mb-2 last:mb-0"
              >
                <div className="flex justify-between">
                  <div className="flex ">
                    <img
                      src={detail.image}
                      alt={detail.comboName}
                      className="h-20 w-20 object-cover rounded-lg mr-2"
                    />
                    <div>
                      <p className="font-medium">{detail.comboName}</p>
                      <p className="text-gray-500">{detail.foods}</p>
                      <p className=" text-gray-500">x {detail.quantity}</p>
                    </div>
                  </div>
                  <span className="text-green-500 font-semibold">
                    {detail.unitPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className=" mb-4">
            <div className="flex justify-between">
              <p className="text-gray-600">Trạng thái đơn hàng</p>
              <p className="text-green-500 font-semibold">
                {orderData.orderStatus}
              </p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-gray-600">Phương thức thanh toán</p>
              <p className="text-gray-600 font-semibold">Ngân hàng</p>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-gray-600">Tổng cộng</p>
              <p className="text-black font-bold">
                {orderData.totalPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
          </div>

          <div>
            <div className="flex justify-center">
              {" "}
              <QRCode value={`pb#${orderData.id}`} />
            </div>

            <div className="flex justify-center">
              {" "}
              <h2 className="text-lg font-semibold mt-3">Quét để nhận hàng</h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderDetail;
