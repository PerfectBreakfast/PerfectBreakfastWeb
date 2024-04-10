import React from "react";

const DailyOrderStatus = ({ status }) => {
  let statusText;
  let styleClass;

  switch (status) {
    case "Initial":
      statusText = "Chờ đặt đơn";
      styleClass =
        "bg-gray-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Processing":
      statusText = "Chờ phân phối";
      styleClass =
        "bg-yellow-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Divided":
      statusText = "Chờ xác nhận";
      styleClass =
        "bg-orange-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Cooking":
      statusText = "Đang nấu";
      styleClass =
        "bg-amber-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Waiting":
      statusText = "Chờ lấy hàng";
      styleClass =
        "bg-blue-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Delivering":
      statusText = "Đang giao hàng";
      styleClass =
        "bg-indigo-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;

    case "Complete":
      statusText = "Hoàn thành";
      styleClass =
        "bg-green-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    default:
      statusText = "Không xác định";
      styleClass =
        "bg-red-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
  }

  return <span className={`${styleClass}`}>{statusText}</span>;
};

export default DailyOrderStatus;
