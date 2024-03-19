import React, { useEffect, useState } from "react";
import "../Homepage/Homepage.css";
import food from "../../../assets/images/logo.png";
import { Button } from "@mui/material";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import menuAPI from "../../../services/menuAPI";
import { useNavigate } from "react-router-dom";
import UserHeader from "../../Header/Header";
import MobileNavigation from "../../Footer/Footer";
import HomepageSkeleton from "./HomepageSkeleton";
import moment from "moment";

const Homepage = () => {
  const navigate = useNavigate();

  const [menuData, setMenuData] = useState(null);
  const [formattedMenuDate, setFormattedMenuDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleComboClick = (comboId) => {
    navigate(`combo/${comboId}`);
  };
  const handleFoodClick = (foodId) => {
    navigate(`food/${foodId}`);
  };

  const formatDate = (dateString) => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(5, 7);
    const day = dateString.substring(8, 10);
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menu = await menuAPI.getMenu();

        setMenuData(menu);
        const menuDate = formatDate(menu.menuDate);
        setFormattedMenuDate(menuDate);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <>
      <UserHeader />
      <div className="container mx-auto p-2 mb-12">
        {loading ? (
          // Hiển thị skeleton loaders trong quá trình tải dữ liệu
          <div className="space-y-4">
            {Array.from({ length: 10 }, (_, index) => (
              <HomepageSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          // Hiển thị thông báo lỗi nếu có
          <div className="text-center mt-4 font-bold">
            <p>Hiện tại không có món ăn</p>
          </div>
        ) : (
          <>
            <div className="menuDate text-left text-xl font-bold">
              <h6 className="text-green-600">
                Thực đơn ngày {formattedMenuDate}
              </h6>
            </div>
            <h6 className="text-gray-600 font-bold text-lg">Combo</h6>
            {menuData.comboFoodResponses.map((combo) => (
              <div className=" grid grid-cols-1 gap-4 mb-3">
                <div
                  className="border-1 border-gray-200 flex flex-row items-center p-3 shadow-md rounded-lg h-24 bg-gray-50"
                  key={combo.id}
                  onClick={() => handleComboClick(combo.id)}
                >
                  <div className=" flex-shrink-0">
                    <img
                      src={combo.image}
                      alt={combo.name}
                      className="h-16 w-16 rounded-xl"
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
              </div>
            ))}
            <h6 className="text-gray-600 font-bold text-lg">Món ăn</h6>
            {menuData.foodResponses.map((food) => (
              <div className=" grid grid-cols-1 gap-4 mb-3">
                <div
                  className="border-1 border-gray-200 flex flex-row items-center p-3 shadow-md rounded-lg h-24 bg-gray-50"
                  key={food.id}
                  onClick={() => handleFoodClick(food.id)}
                >
                  <div className=" flex-shrink-0">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="h-16 w-16 rounded-xl"
                    />
                  </div>
                  <div className=" flex-grow px-4">
                    <h5 className="text-lg font-bold">{food.name}</h5>
                  </div>
                  <div className=" text-lg font-bold">
                    <h5>
                      {food.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </h5>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <MobileNavigation />
    </>
  );
};

export default Homepage;
