import React from "react";
import PartnerContent from "./PartnerContent";
import { Box, styled } from "@mui/system";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PartnerSidebar from "./PartnerSidebar";
import { UserProvider } from "../../../components/Context/UserContext";
const drawerWidth = 240;

const MainContainer = styled("div")({
  display: "flex",
  flexGrow: 1,
  padding: (theme) => theme.spacing(3), // Adjust padding based on your design
});
const PartnerPageLayout = () => {
  return (
    <UserProvider>
      <Box sx={{ display: "flex" }}>
        <PartnerSidebar />

        <MainContainer>
          <div style={{ height: "64px" }} />{" "}
          {/* Adjust the height based on your Sidebar's height */}
          <PartnerContent />
        </MainContainer>
        <ToastContainer position="top-right" autoClose={2000} />
      </Box>
    </UserProvider>
  );
};

export default PartnerPageLayout;
