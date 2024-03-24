import React from "react";

const DailyOrderStatusDelivery = ({ status }) => {
  let statusText;
  let styleClass;

  switch (status) {
    case "Initial":
      statusText = "Chờ đặt đơn";
      styleClass =
        "bg-1 bg-gray-500 text-white text-sm font-semibold   px-2.5 py-0.5 rounded";
      break;
    case "Processing":
      statusText = "Đang chờ phân phối";
      styleClass =
        "bg-1 bg-amber-500 text-white text-sm font-semibold   px-2.5 py-0.5 rounded";
      break;
    case "Cooking":
      statusText = "Đang nấu";
      styleClass =
        "bg-1 bg-yellow-500 text-white  text-sm font-semibold   px-2.5 py-0.5 rounded";
      break;
    case "Waiting":
      statusText = "Đang chờ giao hàng";
      styleClass =
        "bg-1 bg-blue-500 text-white  text-sm font-semibold   px-2.5 py-0.5 rounded";
      break;
    case "Delivering":
      statusText = "Đang giao hàng";
      styleClass =
        "bg-1 bg-indigo-500 text-white  text-sm font-semibold   px-2.5 py-0.5 rounded";
      break;
    case "Complete":
      statusText = "Hoàn thành";
      styleClass =
        "bg-1 bg-green-500 htext-white  text-sm font-semibold   px-2.5 py-0.5 rounded";
      break;
    default:
      statusText = "Không xác định";
      styleClass =
        "bg-1 bg-red-500 text-white  text-sm font-semibold   px-2.5 py-0.5 rounded";
  }

  return <span className={`${styleClass}`}>{statusText}</span>;
};

export default DailyOrderStatusDelivery;
