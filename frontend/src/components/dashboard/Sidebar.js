import React from 'react';
import { Box, Typography, Button, List, ListItem, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StoreIcon from '@mui/icons-material/Store';

const SidebarContainer = styled(Box)({
    width: 300,
    backgroundColor: '#1E2235',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #2D334E'
});

const ProductButton = styled(Button)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    textTransform: 'none',
    color: '#A4A6B3',
    backgroundColor: '#2D334E',
    borderRadius: '8px',
    height: '100px',
    '&:hover': {
        backgroundColor: '#394264',
    }
}));

const StockListItem = ({ price, change, name, symbol, color }) => (
    <ListItem sx={{ backgroundColor: '#2D334E', borderRadius: '8px', mb: 1.5, p: 1.5 }}>
        <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ fontWeight: 'bold' }}>{price}</Typography>
            <Typography variant="caption" sx={{ color: '#4CAF50' }}>{change}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontWeight: 'bold' }}>{name}</Typography>
            <Typography variant="caption" sx={{ color: '#A4A6B3' }}>{symbol}</Typography>
        </Box>
        <Avatar sx={{ bgcolor: color, ml: 2, width: 32, height: 32, fontSize: '1rem' }}>{symbol.charAt(0)}</Avatar>
    </ListItem>
);

const Sidebar = () => {
  return (
    <SidebarContainer>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>tradeAI</Typography>
        
        <Typography variant="subtitle2" sx={{ color: '#A4A6B3' }}>View All</Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>Product</Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 4}}>
            <ProductButton><AccountBalanceIcon /><Typography>Gold</Typography></ProductButton>
            <ProductButton><ShowChartIcon /><Typography>Stock</Typography></ProductButton>
            <ProductButton><ReceiptIcon /><Typography>Bond</Typography></ProductButton>
            <ProductButton><StoreIcon /><Typography>Market</Typography></ProductButton>
        </Box>
        
        <List>
            <StockListItem price="$3580.29" change="(2.44%) 40.1+" name="Amazon" symbol="Alpha" color="#4CAF50" />
            <StockListItem price="$2865" change="(9.10%) 80.11+" name="Alphabet" symbol="Alpha" color="#4CAF50" />
            <StockListItem price="$59.29" change="(6.54%) 66.11+" name="eBay" symbol="Micok Doe" color="#FFC107" />
            <StockListItem price="$257.09" change="(7.84%) 50+" name="Meta" symbol="Micok Doe" color="#FF5722" />
        </List>
    </SidebarContainer>
  );
};

export default Sidebar;