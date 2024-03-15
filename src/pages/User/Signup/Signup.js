import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import userAPI from "../../../services/userAPI";
import logo from "../../../assets/images/logo.png";
import "./Signup.css"; // Import CSS file
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

import { ReactComponent as Loading } from "../../../assets/icons/loading.svg";
import { ReactComponent as VisibilityOff } from "../../../assets/icons/Eye.svg";
import { ReactComponent as Visibility } from "../../../assets/icons/Eye Closed.svg";

const Signup = () => {
  const [companies, setCompanies] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companyList = await userAPI.getCompanies();
        setCompanies(companyList);
      } catch (error) {
        // console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      companyId: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email không đúng định dạng")
        .required("Email không được để trống"),
      name: Yup.string().required("Tên người dùng không được để trống"),
      password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
        .required("Mật khẩu không được để trống"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu không trùng")
        .required("Xác nhận mật khẩu không được để trống"),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Chỉ được nhập số")
        .matches(/^0\d{9}$/, "Số điện thoại phải bắt đầu từ số 0 và có 10 số")
        .required("Số điện thoại không được để trống"),
      companyId: Yup.string().required("Vui lòng chọn công ty của bạn"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const data = await userAPI.register(values);
        toast.success("Đăng ký tài khoản thành công");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        toast.error("Đăng ký thất bại");
      } finally {
        setIsLoading(false); // Hoàn thành gọi API, cập nhật trạng thái không đang tải
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="max-w-xs mx-auto text-center">
      <img src={logo} alt="Logo" className="w-1/5 max-w-xs mx-auto mt-5" />

      <h2 className="text-lg font-semibold mt-4">Đăng ký</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4 mt-2">
        <div className="">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="user-input"
          />
          <div className="text-left">
            {formik.touched.email && formik.errors.email ? (
              <div className="formik-error-message">{formik.errors.email}</div>
            ) : null}
          </div>

          <input
            type="text"
            name="name"
            placeholder="Tên người dùng"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="user-input"
          />
          <div className="text-left">
            {" "}
            {formik.touched.name && formik.errors.name ? (
              <div className="formik-error-message">{formik.errors.name}</div>
            ) : null}
          </div>

          <div className="input-group rounded-xl mt-2.5 p-2 border-1 focus:outline-none w-full hover:border-green-500  focus:border-green-500">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
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
            {formik.touched.password && formik.errors.password ? (
              <div className="formik-error-message">
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          <div className="input-group rounded-xl mt-2.5 p-2 border-2 focus:outline-none border-1 w-full hover:border-green-500  focus:border-green-500">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
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
          <div className="text-left">
            {" "}
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="formik-error-message">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>

          <input
            type="text"
            name="phoneNumber"
            placeholder="Số điện thoại"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
            className="user-input rounded-3xl p-2 border-2"
          />
          <div className="text-left">
            {" "}
            {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
              <div className="formik-error-message">
                {formik.errors.phoneNumber}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <select
              name="companyId"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.companyId}
              className="user-input "
            >
              <option value="" disabled>
                Chọn công ty
              </option>
              {companies.length > 0 ? (
                companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))
              ) : (
                <option disabled>Không có dữ liệu</option>
              )}
            </select>
          </div>

          <div className="text-left">
            {" "}
            {formik.touched.companyId && formik.errors.companyId ? (
              <div className="formik-error-message">
                {formik.errors.companyId}
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          className="btn-submit-user"
          disabled={isLoading} // Disable nút khi đang gọi API
        >
          {isLoading ? <Loading /> : "Đăng ký"}
        </button>
      </form>

      <div className="mt-4">
        Đã có tài khoản?{" "}
        <Link to={"/login"} className="text-blue-600 hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
