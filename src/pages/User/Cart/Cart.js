import React, { useState } from "react";
import {
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "../../../services/CartContext";
import { Link, useNavigate } from "react-router-dom";
import food from "../../../assets/images/logo.png";
import "../Cart/Cart.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

function Cart() {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // const handleRemoveItem = (itemId) => {
  //   dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
  // };

  const handleRemoveItem = (itemId) => {
    setItemToRemove(itemId);
    setShowConfirmation(true);
  };

  const confirmRemoveItem = () => {
    dispatch({ type: "REMOVE_FROM_CART", payload: itemToRemove });
    setShowConfirmation(false);
  };

  const cancelRemoveItem = () => {
    setItemToRemove(null);
    setShowConfirmation(false);
  };

  const handleIncreaseQuantity = (itemId) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity: 1 } });
  };

  const handleDecreaseQuantity = (itemId) => {
    // Kiểm tra xem quantity có lớn hơn 1 không
    const item = cart.find((cartItem) => cartItem.id === itemId);
    if (item.quantity > 1) {
      dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity: -1 } });
    }
  };

  const totalAmount = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600"
        >
          {/* Replace this with a Tailwind-friendly back icon or image */}
          <ArrowBackIosIcon />
        </button>
        <h6 className="text-lg font-bold">Giỏ hàng</h6>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <span className="material-icons text-red-500 text-6xl">
            <RemoveShoppingCartIcon className="" />
          </span>
          <h2 className="text-2xl font-bold mt-4">Không có món nào!</h2>
          <p className="mt-2">
            Không có bát kỳ món ăn nào, vui lòng kiểm tra lại.
          </p>
        </div>
      ) : (
        <div className="mb-28">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between mb-4 p-4 shadow-lg rounded-lg bg-white"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />

              {/* Name and Price */}
              <div className="flex flex-col flex-1 mx-4">
                <span className="text-lg font-bold mb-2">{item.name}</span>
                <div className="flex items-center">
                  <button
                    onClick={() => handleDecreaseQuantity(item.id)}
                    className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-full"
                  >
                    {/* Replace with Tailwind-friendly icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2 w-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 12H6"
                      />
                    </svg>
                  </button>
                  <span className="mx-2 text-lg">{item.quantity}</span>
                  <button
                    onClick={() => handleIncreaseQuantity(item.id)}
                    className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-full"
                  >
                    {/* Replace with Tailwind-friendly icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-2 w-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quantity Adjustments */}

              {/* Remove Item */}
              <div className="flex flex-col items-end">
                {" "}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-600 mb-2"
                >
                  {/* Replace with Tailwind-friendly icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <p className="text-lg font-bold">
                  {(item.price * item.quantity).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length === 0 ? null : (
        <div className="fixed bottom-0 left-0 right-0 w-full ">
          <div className="flex flex-col mt-4 p-2 shadow-lg bg-white rounded-t-2xl">
            <div className="flex justify-between items-center mb-3 m-1">
              <h6 className="text-lg font-bold">Tổng cộng</h6>
              <span className="text-lg font-bold">
                {totalAmount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>

            <button
              className="bg-green-500 text-white p-2 mb-2 rounded-3xl hover:bg-green-600 transition-colors"
              onClick={() => navigate("/checkout")}
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h5 className="text-lg font-bold mb-4">Xác nhận xóa sản phẩm?</h5>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
            </p>
            <div className="flex justify-end">
              <button
                onClick={cancelRemoveItem}
                className="text-red-500 bg-transparent hover:bg-red-100 p-3 rounded mr-4"
              >
                Hủy
              </button>
              <button
                onClick={confirmRemoveItem}
                className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
