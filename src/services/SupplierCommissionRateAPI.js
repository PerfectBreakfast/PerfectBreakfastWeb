import axios from "axios";
import axiosInstance from "./axiosConfig";
import api from "./api";

const SupplierCommissionRateAPI = {
  foodRegistration: async (registrationData) => {
    try {
      const response = await axiosInstance.post(
        `${api}/v1/suppliercommissionrates`,
        registrationData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  deleteFood: async (commissionRateId) => {
    try {
      const response = await axiosInstance.delete(
        `${api}/v1/suppliercommissionrates/${commissionRateId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getFoodRegistration: async (commissionRateId) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/suppliercommissionrates/${commissionRateId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  editFoodRegistration: async (commissionRateId, editRegistrationData) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/suppliercommissionrates/${commissionRateId}`,
        editRegistrationData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default SupplierCommissionRateAPI;
