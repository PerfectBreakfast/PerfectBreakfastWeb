import axios from "axios";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const menuAPI = {
  getMenu: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/menus/08dc1121-1194-4deb-8af6-696fe2e5f1b3`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default menuAPI;
