import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import orderAPI from "../../../services/orderAPI";
import OrderDetailSkeleton from "../../User/OrderHistory/OrderDetailSkeleton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";

const CustomerOrderDetail = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchComboData = async () => {
      try {
        const data = await orderAPI.getOrderDetail(orderId);
        setOrderData(data);
      } catch (error) {
        console.error("Error fetching combo data:", error);
      }
    };

    fetchComboData();
  }, [orderId]);
  const handleGoBack = () => {
    navigate(-1);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleConfirm = async () => {
    try {
      await orderAPI.confirmOrderForDeliveryStaff(orderId);
      toast.success("Đơn hàng đã được xác nhận!");
      navigate(-1);
    } catch (error) {
      console.error("Error confirming order:", error.errors);
      toast.error(error.errors);
    } finally {
      closeModal();
    }
  };

  if (!orderData) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 1 }, (_, index) => (
          <OrderDetailSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 ">
      <div className="flex items-center mb-6">
        <button
          onClick={handleGoBack}
          className="mr-2 text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
        >
          <ArrowBackIosIcon />
        </button>
        <h2 className="text-2xl font-bold flex-grow text-gray-800">
          Thông tin đơn hàng
        </h2>
      </div>
      <div>
        <div className="shadow bg-white rounded-xl p-3 mb-3">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Thông tin khách hàng:
          </h3>
          <p className="text-gray-600">Tên khách hàng: {orderData.user.name}</p>
          <p className="text-gray-600">
            Số điện thoại: {orderData.user.phoneNumber}
          </p>
          <p className="text-gray-600">Công ty: {orderData.company.name}</p>
        </div>
        <div className="mb-20">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Chi tiết đơn hàng:
          </h3>
          {orderData.orderDetails.map((detail, index) => (
            <div
              key={index}
              className="mb-3 px-4 py-3 rounded-xl shadow bg-white"
            >
              <div className="flex items-center">
                <img
                  src={detail.image}
                  alt={detail.comboName}
                  className="w-20 h-20 mr-4 rounded-lg"
                />
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">
                    {detail.comboName}
                  </h4>
                  <p className="text-gray-600">Món ăn: {detail.foods}</p>
                  <p className="text-gray-600">Số lượng: {detail.quantity}</p>
                </div>
              </div>
            </div>
          ))}
          {orderData.orderDetails.map((detail, index) => (
            <div
              key={index}
              className="mb-3 px-4 py-3 rounded-xl shadow bg-white"
            >
              <div className="flex items-center">
                <img
                  src={detail.image}
                  alt={detail.comboName}
                  className="w-20 h-20 mr-4 rounded-lg"
                />
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">
                    {detail.comboName}
                  </h4>
                  <p className="text-gray-600">Món ăn: {detail.foods}</p>
                  <p className="text-gray-600">Số lượng: {detail.quantity}</p>
                </div>
              </div>
            </div>
          ))}
          {orderData.orderDetails.map((detail, index) => (
            <div
              key={index}
              className="mb-3 px-4 py-3 rounded-xl shadow bg-white"
            >
              <div className="flex items-center">
                <img
                  src={detail.image}
                  alt={detail.comboName}
                  className="w-20 h-20 mr-4 rounded-lg"
                />
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">
                    {detail.comboName}
                  </h4>
                  <p className="text-gray-600">Món ăn: {detail.foods}</p>
                  <p className="text-gray-600">Số lượng: {detail.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 w-full">
        <div className="flex flex-col mt-4 px-2 pt-4 pb-1 shadow-lg bg-white rounded-t-2xl">
          <button
            className="bg-green-500 text-white  py-2.5  mb-1 rounded-xl hover:bg-green-600 transition-colors"
            onClick={openModal}
          >
            Xác nhận giao hàng
          </button>
        </div>
      </div>
      {/* Modal xác nhận */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="fixed inset-0 flex items-center justify-center mx-4"
        contentLabel="Xác nhận cập nhật"
      >
        <div className="confirm-modal ">
          <h2 className="text-lg font-semibold mb-2">Xác nhận</h2>
          <p>Bạn có chắc chắn xác nhận đã giao thành công đơn hàng này?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button className="btn-cancel" onClick={closeModal}>
              Hủy bỏ
            </button>
            <button className="btn-confirm" onClick={handleConfirm}>
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default CustomerOrderDetail;
