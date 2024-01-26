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
    <div className="container orderContent">
      <div className="cartManagement">
        <IconButton onClick={handleGoBack}>
          <ArrowBackIosIcon />{" "}
        </IconButton>
        <Typography className="cartText" variant="h6" gutterBottom>
          Giỏ hàng
        </Typography>
      </div>

      {cart.length === 0 ? (
        <div className="emptyOrder">
          <RemoveShoppingCartIcon color="error" id="iconEmptyCart" />
          <h2>Không có món nào!</h2>
          <p>Không có bát kỳ món ăn nào, vui lòng kiểm tra lại. </p>
        </div>
      ) : (
        <div>
          {cart.map((item) => (
            <React.Fragment key={item.id}>
              <div className="cartItem">
                <div className="cartContent">
                  <div>
                    <img src={food} alt="" className="imgItem" />
                  </div>

                  <div>
                    <Typography variant="h6">{item.name}</Typography>

                    <div className="updateItem">
                      <IconButton
                        aria-label="remove"
                        color="error"
                        onClick={() => handleDecreaseQuantity(item.id)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant="h6" id="updateItemQuantity">
                        {item.quantity}
                      </Typography>
                      <IconButton
                        color="success"
                        aria-label="add"
                        onClick={() => handleIncreaseQuantity(item.id)}
                      >
                        <AddIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
                <div className="totalItem">
                  <div className="actionItem">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>
                  <Typography className="priceItem" variant="h6">
                    {(item.price * item.quantity).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Typography>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
      {cart.length === 0 ? (
        <></>
      ) : (
        <div className="confirmOrder">
          <div className="totalOrder">
            <Typography variant="h6" gutterBottom>
              Tổng cộng
            </Typography>
            <Typography className="totalPriceOrder" variant="h5" gutterBottom>
              {totalAmount.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}{" "}
            </Typography>
          </div>

          <Button
            variant="contained"
            component={Link}
            to="/checkout"
            id="confirmBtn"
            size="large"
          >
            Tiến hành thanh toán
          </Button>
        </div>
      )}
      <Dialog
        open={showConfirmation}
        onClose={cancelRemoveItem}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="customDialog"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận xóa sản phẩm?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelRemoveItem} color="error">
            Hủy
          </Button>
          <Button onClick={confirmRemoveItem} color="primary" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Cart;
