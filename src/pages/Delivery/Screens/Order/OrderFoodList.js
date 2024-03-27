import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DailyOrderAPI from "../../../../services/DailyOrderAPI";
import { Search } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import { ToastContainer } from "react-toastify";
import DailyOrderStatus from "../../../../components/Status/DailyOrderStatus";

const DeliveryOrderFoodList = () => {
  const [orders, setOrders] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchOrderList = async () => {
      setIsLoading(true);
      try {
        const result = await DailyOrderAPI.getDailyOrderForDelivery(pageIndex);
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
  const handleDetailClick = (dailyOrderId, bookingDate) => {
    // Navigate to the detail page with companyId and bookingDate
    navigate(`detail/${dailyOrderId}`);
  };
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

      {/* <div className="flex justify-end items-center mb-4">
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
      </div> */}
      <div className="bg-white shadow-md my-6 overflow-auto">
        <table className="min-w-max w-full table-auto table-dailyoder">
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
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-3 px-6">
                  Đang tải...
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.flatMap((item) =>
                item.companies.flatMap((company, companyIndex) =>
                  company.dailyOrders.map((order, orderIndex) => (
                    <tr key={order.id}>
                      {companyIndex === 0 && orderIndex === 0 && (
                        <td
                          className="py-2.5 px-6"
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
                          className="py-2.5 px-6 font-bold"
                          rowSpan={company.dailyOrders.length}
                        >
                          {company.name}
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
                      <td className="py-2.5 px-6">
                        <button
                          className="text-green-500 hover:text-green-600 font-semibold"
                          onClick={() => handleDetailClick(order.id)}
                        >
                          {order.meal}
                        </button>
                      </td>
                      <td className="py-2.5 px-6 text-center">
                        {order.orderQuantity}
                      </td>
                      <td className="py-2.5 px-6">
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
