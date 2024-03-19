import axios from "axios";
import api from "./api";
import axiosInstance from "./axiosConfig";

const roleAPI = {
  getRole: async (roleId) => {
    try {
      const response = await axios.get(`${api}/v1/roles/unit/${roleId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getRoleForManagementSignIn: async () => {
    try {
      const response = await axios.get(`${api}/v1/roles/management-role`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default roleAPI;
