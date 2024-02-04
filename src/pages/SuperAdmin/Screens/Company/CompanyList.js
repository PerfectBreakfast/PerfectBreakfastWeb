import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  Box,
  Button,
  Modal,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../Table/StyledTableComponents";
import companyAPI from "../../../../services/companyAPI";
import { ReactComponent as Search } from "../../../../assets/icons/search.svg";

const CompanyList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [companiesData, setCompaniesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Set the default value to an empty string
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchCompany();
  }, [pageIndex, searchTerm]); // Dependency on pageIndex and searchTerm

  const fetchCompany = async () => {
    try {
      const response = await companyAPI.getCompanyUnitByPagination(
        searchTerm,
        pageIndex
      );
      setCompaniesData(response.items);
      setTotalPages(response.totalPagesCount);
    } catch (error) {
      console.error("Error fetching company :", error);
      toast.error("Lỗi khi thêm dvvc");
    }
  };

  const handleSearch = async () => {
    setSearchTerm(searchInput); // Update searchTerm with searchInput
    setPageIndex(0); // Reset pageIndex to 0]
  };

  const handlePageChange = (event, value) => {
    setPageIndex(value - 1);
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
                <th className="py-3 px-6 w-1/6 break-words">Tên công ty</th>
                <th className="py-3 px-6 w-1/6 break-words">Địa chỉ</th>
                <th className="py-3 px-6 w-1/6 break-words">Số điện thoại</th>
                <th className="py-3 px-6 w-1/6 break-words">Email</th>
                <th className="py-3 px-6 w-1/6 break-words">Giờ làm việc</th>
                <th className="py-3 px-6 w-1/6 break-words">Nhân viên</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {companiesData.map((companyUnit) => (
                <tr
                  key={companyUnit.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left">{companyUnit.name}</td>
                  <td className="py-3 px-6 text-left">{companyUnit.address}</td>
                  <td className="py-3 px-6 text-left">
                    {companyUnit.phoneNumber}
                  </td>
                  <td className="py-3 px-6 text-left">{companyUnit.email}</td>
                  <td className="py-3 px-6 text-left">
                    {companyUnit.startWorkHour}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {companyUnit.memberCount}
                  </td>
                </tr>
              ))}
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

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default CompanyList;
