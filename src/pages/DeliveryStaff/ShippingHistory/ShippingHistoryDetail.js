import React, { useEffect, useState } from "react";
import orderAPI from "../../../services/orderAPI";
import { useNavigate, useParams } from "react-router-dom";
import OrderDetailSkeleton from "../../User/OrderHistory/OrderDetailSkeleton";
import { ClipLoader } from "react-spinners";

const ShippingHistoryDetail = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();
  const [formattedDate, setFormattedDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString) => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(5, 7);
    const day = dateString.substring(8, 10);
    return `${day}/${month}/${year}`;
  };
  useEffect(() => {
    const fetchComboData = async () => {
      try {
        const data = await orderAPI.getOrderDetail(id);
        setOrderData(data);
        const orderDate = formatDate(data.bookingDate);
        setFormattedDate(orderDate);
      } catch (error) {
        console.error("Error fetching combo data:", error);
      }
    };

    fetchComboData();
  }, [id]);
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
  const getStatusColorAndText = (status) => {
    switch (status) {
      case "Pending":
        return { color: "text-gray-500", text: "Chờ thanh toán" };
      case "Paid":
        return { color: "text-yellow-500", text: "Đã thanh toán" };
      case "Complete":
        return { color: "text-green-500", text: "Đã giao thành công" };
      case "Cancel":
        return { color: "text-red-500", text: "Đã hủy" };
      default:
        return { color: "text-gray-500", text: "Chưa xác định" };
    }
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col ">
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
                <h1 className="text-xl font-semibold mb-4">
                  Chi tiết đơn hàng
                </h1>
              </div>

              <span className="text-sm font-medium text-gray-500 py-1 px-3">
                #{orderData.orderCode}
              </span>
            </div>

            <div className=" rounded-lg mb-1">
              <h2 className="text-lg font-semibold mb-2">
                Thông tin nhận hàng
              </h2>
              <div className="bg-white shadow rounded-xl p-3 mb-3 last:mb-0">
                <p className="text-gray-600 mb-1">
                  Thời gian nhận hàng: {orderData.meal}, {formattedDate}
                </p>
                <p className="text-gray-600 mb-1">
                  Công ty: {orderData.company.name}
                </p>
                <p className="text-gray-600">
                  Địa chỉ: {orderData.company.address}
                </p>
              </div>
              <h2 className="text-lg font-semibold mb-2">Tóm tắt đơn hàng</h2>
              {orderData.orderDetails.map((detail, index) => (
                <div
                  key={index}
                  className="bg-white shadow rounded-xl p-3 mb-3 last:mb-0"
                >
                  <div className="flex justify-between">
                    <div className="flex ">
                      <img
                        src={detail.image}
                        alt={detail.comboName}
                        className="h-20 w-20 object-cover rounded-lg mr-2"
                      />
                      <div>
                        {detail.comboName !== "" ? (
                          <p className="user-food-name">{detail.comboName}</p>
                        ) : (
                          <p className="user-food-name">{detail.foods}</p>
                        )}
                        <p className=" text-gray-500">x {detail.quantity}</p>
                      </div>
                    </div>
                    <span className=" font-semibold">
                      {detail.unitPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShippingHistoryDetail;
