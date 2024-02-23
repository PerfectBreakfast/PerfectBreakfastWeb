import { Search } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import SupplierFoodAssignmentAPI from "../../../../services/SupplierFoodAssignmentAPI";

const FoodByCompany = () => {
  const [foods, setFoods] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    fetchFoodList();
  }, [pageIndex]);

  const fetchFoodList = async () => {
    try {
      const result =
        await SupplierFoodAssignmentAPI.getSupplierFoodAssignmentByPartner(
          pageIndex
        );
      setFoods(result.items);
      setTotalPages(result.totalPagesCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleConfirm = async (foodFoodId) => {
    try {
      await SupplierFoodAssignmentAPI.confirmSupplierFoodAssignmentByPartner(
        foodFoodId
      );
      toast.success("Đơn hàng đã được xác nhận!");
      fetchFoodList(); // Refetch the food list to update the UI
    } catch (error) {
      console.error("Error confirming order:", error);
      toast.error("Có lỗi xảy ra khi xác nhận đơn hàng.");
    }
  };
  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Danh sách món ăn đã phân phối
      </h2>

      <div className="bg-white shadow-md my-6">
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 rounded-l text-center">Ngày cung cấp</th>
              <th className="py-3 px-6 ">Tên món ăn</th>
              <th className="py-3 px-6 text-center">Số lượng</th>
              <th className="py-3 px-6 text-center">Nhà cung cấp</th>
              <th className="py-3 px-6 rounded-r text-center">Trạng thái</th>
              <th className="py-3 px-6 rounded-r text-center">
                Xác nhận đơn hàng
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {foods.map((food) =>
              food.foodAssignmentForSuppliers.map((foodFood) => (
                <tr
                  key={foodFood.id}
                  className="bfood-b bfood-gray-200 hover:bg-gray-100"
                >
                  {food.foodAssignmentForSuppliers.indexOf(foodFood) === 0 && (
                    <td
                      rowSpan={food.foodAssignmentForSuppliers.length}
                      className="py-3 px-6 text-center"
                    >
                      {food.dateCooked}
                    </td>
                  )}
                  <td className="py-3 px-6 ">{foodFood.foodName}</td>
                  <td className="py-3 px-6 text-center">
                    {foodFood.amountCooked}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {foodFood.supplierName}
                  </td>

                  <td className="py-3 px-6 text-center">{foodFood.status}</td>

                  <td className="py-3 px-6 text-center">
                    {foodFood.status === "Confirmed" && (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-2xl hover:bg-green-600"
                        onClick={() => handleConfirm(foodFood.id)}
                      >
                        Xác nhận
                      </button>
                    )}
                  </td>
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
export default FoodByCompany;
