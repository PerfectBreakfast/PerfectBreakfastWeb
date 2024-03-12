import React from "react";

const DailyOrderStatus = ({ status }) => {
  let statusText;
  let colorClass;

  switch (status) {
    case "Initial":
      statusText = "Chờ đặt đơn";
      colorClass = "text-gray-500";
      break;
    case "Processing":
      statusText = "Đang chờ phân phối";
      colorClass = "text-yellow-500";
      break;
    case "Cooking":
      statusText = "Đang nấu";
      colorClass = "text-yellow-500";
      break;
    case "Waiting":
      statusText = "Đang chờ giao hàng";
      colorClass = "text-yellow-500";
      break;
    case "Delivering":
      statusText = "Đang giao hàng";
      colorClass = "text-yellow-500";
      break;
    case "Complete":
      statusText = "Hoàn thành";
      colorClass = "text-green-500";
      break;
    default:
      statusText = "Không xác định";
      colorClass = "text-red-500";
  }

  return <span className={`${colorClass}`}>{statusText}</span>;
};

export default DailyOrderStatus;
