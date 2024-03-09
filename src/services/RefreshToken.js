import React from "react";
import { decryptToken, encryptToken } from "./CryptoService";

const refreshAccessToken = async () => {
  try {
    console.log("check call");
    const encryptedAccessToken = localStorage.getItem("accessToken");
    const encryptedRefreshToken = localStorage.getItem("refreshToken");

    // Giải mã
    const accessToken = decryptToken(encryptedAccessToken);
    const refreshToken = decryptToken(encryptedRefreshToken);

    // Gửi refreshToken tới server để nhận accessToken mới
    const response = await fetch(
      "https://pb-dev-api.azurewebsites.net/account/refresh-user-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken, refreshToken }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      // Mã hóa accessToken mới và lưu vào localStorage
      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;
      // Mã hóa tokens
      const encryptedAccessToken = encryptToken(accessToken);
      const encryptedRefreshToken = encryptToken(refreshToken);

      localStorage.setItem("accessToken", encryptedAccessToken);
      localStorage.setItem("refreshToken", encryptedRefreshToken);
      console.log("check refresh");
      return data.accessToken; // Trả về accessToken mới cho các hoạt động tiếp theo
    } else {
      // Xử lý lỗi, ví dụ: refreshToken không hợp lệ hoặc đã hết hạn
      console.error("Error refreshing token:", data.message);
      // Có thể bạn muốn đăng xuất người dùng ở đây hoặc thông báo cho họ biết
    }
  } catch (error) {
    console.error("Error during the token refresh:", error);
  }
};

export default refreshAccessToken;
