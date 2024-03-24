import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router";
import userAPI from "../../../services/userAPI";
import { ToastContainer, toast } from "react-toastify";

import { ReactComponent as User } from "../../../assets/icons/User Circle.svg";
import Loading from "../../Loading/Loading";

const StaffSetting = () => {
  const [userData, setUserData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await userAPI.getUser();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Vui lòng đăng nhập lại!");
        navigate("/login");
      }
    };

    fetchUserData();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/management/login");
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  const handleLogoutConfirm = () => {
    setShowConfirmation(true);
  };
  const cancelLogout = () => {
    setShowConfirmation(false);
  };
  if (!userData) {
    return <Loading />;
  }
  return (
    <div className="container mx-auto p-4 ">
      <div className="flex items-center mb-4">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600"
        >
          <ArrowBackIosIcon />
        </button>
        <h6 className="text-lg font-bold ml-4">Thông tin người dùng</h6>
      </div>
      {userData && (
        <div
          className="bg-white shadow rounded-lg p-3 mb-6 mb-6 cursor-pointer"
          onClick={() => navigate("edit")}
        >
          <div className="flex items-center space-x-4 mb-2">
            {userData.image ? (
              <img
                src={userData.image}
                alt="User"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <User className="w-16 h-16" />
            )}

            <div>
              <p className="text-xl font-semibold">{userData.name}</p>
              <p className="text-sm text-gray-600">{userData.companyName}</p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white shadow rounded-lg px-4 py-3 mb-6">
        <div className="flex flex-col space-y-2">
          <button
            // onClick={() => navigate("/rules")}
            className="w-full p-2.5 border-1 border-green-500 text-green-500 font-bold rounded-xl hover:bg-green-500 hover:text-white transition duration-500"
          >
            Báo cáo
          </button>

          <button
            onClick={() => navigate("/company-info")}
            className="w-full p-2.5 border-1 border-green-500 text-green-500 font-bold rounded-xl hover:bg-green-500 hover:text-white transition duration-500"
          >
            Thông tin về P&B
          </button>
        </div>
      </div>
      <div>
        <button
          className="w-full px-10 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-700 transition duration-500"
          onClick={handleLogoutConfirm}
        >
          Đăng xuất
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h5 className="text-lg font-bold mb-6">
              Bạn có chắc chắn muốn đăng xuất không?
            </h5>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 rounded text-gray-600 border border-gray-300 hover:bg-gray-100 transition duration-200"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition duration-200"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-center" theme="colored" autoClose={250} />
    </div>
  );
};

export default StaffSetting;
