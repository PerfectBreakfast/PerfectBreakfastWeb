import { Search } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import Loading from "../../../Loading/Loading";

import SupplierFoodAssignmentAPI from "../../../../services/SupplierFoodAssignmentAPI";

const FoodByCompany = () => {
  const [foodData, setFoodData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [confirmFoodId, setConfirmFoodId] = useState(null);
  useEffect(() => {
    fetchFoodList();
  }, [pageIndex]);

  const fetchFoodList = async () => {
    try {
      const result =
        await SupplierFoodAssignmentAPI.getSupplierFoodAssignmentByPartner(
          pageIndex
        );
      setFoodData(result.items);
      setTotalPages(result.totalPagesCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log("food", foodData);
  const handleConfirm = async () => {
    if (confirmFoodId) {
      try {
        await SupplierFoodAssignmentAPI.confirmSupplierFoodAssignmentByPartner(
          confirmFoodId
        );
        toast.success("Đơn hàng đã được xác nhận!");
        fetchFoodList(); // Refetch the food list to update the UI
        closeModal(); // Đóng modal sau khi xác nhận thành công
      } catch (error) {
        console.error("Error confirming order:", error);
        toast.error("Có lỗi xảy ra khi xác nhận đơn hàng.");
      }
    }
  };
  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
  };

  const renderOrderStatus = (status) => {
    let statusText;
    let colorClass;

    switch (status) {
      case "Pending":
        statusText = "Chờ xác nhận";
        colorClass = "text-gray-500"; // Màu xám
        break;
      case "Confirmed":
        statusText = "Đã xác nhận";
        colorClass = "text-yellow-500"; // Màu vàng
        break;
      case "Completed":
        statusText = "Hoàn thành";
        colorClass = "text-green-500"; // Màu xanh lá
        break;
      default:
        statusText = "Không xác định";
        colorClass = "text-gray-500";
    }

    return <span className={`${colorClass}`}>{statusText}</span>;
  };

  const openModal = (foodId) => {
    setConfirmFoodId(foodId); // Lưu ID của món ăn cần xác nhận
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setConfirmFoodId(null); // Reset ID sau khi đóng modal
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Danh sách món ăn đã phân phối
      </h2>

      <div className="bg-white shadow-md my-6">
        {foodData.map((dayData) => (
          <div key={dayData.date}>
            <h3 className="text-lg font-semibold my-2">Ngày: {dayData.date}</h3>
            {dayData.foodAssignmentGroupBySuppliers.map((supplierData) => (
              <div key={supplierData.supplierName}>
                <h4 className="text-md font-semibold my-2">
                  Nhà cung cấp: {supplierData.supplierName}
                </h4>
                {supplierData.partnerFoodMealResponses.map(
                  (mealData, index) => (
                    <div key={index}>
                      <h5 className="text-md font-semibold my-2">
                        Bữa ăn: {mealData.meal}
                      </h5>
                      <table className="min-w-max w-full table-auto mb-6">
                        <thead>
                          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6">Tên món ăn</th>
                            <th className="py-3 px-6 text-center">Số lượng</th>
                            <th className="py-3 px-6 text-center">
                              Trạng thái
                            </th>
                            <th className="py-3 px-6 text-center">
                              Xác nhận đơn hàng
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                          {mealData.foodAssignmentResponses.map((foodItem) => (
                            <tr
                              key={foodItem.id}
                              className="border-b border-gray-200 hover:bg-gray-100"
                            >
                              <td className="py-3 px-6 font-bold">
                                {foodItem.foodName}
                              </td>
                              <td className="py-3 px-6 text-center">
                                {foodItem.amountCooked}
                              </td>
                              <td className="py-3 px-6 text-center font-semibold">
                                {renderOrderStatus(foodItem.status)}
                              </td>
                              <td className="py-3 px-6 text-center">
                                {foodItem.status === "Confirmed" && (
                                  <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-2xl hover:bg-green-600"
                                    onClick={() => openModal(foodItem.id)}
                                  >
                                    Xác nhận
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="fixed inset-0 flex items-center justify-center"
        contentLabel="Xác nhận cập nhật"
      >
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto z-50">
          <h2 className="text-lg font-semibold mb-4">Xác nhận</h2>
          <p>Bạn có chắc chắn xác nhận đơn hàng thành công?</p>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black"
              onClick={closeModal}
            >
              Hủy bỏ
            </button>
            <button
              className="px-4 py-2 bg-green-500 hover:bg-green-700 rounded text-white"
              onClick={handleConfirm}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};
export default FoodByCompany;
