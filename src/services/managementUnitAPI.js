import axios from "axios";
import axiosInstance from "./axiosConfig";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const managementUnitAPI = {
  getAllManagementUnit: async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/api/v1/partners`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getManagementUnitByPagination: async (searchTerm, pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/api/v1/partners/pagination?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createManagementUnit: async (newManagementData) => {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/api/v1/partners`,
        newManagementData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createManagementUnitUser: async (newUserData) => {
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
  getPartnerById: async (partnerId) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/api/v1/partners/${partnerId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  editPartner: async (partnerId, newPartnerData) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/api/v1/partners/${partnerId}`,
        newPartnerData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default managementUnitAPI;
