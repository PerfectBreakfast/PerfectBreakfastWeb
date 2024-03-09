import axios from "axios";
import axiosInstance from "./axiosConfig";
import api from "./api";

const SupplierFoodAssignmentAPI = {
  FoodAssigment: async (foodAssignments) => {
    try {
      const response = await axiosInstance.post(
        `${api}/v1/supplierfoodassigments`,
        foodAssignments
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getSupplierFoodAssignmentByPartner: async (pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/supplierfoodassigments/partner?pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getSupplierFoodAssignmentBySupplier: async (pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/supplierfoodassigments/supplier?pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  confirmSupplierFoodAssignmentByPartner: async (supplierFoodAssignmentId) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/supplierfoodassigments/${supplierFoodAssignmentId}/status-completion`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  confirmSupplierFoodAssignmentBySupplier: async (supplierFoodAssignmentId) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/supplierfoodassigments/${supplierFoodAssignmentId}/status-confirmation`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default SupplierFoodAssignmentAPI;
