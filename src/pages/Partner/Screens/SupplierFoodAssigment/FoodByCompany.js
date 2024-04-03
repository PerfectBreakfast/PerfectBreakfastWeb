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
      console.log("data gui di", foodAssignments);
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

  const handleClickDetail = (data) => {
    console.log("data gửi", data);
    navigate("detail", { state: { data } });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-2">
        Danh sách nhà cung cấp đã phân phối
      </h2>

      <div className="bg-white rounded-xl p-4 ">
        <div>
          <table className="w-full table-auto table-dailyoder">
            <thead>
              <tr className="bg-gray-200 text-gray-800 leading-normal">
                <th className="py-2.5 px-6 font-extrabold">Ngày giao hàng</th>
                <th className="py-2.5 px-6 text-center font-extrabold">
                  Bữa ăn
                </th>
                <th className="py-2.5 px-6 font-extrabold">Nhà cung cấp</th>
                <th className="py-2.5 px-6 font-extrabold">
                  Thời gian giao hàng
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {foodData.length > 0 &&
                foodData
                  .map((day, dayIndex) => {
                    let totalDayMeals = day.partnerFoodMealResponses.reduce(
                      (acc, meal) =>
                        acc +
                        meal.foodAssignmentGroupBySuppliers.reduce(
                          (acc2, supplier) =>
                            acc2 + supplier.foodAssignmentResponses.length,
                          0
                        ),
                      0
                    );

                    return day.partnerFoodMealResponses
                      .map((meal, mealIndex) => {
                        let totalMealSuppliers =
                          meal.foodAssignmentGroupBySuppliers.reduce(
                            (acc, supplier) =>
                              acc + supplier.foodAssignmentResponses.length,
                            0
                          );

                        return meal.foodAssignmentGroupBySuppliers
                          .map((supplier, supplierIndex) => {
                            let totalSupplierAssignments =
                              supplier.foodAssignmentResponses.length;

                            return supplier.foodAssignmentResponses.map(
                              (assignment, assignmentIndex) => {
                                return (
                                  <tr
                                    key={`${day.date}-${meal.meal}-${supplier.supplierId}-${assignment.id}`}
                                  >
                                    {mealIndex === 0 &&
                                      supplierIndex === 0 &&
                                      assignmentIndex === 0 && (
                                        <td
                                          rowSpan={totalDayMeals}
                                          className="py-2.5 px-6"
                                        >
                                          {formatDate(day.date)}
                                        </td>
                                      )}
                                    {supplierIndex === 0 &&
                                      assignmentIndex === 0 && (
                                        <td
                                          rowSpan={totalMealSuppliers}
                                          className="py-2.5 px-6 text-center"
                                        >
                                          {meal.meal}
                                        </td>
                                      )}
                                    {assignmentIndex === 0 && (
                                      <td
                                        rowSpan={totalSupplierAssignments}
                                        className="py-2.5 px-6"
                                        onClick={() =>
                                          handleClickDetail(supplier)
                                        }
                                      >
                                        <button className="text-green-500 hover:text-green-700 font-semibold">
                                          {supplier.supplierName}
                                        </button>
                                      </td>
                                    )}
                                    <td className="py-2.5 px-6">
                                      {new Date(
                                        assignment.deliveryDeadline
                                      ).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </td>
                                  </tr>
                                );
                              }
                            );
                          })
                          .flat();
                      })
                      .flat();
                  })
                  .flat()}
              {foodData.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot>
              <tr>
                <td colspan="4">
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