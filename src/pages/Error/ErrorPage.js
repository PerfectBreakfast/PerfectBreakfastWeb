import React from "react";
import { ReactComponent as ErrorIcon } from "../../assets/icons/404.svg";
import UserHeader from "../Header/Header";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <>
      {" "}
      <UserHeader />
      <div className="text-center">
        <ErrorIcon className="w-64 h-64 text-green-500 mx-auto" />
        <p className="text-2xl font-semibold mb-2">Page Not Found</p>
        <p className="mb-8">
          Trang bạn đang tìm kiếm có thể đã bị xóa tên của nó đã thay đổi hoặc
          tạm thời không có sẵn.
        </p>

        <button
          onClick={() => (window.location.href = "https://orderfoodpnb.com/")}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300"
        >
          Trang chủ
        </button>
      </div>
    </>
  );
};

export default ErrorPage;
