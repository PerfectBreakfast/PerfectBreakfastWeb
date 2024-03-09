import axios from "axios";
import React from "react";
import api from "./api";
import axiosInstance from "./axiosConfig";

const DailyOrderAPI = {
  getDailyOrderForPartner: async (pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/daily-orders/partner?pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        // Server trả lời với mã trạng thái lỗi, ví dụ 403 Forbidden
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status); // Nên log ra 403 trong trường hợp này
        console.error("Error headers:", error.response.headers);
        if (error.response.status === 403) {
          console.error(
            "Access Denied: You don't have permission to access this resource."
          );
          // Thực hiện các bước xử lý phù hợp khi bị từ chối quyền truy cập
        }
        // throw new Error(`Request failed with status ${error.response.status}`);
      } else if (error.request) {
        // Yêu cầu được thực hiện nhưng không nhận được phản hồi
        console.error("No response received");
        throw new Error("Network Error");
      } else {
        // Lỗi khởi tạo yêu cầu
        console.error("Error", error.message);
        throw new Error(error.message);
      }
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
        `${api}/v1/daily-orders/delivery?pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default DailyOrderAPI;
