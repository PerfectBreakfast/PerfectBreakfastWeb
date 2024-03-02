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
        const data = await deliveryUnitAPI.getDeliveryById(id);
        if (data) {
          formik.setValues(data);
        }
      } catch (error) {
        console.error("Error fetching delivery data:", error);
        toast.error("Failed to fetch delivery data!");
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
      phoneNumber: Yup.string().required("Số điện thoại không được để trống"),
      commissionRate: Yup.string().required("Hoa hồng không được để trống"),
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
    <div className="mx-auto bg-white p-8 shadow-xl rounded-2xl w-5/6">
      <h2 className="text-xl font-semibold mb-4">
        Chỉnh sửa đơn vị vận chuyển
      </h2>
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
        {/* Dynamic form fields */}
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
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mt-2">
              {formik.errors.name}
            </div>
          )}
        </div>
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
          {formik.touched.address && formik.errors.address && (
            <div className="text-red-500 text-sm mt-2">
              {formik.errors.address}
            </div>
          )}
        </div>
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
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <div className="text-red-500 text-sm mt-2">
              {formik.errors.phoneNumber}
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="commissionRate"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Hoa hồng (%):
          </label>
          <input
            id="commissionRate"
            name="commissionRate"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.commissionRate}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Nhập tỷ lệ hoa hồng"
          />
          {formik.touched.commissionRate && formik.errors.commissionRate && (
            <div className="text-red-500 text-sm mt-2">
              {formik.errors.commissionRate}
            </div>
          )}
        </div>
        {/* Other fields like address, phoneNumber, commissionRate with similar structure */}
        {/* Edit button */}
        <button
          type="button"
          className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded text-white"
          onClick={openModal}
        >
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

export default EditDelivery;
