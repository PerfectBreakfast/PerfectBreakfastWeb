import axios from "axios";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const roleAPI = {
  getRole: async (roleId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/roles/unit/${roleId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default roleAPI;
