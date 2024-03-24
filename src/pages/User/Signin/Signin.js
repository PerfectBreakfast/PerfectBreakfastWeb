import React, { useState } from "react";
import userAPI from "../../../services/userAPI";

import logo from "../../../assets/images/logo.png";
import google from "../../../assets/images/google.png";

import "./Signin.css"; // Import CSS file
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const startGoogleLogin = () => {
    setIsGoogleLoading(true); // Đặt trạng thái loading trước khi gọi hàm đăng nhập
    handleLoginGoogle(); // Gọi hàm đăng nhập Google sau khi đã đặt trạng thái loading
  };

  // call tới google
  const handleLoginGoogle = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      // setIsGoogleLoading(true);
      console.log(codeResponse);
      try {
        const userData = await userAPI.externalLogin(codeResponse.code);

        const accessToken = userData.accessToken;
        const refreshToken = userData.refreshToken;
        // Mã hóa tokens
        const encryptedAccessToken = encryptToken(accessToken);
        const encryptedRefreshToken = encryptToken(refreshToken);

        // decode access token
        const decoded = jwtDecode(accessToken);
        // Nếu CompanyId rỗng thì
        if (decoded.CompanyId === "") {
          console.log(decoded);
          navigate(`/register-external/${decoded.UserId}`);
        } else {
          // Lưu vào localStorage
          localStorage.setItem("accessToken", encryptedAccessToken);
          localStorage.setItem("refreshToken", encryptedRefreshToken);
          navigate("/menu");
        }
      } catch (error) {
        console.log(error);
        toast.error("Lỗi không thể đăng nhập");
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

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
      navigate("/menu");
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
    <div className="max-w-xs mx-auto text-center mb-10">
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
          {isLoading ? (
            <Loading className=" animate-spin inline w-5 h-5 text-gray-200 dark:text-gray-600" />
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>

      <div className="mt-3">
        Bạn chưa có tài khoản?{" "}
        <Link to={"/register"} className="text-blue-600 hover:underline">
          Đăng ký ngay
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <hr class="line" />
        <span className="mx-2">Đăng nhập với</span> <hr class="line" />
      </div>

      <button
        disabled={isGoogleLoading}
        type="button"
        class="mt-4 btn-submit-user-outline flex items-center justify-center"
        onClick={startGoogleLogin}
      >
        {isGoogleLoading ? (
          <Loading className=" animate-spin inline w-5 h-5 text-gray-200 dark:text-gray-600" />
        ) : (
          <>
            {" "}
            <img
              src={google}
              alt="google"
              className="size-6 mr-2"
            /> Google{" "}
          </>
        )}
      </button>

      <ToastContainer autoClose={1000} />
    </div>
  );
};

export default Login;
