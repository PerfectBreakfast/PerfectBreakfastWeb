import React from "react";

const SupplierFoodAssigmentStatus = ({ status }) => {
  let statusText;
  let styleClass;

  switch (status) {
    case "Pending":
      statusText = "Chờ xác nhận";
      styleClass =
        "border-1 border-yellow-500 hover:bg-yellow-50  text-yellow-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Confirmed":
      statusText = "Đã xác nhận";
      styleClass =
        "border-1 border-blue-500 hover:bg-blue-50  text-blue-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Declined":
      statusText = "Đã từ chối";
      styleClass =
        "border-1 border-red-500 hover:bg-red-50  text-red-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Completed":
      statusText = "Hoàn thành";
      styleClass =
        "border-1 border-green-500 hover:bg-green-50  text-green-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    default:
      statusText = "Không xác định";
      styleClass =
        "border-1 border-gray-500 hover:bg-gray-50  text-gray-500 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
  }

  return <span className={`${styleClass}`}>{statusText}</span>;
};

export default SupplierFoodAssigmentStatus;
