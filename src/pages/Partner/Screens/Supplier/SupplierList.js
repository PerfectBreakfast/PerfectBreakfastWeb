import React, { useState, useEffect } from "react";
import { Pagination } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

import { ReactComponent as Search } from "../../../../assets/icons/search.svg";
import supplierUnitAPI from "../../../../services/supplierUnitAPI";

const SupplierList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [supplierUnits, setSupplierUnits] = useState([]);

  const [searchTerm, setSearchTerm] = useState(""); // Set the default value to an empty string
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSupplierUnits();
  }, [pageIndex, searchTerm]); // Dependency on pageIndex and searchTerm

  const fetchSupplierUnits = async () => {
    setIsLoading(true);
    try {
      const response = await supplierUnitAPI.getSupplierByPaginationForPartner(
        searchTerm,
        pageIndex
      );
      setSupplierUnits(response.items);
      setTotalPages(response.totalPagesCount);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching supplier units:", error);
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

  return (
    <>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Danh sách nhà cung cấp</h2>
        <div className="bg-white rounded-xl p-4 ">
          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center">
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
                  <th className="py-2.5 font-extrabold px-6  break-words">
                    Tên công ty
                  </th>
                  <th className="py-2.5 font-extrabold px-6  break-words">
                    Địa chỉ
                  </th>
                  <th className="py-2.5 font-extrabold px-6  break-words">
                    Số điện thoại
                  </th>
                </tr>
              </thead>

              <tbody className="text-gray-600 text-sm font-light">
                {isLoading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-3 px-6">
                      Đang tải...
                    </td>
                  </tr>
                ) : supplierUnits.length > 0 ? (
                  supplierUnits.map((supplierUnit) => (
                    <tr
                      key={supplierUnit.id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-2.5 px-6 text-left font-bold">
                        {supplierUnit.name}
                      </td>
                      <td className="py-2.5 px-6 text-left whitespace-normal break-words">
                        {supplierUnit.address}
                      </td>
                      <td className="py-2.5 px-6 text-left">
                        {supplierUnit.phoneNumber}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-3 px-6">
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3">
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
    </>
  );
};

export default SupplierList;
