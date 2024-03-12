import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SupplierFoodAssignmentAPI from "../../../../services/SupplierFoodAssignmentAPI";
import { ToastContainer, toast } from "react-toastify";
import { Pagination } from "@mui/material";
import Modal from "react-modal";
import SupplierFoodAssigmentStatus from "../../../../components/Status/SupplierFoodAssigmentStatus";

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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Danh sách món ăn được phân phối
      </h2>

      <div className="bg-white shadow-md my-6">
        {foodData.map((dayData) => (
          <div key={dayData.date}>
            <h3 className="text-lg font-semibold my-2">Ngày: {dayData.date}</h3>
            {dayData.foodAssignmentGroupByPartners.map((partnerData) => (
              <div key={partnerData.supplierName}>
                <h4 className="text-md font-semibold my-2">
                  Đối tác: {partnerData.partnerName}
                </h4>
                {partnerData.supplierDeliveryTimes.map((mealData, index) => (
                  <div key={index}>
                    <h5 className="text-md font-semibold my-2">
                      Thời gian hoàn thành: {formatTime(mealData.deliveryTime)}
                    </h5>

                    <table className="min-w-max w-full table-auto mb-6">
                      <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 ">Tên món ăn</th>
                          <th className="py-3 px-6 text-center">Số lượng</th>
                          <th className="py-3 px-6 text-center">Trạng thái</th>
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
                              <SupplierFoodAssigmentStatus
                                status={foodItem.status}
                              />
                            </td>

                            <td className="py-3 px-6 text-center">
                              {foodItem.status === "Pending" && (
                                <>
                                  <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-2xl hover:bg-green-600 mr-2"
                                    onClick={() =>
                                      openModal(foodItem.id, "confirm")
                                    }
                                  >
                                    Xác nhận
                                  </button>
                                  <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600"
                                    onClick={() =>
                                      openModal(foodItem.id, "reject")
                                    }
                                  >
                                    Từ chối
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
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
