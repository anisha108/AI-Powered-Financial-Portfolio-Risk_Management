import React from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { name: "Portfolio", path: "/portfolio", icon: <AccountBalanceWalletIcon /> },
    { name: "Risk Prediction", path: "/risk", icon: <ShowChartIcon /> },
    { name: "Trading Bot", path: "/bot", icon: <SmartToyOutlinedIcon /> },
    { name: "AI Advisor", path: "/advisor", icon: <ChatBubbleOutlineOutlinedIcon /> },
  ];

  return (
    <Box
      sx={{
        width: 260,
        backgroundColor: "#1E1E1E",
        borderRight: "1px solid #2C2C2C",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 3,
        height: "100vh",
        color: "#fff",
      }}
    >
      {/* Logo Section */}
      <Box>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#fff", mb: 0.5 }}
        >
          TradePro
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "#9E9E9E", mb: 4 }}>
          Smart Trading Platform
        </Typography>

        {/* Menu Items */}
        <List>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.name}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: active ? "#333333" : "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: active ? "#333333" : "#2C2C2C",
                  },
                  color: active ? "#4FC3F7" : "#E0E0E0",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? "#4FC3F7" : "#E0E0E0",
                    minWidth: "40px",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 500,
                    fontSize: "0.95rem",
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Account Balance Card */}
      <Card
        elevation={0}
        sx={{
          backgroundColor: "#2C2C2C",
          borderRadius: "12px",
          p: 2,
          color: "#fff",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        <Typography variant="subtitle2" sx={{ color: "#9E9E9E", mb: 0.5 }}>
          Account Balance
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4FC3F7" }}>
          $125,430.50
        </Typography>
      </Card>
    </Box>
  );
};

export default Sidebar;
