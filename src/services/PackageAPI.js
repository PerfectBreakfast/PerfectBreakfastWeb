import axios from "axios";
import axiosInstance from "./axiosConfig";
import api from "./api";

const PackageAPI = {
  getPackage: async () => {
    try {
      const response = await axiosInstance.get(`${api}/v1/package/partner`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default PackageAPI;
