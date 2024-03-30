import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  user: null, // Giá trị mặc định cho user
  login: () => {}, // Hàm mặc định, để tránh lỗi khi gọi hàm mà không được định nghĩa
  logout: () => {}, // Hàm mặc định
});

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
