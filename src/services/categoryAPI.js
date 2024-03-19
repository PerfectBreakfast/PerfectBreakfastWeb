import axiosInstance from "./axiosConfig";
import api from "./api";

const categoryAPI = {
  getCategory: async () => {
    try {
      const response = await axiosInstance.get(`${api}/v1/categories`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDishes: async () => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/categories/08dc1990-abe9-499e-88c1-78fa3956c3f5`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDrinks: async () => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/categories/08dc1990-9d29-4bef-81ac-a87ff73b0067`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getFoodByCategoryForCreate: async (categoryId) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/categories/${categoryId}?status=0`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default categoryAPI;
