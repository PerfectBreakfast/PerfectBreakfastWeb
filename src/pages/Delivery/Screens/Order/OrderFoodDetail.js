import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DailyOrderAPI from "../../../../services/DailyOrderAPI";
import userAPI from "../../../../services/userAPI";
import ShipperSelectModal from "./ShipperSelectModal";
import ShippingOrderAPI from "../../../../services/ShippingOrderAPI";
import { toast } from "react-toastify";
import dishAPI from "../../../../services/dishAPI";
import DailyOrderStatusText from "../../../../components/Status/DailyOrderStatusText";

const OrderFoodDetail = () => {
  const { dailyOrderId } = useParams();

  const [orderData, setOrderData] = useState(null);
  const [shipperData, setShipperData] = useState(null);
  const [staffData, setStaffData] = useState(null);

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
    fetchStaffByOder();
    fetchShipper();
  }, [dailyOrderId]);

  const fetchStaffByOder = async () => {
    try {
      const data = await ShippingOrderAPI.getStaffByDailyOrder(dailyOrderId);
      setStaffData(data);
    } catch (error) {
      console.error("Error fetching dish data:", error);
    }
  };
  const handleSubmitShipper = async (shipperIds) => {
    if (orderData && shipperIds.length) {
      try {
        await ShippingOrderAPI.assignOrderForShipper({
          dailyOrderId: dailyOrderId,
          shipperIds, // Sửa đổi này phản ánh API mới
        });
        fetchStaffByOder();
        toast.success("Thêm người giao hàng thành công!");
      } catch (error) {
        console.error("Error submitting shippers:", error);
        toast.error(error.errors);
      }
    }
    setIsModalOpen(false); // Đóng modal sau khi submit
  };

  console.log("shipper", staffData);
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">Đơn hàng</h2>

      <div className="flex justify-end items-center">
        {orderData &&
          orderData.totalFoodResponses &&
          orderData.totalFoodResponses.length > 0 && (
            <button onClick={() => setIsModalOpen(true)} className="btn-add">
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
            Trạng thái:
            <span className="font-bold">
              {""} <DailyOrderStatusText status={orderData.status} />
            </span>
          </p>
          <h2 className="text-xl font-semibold mb-3 mt-3">
            Nhân viên giao hàng
          </h2>
          <table className="min-w-full table-auto mb-4">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Hình ảnh</th>
                <th className="py-3 px-6 ">Tên nhân viên</th>
                <th className="py-3 px-6 ">Email</th>
                <th className="py-3 px-6 text-right">Số điện thoại</th>
              </tr>
            </thead>
            {staffData && staffData.length > 0 ? (
              <tbody className="text-gray-600 text-sm font-light">
                {staffData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="display-img-user"
                    />
                    <td className="py-3 px-6 text-left whitespace-nowrap font-bold">
                      {item.name}
                    </td>
                    <td className="py-3 px-6 text-left">{item.email}</td>
                    <td className="py-3 px-6 text-right">{item.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-3 px-6">
                  Chưa có nhân viên giao hàng
                </td>
              </tr>
            )}{" "}
          </table>
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
