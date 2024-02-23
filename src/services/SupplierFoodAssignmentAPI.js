import axios from "axios";
import axiosInstance from "./axiosConfig";
import api from "./api";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const SupplierFoodAssignmentAPI = {
  FoodAssigment: async (foodAssignments) => {
    try {
      // Lấy token từ Local Storage
      const token = localStorage.getItem("accessToken"); // Thay "your_token_key" bằng key bạn đã sử dụng để lưu token
      console.log("test data", foodAssignments);
      // Kiểm tra xem token có tồn tại hay không
      if (!token) {
        throw new Error("Token not found in Local Storage");
      }
      const response = await axios.post(
        `${BASE_URL}/api/v1/supplierfoodassigments`,
        foodAssignments,
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
  getSupplierFoodAssignmentByPartner: async (pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/api/v1/supplierfoodassigments/partner?pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getSupplierFoodAssignmentBySupplier: async (pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/api/v1/supplierfoodassigments/supplier?pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  confirmSupplierFoodAssignmentByPartner: async (supplierFoodAssignmentId) => {
    try {
      const response = await axiosInstance.put(
        `${api}/api/v1/supplierfoodassigments/${supplierFoodAssignmentId}/status-completion`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  confirmSupplierFoodAssignmentBySupplier: async (supplierFoodAssignmentId) => {
    try {
      const response = await axiosInstance.put(
        `${api}/api/v1/supplierfoodassigments/${supplierFoodAssignmentId}/status-confirmation`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default SupplierFoodAssignmentAPI;
