import React from "react";

const DailyOrderStatusDelivery = ({ status }) => {
  let statusText;
  let styleClass;

  switch (status) {
    case "Pending":
      statusText = "Đang chờ lấy hàng";
      styleClass =
        "bg-1 bg-amber-500 text-white text-sm font-semibold   px-2.5 py-0.5 rounded";
      break;
    case "Confirm":
      statusText = "Đang chờ giao hàng";
      styleClass =
        "bg-1 bg-blue-500 text-white  text-sm font-semibold   px-2.5 py-0.5 rounded";
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
