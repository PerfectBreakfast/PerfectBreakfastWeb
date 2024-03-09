import axios from "axios";
import axiosInstance from "./axiosConfig";
import api from "./api";

const MealAPI = {
  getMealByAdmin: async () => {
    try {
      const response = await axiosInstance.get(`${api}/v1/meals`);
      return response.data;
    } catch (error) {
      // Xử lý lỗi và ném lại thông báo lỗi
      throw error.response ? error.response.data : error.message;
    }
  },
  getMealByCustomer: async () => {
    try {
      const response = await axiosInstance.get(`${api}/v1/meals/customer`);
      return response.data;
    } catch (error) {
      // Xử lý lỗi và ném lại thông báo lỗi
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default MealAPI;
