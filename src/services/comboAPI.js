import axios from "axios";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const comboAPI = {
  getAllCombo: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/combos`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getComboById: async (comboId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/combos/${comboId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getComboByPagination: async (searchTerm, pageIndex) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/combos/pagination?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  createCombo: async (newComboData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/combos`,
        newComboData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default comboAPI;
