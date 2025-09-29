import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#161A25', boxShadow: 'none', borderBottom: '1px solid #2D334E' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          <Link to={token ? "/dashboard" : "/login"} style={{ textDecoration: 'none', color: 'inherit' }}>
            tradeAI
          </Link>
        </Typography>
        <Box>
          {token ? (
            <Button color="inherit" onClick={handleLogout} sx={{textTransform: 'none'}}>
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" sx={{textTransform: 'none'}}>
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register" sx={{textTransform: 'none'}}>
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;