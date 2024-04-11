import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import DailyOrderAPI from "../../../../services/DailyOrderAPI";
import DailyOrderStatus from "../../../../components/Status/DailyOrderStatus";
import settingAPI from "../../../../services/SettingAPI";

import { ReactComponent as FileIcon } from "../../../../assets/icons/File.svg";
import { ReactComponent as Setting } from "../../../../assets/icons/Settings.svg";
import { ReactComponent as FilterIcon } from "../../../../assets/icons/filter.svg";

import Modal from "react-modal";
import { Menu } from "@headlessui/react";

const DailyOrderList = () => {
  const [orders, setOrders] = useState([]);

  const [settingData, setSettingData] = useState(null);
  const [settingId, setSettingId] = useState(null);
  const [newTime, setNewTime] = useState("");

  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [status, setStatus] = useState();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const [modalIsOpen, setIsOpen] = useState(false);

  const [modalExportOpen, setModalExportOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    fetchOrderList();
    fetchData();
  }, [pageIndex, status]);
  const fetchOrderList = async () => {
    console.log(pageIndex, status);
    setIsLoading(true);
    try {
      const result = await DailyOrderAPI.getDailyOrderForSuperAdmin(
        pageIndex,
        status
      );
      setOrders(result.items);
      setTotalPages(result.totalPagesCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
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

  const formatDateTime = (isoDateString) => {
    if (!isoDateString) return "";
    const [year, month, day] = isoDateString.split("-");
    return `${day}/${month}/${year}`;
  };

  function openExportModal() {
    // setToDate(null);
    // setFromDate(null);
    const today = new Date();
    const sevenDaysAgo = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );

    setToDate(today.toISOString().split("T")[0]);
    setFromDate(sevenDaysAgo.toISOString().split("T")[0]);
    setModalExportOpen(true);
  }

  function closeExportModal() {
    setModalExportOpen(false);
  }

  const handleExport = async () => {
    closeExportModal();
    try {
      if (!fromDate || !toDate) {
        toast.error("Vui lòng chọn ngày!");
        return;
      }

      const response = await DailyOrderAPI.exportDailyOrderForAdmin(
        fromDate,
        toDate
      );

      // Tạo URL cho tệp tải xuống
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute(
        "download",
        `Tổng hợp đơn hàng từ ngày ${fromDate} tới ngày ${toDate}.xlsx`
      );
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      setToDate(null);
      setFromDate(null);
      return response;
    } catch (error) {
      toast.error(error.errors);
      throw error.response ? error.response.data : error.message;
    }
  };

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
  const handleDetailClick = (dailyOrderId) => {
    navigate(`${dailyOrderId}`);
  };

  const MealStatus = (meal) => {
    switch (meal) {
      case "Bữa Sáng":
        return "text-lime-500 hover:text-lime-700";
      case "Bữa Trưa":
        return "text-yellow-500 hover:text-yellow-700";
      case "Bữa Tối":
        return "text-violet-500 hover:text-violet-700";
      default:
        return "text-gray-500 hover:text-gray-700";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h4 className="text-2xl font-semibold mb-4">Tổng hợp đơn hàng</h4>
      <div className="flex justify-between items-center">
        {settingData ? (
          <div className="w-fit bg-white shadow-sm px-4 py-3 rounded-xl flex items-center mb-4">
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
        <button
          type="button"
          className="btn-add"
          onClick={() => openExportModal()}
        >
          <FileIcon />
          Tải file
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 ">
        <div>
          <table className="w-full table-auto table-dailyoder">
            <thead>
              <tr className="bg-gray-200 text-gray-800 leading-normal">
                <th className="py-2.5 w-36">Ngày giao hàng</th>
                <th className="py-2.5">Tên công ty</th>
                <th className="py-2.5 ">Địa chỉ</th>
                <th className="py-2.5 text-left w-20">Bữa ăn</th>
                <th className="py-2.5 text-center w-28">Số lượng đơn đặt</th>
                {/* <th className="py-2.5 text-center">Trạng thái</th> */}
                <th
                  className="py-2.5 text-center"
                  // onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  <Menu as="div" className="relative">
                    <Menu.Button className="py-2.5 text-center">
                      <div className=" flex justify-center items-center hover:font-bold">
                        Trạng thái <FilterIcon className="w-4 mx-1" />
                      </div>
                    </Menu.Button>
                    <Menu.Items className="absolute mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-10">
                      {[
                        { label: "Tất cả", value: "" },
                        { label: "Chờ đặt đơn", value: 0 },
                        { label: "Chờ phân phối", value: 1 },
                        { label: "Chờ xác nhận", value: 2 },
                        { label: "Đang nấu", value: 3 },
                        { label: "Chờ lấy hàng", value: 4 },
                        { label: "Đang giao hàng", value: 5 },
                        { label: "Hoàn thành", value: 6 },
                      ].map((statusOption) => (
                        <Menu.Item key={statusOption.value}>
                          {({ active }) => (
                            <div
                              className={`${
                                active ? "bg-gray-100" : ""
                              } px-4 py-2 cursor-pointer`}
                              onClick={() => {
                                setStatus(statusOption.value.toString()); // Adjust this function to your needs
                                // Add your logic for hiding dropdown or any other side effects
                              }}
                            >
                              {statusOption.label}
                            </div>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Menu>
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-3 px-3">
                    Đang tải...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((item, itemIndex) => {
                  // Calculate total orders for the item.
                  let totalOrdersForItem = item.companies.reduce(
                    (acc, cur) => acc + cur.dailyOrders.length,
                    0
                  );

                  return item.companies.flatMap((company, companyIndex) => {
                    // Calculate total orders for the company.
                    let totalOrdersForCompany = company.dailyOrders.length;

                    return company.dailyOrders.map((order, orderIndex) => (
                      <tr key={order.id}>
                        {companyIndex === 0 && orderIndex === 0 && (
                          <td
                            className="py-2.5 px-3 text-left"
                            rowSpan={totalOrdersForItem}
                          >
                            {formatDate(item.bookingDate)}
                          </td>
                        )}
                        {orderIndex === 0 && (
                          <td
                            className="py-2.5 px-3 text-left"
                            rowSpan={totalOrdersForCompany}
                          >
                            <span className="font-semibold">
                              {company.name}
                            </span>
                          </td>
                        )}
                        {orderIndex === 0 && (
                          <td
                            className="py-2.5 px-3 text-left"
                            rowSpan={totalOrdersForCompany}
                          >
                            {company.address}
                          </td>
                        )}
                        <td className="py-2.5 w-28 text-left">
                          <button
                            className={`${MealStatus(
                              order.meal
                            )} font-semibold`}
                            onClick={() => handleDetailClick(order.id)}
                          >
                            {order.meal}
                          </button>
                        </td>
                        <td className="py-3 text-center font-semibold">
                          {order.orderQuantity}
                        </td>
                        <td className="py-2.5 px-3 text-center min-w-48">
                          <DailyOrderStatus status={order.status} />
                        </td>
                      </tr>
                    ));
                  });
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-3 px-3">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot>
              <tr>
                <td colspan="6">
                  <div className="pagination-container">
                    <Pagination
                      componentName="div"
                      count={totalPages}
                      page={pageIndex + 1}
                      onChange={handlePageChange}
                      shape="rounded"
                      showFirstButton
                      showLastButton
                    />
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
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
          <h2 className="text-xl font-semibold mb-3">
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

      <Modal
        isOpen={modalExportOpen}
        onRequestClose={() => setModalExportOpen(false)}
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
          <h2 className="text-xl font-semibold mb-3">Chọn ngày xuất file</h2>
          <div className="mb-2.5">
            <label htmlFor="fromDate" className="label-input">
              Từ ngày
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="mb-1">
            <label htmlFor="toDate" className="label-input">
              Tới ngày
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              className="btn-cancel"
              onClick={() => setModalExportOpen(false)}
            >
              Hủy
            </button>
            <button className="btn-confirm" onClick={handleExport}>
              Xuất file
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DailyOrderList;
