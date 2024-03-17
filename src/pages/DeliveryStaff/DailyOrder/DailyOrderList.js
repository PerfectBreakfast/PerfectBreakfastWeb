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
  return (
    <>
      <UserHeader />
      <div className="container mx-auto p-2 mb-12">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 10 }, (_, index) => (
              <HomepageSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center mt-4 font-bold">
            <p>Không có đơn hàng cần giao</p>
          </div>
        ) : (
          <>
            <div className="menuDate text-left text-xl font-bold">
              <h6 className="text-green-600">Đơn hàng cần giao</h6>
            </div>
            {orderData.map((order, index) => (
              <div
                key={index}
                onClick={() => handleComboClick(order.dailyOrderId)}
                className="grid grid-cols-1 gap-2 mb-3 bg-gray-100 p-4 rounded-lg shadow cursor-pointer"
              >
                <div className="flex justify-between">
                  <p>Ngày giao: {order.bookingDate}</p>
                  <p>Thời gian: {order.deliveryTime}</p>
                  <p>Bữa giao: {order.meal}</p>
                </div>
                <h2 className="font-semibold">
                  Tên công ty: {order.companyName}
                </h2>
                <p>Địa chỉ: {order.address}</p>
                <p>Sđt: {order.phoneNumber}</p>
              </div>
            ))}
          </>
        )}
      </div>
      <StaffNavigation />
    </>
  );
};

export default DailyOrderList;
