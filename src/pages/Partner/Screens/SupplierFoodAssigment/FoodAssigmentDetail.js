import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SupplierFoodAssignmentAPI from "../../../../services/SupplierFoodAssignmentAPI";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import supplierUnitAPI from "../../../../services/supplierUnitAPI";
import SupplierFoodAssigmentStatus from "../../../../components/Status/SupplierFoodAssigmentStatus";
import Loading from "../../../Loading/Loading";
import { ReactComponent as FileIcon } from "../../../../assets/icons/File.svg";

const FoodAssigmentDetail = () => {
  const location = useLocation();
  const { data: foodAssignmentGroupBySuppliers, date } = location.state || {};
  const [foodData, setFoodData] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [distributeModalIsOpen, setDistributeModalIsOpen] = useState(false);
  const [assigmentId, setAssigmentId] = useState(null);
  const [confirmFoodId, setConfirmFoodId] = useState(null);
  const [supplierData, setSupplierData] = useState(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState("");

  console.log("data nhận", foodAssignmentGroupBySuppliers);
  useEffect(() => {
    fetchFoodList(foodAssignmentGroupBySuppliers); // Assuming we are dealing with the first supplier
  }, [foodAssignmentGroupBySuppliers]); // Added dependency to re-run if data changes

  const fetchFoodList = async (supplierData) => {
    setIsLoading(true);
    try {
      const packageData = {
        supplierId: supplierData.supplierId,
        packageIds: supplierData.packageIds,
      };
      console.log("data test", packageData);
      const result =
        await SupplierFoodAssignmentAPI.getSupplierFoodAssignmentDetailByPartner(
          packageData
        );
      setFoodData(result);
    } catch (error) {
      toast.error(error.errors);
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Kết thúc tải
    }
  };

  if (isLoading) return <Loading />;

  const fetchSupplier = async (foodId) => {
    console.log("id món ăn", foodId);
    if (foodId) {
      try {
        const data = await supplierUnitAPI.getSuppliersForFood(foodId);
        setSupplierData(data);
      } catch (error) {
        console.error("Error fetching supplier data:", error);
      }
    }
  };

  console.log("món ăn", foodData);

  const openModal = (foodId) => {
    setConfirmFoodId(foodId); // Lưu ID của món ăn cần xác nhận
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setConfirmFoodId(null); // Reset ID sau khi đóng modal
  };

  const handleConfirm = async () => {
    if (confirmFoodId) {
      try {
        await SupplierFoodAssignmentAPI.confirmSupplierFoodAssignmentByPartner(
          confirmFoodId
        );
        toast.success("Đơn hàng đã được xác nhận!");
        fetchFoodList(foodAssignmentGroupBySuppliers); // Refetch the food list to update the UI
        closeModal(); // Đóng modal sau khi xác nhận thành công
      } catch (error) {
        console.error("Error confirming order:", error);
        toast.error(error.errors);
      }
    }
  };

  const openAssignModal = ({ foodId, id }) => {
    fetchSupplier(foodId);
    setAssigmentId(id);
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
        supplierFoodAssignmentId: assigmentId,
        supplierId: selectedSupplierId,
      };
      console.log("data gui di", foodAssignments);
      await SupplierFoodAssignmentAPI.reFoodAssigment(foodAssignments);
      toast.success("Phân phối thành công!");
      fetchFoodList(foodAssignmentGroupBySuppliers); // Refetch the food list to update the UI
      closeAssignModal();
    } catch (error) {
      console.error("Error reassigning food:", error);
      toast.error(error.errors);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const year = date.getFullYear();

    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  };

  const handleExport = async () => {
    try {
      const packageData = {
        bookingDate: date,
        packageIds: foodAssignmentGroupBySuppliers.packageIds,
        supplierId: foodAssignmentGroupBySuppliers.supplierId,
      };
      // Make the API call to get the file data
      const response =
        await SupplierFoodAssignmentAPI.downloadFileFoodForPartner(packageData);

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
      toast.error(error.errors);
      throw error.response ? error.response.data : error.message;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-2">Danh sách món ăn</h2>
      <div className="flex justify-between items-center mb-3">
        <button type="button" className="btn-add" onClick={handleExport}>
          <FileIcon />
          Tải file
        </button>
      </div>
      <div>
        {foodData.map((company, index) => (
          <div key={index} className="bg-white rounded-xl p-4 mb-4">
            <p className="text-xl font-semibold text-gray-600 text-left">
              {" "}
              Công ty: {company.companyName}
            </p>
            <div className="overflow-x-auto max-h-96 mt-2">
              <table className="w-full table-auto mb-4">
                <thead className="sticky top-0">
                  <tr className="bg-gray-200 text-gray-800 leading-normal">
                    <th>Tên món ăn</th>
                    <th>Số lượng</th>
                    <th>Thời gian hoàn thành</th>
                    <th>Trạng thái</th>
                    <th className="w-44 text-center">Xác nhận nhận hàng</th>
                    <th className="w-36 text-center"></th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {company.foodAssignmentResponses &&
                  company.foodAssignmentResponses.length > 0 ? (
                    company.foodAssignmentResponses.map((food, foodIndex) => (
                      <tr
                        key={foodIndex}
                        className="h-10 border-b border-gray-200 hover:bg-gray-100"
                      >
                        <td>{food.foodName}</td>
                        <td>{food.amountCooked}</td>
                        <td>{formatDate(food.deliveryDeadline)}</td>
                        <td className="py-2.5 px-3 min-w-48">
                          {" "}
                          <SupplierFoodAssigmentStatus status={food.status} />
                        </td>
                        <td className="w-44 ">
                          <div className="flex justify-center">
                            {food.status === "Confirmed" && (
                              <button
                                className="btn-confirm-action"
                                onClick={() => openModal(food.id)}
                              >
                                Xác nhận
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 text-center">
                          <div className="flex justify-center">
                            {food.status === "Declined" && (
                              <button
                                className="btn-replay"
                                onClick={() =>
                                  openAssignModal({
                                    foodId: food.foodId,
                                    id: food.id,
                                  })
                                }
                              >
                                Phân phối
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Không có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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

export default FoodAssigmentDetail;
