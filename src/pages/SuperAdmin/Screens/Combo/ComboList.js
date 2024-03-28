import React, { useState, useEffect } from "react";
import { Pagination } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import comboAPI from "../../../../services/comboAPI";
import { Link, useNavigate } from "react-router-dom";
import "../Combo/Combo.css";

import Modal from "react-modal";

import { ReactComponent as Plus } from "../../../../assets/icons/plus.svg";
import { ReactComponent as Search } from "../../../../assets/icons/search.svg";
import { ReactComponent as Write } from "../../../../assets/icons/write.svg";
import { ReactComponent as Delete } from "../../../../assets/icons/delete.svg";
import Loading from "../../../Loading/Loading";

const Combos = () => {
  const [combos, setCombos] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [comboToDelete, setComboToDelete] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCombo();
  }, [pageIndex, searchTerm]);
  const fetchCombo = async () => {
    setIsLoading(true);
    try {
      const result = await comboAPI.getComboByPagination(searchTerm, pageIndex);
      setCombos(result.items);
      setTotalPages(result.totalPagesCount);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };
  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
  };
  const handleDetailClick = (comboId) => {
    navigate(`/admin/combo/${comboId}`);
  };

  const handleSearch = async () => {
    setSearchTerm(searchInput); // Update searchTerm with searchInput
    setPageIndex(0); // Reset pageIndex to 0]
  };
  const handleEditClick = (comboId) => {
    navigate(`/admin/combo/${comboId}/edit`);
  };
  const handleDeleteClick = (comboId) => {
    setComboToDelete(comboId);
    openModal();
  };
  const handleDelete = async () => {
    if (comboToDelete) {
      // Kiểm tra nếu có id combo cần xóa
      setLoadingDelete(true); // Hiển thị loader
      closeModal();
      try {
        await comboAPI.deleteComboById(comboToDelete); // Gọi API để xóa
        toast.success("Combo đã được xóa thành công!"); // Thông báo thành công
        fetchCombo(); // Gọi lại hàm fetchCombo để cập nhật danh sách combo
      } catch (error) {
        console.error("Error deleting combo:", error);
        toast.error("Có lỗi xảy ra khi xóa combo."); // Thông báo lỗi
      }
      setLoadingDelete(false); // Ẩn loader
      // Đóng modal
    }
  };
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Danh sách combo</h2>
      <div className="bg-white rounded-xl p-4 ">
        <div className="flex justify-between items-center mb-4">
          <Link to="create">
            <button className="btn-add">
              <Plus />
              Thêm Combo
            </button>
          </Link>

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
                <th className="py-2.5 px-3 w-2/12 font-extrabold">Hình ảnh</th>
                <th className="py-2.5 px-3 w-3/12 font-extrabold">Tên Combo</th>
                <th className="py-2.5 px-3 w-3/12 font-extrabold">Món ăn</th>
                <th className="py-2.5 px-3 w-2/12 font-extrabold ">Đơn giá</th>
                <th className="py-2.5 px-3 w-2/12 font-extrabold"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-3 px-3">
                    Đang tải...
                  </td>
                </tr>
              ) : combos.length > 0 ? (
                combos.map((combo) => (
                  <tr
                    key={combo.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-2.5px-3 text-left">
                      <img
                        src={combo.image}
                        alt={combo.name}
                        className="display-img"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-left">
                      <span
                        className="text-name "
                        onClick={() => handleDetailClick(combo.id)}
                      >
                        {combo.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-left">{combo.foods}</td>
                    <td className="py-2.5 px-3">
                      {combo.comboPrice.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex justify-center">
                        <Write
                          onClick={() => handleEditClick(combo.id)}
                          className="size-5 cursor-pointer"
                        />
                        <Delete
                          onClick={() => handleDeleteClick(combo.id)}
                          className="delete-icon "
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-3 px-3">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5">
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
          <p>Bạn có chắc chắn muốn xóa combo này?</p>
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
    </div>
  );
};

export default Combos;
