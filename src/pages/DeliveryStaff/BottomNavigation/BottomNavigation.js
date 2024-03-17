import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Import icons from your assets folder
import HomeIcon from "../../../assets/icons/Home.svg";
import HistoryIcon from "../../../assets/icons/History.svg";
import QRIcon from "../../../assets/icons/QR Code.svg";
import UserIcon from "../../../assets/icons/User Rounded.svg";

const StaffNavigation = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const navigationItems = [
    { icon: HomeIcon, route: "/staff/order" },
    { icon: HistoryIcon, route: "/staff/history" },
    { icon: QRIcon, route: "/staff/scan" },

    { icon: UserIcon, route: "/staff/setting" },
  ];

  const handleChange = (newValue) => {
    setValue(newValue);
    navigate(navigationItems[newValue].route);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center bg-gray-100 p-3">
      {navigationItems.map((item, index) => (
        <button
          key={index}
          className={`flex flex-col items-center w-full ${
            index === value ? "text-blue-500" : "text-gray-700"
          }`}
          onClick={() => handleChange(index)}
        >
          <img src={item.icon} alt="" className="w-6 h-6" />
        </button>
      ))}
    </div>
  );
};

export default StaffNavigation;
