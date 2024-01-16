import axios from "axios";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const comboAPI = {
  getComboById: async (comboId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/combos/${comboId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default comboAPI;
