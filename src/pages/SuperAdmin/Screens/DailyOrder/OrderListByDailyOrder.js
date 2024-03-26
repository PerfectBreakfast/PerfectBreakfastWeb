import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import orderAPI from "../../../../services/orderAPI";

Modal.setAppElement("#root"); // Adjust according to your project setup

const OrderListByDailyOrder = () => {
  const { id } = useParams();
  const [orderListData, setOrderListData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);

  useEffect(() => {
    const fetchOrderFoodData = async () => {
      try {
        const data = await orderAPI.getOrderByDailyOrder(id);
        setOrderListData(data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrderFoodData();
  }, [id]);

  const openModal = (orderDetails) => {
    setSelectedOrderDetails(orderDetails);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();

    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-4 rounded-xl min-h-screen">
        <h4 className="text-2xl font-semibold mb-4">Danh sách đơn hàng</h4>
        <div className="bg-white shadow-md my-6 overflow-auto">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-800 leading-normal">
                <th>Mã đơn hàng</th>
                <th>Thời gian</th>
                <th>Tên người dùng</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orderListData.length > 0 ? (
                orderListData.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <button
                        className="font-semibold hover:font-bold hover:text-gray-950 text-gray-700"
                        onClick={() => openModal(order.orderDetails)}
                      >
                        {order.orderCode}
                      </button>
                    </td>
                    <td> {formatDate(order.creationDate)}</td>
                    <td>{order.user.name}</td>
                    <td>{order.totalQuantity}</td>
                    <td>
                      {order.totalPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    {/* <td>{order.orderStatus}</td> */}
                    <td className="text-green-500">Đã thanh toán</td>
                  </tr>
                ))
              ) : (
                <p>Loading orders...</p>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Order Details"
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            minWidth: "40%",
            maxWidth: "40%", // You can adjust the width as needed
            maxHeight: "80vh", // You can adjust the height as needed
            overflow: "auto",
          },
        }}
      >
        <div className="px-4 py-1">
          <h2 className="mb-2 font-bold text-lg text-gray-600">
            Chi tiết đơn hàng
          </h2>

          <table className="bg-slate-100 min-w-max w-full table-auto mb-3">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên</th>
                <th>Số lượng</th>
                {/* Add additional headers like unitPrice and image if needed */}
              </tr>
            </thead>
            <tbody>
              {selectedOrderDetails.map((detail, index) => (
                <tr key={index}>
                  <td>
                    {" "}
                    <img
                      src={detail.image}
                      className="rounded-full w-10 h-10"
                      alt={detail.name}
                    />
                  </td>
                  <td>{detail.comboName ? detail.comboName : detail.foods}</td>
                  <td>{detail.quantity}</td>
                  {/* Additional details can be displayed here */}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="justify-end flex">
            <button className="btn-cancel" onClick={closeModal}>
              Đóng
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderListByDailyOrder;
