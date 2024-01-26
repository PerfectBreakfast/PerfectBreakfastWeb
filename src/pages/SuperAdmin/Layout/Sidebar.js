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
} from "@mui/icons-material";
import "../Layout/Sidebar.css";

const drawerWidth = 240;

const Sidebar = () => {
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
        <img src={logo} alt="Logo" style={{ height: "150px", width: "auto" }} />
      </div>
      <Divider className="custom-divider" />

      {/* Menu Items */}
      <List style={{ flexGrow: 1 }}>
        <ListItem button component={Link} to="/admin/foods">
          <ListItemIcon>
            <LunchDining />
          </ListItemIcon>
          <ListItemText primary="Danh sách món ăn" />
        </ListItem>
        <ListItem button component={Link} to="/admin/combo">
          <ListItemIcon>
            <Fastfood />
          </ListItemIcon>
          <ListItemText primary="Danh sách combo" />
        </ListItem>
        <ListItem button component={Link} to="/admin/menu">
          <ListItemIcon>
            <RestaurantMenu />
          </ListItemIcon>
          <ListItemText primary="Danh sách menu" />
        </ListItem>
        <ListItem button component={Link} to="/admin/partners">
          <ListItemIcon>
            <RestaurantMenu />
          </ListItemIcon>
          <ListItemText primary="Danh sách đối tác" />
        </ListItem>
        <ListItem button component={Link} to="/admin/suppliers">
          <ListItemIcon>
            <RestaurantMenu />
          </ListItemIcon>
          <ListItemText primary="Danh sách NCC" />
        </ListItem>
        <ListItem button component={Link} to="/admin/deliveries">
          <ListItemIcon>
            <RestaurantMenu />
          </ListItemIcon>
          <ListItemText primary="Danh sách ĐVVC" />
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

export default Sidebar;
