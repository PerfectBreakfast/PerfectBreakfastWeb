import axios from "axios";
import refreshAccessToken from "./RefreshToken";
import { decryptToken, encryptToken } from "./CryptoService";

// Tạo một axios instance với cấu hình mặc định
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("check request");
    const token = localStorage.getItem("accessToken");
    if (token) {
      const accessToken = decryptToken(token);
      // Chỉ thêm hoặc cập nhật header Authorization
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.log("lỗi promise", error);
    return Promise.reject(error);
  }
);

// Thêm interceptor cho response
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Trả về response nếu không có lỗi
//     return response;
//   },
//   (error) => {
//     // Kiểm tra mã lỗi 403 và thực hiện đăng xuất
//     if (error.response && error.response.status === 403) {
//       console.log("Unauthorized access, logging out...");
//       // Thực hiện đăng xuất tại đây, ví dụ: clear token, redirect đến trang đăng nhập, v.v...
//       // logoutFunction();
//     }
//     return Promise.reject(error);
//   }
// );

// Response interceptor để xử lý trường hợp accessToken hết hạn
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("check response ok");
    return response;
  },
  async (error) => {
    console.log("Handling error:", error);

    // Thêm kiểm tra này để xác định lỗi mạng
    if (error.code === "ERR_NETWORK") {
      console.log("check network refresh");
      console.error("Network error occurred:", error.message);

      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            const encryptedAccessToken = encryptToken(newAccessToken);
            localStorage.setItem("accessToken", encryptedAccessToken); // Cập nhật token mới vào storage
            originalRequest.headers["Authorization"] = `Bearer ${decryptToken(
              encryptedAccessToken
            )}`;
            return axiosInstance(originalRequest); // Gửi lại yêu cầu với token mới
          }
        } catch (refreshError) {
          console.error("Unable to refresh token:", refreshError);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }

    const { response } = error;
    console.log("Handling error 1:", response ? error.response : "No response"); // Cập nhật để kiểm tra response tồn tại
    // console.log("Handling error 2:", error.data); // Dòng này có thể không cần thiết vì error.data thường không tồn tại

    if (
      response &&
      response.data &&
      response.data.statusCode === 401 &&
      response.data.statusPhrase === "Token Expired"
    ) {
      console.log("check 401 refresh");
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            const encryptedAccessToken = encryptToken(newAccessToken);
            localStorage.setItem("accessToken", encryptedAccessToken); // Cập nhật token mới vào storage
            originalRequest.headers["Authorization"] = `Bearer ${decryptToken(
              encryptedAccessToken
            )}`;
            return axiosInstance(originalRequest); // Gửi lại yêu cầu với token mới
          }
        } catch (refreshError) {
          console.error("Unable to refresh token:", refreshError);
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
