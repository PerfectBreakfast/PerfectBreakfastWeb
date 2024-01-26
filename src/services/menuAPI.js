import axios from "axios";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const menuAPI = {
  getMenu: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/menus/menu-is-selected`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getMenuByPagination: async (pageIndex) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/menus/pagination?pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createMenu: async (newMenuData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/menus`,
        newMenuData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default menuAPI;
