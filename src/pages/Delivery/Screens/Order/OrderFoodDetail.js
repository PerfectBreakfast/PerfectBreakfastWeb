import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import DailyOrderAPI from "../../../../services/DailyOrderAPI";

const OrderFoodDetail = () => {
  const { companyId } = useParams();
  const [searchParams] = useSearchParams();
  const bookingDate = searchParams.get("bookingDate");

  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await DailyOrderAPI.getDailyOrderDetailByCompany(
          companyId,
          bookingDate
        );
        setOrderData(data);
      } catch (error) {
        console.error("Error fetching dish data:", error);
      }
    };

    fetchOrderDetail();
  }, [companyId, bookingDate]);
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-300 h-6 w-3/4 mb-4 rounded"></div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-gray-300 h-4 rounded"></div>
        ))}
      </div>
      <div className="mt-4">
        <div className="bg-gray-300 h-6 w-1/2 mb-3 rounded"></div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <div className="bg-gray-300 h-4 rounded col-span-1"></div>
              <div className="bg-gray-300 h-4 rounded col-span-1"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">Đơn hàng</h2>
      {orderData ? (
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="mb-2">
            Ngày đặt:<span className="font-bold"> {orderData.bookingDate}</span>{" "}
          </p>
          <p className="mb-2">
            Công ty:<span className="font-bold"> {orderData.companyName}</span>{" "}
          </p>
          <p className="mb-2">
            Số điện thoại:{" "}
            <span className="font-bold"> {orderData.phoneNumber}</span>
          </p>
          <p className="mb-4">
            Trạng thái: <span className="font-bold"> {orderData.status}</span>
          </p>
          <h2 className="text-xl font-semibold mb-3">Chi tiết đơn hàng</h2>
          {orderData.totalFoodResponses.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Tên món ăn</th>
                  <th className="py-3 px-6 text-right">Số lượng</th>
                </tr>
              </thead>
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
            </table>
          ) : (
            <p className="text-center text-gray-500">Không có đơn hàng</p>
          )}
        </div>
      ) : (
        <LoadingSkeleton />
      )}
    </div>
  );
};

export default OrderFoodDetail;
