import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import deliveryUnitAPI from "../../../../services/deliveryUnitAPI";
import { ToastContainer, toast } from "react-toastify";
import { Pagination } from "@mui/material";

import { ReactComponent as Search } from "../../../../assets/icons/search.svg";
import { ReactComponent as Write } from "../../../../assets/icons/write.svg";
import { ReactComponent as Delete } from "../../../../assets/icons/delete.svg";
import { ReactComponent as Plus } from "../../../../assets/icons/plus.svg";

import Loading from "../../../Loading/Loading";
import Modal from "react-modal";

const DeliveryUnitList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deliveryUnits, setDeliveryUnits] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Set the default value to an empty string
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [newDeliveryData, setNewDeliveryData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    commissionRate: "",
  });

  const [modalIsOpen, setIsOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDeliveryUnits();
  }, [pageIndex, searchTerm]); // Dependency on pageIndex and searchTerm

  const fetchDeliveryUnits = async () => {
    setIsLoading(true);
    try {
      const response = await deliveryUnitAPI.getDeliveryUnitByPagination(
        searchTerm,
        pageIndex
      );
      setDeliveryUnits(response.items);
      setTotalPages(response.totalPagesCount);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching delivery units:", error);
      toast.error(error.errors);
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setSearchTerm(searchInput); // Update searchTerm with searchInput
    setPageIndex(0); // Reset pageIndex to 0]
  };

  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDeliveryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDetailClick = (deliveryId) => {
    // Use navigate to navigate to the detail page with the dishId parameter
    navigate(`/admin/delivery/${deliveryId}`);
  };
  const handleEditClick = (deliveryId) => {
    // Use navigate to navigate to the detail page with the dishId parameter
    navigate(`/admin/delivery/${deliveryId}/edit`);
  };

  const handleCreateData = async () => {
    try {
      // Validate the input data before making the API call
      if (!newDeliveryData.name || !newDeliveryData.address) {
        toast.error("Please fill in all required fields.");
        return;
      }

      const createdDelivery = await deliveryUnitAPI.createDeliveryUnit(
        newDeliveryData
      );

      // Display a success message
      toast.success("Thêm nhà cung cấp thành công!");

      handleCloseModal();
      fetchDeliveryUnits();
    } catch (error) {
      console.error("Error creating delivery unit:", error);
      toast.error("Error creating delivery unit");
    }
  };
  const handleAddEmployeeClick = (id) => {
    navigate("create-delivery-user", { state: { deliveryUnitId: id } });
    console.log(id);
  };

  const handleDeleteClick = (deliveryId) => {
    setDishToDelete(deliveryId);
    openModal();
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleDelete = async () => {
    if (dishToDelete) {
      // Kiểm tra nếu có id món ăn cần xóa
      setLoadingDelete(true); // Hiển thị loader
      closeModal();
      try {
        await deliveryUnitAPI.deleteDeliveryById(dishToDelete); // Gọi API để xóa
        toast.success("Đối tác đã được xóa thành công!"); // Thông báo thành công
        fetchDeliveryUnits(); // Gọi lại hàm fetchDish để cập nhật danh sách món ăn
      } catch (error) {
        console.error("Error deleting dish:", error);
        toast.error("Có lỗi xảy ra khi xóa đối tác!"); // Thông báo lỗi
      }
      setLoadingDelete(false); // Ẩn loader
      // Đóng modal
    }
  };
  const handleClickCreate = () => {
    navigate(`/admin/delivery/create`);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">
          Danh sách đơn vị vận chuyển
        </h2>

        <div className="flex justify-between items-center mb-4">
          <button type="button" className="btn-add" onClick={handleClickCreate}>
            <Plus />
            Thêm đơn vị vận chuyển
          </button>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="input-search "
              placeholder="Tìm kiếm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            {/* <button
              className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
              onClick={handleSearch}
            >
              <Search />
            </button> */}
          </div>
        </div>

        <div className="bg-white shadow-md my-6 overflow-auto">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-800 leading-normal">
                <th className="py-2.5 font-extrabold px-6">Tên công ty</th>
                <th className="py-2.5 font-extrabold px-6">Địa chỉ</th>
                <th className="py-2.5 font-extrabold px-6">Số điện thoại</th>

                <th className="py-2.5 font-extrabold px-6">Quản trị viên</th>
                <th className="py-2.5 font-extrabold px-6"></th>
                <th className="py-2.5 font-extrabold px-6"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-3 px-6">
                    Đang tải...
                  </td>
                </tr>
              ) : deliveryUnits.length > 0 ? (
                deliveryUnits.map((deliveryUnit) => (
                  <tr
                    key={deliveryUnit.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-2.5 px-6 text-left font-bold">
                      {" "}
                      <span
                        className="text-name "
                        onClick={() => handleDetailClick(deliveryUnit.id)}
                      >
                        {deliveryUnit.name}
                      </span>
                    </td>

                    <td className="py-2.5 px-6 text-left whitespace-normal ">
                      {deliveryUnit.address}
                    </td>
                    <td className="py-2.5 px-6 text-left">
                      {deliveryUnit.phoneNumber}
                    </td>

                    <td className="py-2.5 px-6 text-left">
                      <ul>
                        {deliveryUnit.owners.map((owner, index) => (
                          <li key={index}>{owner}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-2.5 px-6 text-left">
                      <button
                        className="btn-add-secondary "
                        onClick={() => handleAddEmployeeClick(deliveryUnit.id)}
                      >
                        Thêm QTV
                      </button>
                    </td>
                    <td className="py-2.5 px-6 text-left">
                      <div className="flex">
                        <Write
                          onClick={() => handleEditClick(deliveryUnit.id)}
                          className="size-5 cursor-pointer"
                        />
                        <Delete
                          onClick={() => handleDeleteClick(deliveryUnit.id)}
                          className="delete-icon "
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3 px-6">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination-container mt-4">
            <Pagination
              componentName="div"
              count={totalPages}
              page={pageIndex + 1}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {loadingDelete && <Loading />}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.5)" } }}
        className="fixed inset-0 flex items-center justify-center"
        contentLabel="Xác nhận"
      >
        <div className="confirm-modal ">
          <h2 className="text-lg font-semibold mb-2">Xác nhận</h2>
          <p>Bạn có chắc chắn muốn xóa dữ liệu này?</p>
          <div className="flex justify-end gap-4 mt-4">
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

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default DeliveryUnitList;
