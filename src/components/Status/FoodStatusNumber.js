import React from "react";

const FoodStatusNumber = ({ status }) => {
  let statusText;
  let styleClass;

  switch (status) {
    case 1:
      statusText = "Bán lẻ";
      styleClass = "text-gray-900";
      break;
    case 0:
      statusText = "Combo";
      styleClass = "text-gray-900";
      break;
    default:
      statusText = "Không xác định";
      styleClass = "text-red-500  ";
  }

  return <span className={`${styleClass}`}>{statusText}</span>;
};

export default FoodStatusNumber;
