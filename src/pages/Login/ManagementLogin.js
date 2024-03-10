import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Grid,
  Link,
} from "@mui/material";

import logo from "../../assets/images/logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import userAPI from "../../services/userAPI";
import { encryptToken } from "../../services/CryptoService";

const ManagementLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userData = await userAPI.login(credentials);

      const roles = userData.roles;

      const accessToken = userData.accessToken;
      const refreshToken = userData.refreshToken;

      // Mã hóa tokens
      const encryptedAccessToken = encryptToken(accessToken);
      const encryptedRefreshToken = encryptToken(refreshToken);

      // Lưu vào localStorage
      localStorage.setItem("accessToken", encryptedAccessToken);
      localStorage.setItem("refreshToken", encryptedRefreshToken);

      // Kiểm tra và điều hướng dựa trên vai trò
      if (roles.includes("SUPER ADMIN")) {
        navigate("/admin/foods");
      } else if (roles.includes("PARTNER ADMIN")) {
        navigate("/partner/order");
      } else if (roles.includes("SUPPLIER ADMIN")) {
        navigate("/supplier/foods");
      } else if (roles.includes("DELIVERY ADMIN")) {
        // navigate("/delivery/order");
        navigate("/scan");
      } else {
        toast.error("Email hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      toast.error("Email hoặc mật khẩu không chính xác");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className="flex flex-col items-center">
        <div className="flex justify-center">
          <img src={logo} alt="Admin Logo" className="mb-4 w-20 mt-5" />
        </div>

        <Typography component="h2" variant="h6">
          Đăng Nhập
        </Typography>

        <form onSubmit={handleLogin} className="w-full max-w-lg mt-2">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                value={credentials.email}
                onChange={handleInputChange}
                size="small"
                className="inputField "
                InputProps={{ fullWidth: true, style: { borderRadius: 20 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Mật khẩu"
                type="password"
                name="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleInputChange}
                size="small"
                className="inputField mb-2"
                InputProps={{ fullWidth: true, style: { borderRadius: 20 } }}
              />
            </Grid>
          </Grid>
          <button
            type="submit"
            fullWidth
            variant="contained"
            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline w-full rounded-3xl"
          >
            Đăng nhập
          </button>
        </form>
      </div>
      <ToastContainer />
    </Container>
  );
};

export default ManagementLogin;
