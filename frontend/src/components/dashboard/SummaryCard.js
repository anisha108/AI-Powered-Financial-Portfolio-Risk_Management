import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, ResponsiveContainer } from 'recharts'; // A simple chart library

const SummaryCard = ({ title, value, percentage, data, isNegative = false }) => (
  <Card sx={{ backgroundColor: '#1E2235', color: '#fff', height: '100%' }}>
    <CardContent>
      <Typography sx={{ color: '#A4A6B3' }}>{title}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
        <Box sx={{ width: 100, height: 40 }}>
            <ResponsiveContainer>
                <LineChart data={data}>
                    <Line type="monotone" dataKey="uv" stroke={isNegative ? "#F44336" : "#4CAF50"} strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </Box>
      </Box>
      <Typography sx={{ color: isNegative ? '#F44336' : '#4CAF50' }}>{percentage}</Typography>
    </CardContent>
  </Card>
);

export default SummaryCard;