// AppLayout.js
import React from "react";
import Sidebar from "./SupplierSidebar";

import { Box, styled } from "@mui/system";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SupplierContent from "./SupplierContent";
import { UserProvider } from "../../../components/Context/UserContext";
const drawerWidth = 240;

const MainContainer = styled("div")({
  display: "flex",
  flexGrow: 1,
  padding: (theme) => theme.spacing(3), // Adjust padding based on your design
});

const SupplierPageLayout = () => {
  return (
    <UserProvider>
      <Box sx={{ display: "flex" }}>
        <Sidebar />

        <MainContainer className="bg-color">
          <div style={{ height: "64px" }} />{" "}
          {/* Adjust the height based on your Sidebar's height */}
          <SupplierContent />
        </MainContainer>
        <ToastContainer position="top-right" autoClose={2000} />
      </Box>
    </UserProvider>
  );
};

export default SupplierPageLayout;
