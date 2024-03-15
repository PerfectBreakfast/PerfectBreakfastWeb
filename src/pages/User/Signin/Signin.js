import React, { useState } from "react";
import userAPI from "../../../services/userAPI";
import logo from "../../../assets/images/logo.png";
import "./Signin.css"; // Import CSS file
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { ReactComponent as Loading } from "../../../assets/icons/loading.svg";
import { ReactComponent as VisibilityOff } from "../../../assets/icons/Eye.svg";
import { ReactComponent as Visibility } from "../../../assets/icons/Eye Closed.svg";

import { encryptToken } from "../../../services/CryptoService";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Thêm trạng thái mới
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Bắt đầu quá trình tải, set isLoading = true
    try {
      const userData = await userAPI.login(credentials);

      const accessToken = userData.accessToken;
      const refreshToken = userData.refreshToken;
      // Mã hóa tokens
      const encryptedAccessToken = encryptToken(accessToken);
      const encryptedRefreshToken = encryptToken(refreshToken);

      // Lưu vào localStorage
      localStorage.setItem("accessToken", encryptedAccessToken);
      localStorage.setItem("refreshToken", encryptedRefreshToken);
      navigate("/home");
    } catch (error) {
      console.log(error);
      toast.error("Email hoặc mật khẩu không chính xác");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            className="user-input"
          />

          <div className="input-group rounded-xl mt-2.5 p-2 border-1 focus:outline-none w-full hover:border-green-500  focus:border-green-500">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="current-password"
              placeholder="Mật khẩu"
              value={credentials.password}
              onChange={handleInputChange}
              className="focus:outline-none"
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
          <Link
            to={"/forgot-password"}
            className="text-red-600 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <button
          type="submit"
          className="btn-submit-user"
          disabled={isLoading} // Disable nút khi đang gọi API
        >
          {isLoading ? <Loading /> : "Đăng nhập"}
        </button>
      </form>

      <div className="mt-4">
        Bạn chưa có tài khoản?{" "}
        <Link to={"/register"} className="text-blue-600 hover:underline">
          Đăng ký ngay
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
