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

  // const handleAddToCart = () => {
  //   const itemToAdd = {
  //     id: comboData.id,
  //     name: comboData.name,
  //     image: comboData.image,
  //     quantity,
  //     price: comboData.comboPrice,
  //   };
  //   addToCart(itemToAdd);
  //   toast.success("Đã thêm món ăn vào giỏ hàng!");
  //   console.log(`Added ${quantity} ${comboData.name} to the cart`);
  // };

  const handleAddToCart = () => {
    const itemToAdd = {
      id: comboData.id,
      name: comboData.name,
      image: comboData.image,
      quantity,
      price: comboData.comboPrice,
    };
    addToCart(itemToAdd);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate(-1); // Quay lại màn hình trước sau khi pop-up ẩn
    }, 500); // Ẩn pop-up sau 1 giây
  };

  // const handleAddToCart = () => {
  //   const itemToAdd = {
  //     id: comboData.id,
  //     name: comboData.name,
  //     image: comboData.image,
  //     quantity,
  //     price: comboData.comboPrice,
  //   };

  //   // Tạo một clone của hình ảnh sản phẩm
  //   const productImage = document.createElement("img");
  //   productImage.src = comboData.image;
  //   productImage.style.position = "fixed";
  //   productImage.style.left = "50%"; // Giả sử sản phẩm ở giữa màn hình
  //   productImage.style.top = "50%";
  //   productImage.style.transform = "translate(-50%, -50%)";
  //   productImage.style.transition = "all 0.5s ease";
  //   document.body.appendChild(productImage);

  //   // Chờ một chút trước khi di chuyển hình ảnh
  //   setTimeout(() => {
  //     productImage.style.left = "50%";
  //     productImage.style.top = "100%"; // Di chuyển đến dưới cùng của trang
  //     productImage.style.transform = "translate(-50%, -100%) scale(0.1)";
  //     productImage.style.opacity = "0";
  //   }, 100);

  //   // Xóa hình ảnh sau khi chuyển cảnh
  //   setTimeout(() => {
  //     productImage.remove();
  //   }, 600); // Đợi cho đến khi hoàn thành chuyển động

  //   addToCart(itemToAdd);
  //   setShowPopup(true);
  //   setTimeout(() => {
  //     setShowPopup(false);
  //     navigate(-1); // Quay lại màn hình trước sau khi pop-up ẩn
  //   }, 500); // Ẩn pop-up sau 1 giây
  // };

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
                class="bg-green-500 text-white py-2.5 px-4 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 w-5/6 rounded-xl font-bold"
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
