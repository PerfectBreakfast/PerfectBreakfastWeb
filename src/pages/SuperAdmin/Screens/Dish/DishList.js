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
          <button
            id="create-btn"
            className="rounded-2xl bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            // onClick={handleOpenModal}
            onClick={handleClickCreate}
          >
            Thêm món ăn
          </button>

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
          <table className=" min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 rounded-l">Hình ảnh</th>
                <th className="py-3 px-6">Tên món ăn</th>
                <th className="py-3 px-6 rounded-r">Đơn giá</th>
                <th className="py-3 px-6 rounded-r"></th>
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
                    <td className="py-3 px-6 text-left">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-16 h-16 rounded-full"
                      />
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className="font-medium cursor-pointer hover:text-green-500"
                        onClick={() => handleDishClick(dish.id)}
                      >
                        {dish.name}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      {dish.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex">
                        <Write
                          onClick={() => handleEditClick(dish.id)}
                          className="size-5 cursor-pointer"
                        />
                        <Delete
                          onClick={() => handleDeleteClick(dish.id)}
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
            color="primary"
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
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto z-50">
          <h2 className="text-lg font-semibold mb-4">Xác nhận</h2>
          <p>Bạn có chắc chắn muốn xóa món ăn này?</p>
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
    </>
  );
};

export default Dishes;
