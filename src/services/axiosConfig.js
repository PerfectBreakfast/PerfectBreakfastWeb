import axios from "axios";
import refreshAccessToken from "./RefreshToken";
import { decryptToken, encryptToken } from "./CryptoService";
import { useNavigate } from "react-router-dom";

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

// Response interceptor để xử lý trường hợp accessToken hết hạn
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("check response ok");
    return response;
  },
  async (error) => {
    console.log("Đã lỗi");

    if (
      error.response.data.statusCode === 401 &&
      error.response.data.statusPhrase === "Token Expired"
    ) {
      console.log("thực hiện refresh token");
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshAccessToken();
          console.log("token mới", newAccessToken);
          if (newAccessToken) {
            const encryptedAccessToken = encryptToken(
              newAccessToken.accessToken
            );
            const encryptedRefeshToken = encryptToken(
              newAccessToken.refreshToken
            );
            localStorage.setItem("accessToken", encryptedAccessToken);
            localStorage.setItem("refreshToken", encryptedRefeshToken); // Cập nhật token mới vào storage
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

// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log("check response ok");
//     return response;
//   },
//   async (error) => {
//     console.log("Đã lỗi");

//     const { statusCode, statusPhrase } = error.response.data;

//     // Trường hợp token hết hạn
//     if (statusCode === 401 && statusPhrase === "Token Expired") {
//       console.log("thực hiện refresh token");
//       const originalRequest = error.config;
//       if (!originalRequest._retry) {
//         originalRequest._retry = true;
//         try {
//           const newAccessToken = await refreshAccessToken();
//           console.log("newAccessToken", newAccessToken);
//           if (newAccessToken) {
//             const encryptedAccessToken = encryptToken(
//               newAccessToken.accessToken
//             );
//             const encryptedRefeshToken = encryptToken(
//               newAccessToken.refreshToken
//             );
//             localStorage.setItem("accessToken", encryptedAccessToken);
//             localStorage.setItem("refreshToken", encryptedRefeshToken); // Cập nhật token mới vào storage
//             originalRequest.headers["Authorization"] = `Bearer ${decryptToken(
//               encryptedAccessToken
//             )}`;
//             return axiosInstance(originalRequest); // Gửi lại yêu cầu với token mới
//           }
//         } catch (refreshError) {
//           console.error("Unable to refresh token:", refreshError);
//           return Promise.reject(refreshError);
//         }
//       }
//     }
//     // Trường hợp token không hợp lệ hoặc bị cấm truy cập
//     else if (
//       (statusCode === 401 && statusPhrase === "Token Invalid") ||
//       (statusCode === 403 && statusPhrase === "Forbidden")
//     ) {
//       console.log("Token không hợp lệ hoặc bị cấm, đang chuyển hướng...");
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken"); // Xóa token khỏi storage
//       // Thực hiện chuyển hướng tới trang login

//       window.location.href = "/error";
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
