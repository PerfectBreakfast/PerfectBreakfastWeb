import axios from "axios";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const userAPI = {
  getUser: async () => {
    try {
      // Lấy token từ Local Storage
      const token = localStorage.getItem("accessToken"); // Thay "your_token_key" bằng key bạn đã sử dụng để lưu token

      // Kiểm tra xem token có tồn tại hay không
      if (!token) {
        throw new Error("Token not found in Local Storage");
      }

      // Gọi API với header Authorization chứa token
      const response = await axios.get(`${BASE_URL}/account/current-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      // Xử lý lỗi và ném lại thông báo lỗi
      throw error.response ? error.response.data : error.message;
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/account/signin`,
        credentials
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/account/signup`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getCompanies: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/companies`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default userAPI;
