import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const CompanyInfo = () => {
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
        <h6 className="text-lg font-bold ml-4">Thông tin công ty</h6>
      </div>
      <div className="px-8 py-6 bg-white shadow rounded-lg text-gray-700">
        {" "}
        <h2 className="font-bold text-lg">CÔNG TY CP THỰC PHẨM P&B</h2>
        <p>MST: 3703172784</p>
        <p>
          Địa chỉ: Ô 5H-40, Lô PC-A4, Đường Số 4, Khu TĐC Hòa Phú, Phường Hoà
          Phú, Thành phố Thủ Dầu Một, Tỉnh Bình Dương, Việt Nam
        </p>
        <p>Hotline: 0976 816 838</p>
        <p>Email: cskh@pnbfood.com</p>
      </div>
    </div>
  );
};

export default CompanyInfo;
