import React from "react";

const DailyOrderStatus = ({ status }) => {
  let statusText;
  let styleClass;

  switch (status) {
    case "Initial":
      statusText = "Chờ đặt đơn";
      styleClass =
        "border-1 border-gray-500 hover:bg-gray-50  text-gray-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Processing":
      statusText = "Đang chờ phân phối";
      styleClass =
        "border-1 border-amber-500 hover:bg-amber-50  text-amber-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Cooking":
      statusText = "Đang nấu";
      styleClass =
        "border-1 border-yellow-500 hover:bg-yellow-50  text-yellow-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Waiting":
      statusText = "Đang chờ giao hàng";
      styleClass =
        "border-1 border-blue-500 hover:bg-blue-50  text-blue-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Delivering":
      statusText = "Đang giao hàng";
      styleClass =
        "border-1 border-indigo-500 hover:bg-indigo-50  text-indigo-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Complete":
      statusText = "Hoàn thành";
      styleClass =
        "border-1 border-green-500 hover:bg-green-50  text-green-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    default:
      statusText = "Không xác định";
      styleClass =
        "border-1 border-red-500 hover:bg-red-50  text-red-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
  }

  return <span className={`${styleClass}`}>{statusText}</span>;
};

export default DailyOrderStatus;
