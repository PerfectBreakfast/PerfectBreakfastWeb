import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import roleAPI from "../../../../services/roleAPI";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-modal";
import Loading from "../../../Loading/Loading";
import userAPI from "../../../../services/userAPI";

const CreateDeliveryUser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { deliveryUnitId } = location.state || {};
  const [roles, setRoles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const imageRef = useRef();
  const [imageInputKey, setImageInputKey] = useState(Date.now());
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const result = await roleAPI.getRole(deliveryUnitId);
        setRoles(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchRole();
  }, [deliveryUnitId]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      roleName: "",
      selectedImage: null,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(
          /^[a-zA-ZÀ-ỹ\s]+$/,
          "Tên người dùng chỉ được phép chứa chữ cái"
        )
        .required("Tên người dùng không được để trống"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email không được để trống"),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Chỉ được nhập số")
        .matches(/^0\d{9}$/, "Số điện thoại phải bắt đầu từ số 0 và có 10 số")
        .required("Số điện thoại không được để trống"),
      roleName: Yup.string().required("Chức năng không được để trống"),
      selectedImage: Yup.mixed().required("Bạn phải chọn một hình ảnh"),
    }),
    onSubmit: async (formData) => {
      setIsOpen(false); // Đóng modal
      setIsLoading(true); // Hiển thị loading
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (imageRef.current.files[0]) {
        data.append("image", imageRef.current.files[0]);
      }
      data.append("deliveryId", deliveryUnitId);

      try {
        await userAPI.createUnitUser(data);
        toast.success("Thêm quản trị viên thành công!");
        navigate(-1);
      } catch (error) {
        console.error("Error creating user:", error);
        toast.error("Có lỗi xảy ra khi tạo mới quản trị viên!");
      } finally {
        setIsLoading(false); // Ẩn loading
      }
    },
  });

  useEffect(() => {
    if (formik.values.selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(formik.values.selectedImage);
    } else {
      setImagePreview(null);
    }
  }, [formik.values.selectedImage]);

  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    formik.setFieldValue("selectedImage", file);
    formik.setFieldTouched("selectedImage", true, false);
  };

  const handleImageRemove = () => {
    formik.setFieldValue("selectedImage", null);
    setImagePreview(null);
    setImageInputKey(Date.now());
  };

  const handleCreateClick = async () => {
    // Đánh dấu tất cả các trường là đã chạm vào, bao gồm cả selectedImage
    formik.setTouched({
      name: true,
      email: true,
      phoneNumber: true,
      roleName: true,
      selectedImage: true, // Thêm dòng này
    });
    const errors = await formik.validateForm();
    formik.setErrors(errors);

    // Kiểm tra xem form có lỗi không
    if (Object.keys(errors).length === 0) {
      // Nếu không có lỗi, mở modal xác nhận
      openModal();
    }
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className="mx-auto bg-white p-8 shadow-xl rounded-2xl w-5/6">
      <form onSubmit={formik.handleSubmit}>
        <h2 className="text-2xl font-semibold mb-4">
          Tạo quản trị viên đơn vị vận chuyển
        </h2>
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="name" className="label-input">
              Tên người dùng
            </label>
            <input
              id="name"
              className="input-form "
              placeholder="Nhập tên người dùng"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="formik-error-message ">{formik.errors.name}</div>
            )}
          </div>

          <div>
            <label htmlFor="email" className="label-input">
              Email
            </label>
            <input
              id="email"
              className="input-form "
              placeholder="Nhập email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="formik-error-message ">{formik.errors.email}</div>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className="label-input">
              Số điện thoại
            </label>
            <input
              id="phoneNumber"
              className="input-form "
              placeholder="Số điện thoại"
              name="phoneNumber"
              type="text"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <div className="formik-error-message ">
                {formik.errors.phoneNumber}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="roleName" className="label-input">
              Chức năng
            </label>
            <select
              id="roleName"
              className="input-form "
              name="roleName"
              value={formik.values.roleName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Chọn chức năng</option>
              {roles.map((role, index) => (
                <option key={index} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
            {formik.touched.roleName && formik.errors.roleName && (
              <div className="formik-error-message ">
                {formik.errors.roleName}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="selectedImage" className="label-input">
              Hình ảnh
            </label>
            <input
              id="selectedImage"
              key={imageInputKey} // Sử dụng key để reset input
              type="file"
              ref={imageRef}
              accept="image/*"
              className="input-file "
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-4 items-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-40 rounded"
                />
                <button
                  type="button"
                  className="btn-delete-image "
                  onClick={handleImageRemove}
                >
                  Xóa hình ảnh
                </button>
              </div>
            )}

            {formik.touched.selectedImage && formik.errors.selectedImage && (
              <div className="formik-error-message ">
                {formik.errors.selectedImage}
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn-submit-form"
            onClick={handleCreateClick}
          >
            Tạo mới
          </button>
        </div>
      </form>
      {isLoading && <Loading />}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="fixed inset-0 flex items-center justify-center"
        contentLabel="Xác nhận"
      >
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto z-50">
          <h2 className="text-lg font-semibold mb-4">Xác nhận</h2>
          <p>Bạn có chắc chắn muốn tạo mới người dùng này?</p>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black"
              onClick={closeModal}
            >
              Hủy bỏ
            </button>
            <button
              className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded text-white"
              onClick={() => formik.handleSubmit()}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default CreateDeliveryUser;
