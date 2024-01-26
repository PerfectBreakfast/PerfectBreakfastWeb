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

const AdminLogin = () => {
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
      localStorage.setItem("accessToken", userData.accessToken);
      navigate("/admin/foods");
    } catch (error) {
      // setErrorMessage(error.errors);
      // setErrorMessage("Email hoặc mật khẩu chưa chính xác!");
      toast.error("Email hoặc mật khẩu không chính xác");
    }
  };

  return (
    <Container component="main" maxWidth="xs" className="containerLogin">
      <CssBaseline />
      <div>
        <img src={logo} alt="Logo" className="logo" />

        <Typography component="h2" variant="h6">
          Đăng nhập
        </Typography>

        <form onSubmit={handleLogin} className="formLogin">
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
                className="inputField"
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
                className="inputField"
                InputProps={{ fullWidth: true, style: { borderRadius: 20 } }}
              />
            </Grid>
          </Grid>
          <div className="forgotPassword">
            <Link href="#" variant="body2" id="forgotPasswordLink">
              Quên mật khẩu
            </Link>
          </div>
          <Button type="submit" fullWidth variant="contained" id="loginButton">
            Đăng nhập
          </Button>
        </form>
      </div>
      <div className="registerLink">
        Bạn chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
      </div>
      <ToastContainer />
    </Container>
  );
};

export default AdminLogin;
