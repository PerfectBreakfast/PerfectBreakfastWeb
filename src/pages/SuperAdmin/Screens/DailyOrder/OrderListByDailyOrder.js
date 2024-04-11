import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import orderAPI from "../../../../services/orderAPI";
import Loading from "../../../Loading/Loading";
import ShippingOrderAPI from "../../../../services/ShippingOrderAPI";
import OrderStatus from "../../../../components/Status/OrderStatus";

import { ReactComponent as UserIcon } from "../../../../assets/icons/User Circle.svg";

Modal.setAppElement("#root"); // Adjust according to your project setup

const OrderListByDailyOrder = () => {
  const { id } = useParams();
  const [orderListData, setOrderListData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [staffData, setStaffData] = useState(null);

  useEffect(() => {
    const fetchOrderFoodData = async () => {
      try {
        const data = await orderAPI.getOrderByDailyOrder(id);
        setOrderListData(data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    const fetchStaffByOder = async () => {
      try {
        const data = await ShippingOrderAPI.getStaffByDailyOrder(id);
        setStaffData(data);
      } catch (error) {
        console.error("Error fetching dish data:", error);
      }
    };

    fetchOrderFoodData();
    fetchStaffByOder();
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
      <h4 className="text-2xl font-semibold mb-4">Danh sách đơn đặt</h4>
      <div className="bg-white rounded-xl p-4 mb-4">
        <h4 className="text-xl font-semibold mb-2.5">Chi tiết đơn hàng</h4>
        <div className="overflow-x-auto max-h-96 mt-2">
          <table className="w-full table-auto mb-4">
            <thead className="sticky top-0">
              <tr className="bg-gray-200 text-gray-800 leading-normal">
                <th>Mã đơn hàng</th>
                <th>Thời gian</th>
                <th>Tên người dùng</th>
                <th>Số lượng </th>
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
                    <td className="text-green-500 font-semibold">
                      <OrderStatus status={order.orderStatus} />
                    </td>
                  </tr>
                ))
              ) : (
                <Loading />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2.5">Nhân viên giao hàng</h2>
        <div className="overflow-x-auto max-h-96 mt-2">
          <table className="w-full table-auto mb-4">
            <thead className="sticky top-0">
              <tr className="bg-gray-200 text-gray-800 leading-normal">
                <th className="py-3 px-6 text-left">Hình ảnh</th>
                <th className="py-3 px-6 ">Tên nhân viên</th>
                <th className="py-3 px-6 ">Email</th>
                <th className="py-3 px-6 text-right">Số điện thoại</th>
              </tr>
            </thead>
            {staffData && staffData.length > 0 ? (
              <tbody className="text-gray-600 text-sm font-light">
                {staffData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td>
                      {/* <img
                        src={item.image}
                        alt={item.name}
                        className="display-img-user"
                      /> */}
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <UserIcon className="w-10 h-10 rounded-full" />
                      )}
                    </td>
                    <td className="py-3 px-6 text-left whitespace-nowrap font-bold">
                      {item.name}
                    </td>
                    <td className="py-3 px-6 text-left">{item.email}</td>
                    <td className="py-3 px-6 text-right">{item.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-3 px-6">
                  Chưa có nhân viên giao hàng
                </td>
              </tr>
            )}{" "}
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
