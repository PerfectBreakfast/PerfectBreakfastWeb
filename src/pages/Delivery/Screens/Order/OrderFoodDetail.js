import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DailyOrderAPI from "../../../../services/DailyOrderAPI";
import userAPI from "../../../../services/userAPI";
import ShipperSelectModal from "./ShipperSelectModal";
import ShippingOrderAPI from "../../../../services/ShippingOrderAPI";
import { toast } from "react-toastify";
import dishAPI from "../../../../services/dishAPI";

const OrderFoodDetail = () => {
  const { dailyOrderId } = useParams();

  const [orderData, setOrderData] = useState(null);
  const [shipperData, setShipperData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await dishAPI.getDailyOrderDetailByDelivery(dailyOrderId);
        setOrderData(data);
      } catch (error) {
        console.error("Error fetching dish data:", error);
      }
    };

    const fetchShipper = async () => {
      try {
        const data = await userAPI.getDeliveryStaff();
        setShipperData(data);
      } catch (error) {
        console.error("Error fetching dish data:", error);
      }
    };
    fetchOrderDetail();
    fetchShipper();
  }, [dailyOrderId]);

  const handleSubmitShipper = async (shipperIds) => {
    if (orderData && shipperIds.length) {
      try {
        await ShippingOrderAPI.assignOrderForShipper({
          dailyOrderId: orderData.id,
          shipperIds, // Sửa đổi này phản ánh API mới
        });
        toast.success("Thêm người giao hàng thành công!");
      } catch (error) {
        console.error("Error submitting shippers:", error);
        toast.error(error.errors);
      }
    }
    setIsModalOpen(false); // Đóng modal sau khi submit
  };

  console.log("shipper", shipperData);
  const LoadingSkeleton = () => (
    <div className="mt-6 w-5/6 mx-auto animate-pulse">
      <div className="space-y-4">
        <div className="h-8 bg-gray-300 rounded-md w-3/4"></div>
        <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
          <div className="p-6 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>

        <div className="h-6 bg-gray-300 rounded-md w-1/2"></div>
        <div className="overflow-x-auto mt-2">
          <div className="w-full mb-4">
            <div className="bg-gray-200 rounded-t-lg h-6 w-full"></div>
            <div className="space-y-2 pt-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between space-x-4 p-2">
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const renderOrderStatus = (status) => {
    let statusText;
    let colorClass;

    switch (status) {
      case "Initial":
        statusText = "Chờ xử lý";
        colorClass = "text-gray-500"; // Màu xám
        break;
      case "Processing":
        statusText = "Đang xử lý";
        colorClass = "text-yellow-500"; // Màu vàng
        break;
      case "Complete":
        statusText = "Hoàn thành";
        colorClass = "text-green-500"; // Màu xanh lá
        break;
      default:
        statusText = "Không xác định";
        colorClass = "text-gray-500";
    }

    return <span className={`${colorClass}`}>{statusText}</span>;
  };
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">Đơn hàng</h2>

      <div className="flex justify-end items-center">
        {orderData &&
          orderData.totalFoodResponses &&
          orderData.totalFoodResponses.length > 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-2xl bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-3 py-2.5 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            >
              Chọn người giao hàng
            </button>
          )}
      </div>

      {orderData ? (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          <p className="mb-2">
            Tên công ty:
            <span className="font-bold"> {orderData.companyName}</span>
          </p>
          <p className="mb-2">
            Số điện thoại<span className="font-bold"> {orderData.phone}</span>
          </p>
          <p className="mb-2">
            Bữa ăn:<span className="font-bold"> {orderData.meal}</span>
          </p>
          <p className="mb-2">
            Bữa ăn:
            <span className="font-bold">
              {" "}
              {""}
              {renderOrderStatus(orderData.status)}
            </span>
          </p>
          <h2 className="text-xl font-semibold mb-3">Chi tiết đơn hàng</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Tên món ăn</th>
                <th className="py-3 px-6 text-right">Số lượng</th>
              </tr>
            </thead>
            {orderData.totalFoodResponses &&
            orderData.totalFoodResponses.length > 0 ? (
              <tbody className="text-gray-600 text-sm font-light">
                {orderData.totalFoodResponses.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap font-bold">
                      {item.name}
                    </td>
                    <td className="py-3 px-6 text-right">
                      {item.quantity} món
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-3 px-6">
                  Không có món ăn
                </td>
              </tr>
            )}{" "}
          </table>
        </div>
      ) : (
        <LoadingSkeleton />
      )}
      {isModalOpen && (
        <ShipperSelectModal
          shipperData={shipperData}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitShipper}
        />
      )}
    </div>
  );
};

export default OrderFoodDetail;
