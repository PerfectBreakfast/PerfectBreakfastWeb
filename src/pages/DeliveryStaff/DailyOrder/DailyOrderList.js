import React, { useEffect, useState } from "react";
import StaffNavigation from "../BottomNavigation/BottomNavigation";
import UserHeader from "../../Header/Header";
import { useNavigate } from "react-router-dom";
import DailyOrderAPI from "../../../services/DailyOrderAPI"; // Assuming this remains unchanged
import ShippingOrderAPI from "../../../services/ShippingOrderAPI";
import HomepageSkeleton from "../../User/Homepage/HomepageSkeleton";

import { ReactComponent as DownIcon } from "../../../assets/icons/Square Alt  Arrow Down.svg";
import { ReactComponent as UpIcon } from "../../../assets/icons/Square Alt Arrow Up.svg";
import DailyOrderStatusDelivery from "../../../components/Status/DailyOrderStatusDelivery";

const DailyOrderList = () => {
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to current date

  const handleComboClick = (dailyOrderId) => {
    navigate(`${dailyOrderId}`);
    console.log(`Redirect to detail page for combo with id: ${dailyOrderId}`);
  };

  useEffect(() => {
    const fetchShippingOrder = async () => {
      try {
        const data = await ShippingOrderAPI.getShippingOrderForDeliveryStaff(
          selectedDate
        ); // Pass the selectedDate to API call

        setOrderData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(true);
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchShippingOrder();
    }
  }, [selectedDate]); // Effect runs on selectedDate change

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const convertTimeFormat = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  return (
    <>
      <UserHeader />
      <div className="container mx-auto p-2 mb-12">
        {/* Date Picker */}
        <div className="menuDate flex justify-between items-center">
          {/* Access bookingDate from the nested dailyOrder object */}
          <h6 className="text-green-600 text-xl font-bold">Đơn hàng</h6>
          <div className="mb-2">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="p-2 border rounded-lg"
            />
          </div>
        </div>
        {loading ? (
          <HomepageSkeleton />
        ) : !loading && (!orderData || orderData.length === 0) ? ( // Check if orderData is null or empty
          <div className="text-xl text-center mt-4 font-bold">
            <p>Không có đơn hàng cần giao</p>
          </div>
        ) : (
          <>
            {orderData.map((orderItem, orderIndex) => (
              <React.Fragment key={orderIndex}>
                {/* Since your data structure changed, you directly access the details of a single order */}
                <div
                  onClick={() => handleComboClick(orderItem.dailyOrder.id)} // Assuming you want to pass the id of the outer object now
                  className="grid grid-cols-1 gap-2 mb-3 bg-gray-100 p-4 rounded-lg shadow cursor-pointer"
                >
                  <div className="flex justify-between mb-2">
                    <div className="font-semibold">
                      Bữa ăn: {orderItem.dailyOrder.meal}
                    </div>
                    <div>
                      <DailyOrderStatusDelivery
                        status={orderItem.dailyOrder.status}
                      />
                    </div>
                  </div>
                  <div className="flex items-center font-bold ">
                    <UpIcon className="mr-1 " />
                    <span className="delivery-order-name">
                      Công ty nhận hàng: {orderItem.dailyOrder.partner.name}
                    </span>
                  </div>
                  <div className="ml-7 font-semibold text-gray-600">
                    Địa chỉ: {""}
                    {orderItem.dailyOrder.partner.address}
                  </div>
                  <div className="ml-7 font-semibold text-gray-600">
                    Thời gian nhận hàng: {""}
                    {convertTimeFormat(orderItem.dailyOrder.pickupTime)}
                  </div>

                  <div className="flex items-center font-bold">
                    <DownIcon className="mr-1 " />{" "}
                    <span className="delivery-order-name">
                      Công ty nhận hàng: {orderItem.dailyOrder.company.name}
                    </span>
                  </div>
                  <div className="ml-7 font-semibold text-gray-600">
                    {orderItem.dailyOrder.company.address}
                  </div>
                  <div className="ml-7 font-semibold text-gray-600">
                    Thời gian giao hàng: {""}
                    {convertTimeFormat(orderItem.dailyOrder.handoverTime)}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </>
        )}
      </div>
      <StaffNavigation />
    </>
  );
};

export default DailyOrderList;
