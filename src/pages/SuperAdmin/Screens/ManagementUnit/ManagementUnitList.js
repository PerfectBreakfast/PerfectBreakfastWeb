import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Pagination } from "@mui/material";

import managementUnitAPI from "../../../../services/managementUnitAPI";
import { ReactComponent as Search } from "../../../../assets/icons/search.svg";
import { ReactComponent as Write } from "../../../../assets/icons/write.svg";
import { ReactComponent as Delete } from "../../../../assets/icons/delete.svg";
import { ReactComponent as Plus } from "../../../../assets/icons/plus.svg";

import Modal from "react-modal";
import Loading from "../../../Loading/Loading";

const ManagementUnitList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [managementUnits, setManagementUnits] = useState([]);

  const [searchTerm, setSearchTerm] = useState(""); // Set the default value to an empty string
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const [modalIsOpen, setIsOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchManagementUnits();
  }, [pageIndex, searchTerm]); // Dependency on pageIndex and searchTerm

  const fetchManagementUnits = async () => {
    setIsLoading(true);
    try {
      const response = await managementUnitAPI.getManagementUnitByPagination(
        searchTerm,
        pageIndex
      );
      setManagementUnits(response.items);
      setTotalPages(response.totalPagesCount);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching management units:", error);
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

  const handleAddEmployeeClick = (id) => {
    navigate("create-management-user", { state: { partnerId: id } });
    console.log(id);
  };
  const handleDetailClick = (partnerId) => {
    // Use navigate to navigate to the detail page with the dishId parameter
    navigate(`/admin/partner/${partnerId}`);
  };
  const handleEditClick = (partnerId) => {
    // Use navigate to navigate to the detail page with the dishId parameter
    navigate(`/admin/partner/${partnerId}/edit`);
  };
  const handleClickCreate = () => {
    navigate(`/admin/partner/create`);
  };

  const handleDeleteClick = (partnerId) => {
    setDishToDelete(partnerId);
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
        await managementUnitAPI.deletePartnerById(dishToDelete); // Gọi API để xóa
        toast.success("Đối tác đã được xóa thành công!"); // Thông báo thành công
        fetchManagementUnits(); // Gọi lại hàm fetchDish để cập nhật danh sách món ăn
      } catch (error) {
        console.error("Error deleting dish:", error);
        toast.error("Có lỗi xảy ra khi xóa đối tác!"); // Thông báo lỗi
      }
      setLoadingDelete(false); // Ẩn loader
      // Đóng modal
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Danh sách đối tác</h2>
        <div className="bg-white rounded-xl p-4 ">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              className="btn-add"
              onClick={handleClickCreate}
            >
              <Plus />
              Thêm đối tác
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
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-800 leading-normal">
                  <th className="py-2.5 font-extrabold px-3">Tên công ty</th>
                  <th className="py-2.5 font-extrabold px-3">Địa chỉ</th>
                  <th className="py-2.5 font-extrabold px-3">Số điện thoại</th>
                  <th className="py-2.5 font-extrabold px-3">Quản trị viên</th>
                  <th className="py-2.5 font-extrabold px-3"></th>
                  <th className="py-2.5 font-extrabold px-3"></th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-3 px-3">
                      Đang tải...
                    </td>
                  </tr>
                ) : managementUnits.length > 0 ? (
                  managementUnits.map((managementUnit) => (
                    <tr
                      key={managementUnit.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-2.5 px-3 text-left font-bold">
                        <span
                          className="text-name "
                          onClick={() => handleDetailClick(managementUnit.id)}
                        >
                          {managementUnit.name}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-left">
                        {managementUnit.address}
                      </td>
                      <td className="py-2.5 px-3 text-left">
                        {managementUnit.phoneNumber}
                      </td>

                      <td className="py-2.5 px-3 text-left">
                        <ul>
                          {managementUnit.owners.map((owner, index) => (
                            <li key={index}>{owner}</li>
                          ))}
                        </ul>
                      </td>

                      <td className="py-2.5 px-3 text-left">
                        <button
                          className="btn-add-secondary"
                          onClick={() =>
                            handleAddEmployeeClick(managementUnit.id)
                          }
                        >
                          Thêm QTV
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-left">
                        <div className="flex">
                          <Write
                            onClick={() => handleEditClick(managementUnit.id)}
                            className="size-5 cursor-pointer"
                          />
                          <Delete
                            onClick={() => handleDeleteClick(managementUnit.id)}
                            className="delete-icon "
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-3 px-3">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td colspan="6">
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
    </>
  );
};

export default ManagementUnitList;
