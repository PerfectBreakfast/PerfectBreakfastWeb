import axios from "axios";
import axiosInstance from "./axiosConfig";
import api from "./api";

const userAPI = {
  getUser: async () => {
    try {
      // Gọi API với header Authorization chứa token
      const response = await axiosInstance.get(`${api}/account/current-user`);

      return response.data;
    } catch (error) {
      // Xử lý lỗi và ném lại thông báo lỗi
      throw error.response ? error.response.data : error.message;
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${api}/account/signin`, credentials);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${api}/account/signup`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getCompanies: async () => {
    try {
      const response = await axios.get(`${api}/v1/companies`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  createUnitUser: async (newUserData) => {
    try {
      const response = await axiosInstance.post(`${api}/v1/users`, newUserData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDeliveryStaff: async () => {
    try {
      // Gọi API với header Authorization chứa token
      const response = await axiosInstance.get(`${api}/v1/users/deliverystaff`);

      return response.data;
    } catch (error) {
      // Xử lý lỗi và ném lại thông báo lỗi
      throw error.response ? error.response.data : error.message;
    }
  },
  getDeliveryStaffByPagination: async (pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/users/deliverystaff/pagination?pageIndex=${pageIndex}&pageSize=5`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default userAPI;
