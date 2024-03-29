import React, { useEffect, useState } from "react";
import DailyOrderAPI from "../../../../services/DailyOrderAPI";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import { ToastContainer } from "react-toastify";
import DailyOrderStatus from "../../../../components/Status/DailyOrderStatus";

import { ReactComponent as Plus } from "../../../../assets/icons/plus.svg";
import FoodStatusText from "../../../../components/Status/FoodStatus";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        const result = await DailyOrderAPI.getDailyOrderForPartner(pageIndex);
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
    navigate(`detail/${dailyOrderId}`);
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
        <table className="min-w-max w-full table-dailyoder">
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
              item.companies.flatMap((company, companyIndex) =>
                company.dailyOrders.map((order, orderIndex) => (
                  <tr key={order.id}>
                    {companyIndex === 0 && orderIndex === 0 && (
                      <td
                        className="py-3 px-6"
                        rowSpan={item.companies.reduce(
                          (acc, cur) => acc + cur.dailyOrders.length,
                          0
                        )}
                      >
                        {formatDate(item.bookingDate)}
                      </td>
                    )}
                    {orderIndex === 0 && (
                      <td
                        className="py-3 px-6 font-bold"
                        rowSpan={company.dailyOrders.length}
                      >
                        {company.name}
                      </td>
                    )}

                    {orderIndex === 0 && (
                      <td
                        className="py-3 px-6 font-semibold"
                        rowSpan={company.dailyOrders.length}
                      >
                        {company.address}
                      </td>
                    )}

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
        <div className="flex justify-end py-2.5">
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

export default OrderList;
