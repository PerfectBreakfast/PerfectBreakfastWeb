import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Button,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import comboAPI from "../../../../services/comboAPI";
import { Link, useNavigate } from "react-router-dom";
import "../Combo/Combo.css";
import {
  StyledTableCell,
  StyledTableRow,
} from "../Table/StyledTableComponents";
import { ReactComponent as Search } from "../../../../assets/icons/search.svg";

const Combos = () => {
  const [combos, setCombos] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCombo = async () => {
      try {
        const result = await comboAPI.getComboByPagination(
          searchTerm,
          pageIndex
        );
        setCombos(result.items);
        setTotalPages(result.totalPagesCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCombo();
  }, [pageIndex, searchTerm]);

  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
  };
  const handleDetailClick = (comboId) => {
    // Use navigate to navigate to the detail page with the dishId parameter
    navigate(`/admin/combo/${comboId}`);
  };

  const handleSearch = async () => {
    setSearchTerm(searchInput); // Update searchTerm with searchInput
    setPageIndex(0); // Reset pageIndex to 0]
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Danh sách combo</h2>

        <div className="flex justify-between items-center mb-4">
          <Link to="create">
            <button
              id="create-btn"
              className="rounded-2xl bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            >
              Thêm Combo
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
                <th className="py-3 px-6 rounded-l">Hình ảnh</th>
                <th className="py-3 px-6">Tên Combo</th>
                <th className="py-3 px-6">Món ăn</th>
                <th className="py-3 px-6 rounded-r">Giá</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {combos.map((combo) => (
                <tr
                  key={combo.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">
                    <img
                      src={combo.image}
                      alt={combo.name}
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span
                      className="font-medium cursor-pointer hover:text-blue-500"
                      onClick={() => handleDetailClick(combo.id)}
                    >
                      {combo.name}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">{combo.foods}</td>
                  <td className="py-3 px-6">
                    {combo.comboPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
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
            color="primary"
          />
        </div>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </>
  );
};

export default Combos;
