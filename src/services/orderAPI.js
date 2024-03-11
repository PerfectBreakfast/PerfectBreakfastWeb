import axios from "axios";
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
      console.log("dda thanh coong");
      return response.data;
    } catch (error) {
      console.log("hahahahahahahahahahahahahahhahaahhahahah");
      console.log(error)
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
};

export default orderAPI;
