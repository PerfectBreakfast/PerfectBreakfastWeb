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
};

export default supplierUnitAPI;
