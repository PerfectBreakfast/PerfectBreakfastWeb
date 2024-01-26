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
  const iconStyle = {
    color: "#0CBF66",
  };
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
      <div className="container">
        <div className="menuDate">
          <h6>Thực đơn ngày 19/01/2024</h6>
        </div>
        <div className="menu">
          {menuData &&
            menuData.comboFoodResponses.map((combo) => (
              <div
                className="combo"
                key={combo.id}
                onClick={() => handleComboClick(combo.id)}
              >
                <div className="imageCombo">
                  <img src={combo.image} alt="" className="img-combo-detail" />
                </div>
                <div className="contentCombo">
                  <h5>{combo.name}</h5>
                  <p className="detailcontentCombo">{combo.foods}</p>
                </div>
                <div className="order">
                  <h5>
                    {combo.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </h5>
                  {/* <div className="btnOrder">
                    <Button
                      id="orderButton"
                      disableRipple
                      startIcon={<AddCircleOutlinedIcon style={iconStyle} />}
                    />
                  </div> */}
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
