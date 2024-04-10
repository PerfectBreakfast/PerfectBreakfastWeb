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
  confirmSupplierFoodAssignmentBySupplier: async (
    supplierFoodAssignmentId,
    status
  ) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/supplierfoodassigments/${supplierFoodAssignmentId}/status-confirmation?status=${status}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  reFoodAssigment: async (foodAssignments) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/supplierfoodassigments`,
        foodAssignments
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  downloadFileFoodForSupplier: async (assignmentData) => {
    try {
      const response = await axiosInstance.post(
        `${api}/v1/supplierfoodassigments/download-excel`,
        assignmentData,
        {
          responseType: "blob", // Đây là điểm quan trọng để xử lý dữ liệu nhị phân
        }
      );
      return response;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getSupplierFoodAssignmentDetailByPartner: async (packageData) => {
    try {
      const response = await axiosInstance.post(
        `${api}/v1/supplierfoodassigments/partner/packages`,
        packageData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getSupplierFoodAssignmentDetailBySupplier: async (packageData) => {
    try {
      const response = await axiosInstance.post(
        `${api}/v1/supplierfoodassigments/supplier/packages`,
        packageData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  downloadFileFoodForPartner: async (assignmentData) => {
    try {
      const response = await axiosInstance.post(
        `${api}/v1/supplierfoodassigments/partner/download-excel`,
        assignmentData,
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

export default SupplierFoodAssignmentAPI;
