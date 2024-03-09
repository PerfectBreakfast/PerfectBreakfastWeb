import React from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import "../Footer/Footer.css";

const MobileNavigation = () => {
  const navigate = useNavigate(); // Initialize navigate function from react-router-dom
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    // Add logic to navigate to the corresponding page based on the selected value
    switch (newValue) {
      case 0:
        navigate("/home");
        break;
      case 1:
        navigate("/cart");
        break;
      case 2:
        navigate("/order-history");
        break;
      case 3:
        navigate("/notifications");
        break;
      case 4:
        navigate("/user");
        break;
      default:
        break;
    }
  };

  return (
    <div className="footerContainer">
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction icon={<HomeOutlinedIcon />} />
        <BottomNavigationAction icon={<ShoppingCartOutlinedIcon />} />
        <BottomNavigationAction icon={<HistoryOutlinedIcon />} />
        <BottomNavigationAction icon={<NotificationsNoneOutlinedIcon />} />
        <BottomNavigationAction icon={<AccountCircleOutlinedIcon />} />
      </BottomNavigation>
    </div>
  );
};

export default MobileNavigation;
