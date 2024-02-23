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
};

export default companyAPI;
