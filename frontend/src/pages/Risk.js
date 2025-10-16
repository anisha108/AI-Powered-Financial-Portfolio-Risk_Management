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
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Risk = () => {
  // Sample chart data
  const data = [
    { month: "Jan", risk: 45 },
    { month: "Feb", risk: 50 },
    { month: "Mar", risk: 38 },
    { month: "Apr", risk: 42 },
    { month: "May", risk: 48 },
    { month: "Jun", risk: 52 },
    { month: "Jul", risk: 46 },
  ];

  // Sample table data
  const rows = [
    { asset: "AAPL", value: "$45,200", risk: "Low", volatility: "1.8%" },
    { asset: "TSLA", value: "$31,000", risk: "High", volatility: "3.4%" },
    { asset: "AMZN", value: "$24,750", risk: "Medium", volatility: "2.5%" },
    { asset: "MSFT", value: "$28,400", risk: "Low", volatility: "1.6%" },
  ];

  return (
    <Box sx={{ p: 3, backgroundColor: "#121212", minHeight: "100vh", color: "#fff" }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: "#fff" }}>
        Risk Prediction
      </Typography>

      {/* ---- Summary Cards ---- */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: "#1E1E1E", boxShadow: "0px 2px 8px rgba(0,0,0,0.4)" }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: "#9E9E9E" }}>
                Total Portfolio Value
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, color: "#fff" }}>
                $125,430.50
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: "#1E1E1E", boxShadow: "0px 2px 8px rgba(0,0,0,0.4)" }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: "#9E9E9E" }}>
                Current Risk Score
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, color: "#FFB74D" }}>
                7.4 / 10 (Moderate)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: "#1E1E1E", boxShadow: "0px 2px 8px rgba(0,0,0,0.4)" }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: "#9E9E9E" }}>
                Volatility Index
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 1, color: "#4FC3F7" }}>
                2.1%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ---- Chart Section ---- */}
      <Box
        sx={{
          mt: 5,
          p: 3,
          bgcolor: "#1E1E1E",
          borderRadius: 3,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#fff" }}>
          Risk Trend (Last 6 Months)
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#333" />
            <XAxis dataKey="month" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2C2C2C",
                border: "none",
                color: "#fff",
              }}
            />
            <Line type="monotone" dataKey="risk" stroke="#4FC3F7" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* ---- Risk Table ---- */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: "#fff" }}>
          Asset Risk Breakdown
        </Typography>
        <TableContainer
          component={Card}
          sx={{
            borderRadius: 3,
            bgcolor: "#1E1E1E",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: "#9E9E9E" }}>Asset</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#9E9E9E" }}>Value</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#9E9E9E" }}>Risk Level</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#9E9E9E" }}>Volatility</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.asset} hover sx={{ "&:hover": { bgcolor: "#2C2C2C" } }}>
                  <TableCell sx={{ color: "#fff" }}>{row.asset}</TableCell>
                  <TableCell sx={{ color: "#fff" }}>{row.value}</TableCell>
                  <TableCell
                    sx={{
                      color:
                        row.risk === "High"
                          ? "#EF5350"
                          : row.risk === "Medium"
                          ? "#FFB74D"
                          : "#81C784",
                    }}
                  >
                    {row.risk}
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }}>{row.volatility}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Risk;
