import axios from "axios";
import React from "react";
import api from "./api";
import axiosInstance from "./axiosConfig";

const DailyOrderAPI = {
  getDailyOrderForPartner: async (pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/daily-orders/partner/process?pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDailyOrderDetailByCompany: async (companyId, bookingDate) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/daily-orders/${companyId}/company?bookingDate=${bookingDate}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDailyOrderForDelivery: async (pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/daily-orders/delivery/process?pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDailyOrderForSuperAdmin: async (pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/daily-orders/pagination?pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDailyOrderHistoryForPartner: async (pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/daily-orders/partner?pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDailyOrderHistoryForDelivery: async (pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/daily-orders/delivery?pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  exportDailyOrder: async (fromDate, toDate) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/daily-orders/Statistic?fromDate=${fromDate}&toDate=${toDate}`,
        {
          responseType: "blob", // Đây là điểm quan trọng để xử lý dữ liệu nhị phân
        }
      );
      return response;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default DailyOrderAPI;
