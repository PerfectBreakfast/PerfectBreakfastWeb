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
  getOrderHistory: async (pageNumber) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/orders/history?pageNumber=${pageNumber}`
      );
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
  cancelOrder: async (orderCode) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/orders/${orderCode}/cancel`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getOrderByDailyOrder: async (dailyorderId) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/orders/daily-order/${dailyorderId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default orderAPI;
