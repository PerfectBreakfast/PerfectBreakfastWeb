import axios from "axios";

// Tạo một axios instance với cấu hình mặc định
const axiosInstance = axios.create();

// Sử dụng interceptors để thêm token vào header của mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
