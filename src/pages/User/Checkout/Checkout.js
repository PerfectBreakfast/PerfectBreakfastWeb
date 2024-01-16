// Checkout.js
import React, { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  IconButton,
} from "@mui/material";
import orderAPI from "../../../services/orderAPI";
import { useCart } from "../../../services/CartContext";
import "../Checkout/Checkout.css";
import userAPI from "../../../services/userAPI";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Divider from "@mui/material/Divider";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import WalletIcon from "@mui/icons-material/Wallet";

function Checkout() {
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("banking");
  const { cart } = useCart();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi hàm getUser từ userAPI khi component được mount
    const fetchUserData = async () => {
      try {
        const user = await userAPI.getUser();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
        alert("Error fetching user data. Please try again later.");
      }
    };

    fetchUserData();
  }, []);

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // const handleCheckout = async () => {
  //   console.log("test", cart);
  //   try {
  //     const orderDetails = {
  //       note,
  //       payment: paymentMethod,
  //       orderDetails: cart.map((item) => ({
  //         quantity: item.quantity,
  //         comboId: item.id,
  //       })),
  //     };

  //     // Gọi hàm orderFood từ orderAPI
  //     const result = await orderAPI.orderFood(orderDetails);

  //     // Xử lý kết quả đặt hàng, ví dụ: hiển thị thông báo, chuyển hướng, làm sạch giỏ hàng, vv.
  //     console.log("Order placed successfully:", result);

  //     // Đoạn mã sau đây là ví dụ, bạn có thể thay đổi nó tùy thuộc vào logic của bạn
  //     alert("Order placed successfully! Thank you for your purchase.");
  //     // Có thể thêm chuyển hướng hoặc các hành động khác tại đây
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
  //     alert("Error placing order. Please try again later.");
  //   }
  // };
  const handleCheckout = async () => {
    console.log("test", cart);
    try {
      const orderDetails = {
        note,
        payment: paymentMethod,
        orderDetails: cart.map((item) => ({
          quantity: item.quantity,
          comboId: item.id,
        })),
      };

      // Gọi hàm orderFood từ orderAPI
      const result = await orderAPI.orderFood(orderDetails);

      // Kiểm tra xem có paymentUrl trong kết quả không
      if (result.paymentUrl) {
        // Chuyển hướng tới trang thanh toán
        window.location.href = result.paymentUrl;
      } else {
        // Xử lý khi không có paymentUrl
        console.error("No paymentUrl found in the result:", result);
        alert("Error: No paymentUrl found. Please try again later.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
      alert("Error placing order. Please try again later.");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="checkoutContainer">
      <div className="paymentManagement">
        <IconButton onClick={handleGoBack}>
          <ArrowBackIosIcon />{" "}
        </IconButton>
        <Typography className="paymentText" variant="h6" gutterBottom>
          Thanh toán
        </Typography>
      </div>
      <div className="container">
        <Typography
          className="paymentText"
          fontWeight={"bold"}
          variant="h6"
          gutterBottom
        >
          Thông tin người dùng
        </Typography>
        <div className="container">
          {/* Hiển thị thông tin người dùng */}
          {userData && (
            <div>
              <Typography variant="h6" gutterBottom>
                Địa chỉ: {userData.companyName}
              </Typography>
              <Divider className="custom-divider" />
              <Typography variant="h6" gutterBottom>
                Số điện thoại: {userData.phoneNumber}
              </Typography>
              <Divider className="custom-divider" />
            </div>
          )}
          <TextField
            placeholder="Ghi chú"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={note}
            onChange={handleNoteChange}
            margin="normal"
            color="success"
          />
        </div>
        <div>
          <FormControl component="fieldset" margin="normal">
            <Typography
              id="paymentContent"
              fontWeight={"bold"}
              variant="h6"
              gutterBottom
            >
              Phương thức thanh toán
            </Typography>
            <div className="container">
              <RadioGroup
                className="paymentControl"
                aria-label="payment-method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel
                  value="banking"
                  control={<Radio style={{ color: "#0CBF66" }} />}
                  label={
                    <div className="paymentMethod">
                      <div className="bankingIcon">
                        {" "}
                        <AccountBalanceIcon
                          id="paymentIconColor"
                          fontSize="large"
                        />{" "}
                      </div>
                      <div className="paymentName">
                        <Typography variant="h6">Ngân hàng</Typography>
                      </div>
                    </div>
                  }
                />

                <FormControlLabel
                  value="wallet"
                  control={<Radio style={{ color: "#0CBF66" }} />}
                  label={
                    <div className="paymentMethod">
                      <div className="WalletIcon">
                        <WalletIcon id="paymentIconColor" fontSize="large" />{" "}
                      </div>
                      <div className="paymentName">
                        <Typography variant="h6">Ví điện tử</Typography>
                      </div>
                    </div>
                  }
                />
              </RadioGroup>
            </div>
          </FormControl>
        </div>
        <div className="orderBtn">
          <Button
            id="confirmBtn"
            variant="contained"
            color="primary"
            size="large"
            onClick={handleCheckout}
          >
            Đặt hàng
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
