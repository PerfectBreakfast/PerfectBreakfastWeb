import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DailyOrderAPI from "../../../../services/DailyOrderAPI";
import DailyOrderStatus from "../../../../components/Status/DailyOrderStatus";
import { Pagination } from "@mui/material";
import { ToastContainer } from "react-toastify";

const DailyOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        const result = await DailyOrderAPI.getDailyOrderHistoryForPartner(
          pageIndex
        );
        setOrders(result.items);
        setTotalPages(result.totalPagesCount);
      } catch (error) {
        console.error("Error fetching data:", error);
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
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-2">Lịch sử đơn hàng</h2>

      <div className="bg-white rounded-xl p-4 ">
        <div>
          <table className="w-full table-auto">
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
              {orders.map((item) =>
                item.companies.map((company) =>
                  company.dailyOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-3">
                        {" "}
                        {formatDate(item.bookingDate)}
                      </td>
                      <td className="py-3 px-3 font-bold">{company.name}</td>
                      <td className="py-3 px-3">{company.address}</td>
                      <td className="py-3 px-3">
                        <button
                          className="text-green-500 hover:text-green-600 font-semibold"
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
                  ))
                )
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

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default DailyOrderHistory;
