import axios from "axios";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const deliveryUnitAPI = {
  getDeliveryUnitByPagination: async (pageIndex) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/deliveryunits/pagination?pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createDeliveryUnit: async (newDeliveryData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/deliveryunits`,
        newDeliveryData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default deliveryUnitAPI;
