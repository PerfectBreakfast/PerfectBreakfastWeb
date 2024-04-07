import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userAPI from "../../../../services/userAPI";
import { ReactComponent as UserIcon } from "../../../../assets/icons/User Circle.svg";

const UserByCompany = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserList();
  }, [id]);
  const fetchUserList = async () => {
    setIsLoading(true);
    try {
      const result = await userAPI.getUserByCompany(id);
      setUserData(result);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h4 className="text-2xl font-semibold mb-4">Danh sách người dùng</h4>
      <div className="bg-white rounded-xl p-4 ">
        <div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-800 leading-normal">
                <th className="py-2.5 px-3 w-1/5 font-extrabold">Hình ảnh</th>
                <th className="py-2.5 px-3 w-1/5 font-extrabold">
                  Tên người dùng
                </th>
                <th className="py-2.5 px-3 text-left w-1/5 font-extrabold">
                  Email
                </th>
                <th className="py-2.5 px-3 w-1/5 font-extrabold">
                  Số điện thoại
                </th>
                {/* <th className="py-2.5 px-3 w-1/5"></th> */}
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
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserByCompany;
