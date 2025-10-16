import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Chip,
  Slider,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const TradePage = () => {
  const [botActive, setBotActive] = useState(true); // Toggle state for bot
  const [tradeConfig, setTradeConfig] = useState({
    strategy: "Momentum Trading",
    maxTradeSize: 5000,
    riskLevel: 50,
    stopLossEnabled: true,
    takeProfitEnabled: true,
    trailingStopEnabled: false,
  });

  const handleToggle = () => {
    setBotActive((prev) => !prev);
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setTradeConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const botStats = {
    totalProfit: "$12,845",
    winRate: "64.5%",
    avgWin: "$125",
    avgLoss: "$68",
    sharpeRatio: "2.4",
    maxDrawdown: "-8.2%",
    profitFactor: "1.85",
    todaysPnl: "+$845",
    activeOrders: 5,
  };

  const recentActivity = [
    { action: "Sold", symbol: "AAPL", shares: 10, price: "$178.50", profit: "+$125" },
    { action: "Bought", symbol: "MSFT", shares: 5, price: "$378.00", profit: "Pending" },
    { action: "Sold", symbol: "TSLA", shares: 8, price: "$245.00", profit: "-$80" },
    { action: "Sold", symbol: "GOOGL", shares: 15, price: "$142.00", profit: "+$225" },
  ];

  return (
    <Box sx={{ p: 3, bgcolor: "#121212", minHeight: "100vh", color: "#fff" }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Automatic Trading Bot
      </Typography>

      {/* Bot Status & Performance Metrics */}
      <Grid container spacing={3}>
        {/* Bot Status with Toggle */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#1E1E1E", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: "#fff" }}>
                Bot Status
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, color: botActive ? "#4CAF50" : "#f44336", fontWeight: 600 }}>
                {botActive ? "Active" : "Paused"}
              </Typography>
              <FormControlLabel
                control={<Switch checked={botActive} onChange={handleToggle} color="success" />}
                label={botActive ? "Bot is running" : "Bot is paused"}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Today's P&L */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#1E1E1E", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: "#fff" }}>
                Today's P&L
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, color: "#fff", fontWeight: 600 }}>
                {botStats.todaysPnl}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: "#4CAF50" }}>
                Win Rate: {botStats.winRate}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: "#1E1E1E", borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: "#fff" }}>
                Performance Metrics
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, color: "#fff", fontWeight: 600 }}>
                Sharpe Ratio: {botStats.sharpeRatio}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: "#FFBB28" }}>
                Max Drawdown: {botStats.maxDrawdown} | Profit Factor: {botStats.profitFactor}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Configuration Settings */}
      <Grid container spacing={3} sx={{ mt: 5 }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Bot Configuration Settings
          </Typography>

          <Card sx={{ bgcolor: "#1E1E1E", borderRadius: 3, p: 2 }}>
            {/* Trading Strategy */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: "#fff" }}>Trading Strategy</InputLabel>
                  <Select
                    label="Trading Strategy"
                    name="strategy"
                    value={tradeConfig.strategy}
                    onChange={handleConfigChange}
                    sx={{
                      bgcolor: "#2C2C2C",
                      color: "#fff",
                      "& .MuiSelect-icon": {
                        color: "#fff",
                      },
                    }}
                  >
                    <MenuItem value="Momentum Trading">Momentum Trading</MenuItem>
                    <MenuItem value="Trend Following">Trend Following</MenuItem>
                    <MenuItem value="Scalping">Scalping</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Max Trade Size */}
              <Grid item xs={12} md={4}>
                <TextField
                  label="Max Trade Size ($)"
                  variant="outlined"
                  fullWidth
                  type="number"
                  name="maxTradeSize"
                  value={tradeConfig.maxTradeSize}
                  onChange={handleConfigChange}
                  sx={{
                    bgcolor: "#2C2C2C",
                    input: { color: "#fff" },
                  }}
                />
              </Grid>

              {/* Risk Level */}
              <Grid item xs={12} md={4}>
                <Typography variant="body2" sx={{ mb: 1, color: "#fff" }}>
                  Risk Level: {tradeConfig.riskLevel}%
                </Typography>
                <Slider
                  value={tradeConfig.riskLevel}
                  onChange={handleConfigChange}
                  name="riskLevel"
                  min={0}
                  max={100}
                  step={1}
                  valueLabelDisplay="auto"
                  sx={{
                    color: "#4CAF50",
                    "& .MuiSlider-valueLabel": {
                      backgroundColor: "#4CAF50",
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Risk Management Settings */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={tradeConfig.stopLossEnabled}
                      onChange={handleConfigChange}
                      name="stopLossEnabled"
                      color="success"
                    />
                  }
                  label="Enable Stop Loss"
                  sx={{ color: "#fff" }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={tradeConfig.takeProfitEnabled}
                      onChange={handleConfigChange}
                      name="takeProfitEnabled"
                      color="success"
                    />
                  }
                  label="Enable Take Profit"
                  sx={{ color: "#fff" }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={tradeConfig.trailingStopEnabled}
                      onChange={handleConfigChange}
                      name="trailingStopEnabled"
                      color="success"
                    />
                  }
                  label="Enable Trailing Stop"
                  sx={{ color: "#fff" }}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3} sx={{ mt: 5 }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent Bot Activity
          </Typography>
          <TableContainer component={Card} sx={{ bgcolor: "#1E1E1E", borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {["Action", "Symbol", "Shares", "Price", "Profit"].map((head) => (
                    <TableCell key={head} sx={{ color: "#fff", fontWeight: 600 }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {recentActivity.map((activity, index) => (
                  <TableRow key={index} hover sx={{ "&:hover": { bgcolor: "#2C2C2C" } }}>
                    <TableCell sx={{ color: "#fff" }}>{activity.action}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{activity.symbol}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{activity.shares}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{activity.price}</TableCell>
                    <TableCell sx={{ color: activity.profit.includes("-") ? "#f44336" : "#4CAF50" }}>
                      {activity.profit}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TradePage;
