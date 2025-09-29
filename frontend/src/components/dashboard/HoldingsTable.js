import React from 'react';
import { Card, CardContent, Typography, Box, Paper } from '@mui/material';

const HoldingsTable = ({ title }) => (
    <Card sx={{ backgroundColor: '#1E2235', color: '#fff', height: '100%' }}>
        <CardContent>
            <Typography variant="h6">{title}</Typography>
            <Paper sx={{mt: 2, backgroundColor: '#2D334E', p: 1}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography sx={{color: '#A4A6B3'}}>Layzoo Ltd</Typography>
                    <Typography sx={{color: '#4CAF50'}}>+64.8%</Typography>
                </Box>
            </Paper>
        </CardContent>
    </Card>
);

export default HoldingsTable;