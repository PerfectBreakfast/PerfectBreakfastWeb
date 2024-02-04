import React, { useEffect, useState } from "react";
import "../Homepage/Homepage.css";
import food from "../../../assets/images/logo.png";
import { Button } from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import menuAPI from "../../../services/menuAPI";
import { useNavigate } from "react-router-dom";
import UserHeader from "../../Header/Header";
import MobileNavigation from "../../Footer/Footer";

const Homepage = () => {
  const navigate = useNavigate();

  const [menuData, setMenuData] = useState(null);
  const handleComboClick = (comboId) => {
    // Chuyển hướng đến trang chi tiết sản phẩm với id của combo
    // Thông qua các phương tiện chuyển hướng bạn đã sử dụng trong ứng dụng của mình
    // Ví dụ: sử dụng react-router-dom
    navigate(`/combo/${comboId}`);
    console.log(`Redirect to detail page for combo with id: ${comboId}`);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menu = await menuAPI.getMenu();
        setMenuData(menu);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, []);

  return (
    <>
      <UserHeader />
      <div style={{ paddingBottom: "4rem" }} className="container mx-auto p-4">
        <div className="menuDate text-left text-2xl font-bold">
          <h6>Thực đơn ngày 08/03/2024</h6>
        </div>
        <div
          style={{ paddingBottom: "4rem" }}
          className=" grid grid-cols-1 gap-4"
        >
          {menuData &&
            menuData.comboFoodResponses.map((combo) => (
              <div
                className=" flex flex-row items-center p-3 shadow-lg rounded-lg"
                key={combo.id}
                onClick={() => handleComboClick(combo.id)}
              >
                <div className=" flex-shrink-0">
                  <img
                    src={combo.image}
                    alt={combo.name}
                    className="h-12 w-12 rounded-xl"
                  />
                </div>
                <div className=" flex-grow px-4">
                  <h5 className="text-lg font-bold">{combo.name}</h5>
                  <p className="text-gray-600">{combo.foods}</p>
                </div>
                <div className=" text-lg font-bold">
                  <h5>
                    {combo.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </h5>
                </div>
              </div>
            ))}
        </div>
      </div>
      <MobileNavigation />
    </>
  );
};

export default Homepage;
