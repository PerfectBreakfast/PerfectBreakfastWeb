import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import logo from "../../../assets/images/logo.png";
import userAPI from "../../../services/userAPI";
import { ClipLoader } from "react-spinners";

const ForgotPassword = () => {
  const protocol = window.location.protocol;
  const host = window.location.host;
  const clientHost = `${protocol}//${host}`;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    console.log("host", clientHost);
    const headers = {
      "X-Client-Host": clientHost,
    };
    console.log("X host", headers);
    setIsLoading(true); // Bắt đầu quá trình tải, set isLoading = true
    try {
      const userData = await userAPI.getEmailForgotPassword(email, headers);

      toast.success("Vui lòng kiểm tra email để lấy lại mật khẩu");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error("Email không tồn tại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xs mx-auto text-center">
      <img src={logo} alt="Logo" className="w-1/5 max-w-xs mx-auto mt-5" />

      <h2 className="text-lg font-semibold mt-4">
        Đặt lại mật khẩu của bạn qua email
      </h2>

      <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
        <div className="space-y-4">
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className="input input-bordered w-full rounded-3xl p-2 border-2"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`btn btn-primary w-full rounded-full transition-colors duration-300 mt-2 border-none ${
            isLoading ? "bg-green-600" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading ? (
            <ClipLoader color="#ffffff" size={24} />
          ) : (
            "Reset lại mật khẩu"
          )}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
