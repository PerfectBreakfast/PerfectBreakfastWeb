import axiosInstance from "./axiosConfig";
import api from "./api";

const settingAPI = {
  getSettingInfo: async () => {
    try {
      const response = await axiosInstance.get(`${api}/v1/hangfire/settings`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  editHangfire: async (hangfireId, newTime) => {
    try {
      const response = await axiosInstance.put(
        `${api}/v1/hangfire/settings/${hangfireId}`,
        newTime
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default settingAPI;
