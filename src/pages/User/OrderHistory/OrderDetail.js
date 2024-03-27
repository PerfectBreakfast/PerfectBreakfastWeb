import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import orderAPI from "../../../services/orderAPI";
import QRCode from "qrcode.react";
import OrderDetailSkeleton from "./OrderDetailSkeleton";
import { ClipLoader } from "react-spinners";
import Modal from "react-modal";

import { ReactComponent as Check } from "../../../assets/icons/check.svg";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [orderCode, setOrderCode] = useState();

  const [showPopup, setShowPopup] = useState(false);

  const [modalAction, setModalAction] = useState({ action: "", id: null });
  const [modalIsOpen, setIsOpen] = useState(false);

  const [formattedDate, setFormattedDate] = useState("");

  const formatDate = (dateString) => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(5, 7);
    const day = dateString.substring(8, 10);
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchComboData = async () => {
      try {
        const data = await orderAPI.getOrderDetail(orderId);
        setOrderData(data);
        const orderDate = formatDate(data.bookingDate);
        setFormattedDate(orderDate);
      } catch (error) {
        console.error("Error fetching combo data:", error);
      }
    };

    fetchComboData();
  }, [orderId]);
  const handleGoBack = () => {
    navigate(-1);
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
  const getStatusColorAndText = (status) => {
    switch (status) {
      case "Pending":
        return { color: "text-gray-500", text: "Chờ thanh toán" };
      case "Paid":
        return { color: "text-yellow-500", text: "Đã thanh toán" };
      case "Complete":
        return { color: "text-green-500", text: "Đã giao thành công" };
      case "Cancel":
        return { color: "text-red-500", text: "Đã hủy" };
      default:
        return { color: "text-gray-500", text: "Chưa xác định" };
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const result = await orderAPI.repaymentOrder(orderId);

      // Kiểm tra xem có paymentUrl trong kết quả không
      if (result.paymentUrl) {
        // Chuyển hướng tới trang thanh toán
        window.location.href = result.paymentUrl;
      } else {
        // Xử lý khi không có paymentUrl
        console.error("No paymentUrl found in the result:", result);
        navigate("/cancel");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error placing order:", error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
      navigate("/cancel");
    }
  };

  const handleCancel = async (orderCode) => {
    setIsLoading(true);
    try {
      const result = await orderAPI.cancelOrder(orderCode);

      // Kiểm tra xem có paymentUrl trong kết quả không
      if (result.paymentUrl) {
        // Chuyển hướng tới trang thanh toán
        window.location.href = result.paymentUrl;
      } else {
        // Xử lý khi không có paymentUrl
        console.error("No paymentUrl found in the result:", result);
        navigate("/cancel");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error placing order:", error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
      navigate("/cancel");
    }
  };

  const handleModalCheckout = () => {
    openModal("checkout");
  };

  const handleModalCancel = (orderCode) => {
    setOrderCode(orderCode);
    openModal("cancel");
  };

  function openModal(action, id) {
    setModalAction({ action, id });
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const confirmAction = async () => {
    // setLoadingDelete(true);
    closeModal();
    if (modalAction.action === "checkout") {
      setIsLoading(true);
      try {
        const result = await orderAPI.repaymentOrder(orderId);

        // Kiểm tra xem có paymentUrl trong kết quả không
        if (result.paymentUrl) {
          // Chuyển hướng tới trang thanh toán
          window.location.href = result.paymentUrl;
        } else {
          // Xử lý khi không có paymentUrl
          console.error("No paymentUrl found in the result:", result);
          navigate("/cancel");
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error placing order:", error);
        // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
        navigate("/cancel");
      }
    } else if (modalAction.action === "cancel") {
      try {
        const result = await orderAPI.cancelOrder(orderCode);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate(-1);
        }, 500);
      } catch (error) {
        console.error("Error placing order:", error);
        // navigate("/cancel");
      }
    }
    closeModal(); // Đóng modal sau khi xử lý
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col ">
        {isLoading && (
          <div className="fixed inset-0 bg-white flex justify-center items-center">
            <div className="loader">
              {" "}
              <ClipLoader
                color="#0CBF66"
                loading={isLoading}
                size={45}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          </div>
        )}
        {orderData && (
          <>
            <div className="flex justify-between">
              <div className="flex items-center">
                <button onClick={handleGoBack} className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h1 className="text-xl font-semibold mb-4">
                  Chi tiết đơn hàng
                </h1>
              </div>

              <span className="text-sm font-medium text-gray-500 py-1 px-3">
                #{orderData.orderCode}
              </span>
            </div>

            <div className=" rounded-lg mb-1">
              <h2 className="text-lg font-semibold mb-2">
                Thông tin nhận hàng
              </h2>
              <div className="bg-white shadow rounded-xl p-3 mb-3 last:mb-0">
                <p className="text-gray-600 mb-1">
                  Thời gian nhận hàng: {orderData.meal}, {formattedDate}
                </p>
                <p className="text-gray-600 mb-1">
                  Công ty: {orderData.company.name}
                </p>
                <p className="text-gray-600">
                  Địa chỉ: {orderData.company.address}
                </p>
              </div>
              <h2 className="text-lg font-semibold mb-2">Tóm tắt đơn hàng</h2>
              {orderData.orderDetails.map((detail, index) => (
                <div
                  key={index}
                  className="bg-white shadow rounded-xl p-3 mb-3 last:mb-0"
                >
                  <div className="flex justify-between">
                    <div className="flex ">
                      <img
                        src={detail.image}
                        alt={detail.comboName}
                        className="h-20 w-20 object-cover rounded-lg mr-2"
                      />
                      <div>
                        {detail.comboName !== "" ? (
                          <p className="user-food-name">{detail.comboName}</p>
                        ) : (
                          <p className="user-food-name">{detail.foods}</p>
                        )}
                        <p className=" text-gray-500">x {detail.quantity}</p>
                      </div>
                    </div>
                    <span className=" font-semibold">
                      {detail.unitPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className=" mb-4">
              <div className="flex justify-between">
                <p className="text-gray-600">Trạng thái đơn hàng</p>

                <p
                  className={`${
                    getStatusColorAndText(orderData.orderStatus).color
                  } font-semibold`}
                >
                  {getStatusColorAndText(orderData.orderStatus).text}
                </p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-gray-600">Phương thức thanh toán</p>
                <p className="text-gray-600 font-semibold">Ngân hàng</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-gray-600">Tổng cộng</p>
                <p className="text-black font-bold">
                  {orderData.totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
            </div>

            <div>
              {orderData.orderStatus === "Paid" && (
                <div className="flex justify-center">
                  <QRCode value={`pb#${orderData.id}`} />
                </div>
              )}

              {orderData.orderStatus === "Paid" && (
                <div className="flex justify-center">
                  <h2 className="text-lg font-semibold mt-3">
                    Quét để nhận hàng
                  </h2>
                </div>
              )}
            </div>
            {!isLoading && orderData.orderStatus === "Pending" && (
              <div className="fixed bottom-0 left-0 right-0 w-full">
                <div className="flex mt-4 px-2 pt-3 pb-1 shadow-lg bg-white rounded-t-xl">
                  <button
                    onClick={() => handleModalCancel(orderData.orderCode)}
                    className="border-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-2.5 w-full mb-2 rounded-xl transition-colors font-bold mx-2"
                  >
                    Hủy đơn hàng
                  </button>
                  <button
                    className="bg-green-500 text-white py-2.5 w-full mb-2 rounded-xl hover:bg-green-700 transition-colors font-bold mx-2"
                    onClick={handleModalCheckout}
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="fixed inset-0 flex items-center justify-center"
        contentLabel="Xác nhận"
      >
        <div className="confirm-modal ">
          <h2 className="text-lg font-semibold mb-2">Xác nhận</h2>
          <p>
            Bạn có chắc chắn muốn{" "}
            {modalAction.action === "checkout" ? "thanh toán" : "hủy"} đơn hàng
            này?
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <button className="btn-cancel" onClick={closeModal}>
              Hủy bỏ
            </button>
            <button
              className={`${
                modalAction.action === "cancel"
                  ? "btn-confirm-delete"
                  : "btn-confirm"
              }`}
              onClick={confirmAction}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>

      {showPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50 bg-white bg-opacity-75">
          <div className="text-white p-3 rounded-lg shadow-lg bg-black bg-opacity-50 flex flex-col items-center">
            <div className="flex items-center">
              <Check className="w-9" />
            </div>
            <div className="flex items-center mt-2">
              <p className="ml-2">Hủy đơn hàng thành công!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
