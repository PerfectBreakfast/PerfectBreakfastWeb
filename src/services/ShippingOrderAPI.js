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
};
export default ShippingOrderAPI;
