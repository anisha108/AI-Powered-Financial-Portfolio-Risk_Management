import React from 'react';
import { Box, Grid } from '@mui/material';
import Header from '../components/dashboard/Header';
import StockTicker from '../components/dashboard/StockTicker';
import Watchlist from '../components/dashboard/Watchlist';
import MainChart from '../components/dashboard/MainChart';

const DashboardPage = () => {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#121212', color: '#fff', minHeight: 'calc(100vh - 64px)' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'hidden' }}>
        {/* Header */}
        <Header />

        {/* Stock Ticker */}
        <Box sx={{ mt: 2 }}>
          <StockTicker />
        </Box>

        {/* Grid with spacing */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Main Chart */}
          <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <MainChart />
          </Grid>

          {/* Watchlist */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Watchlist />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;
