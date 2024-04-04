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
      <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          {orderData ? (
            <>
              <div className="bg-white rounded-xl p-4 mb-4">
                {" "}
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
              </div>
              <div className="bg-white rounded-xl p-4 mb-4">
                <p className="text-xl font-semibold text-gray-600 text-left mb-2">
                  {" "}
                  Chi tiết món ăn
                </p>
                <div className="flex justify-between items-center mb-3">
                  {orderData &&
                    orderData.totalFoodResponses &&
                    orderData.totalFoodResponses.length > 0 &&
                    orderData.status === "Processing" && (
                      <button
                        onClick={() => handleAssignFood()}
                        className="btn-add"
                      >
                        Chọn nhà cung cấp
                      </button>
                    )}
                </div>

                <div className="overflow-x-auto max-h-96 mt-2">
                  <table className="w-full table-auto mb-4">
                    <thead className="sticky top-0">
                      <tr className="bg-gray-200 text-gray-800 leading-normal">
                        <th className="py-2.5 px-6 text-left">Tên món ăn</th>
                        <th className="py-2.5 px-6 text-left">Chi tiết</th>
                        <th className="py-2.5 px-6 text-right">Số lượng món</th>
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
                            <td className="py-2.5 px-6 text-left whitespace-nowrap font-bold">
                              {item.name}
                            </td>
                            <td className="py-2.5 px-6 text-left whitespace-nowrap">
                              {item.foodName}
                            </td>
                            <td className="py-2.5 px-6 text-right">
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
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default OrderDetailByCompany;
