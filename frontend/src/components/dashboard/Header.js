import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Typography,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const [alertAnchor, setAlertAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [unread, setUnread] = useState(true);
  const [username, setUsername] = useState(''); // store logged-in user
  const openAlerts = Boolean(alertAnchor);
  const openProfile = Boolean(profileAnchor);

  // Fetch AI risk alerts (with JWT)
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('token'); // JWT token stored after login
        const response = await fetch('http://127.0.0.1:5000/api/risk-alerts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setAlerts(data.alerts || []);
      } catch (err) {
        console.error('Error fetching alerts:', err);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch current username
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:5000/api/user-info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.username) setUsername(data.username);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUser();
  }, []);

  // Handlers for menus
  const handleAlertClick = (event) => {
    setAlertAnchor(event.currentTarget);
    setUnread(false);
  };
  const handleAlertClose = () => setAlertAnchor(null);

  const handleProfileClick = (event) => setProfileAnchor(event.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        mb: 2,
        backgroundColor: '#1E2235',
        p: 1,
        borderBottom: '1px solid #2D334E',
      }}
    >
      {/* Search bar */}
      <TextField
        variant="standard"
        placeholder="Search"
        size="small"
        sx={{
          '& .MuiInput-underline:before': { borderBottom: '1px solid #4A5380' },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottom: '1px solid #A4A6B3',
          },
          '& .MuiInputBase-input': { color: '#fff', ml: 1 },
          width: '250px',
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#A4A6B3' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Notifications */}
      <IconButton sx={{ color: '#A4A6B3', ml: 2 }} onClick={handleAlertClick}>
        <Badge color="error" variant="dot" invisible={!unread}>
          <NotificationsNoneIcon />
        </Badge>
      </IconButton>

      {/* Alert Menu */}
      <Menu
        anchorEl={alertAnchor}
        open={openAlerts}
        onClose={handleAlertClose}
        PaperProps={{
          sx: {
            backgroundColor: '#2D334E',
            color: '#fff',
            borderRadius: '10px',
            mt: 1,
          },
        }}
      >
        {alerts.length > 0 ? (
          alerts.map((alert, i) => (
            <MenuItem key={i} onClick={handleAlertClose}>
              {alert}
            </MenuItem>
          ))
        ) : (
          <>
            <MenuItem>📈 Portfolio updated</MenuItem>
            <MenuItem>💰 Stock AAPL hit target price</MenuItem>
            <MenuItem>📊 New market report available</MenuItem>
          </>
        )}
      </Menu>

      {/* Profile Icon */}
      <IconButton sx={{ color: '#A4A6B3' }} onClick={handleProfileClick}>
        <AccountCircleIcon />
      </IconButton>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchor}
        open={openProfile}
        onClose={handleProfileClose}
        PaperProps={{
          sx: {
            backgroundColor: '#2D334E',
            color: '#fff',
            borderRadius: '10px',
            mt: 1,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {username || 'Guest User'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#A4A6B3' }}>
            {username ? 'Logged in' : 'Not logged in'}
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: '#4A5380', my: 1 }} />
        <MenuItem onClick={handleProfileClose}>View Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default Header;
