import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import dishAPI from "../../../../services/dishAPI";
import DailyOrderStatusText from "../../../../components/Status/DailyOrderStatusText";

const OrderDetailByCompany = () => {
  const { dailyOrderId } = useParams();

  const [orderData, setOrderData] = useState([]);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDailyOrderDetail = async () => {
      setIsLoading(true); // Bắt đầu loading
      try {
        const data = await dishAPI.getDailyOrderDetailById(dailyOrderId);
        setOrderData(data);
      } catch (error) {
        console.error("Error fetching dish data:", error);
      } finally {
        setIsLoading(false); // Kết thúc loading
      }
    };

    fetchDailyOrderDetail();
  }, [dailyOrderId]);
  console.log("id", dailyOrderId);
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <div className="space-y-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 bg-gray-300 rounded col-span-1"></div>
              <div className="h-4 bg-gray-300 rounded col-span-1"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 bg-gray-300 rounded col-span-1"></div>
              <div className="h-4 bg-gray-300 rounded col-span-1"></div>
            </div>
            {/* Repeat the above div for as many lines as you want to show in skeleton */}
          </div>
        </div>
      </div>
    </div>
  );

  const handleAssignFood = () => {
    navigate(`assign`);
  };

  console.log("dalyorder", orderData);
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold">Đơn hàng</h2>
      {isLoading ? ( // Sử dụng biến isLoading để quyết định hiển thị gì
        <LoadingSkeleton />
      ) : (
        <>
          <div className="flex justify-end items-center">
            {orderData &&
              orderData.totalFoodResponses &&
              orderData.totalFoodResponses.length > 0 && (
                <button onClick={() => handleAssignFood()} className="btn-add">
                  Phân món
                </button>
              )}
          </div>

          {orderData ? (
            <div className="bg-white shadow-md rounded-lg pb-4 pt-3 px-4 mb-4">
              <p className="mb-2">
                Tên công ty:
                <span className="font-bold"> {orderData.companyName}</span>
              </p>
              <p className="mb-2">
                Số điện thoại
                <span className="font-bold"> {orderData.phone}</span>
              </p>
              <p className="mb-2">
                Bữa ăn:<span className="font-bold"> {orderData.meal}</span>
              </p>
              <p className="mb-2">
                Trạng thái:
                <span className="font-bold">
                  {" "}
                  {""}
                  <DailyOrderStatusText status={orderData.status} />
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
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default OrderDetailByCompany;
