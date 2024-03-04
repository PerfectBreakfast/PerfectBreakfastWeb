import axios from "axios";
import axiosInstance from "./axiosConfig";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const companyAPI = {
  getCompanyUnitByPagination: async (searchTerm, pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/api/v1/companies/pagination?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createCompanyUnit: async (newCompanyData) => {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/api/v1/companies`,
        newCompanyData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getCompanyById: async (companyId) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/api/v1/companies/${companyId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  deleteCompanyById: async (companyId) => {
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/api/v1/companies/${companyId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  editCompanyById: async (companyId, newCompanyData) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/api/v1/companies/${companyId}`,
        newCompanyData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default companyAPI;
