import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import userAPI from "../../../services/userAPI";
import companyAPI from "../../../services/companyAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../assets/images/logo.png";
import { Link } from "react-router-dom";

import { ReactComponent as Loading } from "../../../assets/icons/loading.svg";

const SignupExternal = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState([]); // Thêm state cho kết quả tìm kiếm
  const [showSuggestions, setShowSuggestions] = useState(false); // Thêm state để kiểm soát việc hiển thị gợi ý

  const handleSearchChange = async (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    if (value.length > 2) {
      // Tìm kiếm công ty với API
      try {
        const companyList = await companyAPI.getCompanyForSignUp(value);
        setSearchResults(companyList);
        setShowSuggestions(true);
      } catch (error) {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }

    // Nếu người dùng xóa tên công ty đã chọn, xóa giá trị companyId
    if (value === "") {
      formik.setFieldValue("companyId", "", false);
    }
  };

  const handleSelectCompany = (companyId, companyName) => {
    formik.setFieldValue("companyId", companyId);
    setSearchTerm(companyName); // Cập nhật searchTerm để hiển thị tên công ty đã chọn
    setShowSuggestions(false); // Ẩn gợi ý sau khi chọn
  };

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
      companyId: "",
    },
    validationSchema: Yup.object({
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Chỉ được nhập số")
        .matches(/^0\d{9}$/, "Số điện thoại phải bắt đầu từ số 0 và có 10 số")
        .required("Số điện thoại không được để trống"),
      companyId: Yup.string().required("Vui lòng chọn công ty của bạn"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        console.log(id);
        console.log(values);
        const data = await userAPI.editUserWhenSignupGoogle(id, values);
        console.log(data);
        toast.success("Đăng ký tài khoản thành công");
        setTimeout(() => {
          navigate("/login");
        }, 1700);
      } catch (error) {
        toast.error("Đăng ký thất bại");
      } finally {
        setIsLoading(false); // Hoàn thành gọi API, cập nhật trạng thái không đang tải
      }
    },
  });

  return (
    <div className="max-w-xs mx-auto text-center">
      <img src={logo} alt="Logo" className="w-1/5 max-w-xs mx-auto mt-5" />

      <h2 className="text-lg font-semibold mt-4">Đăng ký thông tin</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4 mt-2">
        <div className="">
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

          {/* Search công ty */}
          <div className="relative">
            <input
              type="text"
              name="searchCompany"
              placeholder="Tìm kiếm công ty..."
              onChange={handleSearchChange}
              value={searchTerm}
              autoComplete="off"
              className="user-input"
              onBlur={() => formik.setFieldTouched("companyId", true)}
            />
            {showSuggestions && (
              <div className="absolute z-10 w-full bg-white shadow-md max-h-60 overflow-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((company) => (
                    <div
                      key={company.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() =>
                        handleSelectCompany(company.id, company.name)
                      }
                    >
                      {company.name}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-gray-500">Không có kết quả</div>
                )}
              </div>
            )}
          </div>

          <div className="text-left">
            {formik.touched.companyId && !formik.values.companyId && (
              <div className="formik-error-message">
                {formik.errors.companyId}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn-submit-user"
          disabled={isLoading} // Disable nút khi đang gọi API
        >
          {isLoading ? (
            <Loading className=" animate-spin inline w-5 h-5 text-gray-200 dark:text-gray-600" />
          ) : (
            "Đăng ký"
          )}
        </button>
      </form>

      {/* <div className="mt-4">
        Đã có tài khoản?{" "}
        <Link to={"/login"} className="text-blue-600 hover:underline">
          Đăng nhập ngay
        </Link>
      </div> */}
      <ToastContainer autoClose={1500} />
    </div>
  );
};
export default SignupExternal;
