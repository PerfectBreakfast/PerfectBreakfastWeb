import React, { useState, useEffect } from "react";
import { Pagination } from "@mui/material";
import dishAPI from "../../../../services/dishAPI";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Dish/Dish.css";
import "../Table/Table.css";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Search } from "../../../../assets/icons/search.svg";
import { ReactComponent as Write } from "../../../../assets/icons/write.svg";
import { ReactComponent as Delete } from "../../../../assets/icons/delete.svg";
import { ReactComponent as Plus } from "../../../../assets/icons/plus.svg";

import Modal from "react-modal";
import Loading from "../../../Loading/Loading";

Modal.setAppElement("#root"); // Tránh warning về accessibility

const Dishes = () => {
  const [dishes, setDishes] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDish();
  }, [pageIndex, searchTerm]);
  const fetchDish = async () => {
    setIsLoading(true);
    try {
      const result = await dishAPI.getDishByPagination(searchTerm, pageIndex);
      setDishes(result.items);
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
  const handleSearch = async () => {
    setSearchTerm(searchInput);
    setPageIndex(0);
  };

  const handleDishClick = (dishId) => {
    navigate(`/admin/food/${dishId}`);
  };
  const handleEditClick = (dishId) => {
    navigate(`/admin/food/${dishId}/edit`);
  };
  const handleClickCreate = () => {
    navigate(`/admin/food/create`);
  };

  const handleDeleteClick = (dishId) => {
    setDishToDelete(dishId); // Lưu id món ăn cần xóa vào state
    openModal(); // Mở modal xác nhận
  };

  // Hàm xử lý việc xóa món ăn
  const handleDelete = async () => {
    if (dishToDelete) {
      // Kiểm tra nếu có id món ăn cần xóa
      setLoadingDelete(true); // Hiển thị loader
      closeModal();
      try {
        await dishAPI.deleteDishById(dishToDelete); // Gọi API để xóa
        toast.success("Món ăn đã được xóa thành công!"); // Thông báo thành công
        fetchDish(); // Gọi lại hàm fetchDish để cập nhật danh sách món ăn
      } catch (error) {
        console.error("Error deleting dish:", error);
        toast.error("Có lỗi xảy ra khi xóa món ăn."); // Thông báo lỗi
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
    <>
      <div className="container mx-auto p-4">
        <h4 className="text-2xl font-semibold mb-4">Danh sách món ăn</h4>

        <div className="flex justify-between items-center mb-4">
          <button className="btn-add" type="button" onClick={handleClickCreate}>
            <Plus />
            Thêm món ăn
          </button>

          <div className="flex items-center">
            <input
              type="text"
              className="input-search "
              placeholder="Tìm kiếm..."
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

        <div className="bg-white shadow-md my-6">
          <table className=" min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-800 leading-normal">
                <th className="py-2.5 px-6 w-1/4 font-extrabold">Hình ảnh</th>
                <th className="py-2.5 px-6 w-1/4 font-extrabold">Tên món ăn</th>
                <th className="py-2.5 px-6 w-1/4 font-extrabold">Đơn giá</th>
                <th className="py-2.5 px-6 w-1/4"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-3 px-6">
                    Đang tải...
                  </td>
                </tr>
              ) : dishes.length > 0 ? (
                dishes.map((dish) => (
                  <tr
                    key={dish.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-2.5 px-6 text-left">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="display-img"
                      />
                    </td>
                    <td className="py-2.5 px-6 text-left">
                      <span
                        className="text-name "
                        onClick={() => handleDishClick(dish.id)}
                      >
                        {dish.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-6">
                      {dish.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="py-2.5px-6">
                      <div className="flex justify-center">
                        <Write
                          onClick={() => handleEditClick(dish.id)}
                          className="size-5 cursor-pointer"
                        />
                        <Delete
                          onClick={() => handleDeleteClick(dish.id)}
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
        </div>

        <div className="pagination-container" style={{ marginTop: "20px" }}>
          <Pagination
            componentName="div"
            count={totalPages}
            page={pageIndex + 1}
            onChange={handlePageChange}
            color="success"
          />
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
    </>
  );
};

export default Dishes;
