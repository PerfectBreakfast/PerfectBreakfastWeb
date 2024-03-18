import React, { useEffect, useState } from "react";

import { useCart } from "../../../services/CartContext";
import { Link, useNavigate } from "react-router-dom";

import "../Cart/Cart.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import MealAPI from "../../../services/MealAPI";
import { ReactComponent as Decrease } from "../../../assets/icons/decrease.svg";
import { ReactComponent as Increase } from "../../../assets/icons/increase.svg";
import { ReactComponent as Remove } from "../../../assets/icons/remove.svg";
import Loading from "../../Loading/Loading";

function Cart() {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [mealData, setMealData] = useState(null);
  const [selectedMealId, setSelectedMealId] = useState("");

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const data = await MealAPI.getMealByCustomer();
        setMealData(data);
        // Set default selected meal ID (optional)
        // if (data.length > 0) {
        //   setSelectedMealId(data[0].id);
        // }
      } catch (error) {
        console.error("Error fetching meal data:", error);
        alert("Error fetching meal data. Please try again later.");
      }
    };

    fetchMealData();
  }, []);
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

  const handleGoToCheckout = () => {
    // Include the selectedMealId when navigating
    navigate("/checkout", { state: { selectedMealId } });
  };
  if (!mealData) {
    return <Loading />;
  }

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
            Không có bất kỳ món ăn nào, vui lòng kiểm tra lại.
          </p>
        </div>
      ) : (
        <div className="mb-28">
          {mealData && (
            <div className="mb-3">
              <label
                htmlFor="mealSelect"
                className="block text-sm font-medium text-gray-700"
              >
                Chọn bữa ăn
              </label>
              <select
                id="mealSelect"
                value={selectedMealId}
                onChange={(e) => setSelectedMealId(e.target.value)}
                className="p-2.5 mt-1 block w-full text-base border-gray-300 focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-lg shadow-sm bg-white hover:border-gray-400"
              >
                <option value="" disabled>
                  Chọn bữa ăn
                </option>
                {mealData.map((meal) => (
                  <option key={meal.id} value={meal.id}>
                    {meal.mealType}
                  </option>
                ))}
              </select>
            </div>
          )}
          <p className="block text-sm font-medium text-gray-700 mb-2.5">
            Chi tiết đơn hàng
          </p>
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
                    <Decrease />
                  </button>
                  <span className="mx-2 text-lg">{item.quantity}</span>
                  <button
                    onClick={() => handleIncreaseQuantity(item.id)}
                    className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-full"
                  >
                    {/* Replace with Tailwind-friendly icon */}
                    <Increase />
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
                  <Remove />
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
              className={`font-bold bg-green-500 text-white py-2.5 mb-2 rounded-xl hover:bg-green-600 ${
                selectedMealId ? "" : "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleGoToCheckout}
              disabled={!selectedMealId}
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
            <h5 className="text-lg font-bold mb-4">Xác nhận xóa món ăn?</h5>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa món ăn này khỏi giỏ hàng không?
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
