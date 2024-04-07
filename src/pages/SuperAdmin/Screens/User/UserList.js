import React, { useEffect, useState } from "react";
import userAPI from "../../../../services/userAPI";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";
import { ReactComponent as UserIcon } from "../../../../assets/icons/User Circle.svg";

const UserList = () => {
  const [userData, setUserData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserList();
  }, [pageIndex, searchTerm]);
  const fetchUserList = async () => {
    setIsLoading(true);
    try {
      const result = await userAPI.getUserByPagination(searchTerm, pageIndex);
      setUserData(result.items);
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

  const displayRoleName = (roleName) => {
    const roleTranslations = {
      "SUPER ADMIN": "Quản trị viên hệ thống",
      "PARTNER ADMIN": "Quản trị viên đối tác",
      "SUPPLIER ADMIN": "Quản trị viên nhà cung cấp",
      "DELIVERY ADMIN": "Quản trị viên giao hàng",
      "DELIVERY STAFF": "Nhân viên giao hàng",
      CUSTOMER: "Khách hàng",
      // Thêm các vai trò khác tại đây nếu cần
    };

    return roleTranslations[roleName] || roleName; // Trả về tên đã dịch hoặc giữ nguyên nếu không tìm thấy
  };

  return (
    <div className="container mx-auto p-4">
      <h4 className="text-2xl font-semibold mb-4">Danh sách người dùng</h4>
      <div className="bg-white rounded-xl p-4 ">
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center ">
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
          </div>
        </div>

        <div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-800 leading-normal">
                <th className="py-2.5 px-3 font-extrabold">Hình ảnh</th>
                <th className="py-2.5 px-3 font-extrabold">Tên người dùng</th>
                <th className="py-2.5 px-3 text-left font-extrabold">Email</th>
                <th className="py-2.5 px-3font-extrabold">Số điện thoại</th>
                <th className="py-2.5 px-3 font-extrabold">Vai trò</th>
                {/* <th className="py-2.5 px-3 "></th> */}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-3 px-6">
                    Đang tải...
                  </td>
                </tr>
              ) : userData.length > 0 ? (
                userData.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-2.5 px-3 text-left">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <UserIcon className="w-10 h-10 rounded-full" />
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-left max-w-xs whitespace-normal">
                      <span
                        className="text-name"
                        // onClick={() => handleDishClick(dish.id)}
                      >
                        {user.name}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-left">{user.email}</td>
                    <td className="py-2.5 px-3 text-left">
                      {user.phoneNumber}
                    </td>
                    <td className="py-2.5 px-3 text-left">
                      {displayRoleName(user.roles)}
                    </td>

                    {/* <td className="py-2.5 px-3">
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
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-3 px-6">
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

      {/* {loadingDelete && <Loading />}
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
      </Modal> */}
    </div>
  );
};

export default UserList;
