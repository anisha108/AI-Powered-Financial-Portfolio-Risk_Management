import React from "react";
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
  Chip,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PortfolioPage = () => {
  const summary = {
    totalValue: "$40,814.85",
    todaysChange: "+$1,234.50",
    todaysChangePercent: "+1.23%",
    totalReturn: "+$18,567.25",
    totalReturnPercent: "+17.4% all time",
  };

  const holdings = [
    { symbol: "AAPL", name: "Apple Inc.", shares: 50, avgPrice: 165.5, currentPrice: 178.25 },
    { symbol: "MSFT", name: "Microsoft Corp.", shares: 30, avgPrice: 350.0, currentPrice: 378.91 },
    { symbol: "GOOGL", name: "Alphabet Inc.", shares: 25, avgPrice: 140.0, currentPrice: 141.8 },
    { symbol: "TSLA", name: "Tesla Inc.", shares: 20, avgPrice: 220.0, currentPrice: 242.84 },
    { symbol: "JPM", name: "JPMorgan Chase", shares: 40, avgPrice: 145.0, currentPrice: 158.3 },
    { symbol: "JNJ", name: "Johnson & Johnson", shares: 35, avgPrice: 160.0, currentPrice: 165.75 },
  ];

  const allocation = [
    { name: "Technology", value: 45, color: "#4285F4" },
    { name: "Finance", value: 20, color: "#00C49F" },
    { name: "Healthcare", value: 18, color: "#FFBB28" },
    { name: "Automotive", value: 15, color: "#9C27B0" },
    { name: "Cash", value: 2, color: "#757575" },
  ];

  const calculateValue = (shares, price) => (shares * price).toFixed(2);
  const calculateGain = (avg, curr, shares) => ((curr - avg) * shares).toFixed(2);
  const calculateGainPercent = (avg, curr) => (((curr - avg) / avg) * 100).toFixed(2);

  return (
    <Box sx={{ p: 3, bgcolor: "#121212", minHeight: "100vh", color: "#fff" }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Portfolio
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        {[
          { title: "Total Value", value: summary.totalValue },
          { title: "Today's Change", value: summary.todaysChange, sub: summary.todaysChangePercent },
          { title: "Total Return", value: summary.totalReturn, sub: summary.totalReturnPercent },
        ].map((card, idx) => (
          <Grid item xs={12} md={4} key={idx}>
            <Card sx={{ bgcolor: "#1E1E1E", borderRadius: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: "#9E9E9E" }}>
                  {card.title}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1, color: "#fff", fontWeight: 600 }}>
                  {card.value}
                </Typography>
                {card.sub && (
                  <Typography variant="body2" sx={{ mt: 0.5, color: "#4CAF50" }}>
                    {card.sub}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Holdings Table & Asset Allocation */}
      <Grid container spacing={4} sx={{ mt: 5 }}>
        {/* Holdings Table */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Holdings
          </Typography>
          <TableContainer component={Card} sx={{ bgcolor: "#1E1E1E", borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {["Symbol", "Shares", "Avg Price", "Current Price", "Value", "P/L"].map((head) => (
                    <TableCell key={head} sx={{ color: "#9E9E9E", fontWeight: 600 }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {holdings.map((h) => {
                  const value = calculateValue(h.shares, h.currentPrice);
                  const gain = calculateGain(h.avgPrice, h.currentPrice, h.shares);
                  const gainPct = calculateGainPercent(h.avgPrice, h.currentPrice);
                  return (
                    <TableRow key={h.symbol} hover sx={{ "&:hover": { bgcolor: "#2C2C2C" } }}>
                      <TableCell sx={{ color: "#fff" }}>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>{h.symbol}</Typography>
                          <Typography variant="caption" sx={{ color: "#aaa" }}>
                            {h.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "#fff" }}>{h.shares}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>${h.avgPrice.toFixed(2)}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>${h.currentPrice.toFixed(2)}</TableCell>
                      <TableCell sx={{ color: "#fff" }}>${value}</TableCell>
                      <TableCell sx={{ color: "#4CAF50" }}>
                        +${gain} <Typography variant="caption">(+{gainPct}%)</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Asset Allocation Chart */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Asset Allocation
          </Typography>
          <Card sx={{ bgcolor: "#1E1E1E", borderRadius: 3, p: 2 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={allocation}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {allocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#2C2C2C", border: "none", color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              {allocation.map((a) => (
                <Box key={a.name} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: a.color,
                      mr: 1.5,
                    }}
                  />
                  <Typography variant="body2" sx={{ color: "#fff" }}>
                    {a.name} — {a.value}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PortfolioPage;
