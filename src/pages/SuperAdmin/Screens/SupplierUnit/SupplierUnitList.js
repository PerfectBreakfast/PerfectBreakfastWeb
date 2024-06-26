import React, { useState, useEffect } from "react";
import { Pagination } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Dish/Dish.css";

import "../Table/Table.css";
import { useNavigate } from "react-router-dom";
import supplierUnitAPI from "../../../../services/supplierUnitAPI";
import managementUnitAPI from "../../../../services/managementUnitAPI";

import { ReactComponent as Search } from "../../../../assets/icons/search.svg";
import { ReactComponent as Write } from "../../../../assets/icons/write.svg";
import { ReactComponent as Delete } from "../../../../assets/icons/delete.svg";
import { ReactComponent as Plus } from "../../../../assets/icons/plus.svg";

import Modal from "react-modal";
import Loading from "../../../Loading/Loading";

const SupplierUnitList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [supplierUnits, setSupplierUnits] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Set the default value to an empty string
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [managementUnits, setManagementUnits] = useState([]);

  const [isAssignManagerModalOpen, setAssignManagerModalOpen] = useState(false);
  const [selectedManagementUnit, setSelectedManagementUnit] = useState("");

  const [supplierId, setSupplierId] = useState();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchManagementUnits(supplierId);
    fetchSupplierUnits();
  }, [pageIndex, searchTerm]); // Dependency on pageIndex and searchTerm

  const fetchSupplierUnits = async () => {
    setIsLoading(true);
    try {
      const response = await supplierUnitAPI.getSupplierUnitByPagination(
        searchTerm,
        pageIndex
      );
      setSupplierUnits(response.items);
      setTotalPages(response.totalPagesCount);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching supplier units:", error);
      toast.error("Error fetching supplier units");
      setIsLoading(false);
    }
  };

  const fetchManagementUnits = async (supplierId) => {
    if (supplierId) {
      try {
        const response = await managementUnitAPI.getPartnerForSupplier(
          supplierId
        );
        setManagementUnits(response);
      } catch (error) {
        console.error("Error fetching units:", error);
        toast.error("Error fetching management");
      }
    }
  };

  const handleSearch = async () => {
    setSearchTerm(searchInput); // Update searchTerm with searchInput
    setPageIndex(0); // Reset pageIndex to 0]
  };

  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
  };

  const handleCloseModal = () => {
    setAssignManagerModalOpen(false);
    setModalOpen(false);
  };

  const handleOpenAssignManagerModal = (supplierId) => {
    setSelectedManagementUnit("");
    setAssignManagerModalOpen(true);
    setSupplierId(supplierId);
    fetchManagementUnits(supplierId);
  };
  const handleCloseAssignManagerModal = () => {
    setSupplierId(null);
    fetchManagementUnits(null);
    setSelectedManagementUnit("");
    setAssignManagerModalOpen(false);
  };

  const handleAssignManager = async () => {
    try {
      // Validate selected management unit
      if (!selectedManagementUnit) {
        toast.error("Vui lòng chọn một quản lý.");
        return;
      }

      await supplierUnitAPI.supplyAssigment({
        supplierId: supplierId,
        partnerId: selectedManagementUnit,
      });

      toast.success("Gán quản lý thành công!");

      handleCloseModal();
      fetchSupplierUnits();
      setSupplierId(null);
      setSelectedManagementUnit("");
    } catch (error) {
      console.error("Error assigning manager:", error);
      toast.error("Error assigning manager");
    }
  };
  const handleAddEmployeeClick = (id) => {
    navigate("create-supplier-user", { state: { supplierUnitId: id } });
    console.log("id", id);
  };
  const handleDetailClick = (supplierId) => {
    navigate(`/admin/supplier/${supplierId}`);
  };
  const handleEditClick = (supplierId) => {
    navigate(`/admin/supplier/${supplierId}/edit`);
  };

  const handleDeleteClick = (supplierId) => {
    setDishToDelete(supplierId);
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
      setLoadingDelete(true);
      closeModal();
      try {
        await supplierUnitAPI.deletePartnerById(dishToDelete); // Gọi API để xóa
        toast.success("Nhà cung cấp đã được xóa thành công!"); // Thông báo thành công
        fetchSupplierUnits(); // Gọi lại hàm fetchDish để cập nhật danh sách món ăn
      } catch (error) {
        console.error("Error deleting dish:", error);
        toast.error("Có lỗi xảy ra khi xóa nhà cung cấp!"); // Thông báo lỗi
      }
      setLoadingDelete(false); // Ẩn loader
      // Đóng modal
    }
  };
  const handleClickCreate = () => {
    navigate(`/admin/supplier/create`);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Danh sách nhà cung cấp</h2>
        <div className="bg-white rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              className="btn-add"
              onClick={handleClickCreate}
            >
              <Plus />
              Thêm nhà cung cấp
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
                  <th className="py-2.5 font-extrabold px-2 text-center">
                    Số điện thoại
                  </th>
                  <th className="py-2.5 font-extrabold px-3">Quản trị viên</th>
                  {/* <th className="py-2.5 font-extrabold px-3  ">Đối tác</th> */}
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
                ) : supplierUnits.length > 0 ? (
                  supplierUnits.map((supplierUnit) => (
                    <tr
                      key={supplierUnit.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-2.5 px-3 text-left font-bold">
                        <span
                          className="text-name "
                          onClick={() => handleDetailClick(supplierUnit.id)}
                        >
                          {supplierUnit.name}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-left whitespace-normal  ">
                        {supplierUnit.address}
                      </td>
                      <td className="py-2.5 px-3 text-left">
                        {supplierUnit.phoneNumber}
                      </td>

                      <td className="py-2.5 px-3 text-left">
                        <ul>
                          {supplierUnit.owners.map((owner, index) => (
                            <li key={index}>{owner}</li>
                          ))}
                        </ul>
                      </td>
                      {/* <td className="py-2.5 px-3 text-left">
                      <ul>
                        {supplierUnit.managementUnitName.map((unit, index) => (
                          <li key={index}>{unit}</li>
                        ))}
                      </ul>
                    </td> */}
                      <td className="py-2.5 px-3 text-left flex flex-col gap-y-2">
                        <button
                          className="btn-add-secondary"
                          onClick={() =>
                            handleAddEmployeeClick(supplierUnit.id)
                          }
                        >
                          Thêm QTV
                        </button>

                        <button
                          className="btn-add-third"
                          onClick={() =>
                            handleOpenAssignManagerModal(supplierUnit.id)
                          }
                        >
                          Gán quản lý
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-left">
                        <div className="flex">
                          <Write
                            onClick={() => handleEditClick(supplierUnit.id)}
                            className="size-5 cursor-pointer"
                          />
                          <Delete
                            onClick={() => handleDeleteClick(supplierUnit.id)}
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
      <Modal
        isOpen={isAssignManagerModalOpen}
        onRequestClose={() => handleCloseAssignManagerModal()}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "2rem",
            borderRadius: "0.5rem",
            maxWidth: "500px",
            width: "90%",
          },
        }}
        contentLabel="Assign Manager Modal"
      >
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-2.5">Gán quán lý</h2>
          <div className="mb-1">
            <label htmlFor="managementUnitSelect" className="label-input">
              Chọn công ty quản lý
            </label>
            <select
              id="managementUnitSelect"
              className="input-form"
              value={selectedManagementUnit}
              onChange={(e) => setSelectedManagementUnit(e.target.value)}
            >
              <option disabled value="">
                Chọn
              </option>
              {managementUnits.map((managementUnit) => (
                <option key={managementUnit.id} value={managementUnit.id}>
                  {managementUnit.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              className="btn-cancel"
              onClick={() => setAssignManagerModalOpen(false)}
            >
              Hủy
            </button>
            <button className="btn-confirm" onClick={handleAssignManager}>
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>

      <ToastContainer position="top-right" autoClose={2000} />
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

export default SupplierUnitList;
