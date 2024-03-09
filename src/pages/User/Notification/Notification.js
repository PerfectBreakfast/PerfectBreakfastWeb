import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { ReactComponent as Warning } from "../../../assets/icons/warning.svg";

const Notification = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600"
        >
          <ArrowBackIosIcon />
        </button>
        <h6 className="text-lg font-bold">Thông báo</h6>
      </div>
      <div className="flex flex-col items-center justify-center h-full">
        <span className="material-icons text-red-500 text-6xl">
          <Warning />
        </span>
        <h2 className="text-2xl font-bold mt-4">Chưa hỗ trợ!</h2>
        <p className="mt-2">Tính năng đang trong thời gian hoàn thiện</p>
      </div>
    </div>
  );
};

export default Notification;
