import axios from "axios";
import api from "./api";
import axiosInstance from "./axiosConfig";

const supplierUnitAPI = {
  getSupplierUnitByPagination: async (searchTerm, pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/api/v1/suppliers/pagination?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=3`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  createSupplierUnit: async (newSupplierData) => {
    try {
      const response = await axiosInstance.post(
        `${api}/api/v1/suppliers`,
        newSupplierData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  supplyAssigment: async (supplyAssigmentData) => {
    try {
      const response = await axiosInstance.post(
        `${api}/api/v1/supplyassigments`,
        supplyAssigmentData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createManagementUnitUser: async (newUserData) => {
    try {
      const response = await axiosInstance.post(
        `${api}/api/v1/users`,
        newUserData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getSupplierByPartner: async () => {
    try {
      const response = await axiosInstance.get(
        `${api}/api/v1/suppliers/partner`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default supplierUnitAPI;
