import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import userAPI from "../../../services/userAPI";
import logo from "../../../assets/images/logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router";
import { ReactComponent as Loading } from "../../../assets/icons/loading.svg";
import { ReactComponent as VisibilityOff } from "../../../assets/icons/Eye.svg";
import { ReactComponent as Visibility } from "../../../assets/icons/Eye Closed.svg";

const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tokenParams = queryParams.get("token");
  const email = queryParams.get("email");
  const token = tokenParams.replace(/ /g, "+");

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Mật khẩu không được để trống"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu không trùng khớp")
        .required("Xác nhận mật khẩu không được để trống"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await userAPI.resetPassword({
          email: email,
          token: token,
          newPassword: values.password,
        });
        toast.success("Đặt lại mật khẩu thành công!");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        console.log(response); // Handle response as per your requirement
      } catch (error) {
        console.log(error.errors);
        toast.error(error.errors);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="max-w-xs mx-auto text-center">
      <img src={logo} alt="Logo" className="w-1/5 max-w-xs mx-auto mt-5" />
      <h2 className="text-lg font-semibold mt-4">Đặt lại mật khẩu của bạn</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-2 mt-2">
        <div className="input-group rounded-xl mt-2.5 p-2 border-2 focus:outline-none border-1 w-full hover:border-green-500 focus:border-green-500">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mật khẩu mới"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="focus:outline-none"
          />
          <span
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>
        <div className="text-left">
          {" "}
          {formik.touched.password && formik.errors.password && (
            <div className="formik-error-message">{formik.errors.password}</div>
          )}
        </div>

        <div className="input-group rounded-xl mt-2.5 p-2 border-2 focus:outline-none border-1 w-full hover:border-green-500 focus:border-green-500">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu mới"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className="focus:outline-none"
          />
          <span
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>
        <div className="text-left mb-2">
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className=" formik-error-message">
              {formik.errors.confirmPassword}
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`btn-submit-user ${
            isLoading ? "disabled:opacity-50" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? <Loading /> : "Đặt lại mật khẩu"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
