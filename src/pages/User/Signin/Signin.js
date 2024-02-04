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
import userAPI from "../../../services/userAPI";
import logo from "../../../assets/images/logo.png";
import "./Signin.css"; // Import CSS file
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Thêm trạng thái mới

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
      navigate("/home");
    } catch (error) {
      // setErrorMessage(error.errors);
      // setErrorMessage("Email hoặc mật khẩu chưa chính xác!");
      toast.error("Email hoặc mật khẩu không chính xác");
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Cập nhật trạng thái hiển thị mật khẩu
  };

  return (
    <div className="max-w-xs mx-auto text-center">
      <img src={logo} alt="Logo" className="w-1/5 max-w-xs mx-auto mt-5" />

      <h2 className="text-lg font-semibold mt-4">Đăng nhập</h2>

      <form onSubmit={handleLogin} className="space-y-4 mt-4">
        <div className="space-y-4">
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleInputChange}
            className="input input-bordered w-full rounded-3xl p-2 border-2"
          />

          <div className="input-group rounded-3xl p-2 border-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="current-password"
              placeholder="Mật khẩu"
              value={credentials.password}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
            <span
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>
        </div>

        <div className="mt-2 text-left">
          <a href="#" className="text-red-600 hover:underline">
            Quên mật khẩu?
          </a>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full rounded-full bg-green-600 text-white transition-colors duration-300 hover:bg-green-700 mt-2 border-none"
        >
          Đăng nhập
        </button>
      </form>

      <div className="mt-4">
        Bạn chưa có tài khoản?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Đăng ký ngay
        </a>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
