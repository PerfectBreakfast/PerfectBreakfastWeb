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
      <h2 className="text-2xl font-semibold mb-2">Danh sách đơn hàng</h2>

      <div className="bg-white shadow-md my-6 overflow-auto">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-800 leading-normal">
              <th className="py-2.5 font-extrabold px-6">Ngày giao hàng</th>
              <th className="py-2.5 font-extrabold px-6">Tên công ty</th>
              <th className="py-2.5 font-extrabold px-6">Địa chỉ</th>
              <th className="py-2.5 font-extrabold px-6">Bữa ăn</th>
              <th className="py-2.5 font-extrabold px-6">Số lượng</th>
              <th className="py-2.5 font-extrabold px-6">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orders.map((item) =>
              item.companies.map((company) =>
                company.dailyOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 px-6">
                      {" "}
                      {formatDate(item.bookingDate)}
                    </td>
                    <td className="py-3 px-6 font-bold">{company.name}</td>
                    <td className="py-3 px-6">{company.address}</td>
                    <td className="py-3 px-6">
                      <button
                        className="text-green-500 hover:text-green-600 font-semibold"
                        onClick={() => handleDetailClick(order.id)}
                      >
                        {order.meal}
                      </button>
                    </td>
                    <td className="py-3 px-6 text-center">
                      {order.orderQuantity}
                    </td>
                    <td className="py-3 px-6">
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
            color="primary"
          />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default DailyOrderHistory;
