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

  const [activeTab, setActiveTab] = useState("combo");

  const toggleActiveTab = (tab) => {
    setActiveTab(tab);
  };

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
            <div className="flex border-b">
              <button
                className={`flex-1 p-2 text-bold ${
                  activeTab === "combo"
                    ? "text-green-500 border-b-2 font-bold border-green-500"
                    : "text-gray-500"
                }`}
                onClick={() => toggleActiveTab("combo")}
              >
                Combo
              </button>
              <button
                className={`flex-1 p-2 text-bold ${
                  activeTab === "food"
                    ? "text-green-500 border-b-2 font-bold border-green-500"
                    : "text-gray-500"
                }`}
                onClick={() => toggleActiveTab("food")}
              >
                Món lẻ
              </button>
            </div>

            <div className="menuDate text-left text-xl font-bold">
              <h6 className="text-green-500">
                Thực đơn ngày {formattedMenuDate}
              </h6>
            </div>

            <>
              {" "}
              {activeTab === "combo" &&
                menuData.comboFoodResponses.map((combo) => (
                  <div className=" grid grid-cols-1 gap-4 mb-3">
                    <div
                      className="bg-white rounded-xl shadow flex flex-row p-3 h-24 cursor-pointer"
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

                      <div className="flex flex-row items-start justify-between w-full">
                        {" "}
                        <div className="px-2.5">
                          <h5 className="user-combo-name ">{combo.name}</h5>
                          <p className="text-gray-600">{combo.foods}</p>
                        </div>
                        <div className=" text-lg font-semibold mt-1 ">
                          <h5>
                            {combo.price.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {activeTab === "food" &&
                menuData.foodResponses.map((food) => (
                  <div className=" grid grid-cols-1 gap-4 mb-3">
                    <div
                      className="bg-white rounded-xl shadow flex flex-row p-3 h-24 cursor-pointer"
                      key={food.id}
                      onClick={() => handleFoodClick(food.id)}
                    >
                      <div className="flex-shrink-0 items-center">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="h-16 w-16 rounded-xl"
                        />
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="flex-grow px-2.5">
                          <h5 className="user-food-name ">{food.name}</h5>
                        </div>
                        <div className="mt-1 text-right text-lg font-semibold">
                          <h5>
                            {food.price.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </>
          </>
        )}
      </div>
      <MobileNavigation />
    </>
  );
};

export default Homepage;
