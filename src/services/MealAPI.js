import axios from "axios";
import axiosInstance from "./axiosConfig";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const MealAPI = {
  getMealByAdmin: async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/api/v1/meals`);
      return response.data;
    } catch (error) {
      // Xử lý lỗi và ném lại thông báo lỗi
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default MealAPI;