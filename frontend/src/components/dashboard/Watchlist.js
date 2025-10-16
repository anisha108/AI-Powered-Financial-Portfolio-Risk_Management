import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { getWatchlist, addStockToWatchlist, removeStockFromWatchlist, analyzeStock } from '../../api/apiService';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// A single item in the watchlist, displaying real data
const StockListItem = ({ stock, onRemove }) => {
    const priceChange = stock.chartData.prices.length > 1 
        ? stock.lastClosePrice - stock.chartData.prices[stock.chartData.prices.length - 2] 
        : 0;
    const isNegative = priceChange < 0;

    return (
        <Paper sx={{ display: 'flex', alignItems: 'center', p: 1.5, mb: 1.5, backgroundColor: '#1A1A1A' }}>
            <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 'bold', color: '#fff' }}>{stock.ticker}</Typography>
                <Typography variant="body2" sx={{ color: '#A4A6B3' }}>
                    {stock.aiSummary ? stock.aiSummary.split('.')[0] : 'No summary available.'}
                </Typography> 
            </Box>
            <Box sx={{ textAlign: 'right', mx: 2 }}>
                <Typography sx={{ fontWeight: 'bold', color: '#fff' }}>₹{stock.lastClosePrice.toFixed(2)}</Typography>
                <Typography variant="body2" sx={{ color: isNegative ? '#F44336' : '#4CAF50' }}>
                    {isNegative ? '' : '+'}{priceChange.toFixed(2)}
                </Typography>
            </Box>
            <IconButton size="small" onClick={() => onRemove(stock.ticker)}>
                <DeleteIcon sx={{ color: '#A4A6B3' }} />
            </IconButton>
        </Paper>
    );
};

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [newTicker, setNewTicker] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchWatchlistData = async () => {
        setLoading(true);
        setError('');
        try {
            const watchlistData = await getWatchlist();
            const analysisPromises = watchlistData.tickers.map(ticker => 
                analyzeStock(ticker).then(res => res.data).catch(err => {
                    console.error(`Could not analyze ticker ${ticker}:`, err);
                    return null;
                })
            );
            const detailedWatchlist = (await Promise.all(analysisPromises)).filter(stock => stock !== null); 
            setWatchlist(detailedWatchlist);
        } catch (err) {
            setError(`Failed to load watchlist: ${err.message}`);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchWatchlistData();
    }, []);

    const handleAddStock = async (e) => {
        e.preventDefault();
        if (!newTicker) return;
        try {
            await addStockToWatchlist(newTicker.toUpperCase());
            setNewTicker('');
            fetchWatchlistData();
        } catch (err) {
            setError(`Failed to add ${newTicker.toUpperCase()}: ${err.message}`);
        }
    };

    const handleRemoveStock = async (ticker) => {
        try {
            await removeStockFromWatchlist(ticker);
            fetchWatchlistData();
        } catch (err) {
            setError(`Failed to remove ${ticker}: ${err.message}`);
        }
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', p: 3, backgroundColor: '#000' }}>
            <Paper sx={{ p: 2, backgroundColor: '#111', color: '#fff' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>My Watchlist</Typography>

                {/* Form to add a new stock */}
                <Box component="form" onSubmit={handleAddStock} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="Add ticker (e.g., TCS.NS)"
                        value={newTicker}
                        onChange={(e) => setNewTicker(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#1A1A1A',
                                '& fieldset': { borderColor: 'transparent' },
                            },
                            '& .MuiInputBase-input': { color: '#fff' }
                        }}
                    />
                    <Button type="submit" variant="contained" startIcon={<AddIcon />}>Add</Button>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2, backgroundColor: '#330000', color: '#FFB3B3' }}>{error}</Alert>}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
                ) : (
                    watchlist.length > 0 ? (
                        watchlist.map(stock => (
                            <StockListItem key={stock.ticker} stock={stock} onRemove={handleRemoveStock} />
                        ))
                    ) : (
                        <Typography sx={{ color: '#A4A6B3', textAlign: 'center', my: 4 }}>
                            Your watchlist is empty. Add a stock to get started.
                        </Typography>
                    )
                )}
            </Paper>
        </Box>
    );
};

export default Watchlist;
