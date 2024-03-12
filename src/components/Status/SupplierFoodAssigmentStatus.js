import React from "react";

const SupplierFoodAssigmentStatus = ({ status }) => {
  let statusText;
  let colorClass;

  switch (status) {
    case "Pending":
      statusText = "Chờ xác nhận";
      colorClass = "text-yellow-500";
      break;
    case "Confirmed":
      statusText = "Đã xác nhận";
      colorClass = "text-blue-500";
      break;
    case "Declined":
      statusText = "Đã từ chối";
      colorClass = "text-red-500";
      break;
    case "Completed":
      statusText = "Hoàn thành";
      colorClass = "text-green-500";
      break;
    default:
      statusText = "Không xác định";
      colorClass = "text-red-500";
  }

  return <span className={`${colorClass}`}>{statusText}</span>;
};

export default SupplierFoodAssigmentStatus;
