import axios from "axios";
import React from "react";
import api from "./api";

const DailyOrderAPI = {
  getDailyOrderForPartner: async (pageIndex) => {
    try {
      // Lấy token từ Local Storage
      const token = localStorage.getItem("accessToken"); // Thay "your_token_key" bằng key bạn đã sử dụng để lưu token

      // Kiểm tra xem token có tồn tại hay không
      if (!token) {
        throw new Error("Token not found in Local Storage");
      }
      const response = await axios.get(
        `${api}/api/v1/daily-orders/partner?pageIndex=${pageIndex}&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDailyOrderDetailByCompany: async (companyId, bookingDate) => {
    try {
      // Lấy token từ Local Storage
      const token = localStorage.getItem("accessToken"); // Thay "your_token_key" bằng key bạn đã sử dụng để lưu token

      // Kiểm tra xem token có tồn tại hay không
      if (!token) {
        throw new Error("Token not found in Local Storage");
      }
      const response = await axios.get(
        `${api}/api/v1/daily-orders/${companyId}/company?bookingDate=${bookingDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default DailyOrderAPI;
