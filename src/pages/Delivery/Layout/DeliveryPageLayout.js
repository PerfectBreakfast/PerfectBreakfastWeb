// AppLayout.js
import React from "react";
import Sidebar from "./DeliverySidebar";

import { Box, styled } from "@mui/system";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SupplierContent from "./DeliveryContent";
import DeliveryContent from "./DeliveryContent";
const drawerWidth = 240;

const MainContainer = styled("div")({
  display: "flex",
  flexGrow: 1,
  padding: (theme) => theme.spacing(3), // Adjust padding based on your design
});

const DeliveryPageLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <MainContainer>
        <div style={{ height: "64px" }} />{" "}
        {/* Adjust the height based on your Sidebar's height */}
        <DeliveryContent />
      </MainContainer>
      <ToastContainer position="top-right" autoClose={2000} />
    </Box>
  );
};

export default DeliveryPageLayout;
