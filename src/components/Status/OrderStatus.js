import React from "react";

const OrderStatus = ({ status }) => {
  let statusText;
  let styleClass;

  switch (status) {
    case "CancelledForOverdue":
      statusText = "Không lấy hàng";
      styleClass =
        "bg-red-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Paid":
      statusText = "Đã thanh toán";
      styleClass =
        "bg-blue-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Complete":
      statusText = "Thành công";
      styleClass =
        "bg-green-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    default:
      statusText = "Không xác định";
      styleClass =
        "bg-gray-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
  }

  return <span className={`${styleClass}`}>{statusText}</span>;
};

export default OrderStatus;
