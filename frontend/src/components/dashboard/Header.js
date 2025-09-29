import React from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
    <TextField
      variant="standard"
      placeholder="Search"
      size="small"
      sx={{
        '& .MuiInput-underline:before': { borderBottom: '1px solid #4A5380' },
        '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: '1px solid #A4A6B3' },
        '& .MuiInputBase-input': { color: '#fff', ml: 1 },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#A4A6B3' }} />
          </InputAdornment>
        ),
      }}
    />
    <IconButton sx={{ color: '#A4A6B3', ml: 2 }}>
        <NotificationsNoneIcon />
    </IconButton>
    <IconButton sx={{ color: '#A4A6B3' }}>
        <AccountCircleIcon />
    </IconButton>
  </Box>
);

export default Header;