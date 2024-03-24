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
  loginForManagement: async (credentials) => {
    try {
      const response = await axios.post(
        `${api}/account/management/login`,
        credentials
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  externalLogin: async (code) => {
    try {
      const response = await axios.post(`${api}/account/google?code=${code}`);
      console.log(response.data);
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
  getEmailForgotPassword: async (userEmail) => {
    try {
      const response = await axios.get(
        `${api}/account/password-token?email=${userEmail}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  resetPassword: async (newPasswordData) => {
    try {
      const response = await axios.put(
        `${api}/account/password-resetion`,
        newPasswordData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  editUserWhenSignupGoogle: async (userId, userData) => {
    try {
      const response = await axios.put(
        `${api}/v1/users/${userId}/google`,
        userData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  editUserForCustomer: async (userData) => {
    try {
      const response = await axiosInstance.put(`${api}/v1/users`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  changePassword: async (newPasswordData) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/users/change-password`,
        newPasswordData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  editStaff: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/users/${userId}`,
        userData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default userAPI;
