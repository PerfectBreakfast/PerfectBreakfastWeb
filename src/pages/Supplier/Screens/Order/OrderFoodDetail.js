import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SupplierFoodAssignmentAPI from "../../../../services/SupplierFoodAssignmentAPI";
import { ToastContainer, toast } from "react-toastify";
import Modal from "react-modal";

const OrderFoodDetail = () => {
  const location = useLocation();
  const { data: foodAssignmentGroupByPartners } = location.state || {};
  const [foodData, setFoodData] = useState([]);
  const [confirmFoodId, setConfirmFoodId] = useState(null);
  const [action, setAction] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (
      foodAssignmentGroupByPartners &&
      foodAssignmentGroupByPartners.length > 0
    ) {
      fetchFoodList(foodAssignmentGroupByPartners[0]); // Assuming we are dealing with the first supplier
    }
  }, [foodAssignmentGroupByPartners]);

  const fetchFoodList = async (supplierData) => {
    try {
      const packageIds = supplierData.packageIds;
      const result =
        await SupplierFoodAssignmentAPI.getSupplierFoodAssignmentDetailBySupplier(
          packageIds
        );
      setFoodData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
        fetchFoodList(foodAssignmentGroupByPartners[0]); // Refetch the food list
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

  return (
    <div>
      {foodData.map((company, index) => (
        <div key={index}>
          <h2>{company.companyName}</h2>
          <table>
            <thead>
              <tr>
                <th>Tên món ăn</th>
                <th>Số lượng</th>
                <th>Thời gian hoàn thành</th>
                <th>Trạng thái</th>
                <th>Xác nhận đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {company.foodAssignmentResponses.map((food, foodIndex) => (
                <tr key={foodIndex}>
                  <td>{food.foodName}</td>
                  <td>{food.amountCooked}</td>
                  <td>{food.deliveryDeadline}</td>
                  <td>{food.status}</td>
                  <td className="py-2.5 px-6 text-center">
                    {food.status === "Pending" && (
                      <>
                        <button
                          className="btn-delete"
                          onClick={() => openModal(food.id, "reject")}
                        >
                          Từ chối
                        </button>
                        <button
                          className="btn-confirm ml-2"
                          onClick={() => openModal(food.id, "confirm")}
                        >
                          Xác nhận
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

export default OrderFoodDetail;
