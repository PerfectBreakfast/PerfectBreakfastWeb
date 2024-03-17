import React, { useEffect, useState } from "react";
import StaffNavigation from "../BottomNavigation/BottomNavigation";
import UserHeader from "../../Header/Header";
import { useNavigate } from "react-router-dom";
import DailyOrderAPI from "../../../services/DailyOrderAPI";
import ShippingOrderAPI from "../../../services/ShippingOrderAPI";
import HomepageSkeleton from "../../User/Homepage/HomepageSkeleton";

const DailyOrderList = () => {
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleComboClick = (dailyOrderId) => {
    navigate(`${dailyOrderId}`);
    console.log(`Redirect to detail page for combo with id: ${dailyOrderId}`);
  };

  useEffect(() => {
    const fetchShippingOrder = async () => {
      try {
        const data = await ShippingOrderAPI.getShippingOrderForDeliveryStaff();

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
  console.log("data", orderData);
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <>
      <UserHeader />
      <div className="container mx-auto p-2 mb-12">
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
            <p>Không có đơn hàng cần giao</p>
          </div>
        ) : (
          <>
            {orderData.map((dateGroup) => (
              <>
                <div className="menuDate text-left text-xl font-bold">
                  {/* Sử dụng dateGroup.bookingDate để hiển thị ngày giao */}
                  <h6 className="text-green-600">
                    Đơn hàng ngày {formatDate(dateGroup.bookingDate)}
                  </h6>
                </div>
                {dateGroup.totalFoodForCompanyResponses.map((order, index) => (
                  <div
                    key={index}
                    onClick={() => handleComboClick(order.dailyOrderId)}
                    className="grid grid-cols-1 gap-2 mb-3 bg-gray-100 p-4 rounded-lg shadow cursor-pointer"
                  >
                    <h2 className="font-bold">
                      Tên công ty: {order.companyName}
                    </h2>
                    <p>Địa chỉ: {order.address}</p>
                    <p>Sđt: {order.phoneNumber}</p>
                    <p>Thời gian giao hàng: {order.deliveryTime}</p>
                    {/* If you need to display food details, map over totalFoodResponses here */}
                  </div>
                ))}
              </>
            ))}
          </>
        )}
      </div>
      <StaffNavigation />
    </>
  );
};

export default DailyOrderList;
