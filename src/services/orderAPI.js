import axios from "axios";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const orderAPI = {
  orderFood: async (details) => {
    try {
      // Lấy token từ Local Storage
      const token = localStorage.getItem("accessToken"); // Thay "your_token_key" bằng key thực của token

      // Kiểm tra xem token có tồn tại không
      if (!token) {
        // Xử lý khi không có token
        throw new Error("Token not found in Local Storage");
      }

      // Thêm token vào header của yêu cầu
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Thêm các headers khác nếu cần
      };

      const response = await axios.post(`${BASE_URL}/api/v1/orders`, details, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getOrderHistory: async () => {
    try {
      // Lấy token từ Local Storage
      const token = localStorage.getItem("accessToken"); // Thay "your_token_key" bằng key thực của token

      // Kiểm tra xem token có tồn tại không
      if (!token) {
        // Xử lý khi không có token
        throw new Error("Token not found in Local Storage");
      }

      // Thêm token vào header của yêu cầu
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Thêm các headers khác nếu cần
      };

      const response = await axios.get(`${BASE_URL}/api/v1/orders/history`, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getOrderDetail: async (orderId) => {
    try {
      // Lấy token từ Local Storage
      const token = localStorage.getItem("accessToken"); // Thay "your_token_key" bằng key thực của token

      // Kiểm tra xem token có tồn tại không
      if (!token) {
        // Xử lý khi không có token
        throw new Error("Token not found in Local Storage");
      }

      // Thêm token vào header của yêu cầu
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Thêm các headers khác nếu cần
      };

      const response = await axios.get(`${BASE_URL}/api/v1/orders/${orderId}`, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default orderAPI;
