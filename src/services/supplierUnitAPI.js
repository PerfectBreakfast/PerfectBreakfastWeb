import axios from "axios";
import api from "./api";

const supplierUnitAPI = {
  getSupplierUnitByPagination: async (searchTerm, pageIndex) => {
    try {
      const response = await axios.get(
        `${api}/api/v1/suppliers/pagination?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=3`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  createSupplierUnit: async (newSupplierData) => {
    try {
      const response = await axios.post(
        `${api}/api/v1/suppliers`,
        newSupplierData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  supplyAssigment: async (supplyAssigmentData) => {
    try {
      const response = await axios.post(
        `${api}/api/v1/supplyassigments`,
        supplyAssigmentData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createManagementUnitUser: async (newUserData) => {
    try {
      const response = await axios.post(`${api}/api/v1/users`, newUserData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getSupplierByPartner: async () => {
    try {
      // Lấy token từ Local Storage
      const token = localStorage.getItem("accessToken"); // Thay "your_token_key" bằng key thực của token

      // Kiểm tra xem token có tồn tại không
      if (!token) {
        // Xử lý khi không có token
        throw new Error("Token not found in Local Storage");
      }

      // Thêm token vào header của yêu cầu
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Thêm các headers khác nếu cần
      };

      const response = await axios.get(`${api}/api/v1/suppliers/partner`, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default supplierUnitAPI;
