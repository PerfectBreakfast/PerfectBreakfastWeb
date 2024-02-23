import React from "react";
import axiosInstance from "./axiosConfig";
const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const ShippingOrderAPI = {
  assignOrderForShipper: async (assignData) => {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/api/v1/shippingorders/deliveryadmin`,
        assignData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};
export default ShippingOrderAPI;
