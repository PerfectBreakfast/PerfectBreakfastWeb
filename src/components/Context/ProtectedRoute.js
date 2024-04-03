// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "./AuthContext";
// import { toast } from "react-toastify";

// const PrivateRoute = ({ allowedRoles, children }) => {
//   const { user } = useAuth();
//   const location = useLocation();

//   if (!user) {
//     // Nếu không có thông tin người dùng, redirect đến trang đăng nhập
//     toast.error("Vui lòng đăng nhập!");
//     return <Navigate to="/management/login" replace />;
//   }

//   const userHasAllowedRole = user.roles.some((role) =>
//     allowedRoles.includes(role)
//   );

//   if (!userHasAllowedRole) {
//     // Nếu người dùng không có vai trò được phép, redirect đến trang báo lỗi hoặc hiển thị thông báo không được phép
//     return <Navigate to="/error" state={{ from: location }} replace />;
//   }

//   return children; // Nếu người dùng có vai trò được phép, render component con
// };

// export default PrivateRoute;

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const PrivateRoute = ({ allowedRoles, children }) => {
  const { user, logout } = useAuth();

  const location = useLocation();

  if (!user) {
    // Kiểm tra path hiện tại để quyết định nơi redirect
    const redirectTo = location.pathname.startsWith("/user")
      ? "/login"
      : "/management/login";
    toast.error("Vui lòng đăng nhập!");
    logout(user);
    return <Navigate to={redirectTo} replace />;
  }

  const userHasAllowedRole = user.roles.some((role) =>
    allowedRoles.includes(role)
  );

  if (!userHasAllowedRole) {
    // Nếu người dùng không có vai trò được phép, kiểm tra path để redirect phù hợp
    const redirectTo = location.pathname.startsWith("/user")
      ? "/login"
      : "/management/login";
    logout(user);
    toast.error("Vui lòng đăng nhập!");
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children; // Nếu người dùng có vai trò được phép, render component con
};

export default PrivateRoute;
