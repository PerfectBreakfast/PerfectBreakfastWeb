// ComboDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import comboAPI from "../../../services/comboAPI";
import food from "../../../assets/images/logo.png";
import "../ComboDetail/ComboDetail.css";
import { useCart } from "../../../services/CartContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ComboDetail() {
  const { id } = useParams();
  const [comboData, setComboData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Add this line

  useEffect(() => {
    const fetchComboData = async () => {
      try {
        const data = await comboAPI.getComboById(id);
        setComboData(data);
      } catch (error) {
        console.error("Error fetching combo data:", error);
      }
    };

    fetchComboData();
  }, [id]);

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(newQuantity);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    const itemToAdd = {
      id: comboData.id,
      name: comboData.name,
      quantity,
      price: comboData.comboPrice,
    };
    addToCart(itemToAdd);
    toast.success("Đã thêm món ăn vào giỏ hàng!");
    console.log(`Added ${quantity} ${comboData.name} to the cart`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!comboData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="comboDetail">
      <div>
        <IconButton onClick={handleGoBack} style={{ left: 10, top: 10 }}>
          <ArrowBackIosIcon />
        </IconButton>
      </div>

      <div className="container" item xs={12}>
        <div>
          <CardMedia
            id="imgDetail"
            component="img"
            height="250"
            image={comboData.image}
            alt={comboData.name}
          />
          <div className="detailContent">
            <Typography gutterBottom variant="h4">
              {comboData.name}
            </Typography>
            <Typography gutterBottom variant="h6">
              {comboData.comboPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Typography>
            <Typography variant="body1">{comboData.content}</Typography>

            <div className="actionDetail">
              <div className="updateQuantityDetail">
                {/* <Button variant="outlined" onClick={handleDecrement}>
                  -
                </Button> */}
                <div className="updateQuantity">
                  <IconButton
                    aria-label="remove"
                    color="error"
                    onClick={handleDecrement}
                  >
                    <RemoveIcon />
                  </IconButton>

                  <Typography className="quantityOrder" variant="body1">
                    {quantity}
                  </Typography>
                  {/* <Button variant="outlined" onClick={handleIncrement}>
                  +
                </Button> */}

                  <IconButton
                    color="success"
                    aria-label="add"
                    onClick={handleIncrement}
                  >
                    <AddIcon />
                  </IconButton>
                </div>
              </div>

              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                id="confirmBtn"
                size="large"
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" theme="colored" autoClose={250} />
    </div>
  );
}

export default ComboDetail;
