import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import { ToastContainer } from "react-toastify";
import DailyOrderAPI from "../../../../services/DailyOrderAPI";
import DailyOrderStatus from "../../../../components/Status/DailyOrderStatus";

const DailyOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
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
  }, [pageIndex]);
  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
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
      <h4 className="text-2xl font-semibold mb-4">Danh sách đơn hàng</h4>

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

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default DailyOrderList;
