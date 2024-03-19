import React, { useEffect, useState } from "react";

import logo from "../../assets/images/logo.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import userAPI from "../../services/userAPI";
import { encryptToken } from "../../services/CryptoService";
import roleAPI from "../../services/roleAPI";

import { ReactComponent as Loading } from "../../assets/icons/loading.svg";

const ManagementLogin = () => {
  const navigate = useNavigate();
  const [roleData, setRoleData] = useState([]);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    roleId: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await roleAPI.getRoleForManagementSignIn();
        setRoleData(data);
      } catch (error) {
        // console.error("Error fetching companies:", error);
      }
    };
    fetchRoles();
  }, []);

  console.log("role", roleData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("data", credentials);
      const userData = await userAPI.loginForManagement(credentials);

      const roles = userData.roles;

      const accessToken = userData.accessToken;
      const refreshToken = userData.refreshToken;

      // Mã hóa tokens
      const encryptedAccessToken = encryptToken(accessToken);
      const encryptedRefreshToken = encryptToken(refreshToken);

      // Lưu vào localStorage
      localStorage.setItem("accessToken", encryptedAccessToken);
      localStorage.setItem("refreshToken", encryptedRefreshToken);

      // Kiểm tra và điều hướng dựa trên vai trò
      if (roles.includes("SUPER ADMIN")) {
        navigate("/admin/food");
      } else if (roles.includes("PARTNER ADMIN")) {
        navigate("/partner/order");
      } else if (roles.includes("SUPPLIER ADMIN")) {
        navigate("/supplier/food");
      } else if (roles.includes("DELIVERY ADMIN")) {
        navigate("/delivery/order");
      } else if (roles.includes("DELIVERY STAFF")) {
        // navigate("/delivery/order");
        navigate("/staff/order");
      } else {
        toast.error("Email hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      toast.error(error.errors);
      console.log(error.errors);
    } finally {
      setIsLoading(false);
    }
  };

  const displayRoleName = (roleName) => {
    const roleTranslations = {
      "SUPER ADMIN": "Quản trị viên hệ thống",
      "PARTNER ADMIN": "Quản trị viên đối tác",
      "SUPPLIER ADMIN": "Quản trị viên nhà cung cấp",
      "DELIVERY ADMIN": "Quản trị viên giao hàng",
      "DELIVERY STAFF": "Nhân viên giao hàng",
      // Thêm các vai trò khác tại đây nếu cần
    };

    return roleTranslations[roleName] || roleName; // Trả về tên đã dịch hoặc giữ nguyên nếu không tìm thấy
  };

  return (
    <div className="container mx-auto w-2/6 min-w-80">
      <div className="flex flex-col items-center">
        <div className="flex justify-center">
          <img src={logo} alt="Admin Logo" className="mb-4 w-20 mt-5" />
        </div>

        <h2 className="text-xl font-semibold">Đăng Nhập</h2>

        <form onSubmit={handleLogin} className="w-full mt-2">
          <div className="">
            <input
              placeholder="Email"
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              className="user-input"
              value={credentials.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="">
            <input
              placeholder="Mật khẩu"
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              required
              className="user-input"
              value={credentials.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-2">
            <select
              name="roleId"
              required
              className="user-input"
              value={credentials.roleId}
              onChange={handleInputChange}
            >
              <option disabled value="">
                Chọn vai trò
              </option>
              {roleData.map((role) => (
                <option key={role.id} value={role.id}>
                  {displayRoleName(role.name)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn-submit-user"
            disabled={isLoading} // Disable nút khi đang gọi API
          >
            {isLoading ? (
              <Loading className=" animate-spin inline w-5 h-5 text-gray-200 dark:text-gray-600" />
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ManagementLogin;
