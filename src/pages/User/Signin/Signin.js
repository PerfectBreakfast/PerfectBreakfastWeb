import React, { useState } from "react";
import userAPI from "../../../services/userAPI";
import logo from "../../../assets/images/logo.png";
import "./Signin.css"; // Import CSS file
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ClipLoader } from "react-spinners";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Thêm trạng thái mới
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true); // Bắt đầu quá trình tải, set isLoading = true
    try {
      const userData = await userAPI.login(credentials);
      localStorage.setItem("accessToken", userData.accessToken);
      navigate("/home");
    } catch (error) {
      toast.error("Email hoặc mật khẩu không chính xác");
    } finally {
      setIsLoading(false); // Kết thúc quá trình tải, set isLoading = false
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
          disabled={isLoading}
          className={`btn btn-primary w-full rounded-full transition-colors duration-300 mt-2 border-none ${
            isLoading ? "bg-green-600" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading ? <ClipLoader color="#ffffff" size={24} /> : "Đăng nhập"}
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
