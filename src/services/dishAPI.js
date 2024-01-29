import axios from "axios";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const dishAPI = {
  getDishAll: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/foods`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDishByPagination: async (searchTerm, pageIndex) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/foods/pagination?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=15`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  createDish: async (newDishData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/foods`,
        newDishData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDishById: async (dishId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/foods/${dishId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default dishAPI;
