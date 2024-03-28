import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import managementUnitAPI from "../../../../services/managementUnitAPI";
import { toast } from "react-toastify";
import Modal from "react-modal";
import Loading from "../../../Loading/Loading";
import deliveryUnitAPI from "../../../../services/deliveryUnitAPI";

const EditDelivery = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        setIsLoading(true);
        const data = await deliveryUnitAPI.getDeliveryById(id);
        if (data) {
          formik.setValues(data);
        }
      } catch (error) {
        console.error("Error fetching delivery data:", error);
        toast.error("Failed to fetch delivery data!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryData();
  }, [id]);

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
      console.log("data", values);
      try {
        await deliveryUnitAPI.editDelivery(id, values);
        toast.success("Cập nhật đơn vị vận chuyển thành công!");
        navigate(-1);
      } catch (error) {
        console.error("Error updating delivery:", error);
        toast.error("Cập nhật đơn vị vận chuyển thất bại!");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="mx-auto bg-white p-8 shadow-xl rounded-2xl my-4 h-fit w-5/6">
      <h2 className="text-xl font-semibold mb-4">
        Chỉnh sửa đơn vị vận chuyển
      </h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
        {/* Dynamic form fields */}
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
          {formik.touched.name && formik.errors.name && (
            <div className="formik-error-message">{formik.errors.name}</div>
          )}
        </div>
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
          {formik.touched.address && formik.errors.address && (
            <div className="formik-error-message">{formik.errors.address}</div>
          )}
        </div>
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
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <div className="formik-error-message">
              {formik.errors.phoneNumber}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="commissionRate" className="label-input">
            Hoa hồng (%):
          </label>
          <input
            id="commissionRate"
            name="commissionRate"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.commissionRate}
            className="input-form"
            placeholder="Nhập tỷ lệ hoa hồng"
          />
          {formik.touched.commissionRate && formik.errors.commissionRate && (
            <div className="formik-error-message">
              {formik.errors.commissionRate}
            </div>
          )}
        </div>
        {/* Other fields like address, phoneNumber, commissionRate with similar structure */}
        {/* Edit button */}
        <button type="button" className="btn-submit-form" onClick={openModal}>
          Lưu thay đổi
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
          <p>
            Bạn có chắc chắn muốn lưu thay đổi cho đơn vị vận chuyển này không?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <button className="btn-cancel" onClick={closeModal}>
              Hủy bỏ
            </button>
            <button
              className="btn-confirm "
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

export default EditDelivery;
