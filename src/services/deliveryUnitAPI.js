import axios from "axios";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const deliveryUnitAPI = {
  getManagementUnit: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/deliveries`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getDeliveryUnitByPagination: async (searchTerm, pageIndex) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/deliveries/pagination?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createDeliveryUnit: async (newDeliveryData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/deliveries`,
        newDeliveryData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default deliveryUnitAPI;
