import React, { useEffect, useState } from "react";
import userAPI from "../../../services/userAPI";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import ApartmentIcon from "@mui/icons-material/Apartment";
import InfoIcon from "@mui/icons-material/Info";
import HelpIcon from "@mui/icons-material/Help";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import "../UserSettings/UserInfo.css";
import Divider from "@mui/material/Divider";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserInfo() {
  const [userData, setUserData] = useState(null);
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
    navigate("/login");
  };

  const handleGoBack = () => {
    navigate(-1);
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
          <Grid item xs={4} sm={2}>
            <IconButton>
              <AccountCircleIcon fontSize="large" id="iconAvatar" />
            </IconButton>
          </Grid>
          <Grid item xs={8} sm={10}>
            {userData && (
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
            )}
          </Grid>
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
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </div>
      <ToastContainer position="top-center" theme="colored" autoClose={250} />
    </div>
  );
}

export default UserInfo;
