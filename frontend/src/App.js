import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/layout/Navbar'; // Import the new Navbar component

function App() {
  return (
    <Router>
      {/* The Navbar component is placed here so it appears on every page */}
      <Navbar />
      
      <main>
        {/* The Routes component defines which page to show based on the URL */}
        <Routes>
          {/* Default Route: If the user goes to the base URL, redirect them to the login page */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Page Routes: */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

