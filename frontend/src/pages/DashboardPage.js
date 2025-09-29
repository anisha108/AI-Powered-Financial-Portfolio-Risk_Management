import React from 'react';
import { Box, Grid } from '@mui/material';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import SummaryCard from '../components/dashboard/SummaryCard';
import ProfitChart from '../components/dashboard/ProfitChart';
import HoldingsTable from '../components/dashboard/HoldingsTable';

// Mock data for the small line charts in the summary cards
const salesData = [{uv: 400}, {uv: 300}, {uv: 600}, {uv: 500}, {uv: 700}, {uv: 600}, {uv: 800}];
const portfolioData = [{uv: 300}, {uv: 400}, {uv: 200}, {uv: 500}, {uv: 400}, {uv: 600}, {uv: 700}];

const DashboardPage = () => {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#161A25', color: '#fff', minHeight: 'calc(100vh - 64px)' }}>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        <Header />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <SummaryCard title="Sales Profit" value="-$159,348" percentage="3.5%" data={salesData} isNegative />
          </Grid>
          <Grid item xs={12} md={6}>
            <SummaryCard title="Portfolio" value="$258,789" percentage="" data={portfolioData} />
          </Grid>
          
          <Grid item xs={12}>
            <ProfitChart />
          </Grid>

          <Grid item xs={12} md={6}>
              <HoldingsTable title="Companies Holding In This Online Fund" />
          </Grid>
          <Grid item xs={12} md={6}>
              <HoldingsTable title="Sectors Holding In This Online Fund" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;