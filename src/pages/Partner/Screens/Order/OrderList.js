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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrderList = async () => {
      setIsLoading(true);
      try {
        const result = await DailyOrderAPI.getDailyOrderForPartner(pageIndex);
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
      <h2 className="text-2xl font-semibold mb-2">Đơn hàng cần xử lý</h2>
      <div className="bg-white rounded-xl p-4 ">
        <div className="">
          <table className="w-full table-dailyoder">
            <thead>
              <tr className="bg-gray-200 text-gray-800 leading-normal">
                <th className="py-2.5 font-extrabold min-w-36">
                  Ngày giao hàng
                </th>
                <th className="py-2.5 font-extrabold  ">Tên công ty</th>
                <th className="py-2.5 font-extrabold  ">Địa chỉ</th>
                <th className="py-2.5 font-extrabold  ">Bữa ăn</th>
                <th className="py-2.5 font-extrabold w-24">
                  Số lượng đơn hàng
                </th>
                <th className="py-2.5 font-extrabold text-center">
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
                orders.map((item) =>
                  item.companies.flatMap((company, companyIndex) =>
                    company.dailyOrders.map((order, orderIndex) => (
                      <tr key={order.id}>
                        {companyIndex === 0 && orderIndex === 0 && (
                          <td
                            className="py-2.5"
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
                            className="py-2.5 font-bold"
                            rowSpan={company.dailyOrders.length}
                          >
                            {company.name}
                          </td>
                        )}

                        {orderIndex === 0 && (
                          <td
                            className="py-2.5  font-semibold"
                            rowSpan={company.dailyOrders.length}
                          >
                            {company.address}
                          </td>
                        )}

                        <td className="py-2.5  min-w-24">
                          <button
                            className={`${MealStatus(
                              order.meal
                            )} font-semibold`}
                            onClick={() => handleDetailClick(order.id)}
                          >
                            {order.meal}
                          </button>
                        </td>
                        <td className="py-2.5 text-center">
                          {order.orderQuantity}
                        </td>
                        <td className="py-2.5 min-w-48">
                          <DailyOrderStatus status={order.status} />
                        </td>
                      </tr>
                    ))
                  )
                )
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
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default OrderList;
