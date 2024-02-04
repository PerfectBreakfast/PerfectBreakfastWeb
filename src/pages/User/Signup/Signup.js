import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Grid,
  Link,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import userAPI from "../../../services/userAPI";
import logo from "../../../assets/images/logo.png";
import "./Signup.css"; // Import CSS file
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Signup = () => {
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    password: "",
    phoneNumber: "",
    companyId: "",
  });

  const [companies, setCompanies] = useState([]);
  const [showPassword, setShowPassword] = useState(false); // Thêm trạng thái mới

  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Fetch the list of companies when the component mounts
    const fetchCompanies = async () => {
      try {
        const companyList = await userAPI.getCompanies();
        setCompanies(companyList);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []); // Empty dependency array ensures the effect runs only once

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleCompanySelect = (e) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      companyId: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await userAPI.register(userData);
      console.log("Registration successful", data);
      toast.success("Đăng ký tại khoản thành công");
    } catch (error) {
      // setErrorMessage(error.errors);
      toast.error("Đăng ký thất bại");
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Cập nhật trạng thái hiển thị mật khẩu
  };

  return (
    <div className="max-w-xs mx-auto text-center">
      <img src={logo} alt="Logo" className="w-1/5 max-w-xs mx-auto mt-5" />

      <h2 className="text-lg font-semibold mt-4">Đăng ký</h2>

      <form onSubmit={handleRegister} className="space-y-4 mt-4">
        <div className="space-y-4">
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleInputChange}
            className="input input-bordered w-full rounded-3xl p-2 border-2"
          />

          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Tên người dùng"
            value={userData.name}
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
              value={userData.password}
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

          <input
            type="number"
            name="phoneNumber"
            required
            placeholder="SDT"
            value={userData.phoneNumber}
            onChange={handleInputChange}
            className="input input-bordered w-full rounded-3xl p-2 border-2"
          />

          <div className="relative">
            <select
              name="companyId"
              required
              value={userData.companyId}
              onChange={handleCompanySelect}
              className="select select-bordered w-full rounded-3xl p-2 border-2"
            >
              <option value="" disabled selected>
                Chọn công ty
              </option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full rounded-full bg-green-600 text-white transition-colors duration-300 hover:bg-green-700 mt-4 border-none"
        >
          Đăng ký
        </button>
      </form>

      <div className="mt-4">
        Đã có tài khoản?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Đăng nhập ngay
        </a>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
