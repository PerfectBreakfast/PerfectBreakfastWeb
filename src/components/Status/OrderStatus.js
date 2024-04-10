import React from "react";

const OrderStatus = ({ status }) => {
  let statusText;
  let styleClass;

  switch (status) {
    case "CancelledForOverdue":
      statusText = "Không lấy hàng";
      styleClass =
        "border-1 border-red-500 hover:bg-red-50  text-red-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Paid":
      statusText = "Đã thanh toán";
      styleClass =
        "border-1 border-blue-500 hover:bg-blue-50  text-blue-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Complete":
      statusText = "Thành công";
      styleClass =
        "border-1 border-green-500 hover:bg-green-50  text-green-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    default:
      statusText = "Không xác định";
      styleClass =
        "border-1 border-gray-500 hover:bg-gray-50  text-gray-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
  }

  return <span className={`${styleClass}`}>{statusText}</span>;
};

export default OrderStatus;
