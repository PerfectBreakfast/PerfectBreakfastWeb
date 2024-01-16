import React, { createContext, useContext, useReducer } from "react";

const CartContext = createContext();
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.find((item) => item.id === action.payload.id);

      if (existingItem) {
        // If the item already exists in the cart, update its quantity
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // If the item is not in the cart, add it
        return [...state, action.payload];
      }
    // Add more cases for other cart actions if needed
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload);
    case "UPDATE_QUANTITY":
      const updatedState = state.map((item) =>
        item.id === action.payload.itemId
          ? {
              ...item,
              quantity: Math.max(0, item.quantity + action.payload.quantity),
            }
          : item
      );

      return updatedState.filter((item) => item.quantity > 0);

    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (item) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  return (
    <CartContext.Provider value={{ cart, dispatch, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };
