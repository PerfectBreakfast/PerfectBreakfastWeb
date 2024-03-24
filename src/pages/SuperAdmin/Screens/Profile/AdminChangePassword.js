import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Loading } from "../../../../assets/icons/loading.svg";
import { ReactComponent as VisibilityOff } from "../../../../assets/icons/Eye.svg";
import { ReactComponent as Visibility } from "../../../../assets/icons/Eye Closed.svg";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import Modal from "react-modal";
import userAPI from "../../../../services/userAPI";

const AdminChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Mật khẩu không được để trống"),
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
        // Adjust the API call here to include all necessary fields
        const response = await userAPI.changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.password,
          confirmNewPassword: values.confirmPassword,
        });
        toast.success("Thay đổi mật khẩu thành công!");
        // Wait for 1 second before logging out
        // setTimeout(() => {
        handleLogout(); // Call the handleLogout function to log the user out
        // }, 1000);
      } catch (error) {
        setIsOpen(false);
        console.log(error.errors);
        toast.error(error.errors);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleGoBack = () => {
    navigate(-1);
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleUpdateClick = async () => {
    // Đánh dấu tất cả các trường là đã chạm vào, bao gồm cả selectedImage
    formik.setTouched({
      currentPassword: true,
      password: true,
      confirmPassword: true,
    });

    const errors = await formik.validateForm();
    formik.setErrors(errors);

    // Kiểm tra xem form có lỗi không
    if (Object.keys(errors).length === 0) {
      // Nếu không có lỗi, mở modal xác nhận
      openModal();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600"
        >
          <ArrowBackIosIcon />
        </button>
        <h6 className="text-lg font-bold ml-4">Thay đổi mật khẩu</h6>
      </div>
      <div className="bg-white shadow rounded-lg px-4 py-6 mb-6 grid gap-y-4">
        <form onSubmit={formik.handleSubmit}>
          {" "}
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu hiện tại
            </label>
            <div className="input-group rounded-xl mt-2.5 p-2 border-2 focus:outline-none border-1 w-full hover:border-green-500 focus:border-green-500">
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                placeholder="Mật khẩu hiện tại"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.currentPassword}
                className="focus:outline-none"
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={toggleCurrentPasswordVisibility}
              >
                {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
              </span>
            </div>
            <div className="text-left">
              {" "}
              {formik.touched.currentPassword &&
                formik.errors.currentPassword && (
                  <div className="formik-error-message">
                    {formik.errors.currentPassword}
                  </div>
                )}
            </div>
          </div>
          <div className="mt-2.5">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu mới
            </label>
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
                <div className="formik-error-message">
                  {formik.errors.password}
                </div>
              )}
            </div>
          </div>
          <div className="mt-2.5">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Xác nhận mật khẩu mới
            </label>
            <div className="input-group rounded-xl mt-1 p-2 border-2 focus:outline-none border-1 w-full hover:border-green-500 focus:border-green-500">
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
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className=" formik-error-message">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>
          </div>
          <button
            type="button"
            className="btn-submit-user"
            onClick={handleUpdateClick}
            disabled={isLoading} // Disable nút khi đang gọi API
          >
            {isLoading ? (
              <Loading className=" animate-spin inline w-5 h-5 text-gray-200 dark:text-gray-600" />
            ) : (
              "Thay đổi mật khẩu"
            )}
          </button>
        </form>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="fixed inset-0 flex items-center justify-center"
        contentLabel="Xác nhận cập nhật"
      >
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto z-50">
          <h2 className="text-lg font-semibold mb-4">Xác nhận</h2>
          <p>Bạn có chắc chắn muốn thay đổi mật khẩu?</p>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black"
              onClick={closeModal}
            >
              Hủy bỏ
            </button>
            <button
              className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded text-white"
              onClick={formik.submitForm}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
      <ToastContainer autoClose={700} />
    </div>
  );
};

export default AdminChangePassword;
