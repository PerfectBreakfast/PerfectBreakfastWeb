import React from "react";

const FoodStatusText = ({ status }) => {
  let statusText;
  let styleClass;

  switch (status) {
    case "Retail":
      statusText = "Bán lẻ";
      styleClass = "text-gray-900";
      break;
    case "Combo":
      statusText = "Combo";
      styleClass = "text-gray-900";
      break;
    default:
      statusText = "Không xác định";
      styleClass = "text-red-500  ";
  }

  return <span className={`${styleClass}`}>{statusText}</span>;
};

export default FoodStatusText;
