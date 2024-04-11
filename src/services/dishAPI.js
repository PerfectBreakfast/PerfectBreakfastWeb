import axios from "axios";
import axiosInstance from "./axiosConfig";
import api from "./api";

const dishAPI = {
  getDishAll: async () => {
    try {
      const response = await axiosInstance.get(`${api}/v1/foods`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDishByPagination: async (searchTerm, pageIndex) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/foods/pagination?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=5`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  createDish: async (newDishData) => {
    try {
      const response = await axiosInstance.post(`${api}/v1/foods`, newDishData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDishById: async (dishId) => {
    try {
      const response = await axiosInstance.get(`${api}/v1/foods/${dishId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getOrderFoodForPartner: async () => {
    try {
      const response = await axiosInstance.get(`${api}/v1/foods/partner`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  // editFood: async (foodId, foodName, foodPrice, foodStatus, editFoodData) => {
  //   try {
  //     const response = await axiosInstance.put(
  //       `${api}/v1/foods/${foodId}?Name=${foodName}&Price=${foodPrice}`,
  //       editFoodData
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw error.response ? error.response.data : error.message;
  //   }
  // },

  editFood: async (foodId, foodData) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/foods/${foodId}`,
        foodData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  deleteDishById: async (dishId) => {
    try {
      const response = await axiosInstance.delete(`${api}/v1/foods/${dishId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDailyOrderDetailById: async (dailyOrderId) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/foods/${dailyOrderId}/dailyorderid/partner`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDailyOrderDetailByDelivery: async (dailyOrderId) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/foods/${dailyOrderId}/dailyorderid/delivery`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getFoodForCombo: async () => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/foods/status?status=0`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getFoodForMenu: async () => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/foods/status?status=1`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getFoodRegistrationSupplier: async (supplierId, searchTerm) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/foods/supplier/${supplierId}?searchTerm=${searchTerm}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getTotalFoodForPartner: async (dailyOrderId) => {
    try {
      const response = await axiosInstance.get(
        `${api}/v1/foods/daily-order-id/partner/total-food/${dailyOrderId}`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default dishAPI;
