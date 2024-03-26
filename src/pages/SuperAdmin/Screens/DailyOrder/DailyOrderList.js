import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import DailyOrderAPI from "../../../../services/DailyOrderAPI";
import DailyOrderStatus from "../../../../components/Status/DailyOrderStatus";
import settingAPI from "../../../../services/SettingAPI";

import { ReactComponent as Setting } from "../../../../assets/icons/Settings.svg";

import Modal from "react-modal";

const DailyOrderList = () => {
  const [orders, setOrders] = useState([]);

  const [settingData, setSettingData] = useState(null);
  const [settingId, setSettingId] = useState(null);
  const [newTime, setNewTime] = useState("");

  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modalIsOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        const result = await DailyOrderAPI.getDailyOrderForSuperAdmin(
          pageIndex
        );
        setOrders(result.items);
        setTotalPages(result.totalPagesCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchOrderList();
    fetchData();
  }, [pageIndex]);
  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
  };
  console.log("data", orders);

  const fetchData = async () => {
    try {
      const data = await settingAPI.getSettingInfo();
      setSettingData(data);
    } catch (error) {
      console.error(error.errors);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeString) => {
    const parts = timeString.split(":"); // Split the time string by colon
    return `${parts[0]}:${parts[1]}`; // Return only the hour and minute
  };

  const handleOpenModal = (settingId) => {
    // Assuming `settingData.time` is something like "HH:mm"
    setNewTime(settingData.time); // Just set it directly, format adjustment happens later
    openModal();
    setSettingId(settingId);
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleConfirmSetting = async () => {
    if (settingId && newTime) {
      closeModal();
      try {
        // Construct payload in the correct format
        const payload = {
          time: newTime, // newTime is already in "HH:mm", just use it directly
        };

        await settingAPI.editHangfire(settingId, payload); // Make sure to send the payload
        toast.success("Cập nhật thời gian thành công");
        fetchData(); // Refresh setting data
      } catch (error) {
        console.error("Error updating setting:", error);
        toast.error("Có lỗi xảy ra khi cập nhật thời gian!");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h4 className="text-2xl font-semibold mb-4">Danh sách đơn hàng</h4>
      {settingData ? (
        <div className="w-fit border-1 border-green-500 px-4 py-3 rounded-xl flex items-center">
          <p className="font-semibold text-gray-700">
            Thời gian chốt đơn hàng: {formatTime(settingData.time)}
          </p>
          <button
            className="ml-4 border-1 p-1 border-gray-300 rounded-xl"
            onClick={() => handleOpenModal(settingData.id)}
          >
            <Setting />
          </button>
        </div>
      ) : (
        <p></p>
      )}
      <div className="bg-white shadow-md my-6 overflow-auto">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-800 leading-normal">
              <th className="py-2.5 ">Ngày giờ</th>
              <th className="py-2.5">Tên công ty</th>
              <th className="py-2.5 ">Địa chỉ</th>
              <th className="py-2.5">Bữa ăn</th>
              <th className="py-2.5 text-center">Số lượng</th>
              <th className="py-2.5 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orders.map((item) =>
              item.companies.map((company) =>
                company.dailyOrders.map((order) => (
                  <tr
                    className="border-b border-gray-200 hover:bg-gray-100"
                    key={order.id}
                  >
                    <td className="py-2.5 px-6 text-left">
                      {/* {item.bookingDate} */}
                      {formatDate(item.bookingDate)}
                    </td>
                    <td className="py-2.5 px-6 text-left">
                      <span className=" font-semibold"> {company.name}</span>
                    </td>
                    <td className="py-2.5 px-6 text-left">{company.address}</td>
                    <td className="py-2.5 px-6 text-left">
                      <span className=" font-semibold"> {order.meal}</span>
                    </td>
                    <td className="py-3 text-center font-semibold">
                      {order.orderQuantity}
                    </td>
                    <td className="py-2.5 px-6 text-center">
                      <DailyOrderStatus status={order.status} />
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
        <div className="pagination-container" style={{ marginTop: "5px" }}>
          <Pagination
            componentName="div"
            count={totalPages}
            page={pageIndex + 1}
            onChange={handlePageChange}
            color="success"
          />
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "2rem",
            borderRadius: "0.5rem",
            maxWidth: "500px",
            width: "90%",
          },
        }}
        contentLabel="Assign Manager Modal"
      >
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4">
            Thay đổi thời gian chốt đơn hàng
          </h2>
          <div className="mb-1">
            <label htmlFor="timeInput" className="label-input">
              Chọn thời gian mới
            </label>
            <input
              id="timeInput"
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(`${e.target.value}:00`)} // Append :00 to meet the required format
            ></input>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button className="btn-cancel" onClick={() => setIsOpen(false)}>
              Hủy
            </button>
            <button className="btn-confirm" onClick={handleConfirmSetting}>
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default DailyOrderList;
