import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supplierUnitAPI from "../../../../services/supplierUnitAPI";

import { ReactComponent as Write } from "../../../../assets/icons/write.svg";
import { ReactComponent as Delete } from "../../../../assets/icons/delete.svg";
import { ReactComponent as Plus } from "../../../../assets/icons/plus.svg";

import Modal from "react-modal";
import SupplierCommissionRateAPI from "../../../../services/SupplierCommissionRateAPI";
import { toast } from "react-toastify";
import EditFoodRegistration from "./EditFoodRegistration";

const SupplierDetail = () => {
  const { id } = useParams();
  const [supplierData, setSupplierData] = useState(null);
  const [commissionRateId, setCommissionRateId] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [editingCommissionRateId, setEditingCommissionRateId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSupplierData();
  }, [id]);

  const fetchSupplierData = async () => {
    try {
      const data = await supplierUnitAPI.getSupplierById(id);
      setSupplierData(data);
    } catch (error) {
      console.error("Error fetching supplier data:", error);
    }
  };
  const handleDetailClick = (partnerId) => {
    navigate(`/admin/partner/${partnerId}`);
  };
  const handleClickCreate = () => {
    navigate(`registration`);
  };

  const handleDeleteClick = (commissionRateId) => {
    setCommissionRateId(commissionRateId); // Lưu id món ăn cần xóa vào state
    openModal(); // Mở modal xác nhận
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  // Hàm xử lý việc xóa món ăn
  const handleDelete = async () => {
    if (commissionRateId) {
      // Kiểm tra nếu có id món ăn cần xóa
      setLoadingDelete(true); // Hiển thị loader
      closeModal();
      try {
        await SupplierCommissionRateAPI.deleteFood(commissionRateId); // Gọi API để xóa
        toast.success("Món ăn đã được xóa thành công!"); // Thông báo thành công
        fetchSupplierData(); // Gọi lại hàm fetchDish để cập nhật danh sách món ăn
      } catch (error) {
        console.error("Error deleting dish:", error);
        toast.error("Có lỗi xảy ra khi xóa món ăn."); // Thông báo lỗi
      }
      setLoadingDelete(false); // Ẩn loader
      // Đóng modal
      setCommissionRateId(null);
    }
  };

  const handleEditClick = (commissionRateId) => {
    setEditingCommissionRateId(commissionRateId);
    setIsEditModalOpen(true);
  };

  const handleOnCloseModal = () => {
    setIsEditModalOpen(false);
    fetchSupplierData();
  };

  return (
    <>
      {supplierData ? (
        <div className="mt-6 w-5/6 mx-auto">
          <div className="text-2xl font-bold mb-1 text-left">
            Chi tiết nhà cung cấp
          </div>
          <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
            <div className="p-6">
              <p className="">
                Tên nhà cung cấp: <strong>{supplierData.name}</strong>
              </p>
              <p className="">
                Địa chỉ: <strong>{supplierData.address}</strong>
              </p>
              <p className="">
                Số điện thoại: <strong>{supplierData.phoneNumber}</strong>
              </p>
            </div>
          </div>

          <div className="text-xl font-semibold text-gray-600 text-left mt-4">
            Danh sách đơn vị quản lý
          </div>
          <div class="overflow-x-auto max-h-96 mt-2">
            <table className="w-full table-auto mb-4">
              <thead className="bg-gray-200 sticky top-0">
                <tr className="text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 w-2/5">Tên đơn vị</th>
                  <th className="py-3 px-6 w-2/5">Địa chỉ</th>
                  <th className="py-3 px-6 w-1/5">Số điện thoại</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {supplierData.managementUnitDtos.map((unit) => (
                  <tr key={unit.id} className="border-b">
                    <td className="py-3 px-6 text-left">
                      {" "}
                      <span
                        className="font-medium cursor-pointer hover:text-green-500"
                        onClick={handleClickCreate}
                      >
                        {unit.name}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">{unit.address}</td>
                    <td className="py-3 px-6 text-left">{unit.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xl font-semibold text-gray-600 text-left mt-2 mb-2">
            Danh sách món ăn đã đăng ký
          </div>
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              className="btn-add"
              onClick={() => handleClickCreate(supplierData.id)}
            >
              <Plus />
              Đăng ký món ăn
            </button>
          </div>
          <div class="overflow-x-auto max-h-96 mt-2 mb-5">
            <table className="w-full table-auto mb-4">
              <thead className="bg-gray-200 sticky top-0">
                <tr className="text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 w-2/5">Hình ảnh</th>
                  <th className="py-3 px-6 w-2/5">Tên món ăn</th>
                  <th className="py-3 px-6 w-1/5">Tỷ lệ</th>
                  <th className="py-3 px-6 w-1/5"></th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {supplierData.commissionRates.map((commissionRate) => (
                  <tr key={commissionRate.id} className="border-b">
                    <td className="py-3 px-6 text-left">
                      <img
                        src={commissionRate.food.image}
                        alt={commissionRate.food.name}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="py-3 px-6 text-left">
                      {" "}
                      <span
                        className="font-medium cursor-pointer hover:text-green-500"
                        // onClick={() => handleDetailClick(commissionRate.id)}
                      >
                        {commissionRate.food.name}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {commissionRate.commissionRate}%
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex">
                        <Write
                          onClick={() => handleEditClick(commissionRate.id)}
                          className="size-5 cursor-pointer"
                        />

                        <Delete
                          onClick={() => handleDeleteClick(commissionRate.id)}
                          className="delete-icon "
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-6 w-5/6 mx-auto animate-pulse">
          <div className="text-2xl font-bold mb-1 text-left">
            <div className="bg-gray-300 h-6 w-3/4 rounded"></div>
          </div>
          <div className="bg-white shadow-xl overflow-hidden sm:rounded-lg">
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>

          <div className="text-xl font-semibold text-gray-600 text-left mt-4">
            <div className="bg-gray-300 h-6 w-1/2 rounded"></div>
          </div>
          <div className="overflow-x-auto max-h-96 mt-2">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-3 px-6">
                    <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
                  </th>
                  <th className="py-3 px-6">
                    <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
                  </th>
                  <th className="py-3 px-6">
                    <div className="bg-gray-300 h-4 w-1/4 rounded"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(2)].map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-6">
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-3 px-6">
                      <div className="h-4 bg-gray-300 rounded"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="fixed inset-0 flex items-center justify-center"
        contentLabel="Xác nhận"
      >
        <div className="confirm-modal ">
          <h2 className="text-lg font-semibold mb-2">Xác nhận</h2>
          <p>Bạn có chắc chắn muốn xóa món ăn này?</p>
          <div className="flex justify-end gap-2 mt-4">
            <button className="btn-cancel" onClick={closeModal}>
              Hủy bỏ
            </button>
            <button
              className="btn-confirm-delete"
              onClick={() => handleDelete()}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>

      {isEditModalOpen && (
        <EditFoodRegistration
          onClose={() => handleOnCloseModal()}
          commissionRateId={editingCommissionRateId}
        />
      )}
    </>
  );
};

export default SupplierDetail;
