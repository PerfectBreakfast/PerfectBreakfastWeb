import axios from "axios";
import axiosInstance from "./axiosConfig";
import api from "./api";

const deliveryUnitAPI = {
  getAllDelivery: async () => {
    try {
      const response = await axiosInstance.get(`${api}/v1/deliveries`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDeliveryUnitByPagination: async (searchTerm, pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/deliveries/pagination?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createDeliveryUnit: async (newDeliveryData) => {
    try {
      const response = await axiosInstance.post(
        `${api}/v1/deliveries`,
        newDeliveryData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDeliveryById: async (deliveryId) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/deliveries/${deliveryId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  editDelivery: async (deliveryId, newDeliveryData) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/deliveries/${deliveryId}`,
        newDeliveryData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  deleteDeliveryById: async (deliveryId) => {
    try {
      const response = await axiosInstance.delete(
        `${api}/v1/deliveries/${deliveryId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default deliveryUnitAPI;
