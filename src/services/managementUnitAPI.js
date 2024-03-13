import axios from "axios";
import axiosInstance from "./axiosConfig";
import api from "./api";

const managementUnitAPI = {
  getAllManagementUnit: async () => {
    try {
      const response = await axiosInstance.get(`${api}/v1/partners`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getManagementUnitByPagination: async (searchTerm, pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/partners/pagination?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=5`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createManagementUnit: async (newManagementData) => {
    try {
      const response = await axiosInstance.post(
        `${api}/v1/partners`,
        newManagementData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createManagementUnitUser: async (newUserData) => {
    try {
      const response = await axiosInstance.post(`${api}/v1/users`, newUserData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getPartnerById: async (partnerId) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/partners/${partnerId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  editPartner: async (partnerId, newPartnerData) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/partners/${partnerId}`,
        newPartnerData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  deletePartnerById: async (partnerId) => {
    try {
      const response = await axiosInstance.delete(
        `${api}/v1/partners/${partnerId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default managementUnitAPI;
