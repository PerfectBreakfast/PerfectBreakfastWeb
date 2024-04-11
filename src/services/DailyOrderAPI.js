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
  // getDailyOrderForSuperAdmin: async (status, pageIndex) => {
  //   try {
  //     const response = await axiosInstance.get(
  //       `${api}/v1/daily-orders/pagination?pageIndex=${pageIndex}&pageSize=10`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw error.response ? error.response.data : error.message;
  //   }
  // },

  getDailyOrderForSuperAdmin: async (pageIndex, status) => {
    try {
      // Build the base URL
      let url = `${api}/v1/daily-orders/pagination?pageIndex=${pageIndex}&pageSize=10`;

      // Check if status is a number within the expected range (0-8)
      if (status !== undefined && status >= 0 && status <= 8) {
        url += `&status=${status}`;
      }
      console.log(url);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      // Throw the error message or the error response data
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
        `${api}/v1/daily-orders/statistic?fromDate=${fromDate}&toDate=${toDate}`,
        {
          responseType: "blob", // Đây là điểm quan trọng để xử lý dữ liệu nhị phân
        }
      );
      return response;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  exportDailyOrderForAdmin: async (fromDate, toDate) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/daily-orders/statistic/super-admin?fromDate=${fromDate}&toDate=${toDate}`,
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
