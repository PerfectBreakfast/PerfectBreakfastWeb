import React, { useState, useEffect } from "react";
import { Pagination } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import menuAPI from "../../../../services/menuAPI";
import "../Table/Table.css";

import { ReactComponent as Search } from "../../../../assets/icons/search.svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    fetchMenu();
  }, [pageIndex, searchTerm]);

  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
  };
  const fetchMenu = async () => {
    try {
      const result = await menuAPI.getMenuByPagination(searchTerm, pageIndex);
      setMenus(result.items);
      setTotalPages(result.totalPagesCount);
    } catch (error) {
      console.error("Error fetching data:", error);
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
  const toggleMenuVisibility = async (menuId) => {
    try {
      // Gọi API để cập nhật isSelected của menu
      await menuAPI.updateMenuVisibility(menuId);
      // Cập nhật UI, có thể cần gọi lại fetchMenu hoặc cập nhật state tương ứng
      toast.success("Đã cập nhật menu được hiển thị!");
      fetchMenu(); // Hoặc cập nhật state nếu bạn không muốn gọi lại API
    } catch (error) {
      console.error("Error updating menu visibility:", error);
      toast.error("Failed to update menu");
    }
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
              <th className="py-3 px-6">ID</th>
              <th className="py-3 px-6">Tên menu</th>
              <th className="py-3 px-6">Ngày tạo</th>
              <th className="py-3 px-6"></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {menus.map((menu) => (
              <tr
                key={menu.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{menu.id}</td>
                <td className="py-3 px-6 text-left">{menu.name}</td>
                <td className="py-3 px-6 text-left">
                  {formatDate(menu.creationDate)}
                </td>
                <td className="py-3 px-6 text-center">
                  {menu.isSelected ? (
                    <VisibilityIcon />
                  ) : (
                    <button onClick={() => toggleMenuVisibility(menu.id)}>
                      <VisibilityOffIcon />
                    </button>
                  )}
                </td>
              </tr>
            ))}
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
    </div>
  );
};

export default Menu;
