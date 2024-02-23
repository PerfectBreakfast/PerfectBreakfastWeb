import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DailyOrderAPI from "../../../../services/DailyOrderAPI";
import { Search } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import { ToastContainer } from "react-toastify";

const DeliveryOrderFoodList = () => {
  const [orders, setOrders] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        const result = await DailyOrderAPI.getDailyOrderForDelivery(pageIndex);
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
  const handleDetailClick = (companyId, bookingDate) => {
    // Navigate to the detail page with companyId and bookingDate
    navigate(`detail/${companyId}?bookingDate=${bookingDate}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Danh sách đơn hàng</h2>

      <div className="flex justify-end items-center mb-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="px-4 py-2 border rounded-2xl text-gray-700 focus:outline-none focus:border-blue-500"
            placeholder="Tìm kiếm"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600">
            <Search />
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md my-6">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 rounded-l">Ngày giao hàng</th>
              <th className="py-3 px-6">Tên công ty</th>
              <th className="py-3 px-6">Địa chỉ</th>
              <th className="py-3 px-6">Giờ làm việc</th>
              <th className="py-3 px-6">Số lượng đơn hàng</th>

              <th className="py-3 px-6 rounded-r">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orders.map((order) =>
              order.dailyOrderModelResponses.map((companyOrder) => (
                <tr
                  key={companyOrder.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  {order.dailyOrderModelResponses.indexOf(companyOrder) ===
                    0 && (
                    <td
                      rowSpan={order.dailyOrderModelResponses.length}
                      className="py-3 px-6"
                    >
                      {order.bookingDate}
                    </td>
                  )}
                  <td className="py-3 px-6">
                    {/* Wrap company name in a button */}
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() =>
                        handleDetailClick(
                          companyOrder.company.id,
                          order.bookingDate
                        )
                      }
                    >
                      {companyOrder.company.name}
                    </button>
                  </td>
                  <td className="py-3 px-6">{companyOrder.company.address}</td>
                  <td className="py-3 px-6">
                    {companyOrder.company.startWorkHour}
                  </td>
                  <td className="py-3 px-6">{companyOrder.orderQuantity}</td>

                  <td className="py-3 px-6">{companyOrder.status}</td>
                </tr>
              ))
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

export default DeliveryOrderFoodList;
