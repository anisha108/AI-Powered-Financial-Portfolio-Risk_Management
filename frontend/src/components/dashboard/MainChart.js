import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const MainChart = () => {
  const [chartData, setChartData] = useState([17000, 17150, 17200, 17100, 17250, 17300, 17280]);
  const [labels, setLabels] = useState(['T-6', 'T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'Now']);

  useEffect(() => {
    const fetchNiftyPrice = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stock-data');
        const data = await response.json();
        if (data?.price) {
          setChartData(prev => {
            const newData = [...prev];
            newData.shift();
            newData.push(data.price);
            return newData;
          });
        }
      } catch (err) {
        console.error('Error fetching Nifty 50 data:', err);
      }
    };

    fetchNiftyPrice();
    const interval = setInterval(fetchNiftyPrice, 5000);
    return () => clearInterval(interval);
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: 'Nifty 50',
        data: chartData,
        borderColor: 'rgba(255, 193, 7, 1)',
        backgroundColor: ctx => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 500);
          gradient.addColorStop(0, 'rgba(255, 193, 7, 0.3)');
          gradient.addColorStop(1, 'rgba(255, 193, 7, 0)');
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(255, 193, 7, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#000', // black tooltip
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: {
        ticks: { color: '#fff' }, // white labels
        grid: { color: '#333', drawTicks: false },
      },
      y: {
        ticks: { color: '#fff' },
        grid: { color: '#333', borderColor: '#333' },
      },
    },
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000', // pure black background
        p: 2,
      }}
    >
      <Paper
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: 2,
          p: 2,
          backgroundColor: '#000', // black paper
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
          Nifty 50 Market Overview
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Line options={options} data={data} />
        </Box>
      </Paper>
    </Box>
  );
};

export default MainChart;
