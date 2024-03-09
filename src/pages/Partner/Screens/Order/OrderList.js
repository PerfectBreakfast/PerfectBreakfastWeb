import React, { useEffect, useState } from "react";
import DailyOrderAPI from "../../../../services/DailyOrderAPI";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import { ToastContainer } from "react-toastify";

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
    // Navigate to the detail page with companyId and bookingDate
    navigate(`detail/${dailyOrderId}`);
  };

  console.log("data", orders);

  const renderOrderStatus = (status) => {
    let statusText;
    let colorClass;

    switch (status) {
      case "Initial":
        statusText = "Chờ xử lý";
        colorClass = "text-gray-500"; // Màu xám
        break;
      case "Processing":
        statusText = "Đang xử lý";
        colorClass = "text-yellow-500"; // Màu vàng
        break;
      case "Complete":
        statusText = "Hoàn thành";
        colorClass = "text-green-500"; // Màu xanh lá
        break;
      default:
        statusText = "Không xác định";
        colorClass = "text-gray-500";
    }

    return <span className={`${colorClass}`}>{statusText}</span>;
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-2">Danh sách đơn hàng</h2>

      <div className="bg-white shadow-md my-6">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 rounded-l">Ngày giờ</th>
              <th className="py-3 px-6">Tên công ty</th>
              <th className="py-3 px-6">Địa chỉ</th>
              <th className="py-3 px-6">Bữa ăn</th>
              <th className="py-3 px-6">Số lượng</th>
              <th className="py-3 px-6 rounded-r">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orders.map((item) =>
              item.companies.map((company) =>
                company.dailyOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 px-6">{item.bookingDate}</td>
                    <td className="py-3 px-6 font-bold">{company.name}</td>
                    <td className="py-3 px-6">{company.address}</td>
                    <td className="py-3 px-6">
                      <button
                        className="text-green-500 hover:underline font-semibold"
                        onClick={() => handleDetailClick(order.id)}
                      >
                        {order.meal}
                      </button>
                    </td>
                    <td className="py-3 px-6 text-center">
                      {order.orderQuantity}
                    </td>
                    <td className="py-3 px-6">
                      {renderOrderStatus(order.status)}
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

export default OrderList;
