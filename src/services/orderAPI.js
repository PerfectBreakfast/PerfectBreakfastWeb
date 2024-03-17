import axiosInstance from "./axiosConfig";
import api from "./api";

const orderAPI = {
  orderFood: async (details) => {
    try {
      const response = await axiosInstance.post(`${api}/v1/orders`, details);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getOrderHistory: async () => {
    try {
      const response = await axiosInstance.get(`${api}/v1/orders/history`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getOrderDetail: async (orderId) => {
    try {
      const response = await axiosInstance.get(`${api}/v1/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  repaymentOrder: async (orderId) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/orders/${orderId}/paymentlink`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default orderAPI;
