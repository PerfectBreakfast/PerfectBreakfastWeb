import axios from "axios";
import axiosInstance from "./axiosConfig";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const userAPI = {
  getUser: async () => {
    try {
      // Gọi API với header Authorization chứa token
      const response = await axiosInstance.get(
        `${BASE_URL}/account/current-user`
      );

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

  createUnitUser: async (newUserData) => {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/api/v1/users`,
        newUserData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDeliveryStaff: async () => {
    try {
      // Gọi API với header Authorization chứa token
      const response = await axiosInstance.get(
        `${BASE_URL}/api/v1/users/deliverystaff`
      );

      return response.data;
    } catch (error) {
      // Xử lý lỗi và ném lại thông báo lỗi
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default userAPI;
