import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Pagination } from "@mui/material";

import companyAPI from "../../../../services/companyAPI";
import { ReactComponent as Search } from "../../../../assets/icons/search.svg";
import { ReactComponent as Write } from "../../../../assets/icons/write.svg";
import { ReactComponent as Delete } from "../../../../assets/icons/delete.svg";

import Modal from "react-modal";
import Loading from "../../../Loading/Loading";

const CompanyList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [companiesData, setCompaniesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Set the default value to an empty string
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const [modalIsOpen, setIsOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCompany();
  }, [pageIndex, searchTerm]); // Dependency on pageIndex and searchTerm

  const fetchCompany = async () => {
    setIsLoading(true);
    try {
      const response = await companyAPI.getCompanyUnitByPagination(
        searchTerm,
        pageIndex
      );
      setCompaniesData(response.items);
      setTotalPages(response.totalPagesCount);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching company :", error);
      toast.error("Lỗi khi thêm dvvc");
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

  const handleDeleteClick = (companyId) => {
    setDishToDelete(companyId);
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
        await companyAPI.deleteCompanyById(dishToDelete); // Gọi API để xóa
        toast.success("Công ty đã được xóa thành công!"); // Thông báo thành công
        fetchCompany(); // Gọi lại hàm fetchDish để cập nhật danh sách món ăn
      } catch (error) {
        console.error("Error deleting dish:", error);
        toast.error("Có lỗi xảy ra khi xóa công ty!"); // Thông báo lỗi
      }
      setLoadingDelete(false); // Ẩn loader
      // Đóng modal
    }
  };
  const handleEditClick = (companyId) => {
    // Use navigate to navigate to the detail page with the dishId parameter
    navigate(`/admin/company/${companyId}/edit`);
  };

  const handleDetailClick = (companyId) => {
    // Use navigate to navigate to the detail page with the dishId parameter
    navigate(`/admin/company/${companyId}`);
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Danh sách công ty</h2>

        <div className="flex justify-between items-center mb-4">
          <Link to="create">
            <button
              id="create-btn"
              className="rounded-2xl bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            >
              Thêm công ty
            </button>
          </Link>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              className="px-4 py-2 border rounded-2xl text-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Tìm kiếm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
              onClick={handleSearch}
            >
              <Search />
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md my-6">
          <table className=" w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 w-1/7 break-words">Tên công ty</th>
                <th className="py-3 px-6 w-1/7 break-words">Địa chỉ</th>
                <th className="py-3 px-6 w-1/7 break-words">Số điện thoại</th>

                <th className="py-3 px-6 w-1/7 break-words">Đối tác</th>
                <th className="py-3 px-6 w-1/7 break-words">
                  Đơn vị vận chuyển
                </th>
                <th className="py-3 px-6 w-1/7 break-words"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-3 px-6">
                    Đang tải...
                  </td>
                </tr>
              ) : companiesData.length > 0 ? (
                companiesData.map((companyUnit) => (
                  <tr
                    key={companyUnit.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left font-bold">
                      <span
                        className="font-medium cursor-pointer hover:text-blue-500"
                        onClick={() => handleDetailClick(companyUnit.id)}
                      >
                        {companyUnit.name}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {companyUnit.address}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {companyUnit.phoneNumber}
                    </td>

                    <td className="py-3 px-6 text-left">
                      {companyUnit.managementUnit}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {companyUnit.deliveryUnit}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div className="flex">
                        <Write
                          onClick={() => handleEditClick(companyUnit.id)}
                          className="size-5 cursor-pointer"
                        />
                        <Delete
                          onClick={() => handleDeleteClick(companyUnit.id)}
                          className="size-5 cursor-pointer ml-4"
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
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto z-50">
          <h2 className="text-lg font-semibold mb-4">Xác nhận</h2>
          <p>Bạn có chắc chắn muốn xóa dữ liệu này?</p>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black"
              onClick={closeModal}
            >
              Hủy bỏ
            </button>
            <button
              className="px-4 py-2 bg-red-500 hover:bg-red-700 rounded text-white"
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

export default CompanyList;
