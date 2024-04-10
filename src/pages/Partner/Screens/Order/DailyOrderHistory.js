import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DailyOrderAPI from "../../../../services/DailyOrderAPI";
import DailyOrderStatus from "../../../../components/Status/DailyOrderStatus";
import { Pagination } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { ReactComponent as FileIcon } from "../../../../assets/icons/File.svg";
import { toast } from "react-toastify";
import Modal from "react-modal";

const DailyOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [modalExportOpen, setModalExportOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchOrderList = async () => {
      setIsLoading(true);
      try {
        const result = await DailyOrderAPI.getDailyOrderHistoryForPartner(
          pageIndex
        );
        setOrders(result.items);
        setTotalPages(result.totalPagesCount);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };
    fetchOrderList();
  }, [pageIndex]);
  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
  };
  const handleDetailClick = (dailyOrderId) => {
    navigate(`${dailyOrderId}`);
  };

  console.log("data", orders);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  function openExportModal() {
    setToDate(null);
    setFromDate(null);
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

      const response = await DailyOrderAPI.exportDailyOrder(fromDate, toDate);

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

  const MealStatus = (meal) => {
    switch (meal) {
      case "Bữa Sáng":
        return "text-lime-500 hover:text-lime-700";
      case "Bữa Trưa":
        return "text-green-500 hover:text-green-700";
      case "Bữa Tối":
        return "text-violet-500 hover:text-violet-700";
      default:
        return "text-gray-500 hover:text-gray-700";
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-2">Lịch sử đơn hàng</h2>
      <div className="flex justify-end mb-3">
        {" "}
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
          <table className="w-full table-dailyoder">
            <thead>
              <tr className="bg-gray-200 text-gray-800 leading-normal">
                <th className="py-2.5 font-extrabold w-36">Ngày giao hàng</th>
                <th className="py-2.5 font-extrabold px-3 min-w-36">
                  Tên công ty
                </th>
                <th className="py-2.5 font-extrabold px-3">Địa chỉ</th>
                <th className="py-2.5 font-extrabold px-3 w-28">Bữa ăn</th>
                <th className="py-2.5 font-extrabold px-3 w-28 text-center">
                  Số lượng
                </th>
                <th className="py-2.5 font-extrabold px-3 text-center">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-3 px-6">
                    Đang tải...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((item, itemIndex) => {
                  let totalOrdersForItem = item.companies.reduce(
                    (acc, cur) => acc + cur.dailyOrders.length,
                    0
                  );

                  return item.companies.flatMap((company, companyIndex) => {
                    let totalOrdersForCompany = company.dailyOrders.length;

                    return company.dailyOrders.map((order, orderIndex) => (
                      <tr key={order.id}>
                        {companyIndex === 0 && orderIndex === 0 && (
                          <td
                            className="py-3 px-3"
                            rowSpan={totalOrdersForItem}
                          >
                            {formatDate(item.bookingDate)}
                          </td>
                        )}
                        {orderIndex === 0 && (
                          <td
                            className="py-3 px-3 font-bold"
                            rowSpan={totalOrdersForCompany}
                          >
                            {company.name}
                          </td>
                        )}
                        {orderIndex === 0 && (
                          <td
                            className="py-3 px-3"
                            rowSpan={totalOrdersForCompany}
                          >
                            {company.address}
                          </td>
                        )}
                        <td className="py-3 px-3">
                          <button
                            className={`${MealStatus(
                              order.meal
                            )} font-semibold`}
                            onClick={() => handleDetailClick(order.id)}
                          >
                            {order.meal}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {order.orderQuantity}
                        </td>
                        <td className="py-3 px-3 text-center min-w-48">
                          <DailyOrderStatus status={order.status} />
                        </td>
                      </tr>
                    ));
                  });
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-3 px-6">
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
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default DailyOrderHistory;
