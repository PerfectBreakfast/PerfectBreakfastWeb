import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Loading/Loading";
import Modal from "react-modal";
import supplierUnitAPI from "../../../../services/supplierUnitAPI";

const CreateSupplier = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên công ty không được để trống"),
      address: Yup.string().required("Địa chỉ không được để trống"),
      phoneNumber: Yup.string()
        .required("Số điện thoại không được để trống")
        .test(
          "startsWith0",
          "Số điện thoại phải bắt đầu bằng số 0",
          (value) => value && value.startsWith("0")
        )
        .test(
          "lengthIs10",
          "Số điện thoại phải có đúng 10 số",
          (value) => value && value.length === 10
        ),
    }),
    onSubmit: async (values) => {
      setIsOpen(false);
      setIsLoading(true);
      console.log("data", values);
      try {
        // API call to create management unit with form values
        const createdSupplier = await supplierUnitAPI.createSupplierUnit(
          values
        );
        toast.success("Thêm nhà cung cấp thành công!");
        navigate(-1);
      } catch (error) {
        console.error("Error creating management unit:", error);
        toast.error("Error creating management unit");
      } finally {
        setIsLoading(false); // Ẩn loading
      }
    },
  });

  const handleCreateClick = async () => {
    // Đánh dấu tất cả các trường là đã chạm vào, bao gồm cả selectedImage
    formik.setTouched({
      name: true,
      address: true,
      phoneNumber: true,
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
      <h2 className="text-xl font-semibold mb-4">Tạo mới nhà cung cấp</h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
        {/* Name field */}
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Tên công ty:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Nhập tên công ty"
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-sm mt-2">
              {formik.errors.name}
            </div>
          ) : null}
        </div>

        {/* Address field */}
        <div>
          <label
            htmlFor="address"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Địa chỉ:
          </label>
          <input
            id="address"
            name="address"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Nhập địa chỉ"
          />
          {formik.touched.address && formik.errors.address ? (
            <div className="text-red-500 text-sm mt-2">
              {formik.errors.address}
            </div>
          ) : null}
        </div>

        {/* Phone Number field */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Số điện thoại:
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Nhập số điện thoại"
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
            <div className="text-red-500 text-sm mt-2">
              {formik.errors.phoneNumber}
            </div>
          ) : null}
        </div>

        {/* Submit button */}

        <button
          type="button"
          className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded text-white"
          onClick={handleCreateClick}
        >
          Tạo mới
        </button>
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
          <p>Bạn có chắc chắn muốn tạo mới nhà cung cấp này?</p>
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

export default CreateSupplier;
