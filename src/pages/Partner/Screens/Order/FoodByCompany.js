import { Search } from "@mui/icons-material";
import { Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";
import Loading from "../../../Loading/Loading";

import SupplierFoodAssignmentAPI from "../../../../services/SupplierFoodAssignmentAPI";
import SupplierFoodAssigmentStatus from "../../../../components/Status/SupplierFoodAssigmentStatus";
import supplierUnitAPI from "../../../../services/supplierUnitAPI";

const FoodByCompany = () => {
  const [foodData, setFoodData] = useState([]);
  const [supplierData, setSupplierData] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [confirmFoodId, setConfirmFoodId] = useState(null);
  const [distributeModalIsOpen, setDistributeModalIsOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");

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
  const fetchSupplier = async (foodId) => {
    console.log("foodId", foodId);
    if (foodId) {
      try {
        const data = await supplierUnitAPI.getSuppliersForFood(foodId);
        setSupplierData(data);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
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

  const openModal = (foodId) => {
    setConfirmFoodId(foodId); // Lưu ID của món ăn cần xác nhận
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setConfirmFoodId(null); // Reset ID sau khi đóng modal
  };

  // const openAssignModal = (foodId) => {
  //   setConfirmFoodId(foodId);
  // };

  const openAssignModal = (foodId) => {
    fetchSupplier(foodId);
    setConfirmFoodId(foodId);
    setDistributeModalIsOpen(true);
  };

  const closeAssignModal = () => {
    setDistributeModalIsOpen(false);
    setConfirmFoodId(null);
    setSelectedSupplierId("");
  };

  const reassignFood = async () => {
    if (!selectedSupplierId) {
      toast.error("Vui lòng chọn nhà cung cấp.");
      return;
    }

    try {
      const foodAssignments = {
        supplierFoodAssignmentId: confirmFoodId,
        supplierId: selectedSupplierId,
      };
      await SupplierFoodAssignmentAPI.reFoodAssigment(foodAssignments);
      toast.success("Phân phối thành công!");
      fetchFoodList(); // Refetch the food list to update the UI
      closeAssignModal();
    } catch (error) {
      console.error("Error reassigning food:", error);
      toast.error(error.errors);
    }
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
      <h2 className="text-2xl font-semibold mb-4">
        Danh sách món ăn đã phân phối
      </h2>

      <div className="bg-white shadow-md my-6 overflow-auto">
        {foodData.map((dayData) => (
          <div key={dayData.date}>
            <h3 className="text-lg font-semibold my-2">
              Ngày: {formatDate(dayData.date)}
            </h3>
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
                      <table className="min-w-max w-full table-auto">
                        <thead>
                          <tr className="bg-gray-200 text-gray-800 leading-normal">
                            <th className="py-2.5 px-6 font-extrabold">
                              Tên món ăn
                            </th>
                            <th className="py-2.5 px-6 text-center font-extrabold">
                              Số lượng
                            </th>
                            <th className="py-2.5 px-6 font-extrabold">
                              Trạng thái
                            </th>
                            <th className="py-2.5 px-6 font-extrabold text-center">
                              Xác nhận nhận hàng
                            </th>
                            <th className="py-2.5 px-6 text-center font-extrabold"></th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                          {mealData.foodAssignmentResponses.map((foodItem) => (
                            <tr
                              key={foodItem.id}
                              className="border-b border-gray-200 hover:bg-gray-100"
                            >
                              <td className="py-2.5 px-6 font-bold text-left ">
                                {foodItem.foodName}
                              </td>
                              <td className="py-2.5 px-6 text-center ">
                                {foodItem.amountCooked}
                              </td>
                              <td className="py-2.5 px-6 font-semibold text-left ">
                                <SupplierFoodAssigmentStatus
                                  status={foodItem.status}
                                />
                              </td>
                              <td className="py-2.5 px-6 text-center ">
                                <div className="flex justify-center">
                                  {foodItem.status === "Confirmed" && (
                                    <button
                                      className="btn-add"
                                      onClick={() => openModal(foodItem.id)}
                                    >
                                      Xác nhận
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="py-2.5 px-6 text-center text-left ">
                                {foodItem.status === "Declined" && (
                                  <button
                                    className="btn-replay"
                                    onClick={() =>
                                      openAssignModal(foodItem.foodId)
                                    }
                                  >
                                    Phân phối
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
      {/* Modal xác nhận */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="fixed inset-0 flex items-center justify-center"
        contentLabel="Xác nhận cập nhật"
      >
        <div className="confirm-modal ">
          <h2 className="text-lg font-semibold mb-2">Xác nhận</h2>
          <p>Bạn có chắc chắn xác nhận đơn hàng thành công?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button className="btn-cancel" onClick={closeModal}>
              Hủy bỏ
            </button>
            <button className="btn-confirm" onClick={handleConfirm}>
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal phân lại đơn hàng */}
      <Modal
        isOpen={distributeModalIsOpen}
        onRequestClose={closeAssignModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        contentLabel="Chọn nhà cung cấp"
        className="fixed inset-0 flex items-center justify-center"
      >
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto z-50">
          <h2 className="text-lg font-semibold mb-4">Chọn nhà cung cấp</h2>
          <select
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            className="input-form"
          >
            {/* Kiểm tra nếu supplierData không tồn tại hoặc mảng rỗng */}

            <>
              <option disabled value="">
                Chọn nhà cung cấp
              </option>
              {!supplierData || supplierData.length === 0 ? (
                <option value="">
                  Không có nhà cung cấp nào đăng ký món ăn này
                </option>
              ) : (
                supplierData.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))
              )}
            </>
          </select>

          <div className="flex justify-end gap-4 mt-4">
            <button className="btn-cancel" onClick={closeAssignModal}>
              Hủy bỏ
            </button>
            <button className="btn-confirm" onClick={() => reassignFood()}>
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
