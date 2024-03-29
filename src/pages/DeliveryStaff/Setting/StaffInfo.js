import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import userAPI from "../../../services/userAPI";
import companyAPI from "../../../services/companyAPI";
import Loading from "../../Loading/Loading";

import { ReactComponent as Write } from "../../../assets/icons/write.svg";
import { ReactComponent as User } from "../../../assets/icons/User Circle.svg";
import { ReactComponent as RightIcon } from "../../../assets/icons/right-arrow.svg";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import Modal from "react-modal";

const StaffInfo = () => {
  const [userData, setUserData] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [hasChanged, setHasChanged] = useState(false);

  const [modalIsOpen, setIsOpen] = useState(false);

  const [userId, setUserId] = useState(false);

  const formik = useFormik({
    initialValues: {
      image: "",
      name: "",
      phoneNumber: "",
      email: "",
      companyName: "",
      companyId: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên người dùng không được để trống"),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Chỉ được nhập số")
        .matches(/^0\d{9}$/, "Số điện thoại phải bắt đầu từ số 0 và có 10 số")
        .required("Số điện thoại không được để trống"),
      companyId: Yup.string().required("Vui lòng chọn công ty của bạn"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("image", values.image);
      formData.append("name", values.name);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("companyId", values.companyId);

      try {
        await userAPI.editStaff(userId, formData);
        toast.success("Thay đổi thông tin thành công!");
        navigate(-1);
      } catch (error) {
        console.error("Error updating user info:", error);
        toast.error("Thay đổi thông tin thất bại!");
      }
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await userAPI.getUser();
        setImagePreview(user.image);
        setUserId(user.id);
        setUserData(user);
        formik.setValues({
          ...formik.values,
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
          companyId: user.companyId,
          companyName: user.companyName,
        });
        setSearchTerm(user.companyName);
        setImagePreview(user.image);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Please log in again!");
        navigate("/login");
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    // Bây giờ sử dụng formik trong useEffect sau khi nó đã khởi tạo
    if (userData) {
      const hasFormChanged =
        formik.values.name !== userData.name ||
        formik.values.phoneNumber !== userData.phoneNumber ||
        formik.values.email !== userData.email ||
        formik.values.companyId !== userData.companyId ||
        formik.values.image !== "";
      setHasChanged(hasFormChanged);
    }
  }, [formik.values, userData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      setImagePreview(URL.createObjectURL(file));
      setHasChanged(true);
    }
  };

  //   const handleSearchChange = async (event) => {
  //     const { value } = event.target;
  //     setSearchTerm(value);
  //     if (value.length > 2) {
  //       try {
  //         const companyList = await companyAPI.getCompanyForSignUp(value);
  //         setSearchResults(companyList);
  //         setShowSuggestions(true);
  //       } catch (error) {
  //         setSearchResults([]);
  //       }
  //     } else {
  //       setSearchResults([]);
  //       setShowSuggestions(false);
  //     }

  //     // If user alters the company name after selection, reset companyId
  //     if (value !== formik.values.companyName) {
  //       formik.setFieldValue("companyId", "", false);
  //     }
  //   };

  //   const handleSelectCompany = (companyId, companyName) => {
  //     formik.setFieldValue("companyId", companyId);
  //     formik.setFieldValue("companyName", companyName);
  //     setSearchTerm(companyName);
  //     setShowSuggestions(false);
  //   };
  const handleGoBack = () => {
    navigate(-1);
  };
  const handleUpdateClick = async () => {
    // Đánh dấu tất cả các trường là đã chạm vào, bao gồm cả selectedImage
    formik.setTouched({
      name: true,
      phoneNumber: true,
      companyId: true,
    });

    const errors = await formik.validateForm();
    formik.setErrors(errors);

    // Kiểm tra xem form có lỗi không
    if (Object.keys(errors).length === 0) {
      // Nếu không có lỗi, mở modal xác nhận
      openModal();
    }
  };
  if (!userData) {
    return <Loading />;
  }
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600"
        >
          <ArrowBackIosIcon />
        </button>
        <h6 className="text-lg font-bold ml-4">Thay đổi thông tin</h6>
      </div>
      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1">
        <div className="text-center mb-2">
          <div className="relative inline-block">
            {/* <img
                src={imagePreview || <User />}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover"
              /> */}

            {imagePreview ? (
              <img
                src={imagePreview}
                alt="User"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <User className="w-24 h-24 rounded-full object-cover" />
            )}

            <label
              htmlFor="image"
              className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 cursor-pointer hover:bg-green-600"
            >
              {" "}
              <Write className="h-4 w-4 text-white" />
              <input
                type="file"
                id="image"
                name="image"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>
        <h6 className="text-base font-semibold text-gray-600 mb-2.5">
          Thông tin cá nhân
        </h6>
        <div className="bg-white shadow rounded-lg px-4 py-6 mb-6 grid gap-y-3">
          {" "}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Tên người dùng
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="edit-user-input"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="formik-error-message">{formik.errors.name}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              disabled
              type="text"
              id="email"
              name="email"
              //   onChange={formik.handleChange}
              //   onBlur={formik.handleBlur}
              value={formik.values.email}
              className="mt-1 border-1 w-full rounded-xl p-2"
            />
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Số điện thoại
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phoneNumber}
              className="edit-user-input"
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="formik-error-message">
                {formik.errors.phoneNumber}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Tên công ty
            </label>
            <input
              disabled
              id="companyName"
              type="text"
              placeholder="Tìm kiếm công ty..."
              //   onChange={handleSearchChange}
              value={searchTerm}
              className="mt-1 border-1 w-full rounded-xl p-2"
              onBlur={() => {
                formik.setFieldTouched("companyId", true);
              }}
            />
            {/* {showSuggestions && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
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
            )} */}
            {formik.touched.companyId && !formik.values.companyId && (
              <div className="formik-error-message">
                {formik.errors.companyId}
              </div>
            )}
          </div>{" "}
        </div>

        <h6 className="text-base font-semibold text-gray-600 mb-2.5">
          Cài đặt tài khoản
        </h6>
        <div className="bg-white shadow rounded-lg p-4 mb-20">
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>

            <div
              onClick={() => navigate("change-password")}
              className="input-group edit-user-input relative cursor-pointer" // Thêm relative ở đây
            >
              <input
                value="••••••••"
                type="password"
                id="password"
                name="password"
                className="focus:outline-none w-full cursor-pointer " // Đảm bảo input chiếm toàn bộ chiều rộng
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <RightIcon className="h-5 w-5" />
              </span>
            </div>
          </div>
        </div>

        {/* <button
            type="submit"
            disabled={!hasChanged} // Disable nút này khi không có sự thay đổi
            className={`py-2 px-4 ${
              !hasChanged ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
            } text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`}
          >
            Cập Nhật
          </button> */}

        <div className="fixed bottom-0 left-0 right-0 w-full">
          <div className=" flex flex-col mt-4 px-2 pt-4 pb-1 shadow-lg bg-white rounded-t-2xl">
            <button
              type="button"
              onClick={handleUpdateClick}
              disabled={!hasChanged}
              className={`font-bold bg-green-500 text-white py-2.5 mb-2 rounded-xl hover:bg-green-600 ${
                hasChanged ? "" : "opacity-50 cursor-not-allowed"
              }`}
            >
              Cập nhật
            </button>
          </div>
        </div>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="fixed inset-0 flex items-center justify-center"
        contentLabel="Xác nhận cập nhật"
      >
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto z-50">
          <h2 className="text-lg font-semibold mb-4">Xác nhận</h2>
          <p>Bạn có chắc chắn muốn cập nhật thông tin này?</p>
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
    </div>
  );
};

export default StaffInfo;
