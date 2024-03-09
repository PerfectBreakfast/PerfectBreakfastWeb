import axios from "axios";
import api from "./api";

const roleAPI = {
  getRole: async (roleId) => {
    try {
      const response = await axios.get(`${api}/v1/roles/unit/${roleId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default roleAPI;
