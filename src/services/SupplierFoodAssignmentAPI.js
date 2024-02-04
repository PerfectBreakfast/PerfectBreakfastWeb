import axios from "axios";

const BASE_URL = "https://pb-dev-api.azurewebsites.net";

const SupplierFoodAssignmentAPI = {
  FoodAssigment: async (foodAssignments) => {
    try {
      // Lấy token từ Local Storage
      const token = localStorage.getItem("accessToken"); // Thay "your_token_key" bằng key bạn đã sử dụng để lưu token

      // Kiểm tra xem token có tồn tại hay không
      if (!token) {
        throw new Error("Token not found in Local Storage");
      }
      const response = await axios.post(
        `${BASE_URL}/api/v1/supplierfoodassigments`,
        foodAssignments,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default SupplierFoodAssignmentAPI;
