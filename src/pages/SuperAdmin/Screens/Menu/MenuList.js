import React, { useState, useEffect } from "react";
import { Pagination } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import menuAPI from "../../../../services/menuAPI";
import "../Table/Table.css";

import { ReactComponent as Search } from "../../../../assets/icons/search.svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ReactComponent as Write } from "../../../../assets/icons/write.svg";
import { ReactComponent as Delete } from "../../../../assets/icons/delete.svg";
import Loading from "../../../Loading/Loading";
import Modal from "react-modal";

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [modalAction, setModalAction] = useState({ action: "", id: null });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchMenu();
  }, [pageIndex, searchTerm]);

  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
  };
  const fetchMenu = async () => {
    setIsLoading(true);
    try {
      const result = await menuAPI.getMenuByPagination(searchTerm, pageIndex);
      setMenus(result.items);
      setTotalPages(result.totalPagesCount);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
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
  const handleSearch = async () => {
    setSearchTerm(searchInput); // Update searchTerm with searchInput
    setPageIndex(0); // Reset pageIndex to 0]
  };
  const handleDetailClick = (menuId) => {
    // Use navigate to navigate to the detail page with the dishId parameter
    navigate(`/admin/menu/${menuId}`);
  };
  const handleEditClick = (menuId) => {
    // Use navigate to navigate to the detail page with the dishId parameter
    navigate(`/admin/menu/${menuId}/edit`);
  };

  const handleEnableMenu = (menuId) => {
    openModal("enable", menuId);
  };

  const handleDeleteClick = (menuId) => {
    openModal("delete", menuId);
  };

  function openModal(action, id) {
    setModalAction({ action, id });
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const confirmAction = async () => {
    setLoadingDelete(true);
    closeModal();
    if (modalAction.action === "delete") {
      try {
        await menuAPI.deleteMenuById(modalAction.id); // Gọi API để xóa
        setLoadingDelete(false);
        toast.success("Menu đã được xóa thành công!"); // Thông báo thành công
        fetchMenu(); // Gọi lại hàm fetchMenu để cập nhật danh sách
      } catch (error) {
        console.error("Error deleting menu:", error);
        toast.error("Có lỗi xảy ra khi xóa menu."); // Thông báo lỗi
      } finally {
        setLoadingDelete(false); // Ẩn loader
      }
    } else if (modalAction.action === "enable") {
      // Xử lý cập nhật visibility
      try {
        await menuAPI.updateMenuVisibility(modalAction.id);
        setLoadingDelete(false);
        toast.success("Đã cập nhật menu!");
        fetchMenu();
      } catch (error) {
        console.error("Error updating menu visibility:", error);
        toast.error("Lỗi khi hiển thị menu!");
      } finally {
        setLoadingDelete(false); // Ẩn loader
      }
    }
    closeModal(); // Đóng modal sau khi xử lý
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Danh sách menu</h2>

      <div className="flex justify-between items-center mb-4">
        <Link to="create">
          <button
            id="create-btn"
            className="rounded-2xl bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          >
            Thêm Menu
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
        <table className="min-w-max w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6">Tên menu</th>
              <th className="py-3 px-6">Ngày tạo</th>
              <th className="py-3 px-6 text-center">Hiện menu</th>
              <th className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center py-3 px-6">
                  Đang tải...
                </td>
              </tr>
            ) : menus.length > 0 ? (
              menus.map((menu) => (
                <tr
                  key={menu.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">
                    {" "}
                    <span
                      className="font-medium cursor-pointer hover:text-blue-500"
                      onClick={() => handleDetailClick(menu.id)}
                    >
                      {menu.name}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {formatDate(menu.creationDate)}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {menu.isSelected ? (
                      <VisibilityIcon />
                    ) : (
                      <button onClick={() => handleEnableMenu(menu.id)}>
                        <VisibilityOffIcon />
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex">
                      <Write
                        onClick={() => handleEditClick(menu.id)}
                        className="size-5 cursor-pointer"
                      />
                      <Delete
                        onClick={() => handleDeleteClick(menu.id)}
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
      </div>

      <div className="pagination-container" style={{ marginTop: "20px" }}>
        <Pagination
          componentName="div"
          count={totalPages}
          page={pageIndex + 1}
          onChange={handlePageChange}
        />
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
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
          <p>
            Bạn có chắc chắn muốn{" "}
            {modalAction.action === "delete" ? "xóa" : "cập nhật"} menu này?
          </p>

          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-black"
              onClick={closeModal}
            >
              Hủy bỏ
            </button>
            <button
              className={`px-4 py-2 rounded text-white ${
                modalAction.action === "delete"
                  ? "bg-red-500 hover:bg-red-700"
                  : "bg-green-500 hover:bg-green-700"
              }`}
              onClick={confirmAction}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Menu;
