// Sidebar.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Hidden from "@mui/material/Hidden";
import logo from "../../../assets/images/logo.png";
import { Button, Divider, ListItemIcon } from "@mui/material";
import {
  EmojiFoodBeverage,
  Fastfood,
  Logout,
  LunchDining,
  RestaurantMenu,
  SettingsApplications,
  OutdoorGrill,
  LocalShipping,
  LocationCity,
} from "@mui/icons-material";
import "../../SuperAdmin/Layout/Sidebar.css";

const drawerWidth = 240;
const PartnerSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/admin/login");
  };

  const drawerContent = (
    <div className="sidebar-container">
      {/* Logo */}
      <div style={{ textAlign: "center" }}>
        <img src={logo} alt="Logo" style={{ height: "75px", width: "auto" }} />
      </div>
      <Divider className="custom-divider" />

      {/* Menu Items */}
      <List style={{ flexGrow: 1 }}>
        <ListItem button component={Link} to="/partner/order">
          <ListItemIcon>
            <LunchDining />
          </ListItemIcon>
          <ListItemText primary="Đơn hàng" />
        </ListItem>
        <ListItem button component={Link} to="/admin/suppliers">
          <ListItemIcon>
            <OutdoorGrill />
          </ListItemIcon>
          <ListItemText primary="Danh sách NCC" />
        </ListItem>
        <ListItem button component={Link} to="/admin/deliveries">
          <ListItemIcon>
            <LocalShipping />
          </ListItemIcon>
          <ListItemText primary="Danh sách ĐVVC" />
        </ListItem>
        <ListItem button component={Link} to="/admin/companies">
          <ListItemIcon>
            <LocationCity />
          </ListItemIcon>
          <ListItemText primary="Danh sách công ty" />
        </ListItem>
        <ListItem button component={Link} to="/admin/companies">
          <ListItemIcon>
            <LocationCity />
          </ListItemIcon>
          <ListItemText primary="Lịch sử GD" />
        </ListItem>
      </List>

      <div className="sidebar-logout">
        <Button
          onClick={handleLogout}
          color="error"
          startIcon={<Logout />}
          fullWidth
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Hidden smDown>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
            },
          }}
        >
          <div sx={{ height: "64px" }} />
          {drawerContent}
        </Drawer>
      </Hidden>

      {/* Mobile Sidebar Toggle */}
      <Hidden smUp>
        <IconButton onClick={handleDrawerToggle}>
          <MenuIcon />
        </IconButton>
      </Hidden>

      {/* Mobile Sidebar */}
      <Hidden smUp>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            width: drawerWidth,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
            },
          }}
        >
          <div sx={{ height: "64px" }} />
          {drawerContent}
        </Drawer>
      </Hidden>
    </>
  );
};

export default PartnerSidebar;
