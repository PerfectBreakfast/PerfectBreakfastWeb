import axios from "axios";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const managementUnitAPI = {
  getAllManagementUnit: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/partners`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  getManagementUnitByPagination: async (searchTerm, pageIndex) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/partners/pagination?searchTerm=${searchTerm}&pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createManagementUnit: async (newManagementData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/partners`,
        newManagementData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createManagementUnitUser: async (newUserData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/users`,
        newUserData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default managementUnitAPI;
