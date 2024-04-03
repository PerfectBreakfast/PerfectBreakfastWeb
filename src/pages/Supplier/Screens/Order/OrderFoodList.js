import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SupplierFoodAssignmentAPI from "../../../../services/SupplierFoodAssignmentAPI";
import { ToastContainer, toast } from "react-toastify";
import { Pagination } from "@mui/material";
import Modal from "react-modal";
import SupplierFoodAssigmentStatus from "../../../../components/Status/SupplierFoodAssigmentStatus";

import { ReactComponent as File } from "../../../../assets/icons/File.svg";

const OrderFoodList = () => {
  const [foodData, setFoodData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [confirmFoodId, setConfirmFoodId] = useState(null);
  useEffect(() => {
    fetchFoodList();
  }, [pageIndex]);

  const fetchFoodList = async () => {
    try {
      const result =
        await SupplierFoodAssignmentAPI.getSupplierFoodAssignmentBySupplier(
          pageIndex
        );
      setFoodData(result.items);
      setTotalPages(result.totalPagesCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAction = async () => {
    const status = action === "confirm" ? 1 : 0; // Chuyển đổi hành động thành status tương ứng
    if (confirmFoodId) {
      try {
        await SupplierFoodAssignmentAPI.confirmSupplierFoodAssignmentBySupplier(
          confirmFoodId,
          status
        );
        toast.success(
          `Đơn hàng đã được ${action === "confirm" ? "xác nhận" : "từ chối"}!`
        );
        fetchFoodList(); // Refetch the food list
        closeModal(); // Close modal
      } catch (error) {
        console.error(
          `Error ${action === "confirm" ? "confirming" : "rejecting"} order:`,
          error
        );
        toast.error(
          `Có lỗi xảy ra khi ${
            action === "confirm" ? "xác nhận" : "từ chối"
          } đơn hàng.`
        );
      }
    }
  };
  const handleExport = async (date) => {
    try {
      // Make the API call to get the file data
      const response =
        await SupplierFoodAssignmentAPI.downloadFileFoodForSupplier(date);

      // Tạo URL cho tệp tải xuống
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute("download", `Danh sách món ăn ngày ${date}.xlsx`);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      return response;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  };

  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
  };
  console.log("order food", foodData);

  const openModal = (foodId, action) => {
    setConfirmFoodId(foodId); // Lưu ID của món ăn cần xác nhận hoặc từ chối
    setAction(action); // Lưu hành động được chọn
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setConfirmFoodId(null);
    setAction(null); // Reset action khi đóng modal
  };
  const formatTime = (time) => {
    // Cắt bỏ phần giây, lấy từ ký tự đầu tiên đến ký tự thứ 5
    return time.slice(0, 5);
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
      <h2 className="text-2xl font-semibold mb-4">
        Danh sách món ăn được phân phối
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
                <th className="py-2.5 px-6 font-extrabold text-center">
                  Đối tác
                </th>
                <th className="py-2.5 px-6 font-extrabold text-center">
                  Thời gian giao hàng
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {foodData.length > 0 &&
                foodData
                  .map((day, dayIndex) => {
                    let totalDayMeals = day.supplierDeliveryTimes.reduce(
                      (acc, meal) =>
                        acc +
                        meal.foodAssignmentGroupByPartners.reduce(
                          (acc2, partner) =>
                            acc2 + partner.foodAssignmentResponses.length,
                          0
                        ),
                      0
                    );

                    return day.supplierDeliveryTimes
                      .map((meal, mealIndex) => {
                        let totalMealSuppliers =
                          meal.foodAssignmentGroupByPartners.reduce(
                            (acc, partner) =>
                              acc + partner.foodAssignmentResponses.length,
                            0
                          );

                        return meal.foodAssignmentGroupByPartners
                          .map((partner, supplierIndex) => {
                            let totalSupplierAssignments =
                              partner.foodAssignmentResponses.length;

                            return partner.foodAssignmentResponses.map(
                              (assignment, assignmentIndex) => {
                                return (
                                  <tr
                                    key={`${day.date}-${meal.deliveryTime}-${assignment.id}`}
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
                                          {meal.deliveryTime}
                                        </td>
                                      )}
                                    {assignmentIndex === 0 && (
                                      <td
                                        rowSpan={totalSupplierAssignments}
                                        className="py-2.5 px-6 text-center"
                                        onClick={() =>
                                          handleClickDetail(partner)
                                        }
                                      >
                                        <button className="text-green-500 hover:text-green-700 font-semibold">
                                          {partner.partnerName}
                                        </button>
                                      </td>
                                    )}
                                    <td className="py-2.5 px-6 text-center">
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
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="fixed inset-0 flex items-center justify-center"
        contentLabel="Xác nhận hành động"
      >
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
          <h2 className="text-lg font-semibold mb-4">Xác nhận món ăn</h2>
          <p>
            Bạn có chắc chắn{" "}
            {action === "confirm"
              ? "xác nhận thông tin"
              : "muốn từ chối thực hiện"}{" "}
            món ăn này?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black"
              onClick={closeModal}
            >
              Hủy
            </button>
            <button
              className={`px-4 py-2 rounded text-white ${
                action === "confirm"
                  ? "bg-green-500 hover:bg-green-700"
                  : "bg-red-500 hover:bg-red-700"
              }`}
              onClick={handleAction}
            >
              {action === "confirm" ? "Xác nhận" : "Từ chối"}
            </button>
          </div>
        </div>
      </Modal>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};
export default OrderFoodList;
