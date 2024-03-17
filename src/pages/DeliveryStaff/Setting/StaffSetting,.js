import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router";
import userAPI from "../../../services/userAPI";
import { ToastContainer, toast } from "react-toastify";
import { Button, Divider, Grid, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import ApartmentIcon from "@mui/icons-material/Apartment";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const StaffSetting = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

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
  const cancelRemoveItem = () => {
    setShowConfirmation(false);
  };
  return (
    <div className="userSettingContainer">
      <div className="userSettings">
        <IconButton onClick={handleGoBack}>
          <ArrowBackIosIcon />{" "}
        </IconButton>
        <Typography className="paymentText" variant="h6" gutterBottom>
          Thông tin người dùng
        </Typography>
      </div>
      <Box padding={2}>
        <Grid container spacing={2} alignItems="center">
          {userData && (
            <>
              <Grid item xs={4} sm={2}>
                <img
                  src={userData.image}
                  alt={userData.name}
                  className="w-20 h-20 rounded-full"
                />
              </Grid>
              <Grid item xs={8} sm={10}>
                <div>
                  <Typography variant="h6" gutterBottom>
                    {userData.name}
                  </Typography>

                  <Typography variant="body1" gutterBottom>
                    <PhoneIcon /> {userData.phoneNumber}
                  </Typography>
                  <Divider className="custom-divider" />
                  <Typography variant="body1" gutterBottom>
                    <ApartmentIcon /> {userData.companyName}
                  </Typography>
                  <Divider className="custom-divider" />
                </div>
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={12}>
            <Button
              fullWidth
              id="userSettingBtn"
              variant="outlined"
              size="large"
            >
              Thông tin khác <KeyboardArrowRightIcon />
            </Button>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button fullWidth id="userSettingBtn" variant="outlined">
              FAQ <KeyboardArrowRightIcon />
            </Button>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button fullWidth id="userSettingBtn" variant="outlined">
              Trợ giúp <KeyboardArrowRightIcon />
            </Button>
          </Grid>
        </Grid>
      </Box>
      <div className="container logoutUser">
        <Button
          id="logoutBtn"
          variant="contained"
          size="large"
          onClick={handleLogoutConfirm}
        >
          Đăng xuất
        </Button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h5 className="text-lg font-bold mb-6">Bạn có muốn đăng xuất?</h5>
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={cancelRemoveItem} className="btn-cancel">
                Hủy
              </button>
              <button onClick={handleLogout} className="btn-confirm-delete">
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
