import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import HomeIcon from "../../assets/icons/Home.svg";
import HistoryIcon from "../../assets/icons/History.svg";
import CartIcon from "../../assets/icons/Cart Large Minimalistic.svg";
import UserIcon from "../../assets/icons/User Rounded.svg";
import "../Footer/Footer.css";

const MobileNavigation = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  const navigationItems = [
    { icon: HomeIcon, route: "/menu" },
    { icon: CartIcon, route: "/cart" },
    { icon: HistoryIcon, route: "/order-history" },
    { icon: UserIcon, route: "/user" },
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

export default MobileNavigation;
