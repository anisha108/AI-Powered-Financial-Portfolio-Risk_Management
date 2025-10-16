import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PortfolioPage from './pages/PortfolioPage';
import Risk from "./pages/Risk";
import DashboardPage from './pages/DashboardPage';
import AIAdvisorPage from "./pages/AIAdvisorPage";
import TradePage from "./pages/TradePage";
import Navbar from './components/layout/Navbar';
import DashboardLayout from './components/layout/DashboardLayout'; // new layout

function App() {
  return (
    <Router>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard layout wraps all dashboard-related pages */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="advisor" element={<AIAdvisorPage />} />
            <Route path="bot" element={<TradePage />} />
            <Route path="portfolio" element={<PortfolioPage />} /> 
            <Route path="/risk" element={<Risk />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;
