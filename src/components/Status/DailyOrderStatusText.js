import React from "react";

const DailyOrderStatusText = ({ status }) => {
  let statusText;
  let styleClass;

  switch (status) {
    case "Initial":
      statusText = "Chờ đặt đơn";
      styleClass = "text-gray-500";
      break;
    case "Processing":
      statusText = "Đang chờ phân phối";
      styleClass = "text-amber-500";
      break;
    case "Divided":
      statusText = "Đang chờ xác nhận";
      styleClass = "text-orange-500";
      break;
    case "Cooking":
      statusText = "Đang nấu";
      styleClass = "text-yellow-500 text-sm";
      break;
    case "Waiting":
      statusText = "Đang chờ giao hàng";
      styleClass = "text-blue-500  ";
      break;
    case "Delivering":
      statusText = "Đang giao hàng";
      styleClass = "text-indigo-500  ";
      break;
    case "Complete":
      statusText = "Hoàn thành";
      styleClass = "text-green-500  ";
      break;
    default:
      statusText = "Không xác định";
      styleClass = "text-red-500  ";
  }

  return <span className={`${styleClass}`}>{statusText}</span>;
};

export default DailyOrderStatusText;
