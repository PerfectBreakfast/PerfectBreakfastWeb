import React, { useEffect, useState } from "react";
import userAPI from "../../../../services/userAPI";
import { useNavigate } from "react-router-dom";
import Loading from "../../../Loading/Loading";
import { ToastContainer } from "react-toastify";
import { Pagination } from "@mui/material";

import { ReactComponent as Search } from "../../../../assets/icons/search.svg";
import { ReactComponent as Write } from "../../../../assets/icons/write.svg";
import { ReactComponent as Delete } from "../../../../assets/icons/delete.svg";
import { ReactComponent as Plus } from "../../../../assets/icons/plus.svg";

const DeliveryStaffList = () => {
  const [staffData, setStaffData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryId, setDeliveryId] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    fetchStaffData();
  }, [pageIndex]);
  const fetchStaffData = async () => {
    setIsLoading(true);
    try {
      const result = await userAPI.getDeliveryStaffByPagination(pageIndex);
      setStaffData(result.pagination.items);
      setDeliveryId(result.deliveryId);
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
  console.log("data", staffData);
  const handleAddEmployeeClick = (id) => {
    navigate("create", { state: { deliveryUnitId: id } });
    console.log(id);
  };
  return (
    <>
      <div className="container mx-auto p-4">
        <h4 className="text-2xl font-semibold mb-4">Danh sách nhân viên</h4>

        <div className="flex justify-between items-center mb-4">
          <button
            className="btn-add"
            onClick={() => handleAddEmployeeClick(deliveryId)}
          >
            <Plus />
            Thêm nhân viên
          </button>
          {/* 
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
          </div> */}
        </div>

        <div className="bg-white shadow-md my-6 overflow-auto">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-800 leading-normal">
                <th className="py-2.5 font-extrabold px-6">Hình ảnh</th>
                <th className="py-2.5 font-extrabold px-6">Tên nhân viên</th>
                <th className="py-2.5 font-extrabold px-6">Số điện thoại</th>
                <th className="py-2.5 font-extrabold px-6">Email</th>
                <th className="py-2.5 font-extrabold px-6"></th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-3 px-6">
                    Đang tải...
                  </td>
                </tr>
              ) : staffData.length > 0 ? (
                staffData.map((staff) => (
                  <tr
                    key={staff.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-2.5 px-6 text-left">
                      <img
                        src={staff.image}
                        alt={staff.name}
                        className="display-img-user"
                      />
                    </td>
                    <td className="p2.5-3 px-6 text-left">
                      <span
                        className="text-name "
                        // onClick={() => handleDishClick(staff.id)}
                      >
                        {staff.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-6 text-left">
                      {staff.phoneNumber}
                    </td>
                    <td className="py-2.5 px-6 text-left">{staff.email}</td>
                    <td className="py-2.5 px-6">
                      <div className="flex">
                        <Write
                          // onClick={() => handleEditClick(staff.id)}
                          className="size-5 cursor-pointer"
                        />
                        <Delete
                          // onClick={() => handleDeleteClick(staff.id)}
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
    </>
  );
};

export default DeliveryStaffList;
