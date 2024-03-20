import axiosInstance from "./axiosConfig";
import api from "./api";

const menuAPI = {
  getMenu: async () => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/menus/menu-is-selected`
      );
      return response.data;
    } catch (error) {
      console.log("loi", error);
      throw error.response ? error.response.data : error.message;
    }
  },
  getMenuByPagination: async (searchTerm, pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/menus/pagination?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=5`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createMenu: async (newMenuData) => {
    try {
      const response = await axiosInstance.post(`${api}/v1/menus`, newMenuData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  updateMenuVisibility: async (menuId) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/menus/${menuId}/menu-is-selected-status`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  editMenu: async (menuId, newMenuData) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/menus/${menuId}`,
        newMenuData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getMenuById: async (menuId) => {
    try {
      const response = await axiosInstance.get(`${api}/v1/menus/${menuId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  deleteMenuById: async (menuId) => {
    try {
      const response = await axiosInstance.delete(`${api}/v1/menus/${menuId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default menuAPI;
