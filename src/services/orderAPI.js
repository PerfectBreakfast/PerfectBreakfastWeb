import axios from "axios";
import axiosInstance from "./axiosConfig";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const orderAPI = {
  orderFood: async (details) => {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/api/v1/orders`,
        details
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getOrderHistory: async () => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/api/v1/orders/history`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getOrderDetail: async (orderId) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/api/v1/orders/${orderId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default orderAPI;
