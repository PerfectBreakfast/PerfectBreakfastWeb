import axios from "axios";
import React from "react";
import api from "./api";
import axiosInstance from "./axiosConfig";

const DashboardAPI = {
  getTopFood: async (fromDate, toDate) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/dashboards/top-combo-food/from-date-to-date?fromDate=${fromDate}&toDate=${toDate}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getTopCompany: async (fromDate, toDate) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/dashboards/top-company/from-date-to-date?fromDate=${fromDate}&toDate=${toDate}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDeliveryRate: async (fromDate, toDate) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/dashboards/order-statistic/from-date-to-date?fromDate=${fromDate}&toDate=${toDate}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getOrderAmount: async (fromDate, toDate) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/dashboards/order-amount/from-date-to-date?fromDate=${fromDate}&toDate=${toDate}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default DashboardAPI;
