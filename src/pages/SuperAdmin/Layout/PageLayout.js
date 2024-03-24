// AppLayout.js
import React from "react";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";
import { Box, styled } from "@mui/system";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "../../../components/Context/UserContext";

const drawerWidth = 240;

const MainContainer = styled("div")({
  display: "flex",
  flexGrow: 1,
  padding: (theme) => theme.spacing(3), // Adjust padding based on your design
});

const AppLayout = () => {
  return (
    <UserProvider>
      <Box sx={{ display: "flex" }}>
        <Sidebar />

        <MainContainer>
          <div style={{ height: "64px" }} />{" "}
          {/* Adjust the height based on your Sidebar's height */}
          <MainContent />
        </MainContainer>
        <ToastContainer position="top-right" autoClose={2000} />
      </Box>
      /
    </UserProvider>
  );
};

export default AppLayout;
