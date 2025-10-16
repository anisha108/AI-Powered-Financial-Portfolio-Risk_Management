// src/components/layout/DashboardLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar"; // your existing sidebar

const DashboardLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
