import React from "react";

const SupplierFoodAssigmentStatus = ({ status }) => {
  let statusText;
  let styleClass;

  switch (status) {
    case "Pending":
      statusText = "Chờ xác nhận";
      styleClass =
        "bg-yellow-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Confirmed":
      statusText = "Đã xác nhận";
      styleClass =
        "bg-blue-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Declined":
      statusText = "Đã từ chối";
      styleClass =
        "bg-red-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    case "Complete":
      statusText = "Hoàn thành";
      styleClass =
        "bg-green-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
    default:
      statusText = "Không xác định";
      styleClass =
        "bg-gray-500 text-white hover:shadow-xl cursor-pointer text-sm font-semibold mr-2 px-2.5 py-0.5 rounded";
      break;
  }

  return <span className={`${styleClass}`}>{statusText}</span>;
};

export default SupplierFoodAssigmentStatus;
