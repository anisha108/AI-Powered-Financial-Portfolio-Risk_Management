import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const ProfitChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Profit',
      data: [5000, 4500, 6000, 5500, 7500, 6800, 8500],
      borderColor: 'rgba(76, 175, 80, 1)',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, "rgba(76, 175, 80, 0.5)");
        gradient.addColorStop(1, "rgba(76, 175, 80, 0)");
        return gradient;
      },
      tension: 0.4,
      fill: true,
      pointRadius: 0,
    }],
  };
  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
        x: { ticks: { color: '#A4A6B3' }, grid: { display: false } },
        y: { ticks: { color: '#A4A6B3' }, grid: { color: '#2D334E' } }
    }
  };

  return (
    <Card sx={{ backgroundColor: '#1E2235', color: '#fff' }}>
      <CardContent>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Typography variant="h6">Profit</Typography>
            <Box>
                <Button size="small" sx={{color: '#fff', backgroundColor: '#2D334E', textTransform: 'none', mr: 1}}>Day</Button>
                <Button size="small" sx={{color: '#A4A6B3', textTransform: 'none', mr: 1}}>Week</Button>
                <Button size="small" sx={{color: '#A4A6B3', textTransform: 'none'}}>Month</Button>
            </Box>
        </Box>
        <Box sx={{height: '250px', mt: 3}}>
            <Line options={options} data={data} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfitChart;