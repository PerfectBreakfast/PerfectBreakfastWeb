import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "../../assets/icons/Home.svg";
import HistoryIcon from "../../assets/icons/History.svg";
import CartIcon from "../../assets/icons/Cart Large Minimalistic.svg";
import UserIcon from "../../assets/icons/User Rounded.svg";

import "../Footer/Footer.css";
import { useCart } from "../../services/CartContext";

const MobileNavigation = () => {
  const navigate = useNavigate();
  const { cart } = useCart(); // Use the useCart hook to access the cart state
  const [value, setValue] = useState(0);

  // Calculate the total quantity of items in the cart
  const totalItems = cart.length;

  const navigationItems = [
    { icon: HomeIcon, route: "/menu" },
    { icon: CartIcon, route: "/cart", badgeContent: totalItems }, // Include totalItems here
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
          className={`flex flex-col items-center w-full relative ${
            index === value ? "text-blue-500" : "text-gray-700"
          }`}
          onClick={() => handleChange(index)}
        >
          <div className="relative">
            <img src={item.icon} alt="" className="w-6 h-6" />
            {item.badgeContent > 0 &&
              index === 1 && ( // Display the badge content only for the cart icon if there are items in the cart
                <span className="absolute -top-1 -right-1 text-xxs rounded-full bg-green-500 text-white p-custom font-bold">
                  {item.badgeContent}
                </span>
              )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default MobileNavigation;
