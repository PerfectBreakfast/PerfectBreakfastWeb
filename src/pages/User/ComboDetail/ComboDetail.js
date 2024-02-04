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
      image: comboData.image,
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
    <div class="relative">
      <div className="mt-2 flex justify-between">
        <div className="container flex items-center">
          <button onClick={handleGoBack} className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-xl font-semibold mb-4">Chi tiết món ăn</h1>
        </div>
      </div>

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-lg">
        <div class="max-h-64 w-full mt-2 border-2 border-white rounded-xl shadow-md overflow-hidden">
          <img
            id="imgDetail"
            class="w-full object-cover"
            height="250"
            src={comboData.image}
            alt={comboData.name}
          />
        </div>

        <div class="text-center mt-5">
          <h4 class="text-2xl font-bold mb-2">{comboData.name}</h4>
          <h6 class="text-xl font-semibold mb-2">
            {comboData.comboPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </h6>
          <p class="text-base">{comboData.content}</p>

          <div class="mb-5 fixed bottom-0 left-0 w-full bg-white ">
            <div class="flex items-center justify-center py-2.5 space-x-2">
              <button
                aria-label="remove"
                class="text-red-500"
                onClick={handleDecrement}
              >
                <RemoveIcon />
              </button>

              <span class="px-1 text-base">{quantity}</span>

              <button
                class="text-green-500"
                aria-label="add"
                onClick={handleIncrement}
              >
                <AddIcon />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              class="bg-green-500 text-white py-2 px-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 w-5/6 rounded-3xl"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ComboDetail;
