import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Loading/Loading";
import Modal from "react-modal";
import deliveryUnitAPI from "../../../../services/deliveryUnitAPI";

const CreateDelivery = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      phoneNumber: "",
      commissionRate: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên công ty không được để trống"),
      address: Yup.string().required("Địa chỉ không được để trống"),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Chỉ được nhập số")
        .matches(/^0\d{9}$/, "Số điện thoại phải bắt đầu từ số 0 và có 10 số")
        .required("Số điện thoại không được để trống"),
      commissionRate: Yup.number()
        .typeError("Tỷ lệ hoa hồng phải là số")
        .positive("Tỷ lệ hoa hồng phải là số dương")
        .max(100, "Tỷ lệ hoa hồng không được lớn hơn 100")
        .required("Tỷ lệ hoa hồng không được để trống"),
    }),
    onSubmit: async (values) => {
      setIsOpen(false);
      setIsLoading(true);
      try {
        const createdDelivery = await deliveryUnitAPI.createDeliveryUnit(
          values
        );
        toast.success("Thêm đơn vị vận chuyển thành công!");
        navigate(-1); // Navigate back
      } catch (error) {
        console.error("Error creating delivery unit:", error);
        toast.error("Error creating delivery unit");
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
      commissionRate: true,
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
      <h2 className="text-xl font-semibold mb-4">Tạo mới đơn vị vận chuyển</h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
        {/* Name field */}
        <div>
          <label htmlFor="name" className="label-input">
            Tên công ty:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className="input-form"
            placeholder="Nhập tên công ty"
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="formik-error-message">{formik.errors.name}</div>
          ) : null}
        </div>

        {/* Address field */}
        <div>
          <label htmlFor="address" className="label-input">
            Địa chỉ:
          </label>
          <input
            id="address"
            name="address"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
            className="input-form"
            placeholder="Nhập địa chỉ"
          />
          {formik.touched.address && formik.errors.address ? (
            <div className="formik-error-message">{formik.errors.address}</div>
          ) : null}
        </div>

        {/* Phone Number field */}
        <div>
          <label htmlFor="phoneNumber" className="label-input">
            Số điện thoại:
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
            className="input-form"
            placeholder="Nhập số điện thoại"
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
            <div className="formik-error-message">
              {formik.errors.phoneNumber}
            </div>
          ) : null}
        </div>

        {/* Commission Rate field */}
        <div>
          <label htmlFor="commissionRate" className="label-input">
            Hoa hồng (%):
          </label>
          <input
            id="commissionRate"
            name="commissionRate"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.commissionRate}
            className="input-form"
            placeholder="Nhập tỷ lệ hoa hồng"
          />
          {formik.touched.commissionRate && formik.errors.commissionRate ? (
            <div className="formik-error-message">
              {formik.errors.commissionRate}
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
          <p>Bạn có chắc chắn muốn tạo mới đơn vị vận chuyển này?</p>
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

export default CreateDelivery;
