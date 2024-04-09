import React from "react";
import axiosInstance from "./axiosConfig";
import api from "./api";

const ShippingOrderAPI = {
  assignOrderForShipper: async (assignData) => {
    try {
      const response = await axiosInstance.post(
        `${api}/v1/shippingorders/deliveryadmin`,
        assignData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getShippingOrderForDeliveryStaff: async (shippingDate) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/shippingorders/delivery-staff?time=${shippingDate}
        `
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  confirmShippingOrderByStaff: async (dailyOrderId) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/shippingorders/confirmation/${dailyOrderId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  finishShippingOrderByStaff: async (dailyOrderId) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/shippingorders/end/${dailyOrderId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getShippingOrderHistoryForDeliveryStaff: async () => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/shippingorders/delivery-staff/history-order
        `
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getStaffByDailyOrder: async (dailyOrderId) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/shippingorders/delivery-staff/daily-order/${dailyOrderId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};
export default ShippingOrderAPI;
