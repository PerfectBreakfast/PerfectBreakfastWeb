import React, { useEffect, useState } from "react";
import dishAPI from "../../../services/dishAPI";
import { useNavigate, useParams } from "react-router-dom";
import DailyOrderStatusText from "../../../components/Status/DailyOrderStatusText";
import ShippingOrderAPI from "../../../services/ShippingOrderAPI";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const DailyOrderDetail = () => {
  const { dailyOrderId } = useParams();

  const [orderData, setOrderData] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    fetchOrderDetail();
  }, [dailyOrderId]);

  const fetchOrderDetail = async () => {
    try {
      const data = await dishAPI.getDailyOrderDetailByDelivery(dailyOrderId);
      setOrderData(data);
    } catch (error) {
      console.error("Error fetching dish data:", error);
    }
  };

  const handleConfirm = async () => {
    try {
      await ShippingOrderAPI.confirmShippingOrderByStaff(dailyOrderId);
      toast.success("Đơn hàng đã được xác nhận!");
      fetchOrderDetail();
    } catch (error) {
      console.error("Error confirming order:", error.errors);
      toast.error(error.errors);
    } finally {
      closeModal();
    }
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const LoadingSkeleton = () => (
    <div className="mt-6 w-5/6 mx-auto animate-pulse">
      <div className="space-y-4">
        <div className="h-8 bg-gray-300 rounded-md w-3/4"></div>
        <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
          <div className="p-6 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>

        <div className="h-6 bg-gray-300 rounded-md w-1/2"></div>
        <div className="overflow-x-auto mt-2">
          <div className="w-full mb-4">
            <div className="bg-gray-200 rounded-t-lg h-6 w-full"></div>
            <div className="space-y-2 pt-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between space-x-4 p-2">
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-3">
        <button onClick={handleGoBack} className="">
          <ArrowBackIosIcon />
        </button>
        <h2 className="text-2xl font-bold  text-center">Thông đơn tin hàng</h2>
      </div>

      {orderData ? (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          <p className="mb-2">
            Tên công ty:
            <span className="font-bold"> {orderData.companyName}</span>
          </p>
          <p className="mb-2">
            Số điện thoại<span className="font-bold"> {orderData.phone}</span>
          </p>
          <p className="mb-2">
            Bữa ăn:<span className="font-bold"> {orderData.meal}</span>
          </p>

          <h2 className="text-xl font-semibold mb-3">Chi tiết đơn hàng</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Tên món ăn</th>
                <th className="py-3 px-6 text-right">Số lượng</th>
              </tr>
            </thead>
            {orderData.totalFoodResponses &&
            orderData.totalFoodResponses.length > 0 ? (
              <tbody className="text-gray-600 text-sm font-light">
                {orderData.totalFoodResponses.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap font-bold">
                      {item.name}
                    </td>
                    <td className="py-3 px-6 text-right">
                      {item.quantity} món
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-3 px-6">
                  Không có món ăn
                </td>
              </tr>
            )}{" "}
          </table>
        </div>
      ) : (
        <LoadingSkeleton />
      )}
      {orderData && orderData.status === "Waiting" && (
        <div className="fixed bottom-0 left-0 right-0 w-full">
          <div className="flex flex-col mt-4 px-2 pt-4 pb-1 shadow-lg bg-white rounded-t-2xl">
            <button
              className="bg-green-500 text-white  py-2.5  mb-2 rounded-xl hover:bg-green-600 transition-colors"
              onClick={openModal}
            >
              Xác nhận đã nhận hàng
            </button>
          </div>
        </div>
      )}
      {/* Modal xác nhận */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="fixed inset-0 flex items-center justify-center"
        contentLabel="Xác nhận cập nhật"
      >
        <div className="confirm-modal ">
          <h2 className="text-lg font-semibold mb-2">Xác nhận</h2>
          <p>Bạn có chắc chắn xác nhận đã nhận đơn hàng này?</p>
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

export default DailyOrderDetail;
