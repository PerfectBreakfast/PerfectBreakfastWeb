import axios from "axios";
import axiosInstance from "./axiosConfig";
import api from "./api";

const companyAPI = {
  getCompanyUnitByPagination: async (searchTerm, pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/companies/pagination?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createCompanyUnit: async (newCompanyData) => {
    try {
      const response = await axiosInstance.post(
        `${api}/v1/companies`,
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
        `${api}/v1/companies/${companyId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  deleteCompanyById: async (companyId) => {
    try {
      const response = await axiosInstance.delete(
        `${api}/v1/companies/${companyId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  editCompanyById: async (companyId, newCompanyData) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/companies/${companyId}`,
        newCompanyData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getCompanyUnitByPaginationForDelivery: async (searchTerm, pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/companies/pagination/delivery?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getCompanyUnitByPaginationForPartner: async (searchTerm, pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/companies/pagination/partner?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getCompanyForSignUp: async (searchTerm) => {
    try {
      const response = await axios.get(
        `${api}/v1/companies/search?searchTerm=${searchTerm}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default companyAPI;
