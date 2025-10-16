import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

// CSS animation for continuous horizontal scroll
const scroll = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
`;

const StockTicker = () => {
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickers = () => {
      fetch('http://127.0.0.1:5000/api/ticker-data')
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.data)) {
            setTickers(data.data);
          } else {
            setTickers([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching tickers:', err);
          setTickers([]);
          setLoading(false);
        });
    };

    fetchTickers();
    const interval = setInterval(fetchTickers, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 1, backgroundColor: '#000', borderRadius: '8px' }}>
        <Typography sx={{ color: '#A4A6B3', textAlign: 'center' }}>
          Loading ticker data...
        </Typography>
      </Box>
    );
  }

  if (!tickers.length) {
    return (
      <Box sx={{ width: '100%', p: 1, backgroundColor: '#000', borderRadius: '8px' }}>
        <Typography sx={{ color: '#A4A6B3', textAlign: 'center' }}>
          No ticker data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', backgroundColor: '#000', p: 1, borderRadius: '8px' }}>
      <Box
        sx={{
          display: 'flex',
          whiteSpace: 'nowrap',
          animation: `${scroll} 40s linear infinite`,
        }}
      >
        {tickers.concat(tickers).map((ticker, index) => (
          <Box
            key={index}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              mx: 3,
              backgroundColor: '#111',
              p: '4px 8px',
              borderRadius: '4px'
            }}
          >
            <Typography sx={{ color: '#fff', fontWeight: 'bold', mr: 1 }}>
              {ticker?.name ? ticker.name.replace('.NS', '') : 'N/A'}
            </Typography>
            <Typography sx={{ color: ticker?.isNegative ? '#FF4D4F' : '#4CAF50', fontWeight: 'bold' }}>
              {ticker?.value ?? '--'} ({ticker?.change ?? '--'})
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default StockTicker;
