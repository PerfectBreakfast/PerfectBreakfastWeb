import axios from "axios";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const companyAPI = {
  getCompanyUnitByPagination: async (pageIndex) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/companies/pagination?pageIndex=${pageIndex}&pageSize=10`
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  createCompanyUnit: async (newCompanyData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/companies`,
        newCompanyData
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default companyAPI;
