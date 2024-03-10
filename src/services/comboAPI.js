import axios from "axios";
import axiosInstance from "./axiosConfig";
import api from "./api";

const comboAPI = {
  getAllCombo: async () => {
    try {
      const response = await axiosInstance.get(`${api}/v1/combos`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getComboById: async (comboId) => {
    try {
      const response = await axiosInstance.get(`${api}/v1/combos/${comboId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getComboByPagination: async (searchTerm, pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/combos/pagination?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  createCombo: async (newComboData) => {
    try {
      const response = await axiosInstance.post(
        `${api}/v1/combos`,
        newComboData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  editCombo: async (comboId, newComboData) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/combos/${comboId}`,
        newComboData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  deleteComboById: async (comboId) => {
    try {
      const response = await axiosInstance.delete(
        `${api}/v1/combos/${comboId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default comboAPI;
