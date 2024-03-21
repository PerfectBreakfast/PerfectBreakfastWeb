import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import comboAPI from "../../../services/comboAPI";

import "../ComboDetail/ComboDetail.css";
import { useCart } from "../../../services/CartContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ComboDetailSkeleton from "./ComboDetailSkeleton";
import { ReactComponent as Check } from "../../../assets/icons/check.svg";
import { ReactComponent as BackIcon } from "../../../assets/icons/back-arrow.svg";

function ComboDetail() {
  const { id } = useParams();
  const [comboData, setComboData] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [showPopup, setShowPopup] = useState(false);

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
      type: "combo",
    };
    addToCart(itemToAdd);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate(-1); // Quay lại màn hình trước sau khi pop-up ẩn
    }, 500); // Ẩn pop-up sau 1 giây
  };

  const totalPrice = comboData ? comboData.comboPrice * quantity : 0;
  const formattedTotalPrice = totalPrice.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!comboData) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 1 }, (_, index) => (
          <ComboDetailSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <>
      {showPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 bg-white bg-opacity-75">
          <div className="text-white p-3 rounded-lg shadow-lg bg-black bg-opacity-50 flex flex-col items-center">
            <div className="flex items-center">
              <Check className="w-9" />
            </div>
            <div className="flex items-center">
              <p className="ml-2">Đã thêm vào giỏ!</p>
            </div>
          </div>
        </div>
      )}
      <div class="relative">
        <div className="mt-2 flex justify-between">
          <div className="container flex items-center">
            <button onClick={handleGoBack} className="mb-4">
              <BackIcon />
            </button>
            <h1 className="text-xl font-semibold mb-4">Chi tiết món ăn</h1>
          </div>
        </div>

        <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-lg mb-32">
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
          </div>
        </div>
        <div className="container">
          <div className="fixed bottom-0 left-0 right-0 w-full">
            <div className="flex flex-col mt-4 px-2 pt-2 pb-1 shadow-lg bg-white rounded-t-2xl">
              <div className="flex justify-center my-2">
                <button
                  aria-label="remove"
                  class="text-red-500 border-1 border-red-500 rounded-md"
                  onClick={handleDecrement}
                >
                  <RemoveIcon />
                </button>

                {/* <span class="px-2.5 text-base">{quantity}</span> */}
                <input
                  type="number"
                  className="mx-2 w-16 text-center self-center border-1 border-gray-300 rounded-md focus:outline-none focus:border-green-500 "
                  value={quantity}
                  onChange={(e) => {
                    const newQuantity = e.target.value;
                    // Cho phép người dùng xóa số lượng để nhập giá trị mới
                    if (newQuantity === "") {
                      setQuantity(newQuantity);
                    } else {
                      const num = parseInt(newQuantity, 10);
                      // Chỉ cập nhật nếu là số dương
                      if (num > 0) {
                        setQuantity(num);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    // Nếu input trống khi người dùng bấm ra ngoài, đặt số lượng về 1
                    if (e.target.value === "") {
                      setQuantity(1);
                    }
                  }}
                  min="1"
                />

                <button
                  class="text-green-500 border-1 border-green-500 rounded-md"
                  aria-label="add"
                  onClick={handleIncrement}
                >
                  <AddIcon />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-green-500 text-white  py-2.5  mb-2 rounded-xl hover:bg-green-600 transition-colors font-bold"
              >
                Thêm vào giỏ hàng - {formattedTotalPrice}
              </button>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </>
  );
}

export default ComboDetail;
