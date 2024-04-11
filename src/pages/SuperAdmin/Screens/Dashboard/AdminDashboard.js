import React, { useEffect, useState } from "react";
import DashboardAPI from "../../../../services/DashboardAPI";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [foodList, setFoodList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [orderAmount, setOrderAmount] = useState([]);
  const [deliveryRate, setDeliveryRate] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const today = new Date();
    const priorDate = new Date(new Date().setDate(today.getDate() - 7));
    setFromDate(priorDate.toISOString().split("T")[0]);
    setToDate(today.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await fetchTopFood();
      await fetchTopCompany();
      await fetchOrderAmount();
      await fetchDeliveryRate();
      setIsLoading(false);
    };

    fetchAllData();
  }, [fromDate, toDate]);

  const fetchTopFood = async () => {
    setIsLoading(true);
    try {
      const result = await DashboardAPI.getTopFood(fromDate, toDate);
      setFoodList(result);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const fetchTopCompany = async () => {
    try {
      const result = await DashboardAPI.getTopCompany(fromDate, toDate);
      setCompanyList(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchOrderAmount = async () => {
    try {
      const result = await DashboardAPI.getOrderAmount(fromDate, toDate);
      setOrderAmount(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDeliveryRate = async () => {
    try {
      const result = await DashboardAPI.getDeliveryRate(fromDate, toDate);
      setDeliveryRate(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const formattedOrderAmount = orderAmount.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }));

  const deliveryRateData = [
    { name: "Hoàn thành", value: deliveryRate.completeAmount },
    { name: "Thất bại", value: deliveryRate.cancelledForOverdueAmount },
  ];

  const COLORS = ["#0abe63", "#FF6347"]; // Màu cho mỗi phần của pie

  return (
    <div className="container mx-auto p-4">
      <h4 className="text-2xl font-semibold mb-3">Dashboard</h4>
      <div className="mb-3 flex items-center">
        <label className="font-semibold mr-1">Từ ngày: </label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="mr-2"
        />
        <label className="font-semibold mr-1">Tới ngày: </label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 ">
        <div className="bg-white rounded-xl px-4 py-3 mb-4">
          <h5 className="text-xl font-semibold mb-3">Số lượng đơn hàng</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedOrderAmount}>
              <CartesianGrid strokeDasharray="1 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              {/* <Legend /> */}
              <Bar
                dataKey="orderAmount"
                fill="#0abe63"
                name="Đơn hàng"
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl px-4 py-3 mb-4">
          <h5 className="text-xl font-semibold">Tỷ lệ hoàn thành đơn hàng</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deliveryRateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(2)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deliveryRateData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className=" bg-white rounded-xl px-4 py-3 mb-4">
          <h5 className="text-xl font-semibold mb-3">
            Danh sách món ăn được ưa chuộng nhất
          </h5>
          <div className="overflow-x-auto max-h-96 mt-2">
            <table className="w-full table-auto mb-4">
              <thead className="sticky top-0">
                <tr className="bg-gray-200 text-gray-800 leading-normal">
                  <th className="py-2.5 px-3 font-extrabold">#</th>
                  <th className="py-2.5 px-3 font-extrabold">Hình ảnh</th>
                  <th className="py-2.5 px-3 font-extrabold">Tên món ăn</th>
                  <th className="py-2.5 px-3 text-left font-extrabold">
                    Chi tiết
                  </th>
                  <th className="py-2.5 px-3 font-extrabold">Số lượng</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-3 px-6">
                      Đang tải...
                    </td>
                  </tr>
                ) : foodList.length > 0 ? (
                  foodList.map((food, index) => (
                    <tr
                      key={food.id}
                      className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        if (food.type === "Combo") {
                          navigate(`/admin/combo/${food.id}`);
                        } else {
                          navigate(`/admin/food/${food.id}`);
                        }
                      }}
                    >
                      <td className="py-2.5 px-3 text-left font-semibold">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3 text-left">
                        <img
                          src={food.image}
                          alt={food.name}
                          className="display-img"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-left max-w-xs whitespace-normal">
                        <span className="text-name">{food.name}</span>
                      </td>

                      <td className="py-2.5 px-3">{food.foods}</td>
                      <td className="py-2.5 px-3">{food.quantity}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-3 px-6">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white rounded-xl px-4 py-3 mb-4">
          <h5 className="text-xl font-semibold mb-3">
            Danh sách công ty đặt hàng nhiều nhất
          </h5>
          <div className="overflow-x-auto max-h-96 mt-2">
            <table className="w-full table-auto mb-4">
              <thead className="sticky top-0">
                <tr className="bg-gray-200 text-gray-800 leading-normal">
                  <th className="py-2.5 px-3 font-extrabold">#</th>
                  <th className="py-2.5 px-3 font-extrabold">Tên công ty</th>
                  <th className="py-2.5 px-3font-extrabold text-center">
                    Số lượng
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-3 px-6">
                      Đang tải...
                    </td>
                  </tr>
                ) : companyList.length > 0 ? (
                  companyList.map((company, index) => (
                    <tr
                      key={company.id}
                      className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                      onClick={() => navigate(`/admin/company/${company.id}`)}
                    >
                      <td className="py-2.5 px-3 text-left font-semibold">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3 text-left max-w-xs whitespace-normal">
                        <span className="text-name">{company.name}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {company.orderQuantity}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-3 px-6">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
